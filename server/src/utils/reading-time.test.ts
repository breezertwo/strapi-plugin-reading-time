import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from './reading-time';
import { getStrapiTextContent } from './text-extract';

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

describe('Integration: calculateReadingTime with text extraction', () => {
  describe('with getStrapiTextContent', () => {
    it('should calculate reading time for simple content array', () => {
      const input = [{ content: 'This is some content.' }, { content: 'This is more content.' }];
      const result = calculateReadingTime(getStrapiTextContent(input));
      expect(result.words).toBe(8);
    });

    it('should calculate reading time for content with columns', () => {
      const input = [
        {
          columns: [{ content: 'Left column text here.' }, { content: 'Right column text here.' }],
        },
      ];
      const result = calculateReadingTime(getStrapiTextContent(input));
      expect(result.words).toBe(8);
    });

    it('should calculate reading time for image captions', () => {
      const input = [
        {
          images: [
            { caption: 'A beautiful sunset over the ocean.' },
            { caption: 'Mountains in the morning mist.' },
          ],
        },
      ];
      const result = calculateReadingTime(getStrapiTextContent(input));
      expect(result.words).toBe(11);
    });

    it('should calculate reading time for mixed content types', () => {
      const input = [
        { content: 'Introduction text.' },
        {
          columns: [{ content: 'Column one.' }, { content: 'Column two.' }],
        },
        {
          images: [{ caption: 'Image caption here.' }],
        },
        { text: 'Final text.' },
      ];
      const result = calculateReadingTime(getStrapiTextContent(input));
      expect(result.words).toBeGreaterThanOrEqual(10);
    });

    it('should calculate reading time for a full blog post', () => {
      const input = [
        {
          type: 'heading',
          content: [{ content: 'The Ultimate Guide to Testing' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              content:
                'Testing is an essential part of software development. It helps ensure quality and reliability.',
            },
          ],
        },
        {
          type: 'heading',
          content: [{ content: 'Why Test?' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              content:
                'Tests catch bugs early, provide documentation, and give confidence when refactoring.',
            },
          ],
        },
        {
          type: 'image',
          asset: {
            caption: 'A diagram showing the testing pyramid.',
            alternativeText: 'Testing pyramid with unit, integration, and e2e tests.',
          },
        },
        {
          type: 'quote',
          text: 'Code without tests is broken by design.',
        },
      ];
      const result = calculateReadingTime(getStrapiTextContent(input));
      expect(result.words).toBeGreaterThan(30);
      expect(result.minutes).toBeGreaterThan(0);
    });

    it('should calculate reading time for dynamic zone content', () => {
      const input = [
        {
          __component: 'blocks.hero',
          content: 'Welcome to our amazing website.',
        },
        {
          __component: 'blocks.features',
          features: [
            { content: 'Feature one description.' },
            { content: 'Feature two description.' },
            { content: 'Feature three description.' },
          ],
        },
        {
          __component: 'blocks.cta',
          text: 'Sign up today and get started!',
        },
      ];
      const result = calculateReadingTime(getStrapiTextContent(input));
      expect(result.words).toBeGreaterThan(15);
    });
  });

  describe('realistic content scenarios', () => {
    it('should estimate ~1 min for a 200-word article', () => {
      const paragraph = Array(40).fill('word').join(' ');
      const input = [
        { content: paragraph },
        { content: paragraph },
        { content: paragraph },
        { content: paragraph },
        { content: paragraph },
      ];
      const result = calculateReadingTime(getStrapiTextContent(input));
      expect(result.minutes).toBeCloseTo(1, 0);
    });

    it('should estimate ~3 min for a 600-word article', () => {
      const paragraph = Array(100).fill('word').join(' ');
      const input = [
        { content: paragraph },
        { content: paragraph },
        { content: paragraph },
        { content: paragraph },
        { content: paragraph },
        { content: paragraph },
      ];
      const result = calculateReadingTime(getStrapiTextContent(input));
      expect(result.minutes).toBeCloseTo(3, 0);
    });

    it('should handle content stripped of HTML', () => {
      const input = [
        {
          content: '<p>This is a <strong>paragraph</strong> with <em>HTML</em> tags.</p>',
        },
        {
          content: '<div><h2>Heading</h2><p>More content here.</p></div>',
        },
      ];
      const result = calculateReadingTime(getStrapiTextContent(input));
      // HTML stripped: "This is a paragraph with HTML tags." + "HeadingMore content here."
      // Some words merge when HTML is stripped without spaces
      expect(result.words).toBe(10);
    });
  });
});
