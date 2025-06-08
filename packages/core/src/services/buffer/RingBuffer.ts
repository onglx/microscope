/**
 * A generic ring buffer implementation with fixed capacity.
 * When the buffer is full, pushing new items will drop the oldest items.
 */
export class RingBuffer<T> {
  private buffer: (T | null)[];
  private head: number = 0;
  private tail: number = 0;
  private count: number = 0;

  /**
   * Creates a new RingBuffer with the specified capacity.
   * @param capacity The maximum number of items the buffer can hold.
   */
  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }
    this.buffer = new Array(capacity).fill(null);
  }

  /**
   * Pushes a new item into the buffer.
   * If the buffer is full, the oldest item will be dropped.
   * @param item The item to push into the buffer.
   */
  push(item: T): void {
    if (this.count === this.buffer.length) {
      // Buffer is full, advance head to drop oldest item
      this.head = (this.head + 1) % this.buffer.length;
      this.count--;
    }

    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.buffer.length;
    this.count++;
  }

  /**
   * Removes and returns the oldest item from the buffer.
   * @returns The oldest item in the buffer, or null if the buffer is empty.
   */
  pop(): T | null {
    if (this.count === 0) {
      return null;
    }

    const item = this.buffer[this.head];
    this.buffer[this.head] = null;
    this.head = (this.head + 1) % this.buffer.length;
    this.count--;

    return item;
  }

  /**
   * Returns the current number of items in the buffer.
   * @returns The number of items currently in the buffer.
   */
  size(): number {
    return this.count;
  }
}