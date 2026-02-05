import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from './reading-time';

describe('calculateReadingTime', () => {
  describe('basic functionality', () => {
    it('should return an object with the expected properties', () => {
      const input = 'This is a test article.';
      const result = calculateReadingTime(input);
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('time');
      expect(result).toHaveProperty('words');
      expect(result).toHaveProperty('minutes');
    });

    it('should return correct word count', () => {
      const input = 'one two three four five';
      const result = calculateReadingTime(input);
      expect(result.words).toBe(5);
    });

    it('should handle empty string', () => {
      const result = calculateReadingTime('');
      expect(result.words).toBe(0);
      expect(result.minutes).toBe(0);
    });

    it('should handle whitespace only', () => {
      const result = calculateReadingTime('   \n\t   ');
      expect(result.words).toBe(0);
    });
  });

  describe('reading time calculations', () => {
    it('should calculate approximately 1 minute for 200 words', () => {
      // Average reading speed is ~200 words per minute
      const words = Array(200).fill('word').join(' ');
      const result = calculateReadingTime(words);
      expect(result.minutes).toBeCloseTo(1, 0);
    });

    it('should calculate approximately 2 minutes for 400 words', () => {
      const words = Array(400).fill('word').join(' ');
      const result = calculateReadingTime(words);
      expect(result.minutes).toBeCloseTo(2, 0);
    });

    it('should calculate approximately 5 minutes for 1000 words', () => {
      const words = Array(1000).fill('word').join(' ');
      const result = calculateReadingTime(words);
      expect(result.minutes).toBeCloseTo(5, 0);
    });

    it('should return fractional minutes for short content', () => {
      const input = 'This is a short article.';
      const result = calculateReadingTime(input);
      expect(result.minutes).toBeLessThan(1);
      expect(result.minutes).toBeGreaterThan(0);
    });
  });
});
