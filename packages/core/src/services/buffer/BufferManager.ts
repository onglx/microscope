import { Types } from '@microscope/shared';
import { RingBuffer } from './RingBuffer';

/**
 * Singleton class that manages a ring buffer of telemetry events and handles flushing to transports
 */
export class BufferManager {
  private static instance: BufferManager;
  private ringBuffer: RingBuffer<Types.Logger.TelemetryEvent>;
  private flushInterval: NodeJS.Timeout;
  private transports: Types.Transport.Transport[] = [];
  private BUFFER_SIZE: number = 1000;
  private INTERVAL_TIME: number = 5000; // 5 seconds
  private MAX_BATCH_SIZE: number = 50;


  private constructor() {
    this.ringBuffer = new RingBuffer<Types.Logger.TelemetryEvent>(this.BUFFER_SIZE);
    this.flushInterval = setInterval(() => this.flush(), this.INTERVAL_TIME);
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
  public addTransport(transport: Types.Transport.Transport): void {
    this.transports.push(transport);
  }

  /**
   * Set all transports for the buffer manager
   * @param transports - Array of transport instances
   */
  public setTransports(transports: Types.Transport.Transport[]): void {
    this.transports = transports;
  }

  /**
   * Push a new event to the ring buffer
   * @param event - The telemetry event to add
   */
  public pushEvent(event: Types.Logger.TelemetryEvent): void {
    this.ringBuffer.push(event);
  }

  /**
   * Flush the ring buffer to all configured transports
   * Processes events in batches of up to 50 events
   */
  private async flush(): Promise<void> {
    const batch: Types.Logger.TelemetryEvent[] = [];

    // Pop up to maxBatchSize events from the ring buffer
    while (batch.length < this.MAX_BATCH_SIZE) {
      const event = this.ringBuffer.pop();
      if (!event) break;
      batch.push(event);
    }

    // If we have events to process, send them to all configured sinks
    if (batch.length > 0 && this.transports.length > 0) {
      await Promise.allSettled(
        this.transports.map(transport => transport.sendBatch(batch))
      );
    }

  }
}