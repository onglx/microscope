import { Logger } from './Logger';


export namespace Transport {
  /**
   * Transport interface for implementing pluggable sink strategies
   * Handles batched telemetry event delivery to various destinations
   */
  export interface Transport {
    /**
     * Sends a batch of telemetry events to the configured destination
     * @param events - Array of telemetry events to be sent
     * @returns Promise that resolves when the batch has been sent
     */
    sendBatch(events: Logger.TelemetryEvent[]): Promise<void>;
  }
}