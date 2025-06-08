import { describe, it, expect } from 'vitest';
import { RingBuffer } from '../../../src/services/buffer/RingBuffer';

describe('RingBuffer', () => {
  it('should push and pop items in FIFO order', () => {
    const buffer = new RingBuffer<number>(3);
    buffer.push(1);
    buffer.push(2);
    buffer.push(3);
    expect(buffer.size()).toBe(3);
    expect(buffer.pop()).toBe(1);
    expect(buffer.pop()).toBe(2);
    expect(buffer.pop()).toBe(3);
    expect(buffer.pop()).toBeNull();
  });

  it('should overwrite oldest when full', () => {
    const buffer = new RingBuffer<number>(2);
    buffer.push(1);
    buffer.push(2);
    buffer.push(3); // should overwrite 1
    expect(buffer.size()).toBe(2);
    expect(buffer.pop()).toBe(2);
    expect(buffer.pop()).toBe(3);
    expect(buffer.pop()).toBeNull();
  });

  it('should throw if capacity <= 0', () => {
    expect(() => new RingBuffer(0)).toThrow();
    expect(() => new RingBuffer(-1)).toThrow();
  });

  it('size should reflect number of items', () => {
    const buffer = new RingBuffer<string>(2);
    expect(buffer.size()).toBe(0);
    buffer.push('a');
    expect(buffer.size()).toBe(1);
    buffer.push('b');
    expect(buffer.size()).toBe(2);
    buffer.pop();
    expect(buffer.size()).toBe(1);
    buffer.pop();
    expect(buffer.size()).toBe(0);
  });
}); 