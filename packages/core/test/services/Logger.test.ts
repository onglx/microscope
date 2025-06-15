import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Types } from '@microscope/shared';
import { Logger } from '../../src/services/Logger';
import { BufferManager } from '../../src/services/buffer/BufferManager';

vi.mock('../../src/services/buffer/BufferManager');

const createMockTransport = (): Types.Transport.Transport => ({
  sendBatch: vi.fn().mockResolvedValue(undefined),
});

describe('Logger', () => {
  let logger: Logger;
  let mockTransport: Types.Transport.Transport;
  let bufferManagerInstance: BufferManager;

  beforeEach(() => {
    mockTransport = createMockTransport();
    bufferManagerInstance = {
      setTransports: vi.fn(),
      addTransport: vi.fn(),
      pushEvent: vi.fn(),
    } as unknown as BufferManager;
    (BufferManager.getInstance as unknown as ReturnType<typeof vi.fn>).mockReturnValue(bufferManagerInstance);
    logger = new Logger([mockTransport]);
  });

  it('should initialize with transports and set them on BufferManager', () => {
    expect(bufferManagerInstance.setTransports).toHaveBeenCalledWith([mockTransport]);
  });

  it('should add a transport and call BufferManager.addTransport', () => {
    const newTransport = createMockTransport();
    logger.addTransport(newTransport);
    expect(bufferManagerInstance.addTransport).toHaveBeenCalledWith(newTransport);
  });

  it('should set transports and call BufferManager.setTransports', () => {
    const transports = [createMockTransport(), createMockTransport()];
    logger.setTransports(transports);
    expect(bufferManagerInstance.setTransports).toHaveBeenCalledWith(transports);
  });

  it('should log an event with correct level and message', () => {
    logger.log(Types.Logger.LogLevel.INFO, 'test message', { foo: 'bar' });
    expect(bufferManagerInstance.pushEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: Types.Logger.LogLevel.INFO,
        attributes: expect.objectContaining({
          message: 'test message',
          foo: 'bar',
        }),
      })
    );
  });

  it('should log debug, info, warn, and error levels', () => {
    logger.debug('debug msg');
    logger.info('info msg');
    logger.warn('warn msg');
    logger.error('error msg');
    expect(bufferManagerInstance.pushEvent).toHaveBeenCalledTimes(4);
    expect(bufferManagerInstance.pushEvent).toHaveBeenCalledWith(
      expect.objectContaining({ name: Types.Logger.LogLevel.DEBUG })
    );
    expect(bufferManagerInstance.pushEvent).toHaveBeenCalledWith(
      expect.objectContaining({ name: Types.Logger.LogLevel.INFO })
    );
    expect(bufferManagerInstance.pushEvent).toHaveBeenCalledWith(
      expect.objectContaining({ name: Types.Logger.LogLevel.WARN })
    );
    expect(bufferManagerInstance.pushEvent).toHaveBeenCalledWith(
      expect.objectContaining({ name: Types.Logger.LogLevel.ERROR })
    );
  });
}); 