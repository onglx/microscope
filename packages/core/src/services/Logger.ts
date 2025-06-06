import { LogLevel, ILogger, TelemetryEvent } from '@microscope/shared/src/types/ILogger';
import { Transport } from '@microscope/shared/src/types/Transport';
import { BufferManager } from './buffer/BufferManager';

/**
 * Implementation of the ILogger interface that manages transports and event buffering
 */
export class Logger implements ILogger {
  private transports: Transport[] = [];
  private bufferManager: BufferManager;

  constructor(transports: Transport[] = []) {
    this.transports = transports;
    this.bufferManager = BufferManager.getInstance();
    // Initialize buffer manager with the same transports
    this.bufferManager.setTransports(transports);
  }

  /**
   * Add a transport to the logger
   * @param transport - The transport instance to add
   */
  public addTransport(transport: Transport): void {
    this.transports.push(transport);
    this.bufferManager.addTransport(transport);
  }

  /**
   * Set all transports for the logger
   * @param transports - Array of transport instances
   */
  public setTransports(transports: Transport[]): void {
    this.transports = transports;
    this.bufferManager.setTransports(transports);
  }

  /**
   * Log a message with the specified level and metadata
   * @param level - The severity level of the log
   * @param message - The message to log
   * @param metadata - Optional additional contextual information
   */
  public log(level: LogLevel, message: string, metadata: Record<string, any> = {}): void {
    const event: TelemetryEvent = {
      timestamp: Date.now(),
      name: level,
      attributes: {
        message,
        ...metadata
      }
    };

    this.bufferManager.pushEvent(event);
  }

  /**
   * Log a debug level message
   * @param message - The message to log
   * @param metadata - Optional additional contextual information
   */
  public debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Log an info level message
   * @param message - The message to log
   * @param metadata - Optional additional contextual information
   */
  public info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Log a warning level message
   * @param message - The message to log
   * @param metadata - Optional additional contextual information
   */
  public warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Log an error level message
   * @param message - The message to log
   * @param metadata - Optional additional contextual information
   */
  public error(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, metadata);
  }
}