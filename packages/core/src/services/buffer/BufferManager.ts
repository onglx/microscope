import { TelemetryEvent } from '@microscope/shared/src/types/ILogger';
import { Transport } from '@microscope/shared/src/types/Transport';

/**
 * Singleton class that manages a buffer of telemetry events and handles flushing to transports
 */
export class BufferManager {
  private static instance: BufferManager;
  private buffer: TelemetryEvent[] = [];
  private readonly maxBufferSize: number = 1000;
  private flushInterval: number = 5000; // 5 seconds
  private transports: Transport[] = [];

  private constructor() {
    this.startFlushTimer();
  }

  /**
   * Get the singleton instance of BufferManager
   */
  public static getInstance(): BufferManager {
    if (!BufferManager.instance) {
      BufferManager.instance = new BufferManager();
    }
    return BufferManager.instance;
  }

  /**
   * Add a transport to the buffer manager
   * @param transport - The transport instance to add
   */
  public addTransport(transport: Transport): void {
    this.transports.push(transport);
  }

  /**
   * Set all transports for the buffer manager
   * @param transports - Array of transport instances
   */
  public setTransports(transports: Transport[]): void {
    this.transports = transports;
  }

  /**
   * Push a new event to the buffer
   * @param event - The telemetry event to add
   */
  public pushEvent(event: TelemetryEvent): void {
    this.buffer.push(event);
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  /**
   * Flush the buffer to all configured transports
   */
  private async flush(): Promise<void> {
    if (this.buffer.length === 0 || this.transports.length === 0) {
      return;
    }

    const events = [...this.buffer];
    this.buffer = [];

    await Promise.all(
      this.transports.map(transport => transport.sendBatch(events))
    ).catch(error => {
      console.error('Error flushing events:', error);
      // Re-add events to buffer on error
      this.buffer = [...events, ...this.buffer];
    });
  }

  /**
   * Start the flush timer
   */
  private startFlushTimer(): void {
    setInterval(() => this.flush(), this.flushInterval);
  }
}