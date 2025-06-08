import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BufferManager } from '../../../src/services/buffer/BufferManager';
import type { TelemetryEvent } from '@microscope/shared/src/types/ILogger';
import type { Transport } from '@microscope/shared/src/types/Transport';

function createMockTransport() {
  return {
    sendBatch: vi.fn().mockResolvedValue(undefined),
  } as unknown as Transport;
}

describe('BufferManager', () => {
  let bufferManager: BufferManager;

  beforeEach(() => {
    // Reset singleton instance for isolation
    // @ts-expect-error: private property
    BufferManager.instance = undefined;
    bufferManager = BufferManager.getInstance();
    bufferManager.setTransports([]); // clear transports
  });

  afterEach(() => {
    // @ts-expect-error: private property
    clearInterval(bufferManager.flushInterval);
  });

  it('should be a singleton', () => {
    const another = BufferManager.getInstance();
    expect(bufferManager).toBe(another);
  });

  it('should add and set transports', () => {
    const t1 = createMockTransport();
    const t2 = createMockTransport();
    bufferManager.addTransport(t1);
    bufferManager.setTransports([t2]);
    // @ts-expect-error: private property
    expect(bufferManager.transports).toEqual([t2]);
  });

  it('should push events to the buffer', () => {
    const event: TelemetryEvent = { timestamp: Date.now(), name: 'test', attributes: {} };
    bufferManager.pushEvent(event);
    // @ts-expect-error: private property
    expect(bufferManager.ringBuffer.size()).toBe(1);
  });

  it('should flush events to transports in batches', async () => {
    const t1 = createMockTransport();
    bufferManager.setTransports([t1]);
    // Fill buffer with 3 events
    for (let i = 0; i < 3; i++) {
      bufferManager.pushEvent({ timestamp: Date.now(), name: `event${i}`, attributes: {} });
    }
    // @ts-expect-error: private method
    await bufferManager.flush();
    expect(t1.sendBatch).toHaveBeenCalledTimes(1);
    expect(t1.sendBatch).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'event0' }),
      expect.objectContaining({ name: 'event1' }),
      expect.objectContaining({ name: 'event2' }),
    ]);
  });

  it('should not flush if no transports', async () => {
    // Fill buffer with 2 events
    for (let i = 0; i < 2; i++) {
      bufferManager.pushEvent({ timestamp: Date.now(), name: `event${i}`, attributes: {} });
    }
    // @ts-expect-error: private method
    await bufferManager.flush();
    // No error, nothing to assert
  });
}); 