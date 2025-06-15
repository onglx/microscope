export namespace Logger {
  /**
   * Log levels for the logging system
   */
  export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
  }

  /**
   * Structure for telemetry events
   */
  export type TelemetryEvent = {
    timestamp: number;
    name: string;
    attributes: Record<string, any>;
  }

  /**
   * Core logger interface that defines the logging capabilities
   */
  export interface ILogger {
    /**
     * Log a message with a specific log level
     * @param level - The severity level of the log
     * @param message - The message to log
     * @param metadata - Optional additional contextual information
     */
    log(level: LogLevel, message: string, metadata?: Record<string, any>): void;

    /**
     * Log an info level message
     * @param message - The message to log
     * @param metadata - Optional additional contextual information
     */
    info(message: string, metadata?: Record<string, any>): void;

    /**
     * Log a warning level message
     * @param message - The message to log
     * @param metadata - Optional additional contextual information
     */
    warn(message: string, metadata?: Record<string, any>): void;

    /**
     * Log an error level message
     * @param message - The message to log
     * @param metadata - Optional additional contextual information
     */
    error(message: string, metadata?: Record<string, any>): void;

    /**
     * Log a debug level message
     * @param message - The message to log
     * @param metadata - Optional additional contextual information
     */
    debug(message: string, metadata?: Record<string, any>): void;
  }
}