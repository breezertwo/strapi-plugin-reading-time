import { describe, it, expect, vi } from 'vitest';
import readingTimeService from './reading-time-service';

describe('readingTimeService', () => {
  const createMockStrapi = (settings = {}) => {
    const mockSettingsService = {
      get: vi.fn().mockReturnValue({
        skipUndefinedReferences: false,
        models: {
          'api::article.article': {
            field: 'reading_time',
            references: ['content'],
          },
          article: {
            field: 'reading_time',
            references: ['content'],
          },
        },
        ...settings,
      }),
    };

    return {
      plugin: vi.fn().mockReturnValue({
        service: vi.fn().mockReturnValue(mockSettingsService),
      }),
    };
  };

  const createMockContext = (data: any, modelUid = 'api::article.article') => ({
    params: {
      data,
    },
    model: {
      uid: modelUid,
    },
  });

  describe('storeCalculation', () => {
    describe('basic functionality', () => {
      it('should calculate and store reading time for plain string content', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: 'This is a test article with some content.',
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
        expect(typeof data['reading_time']).toBe('number');
        expect(data['reading_time']).toBeGreaterThan(0);
      });

      it('should not modify data if data is undefined', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const ctx = createMockContext(undefined);

        expect(() => service.storeCalculation(ctx as any)).not.toThrow();
      });

      it('should not modify data if data is null', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const ctx = {
          params: { data: null },
          model: { uid: 'api::article.article' },
        };

        expect(() => service.storeCalculation(ctx as any)).not.toThrow();
      });
    });

    describe('content type handling', () => {
      it('should handle plain string content', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: 'word '.repeat(200), // ~200 words = ~1 minute
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data['reading_time']).toBeCloseTo(1, 0);
      });

      it('should handle array content (Strapi Blocks)', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: [
            { content: 'First paragraph content.' },
            { content: 'Second paragraph content.' },
          ],
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
        expect(data['reading_time']).toBeGreaterThan(0);
      });

      it('should handle object with content property', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: {
            content: [{ content: 'Nested content here.' }],
          },
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
        expect(data['reading_time']).toBeGreaterThan(0);
      });

      it('should handle Rich Text blocks format', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'This is rich text content.' }],
            },
          ],
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
        expect(data['reading_time']).toBeGreaterThan(0);
      });
    });

    describe('multiple references', () => {
      it('should combine text from multiple reference fields', () => {
        const mockStrapi = createMockStrapi({
          models: {
            'api::article.article': {
              field: 'reading_time',
              references: ['content', 'body'],
            },
            article: {
              field: 'reading_time',
              references: ['content', 'body'],
            },
          },
        });
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: 'word '.repeat(100),
          body: 'word '.repeat(100),
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        // 200 words combined should be ~1 minute
        expect(data['reading_time']).toBeCloseTo(1, 0);
      });

      it('should handle when some references are empty strings', () => {
        const mockStrapi = createMockStrapi({
          skipUndefinedReferences: true,
          models: {
            'api::article.article': {
              field: 'reading_time',
              references: ['content', 'body'],
            },
            article: {
              field: 'reading_time',
              references: ['content', 'body'],
            },
          },
        });
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: 'This is some content.',
          body: '',
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
      });
    });

    describe('undefined references handling', () => {
      it('should not calculate when references are undefined and skipUndefinedReferences is false', () => {
        const mockStrapi = createMockStrapi({
          skipUndefinedReferences: false,
          models: {
            'api::article.article': {
              field: 'reading_time',
              references: ['content', 'body'],
            },
            article: {
              field: 'reading_time',
              references: ['content', 'body'],
            },
          },
        });
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: 'Some content here.',
          // body is undefined
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data['reading_time']).toBeUndefined();
      });

      it('should calculate when some references are undefined and skipUndefinedReferences is true', () => {
        const mockStrapi = createMockStrapi({
          skipUndefinedReferences: true,
          models: {
            'api::article.article': {
              field: 'reading_time',
              references: ['content', 'body'],
            },
            article: {
              field: 'reading_time',
              references: ['content', 'body'],
            },
          },
        });
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: 'Some content here.',
          // body is undefined
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
        expect(data['reading_time']).toBeGreaterThan(0);
      });

      it('should not calculate when all references are empty', () => {
        const mockStrapi = createMockStrapi({
          skipUndefinedReferences: true,
          models: {
            'api::article.article': {
              field: 'reading_time',
              references: ['content'],
            },
            article: {
              field: 'reading_time',
              references: ['content'],
            },
          },
        });
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: '',
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data['reading_time']).toBeUndefined();
      });

      it('should handle null reference values', () => {
        const mockStrapi = createMockStrapi({
          skipUndefinedReferences: true,
        });
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: null,
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data['reading_time']).toBeUndefined();
      });
    });

    describe('complex content structures', () => {
      it('should extract text from columns', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: [
            {
              columns: [{ content: 'Left column text.' }, { content: 'Right column text.' }],
            },
          ],
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
        expect(data['reading_time']).toBeGreaterThan(0);
      });

      it('should extract text from image captions', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: [
            {
              images: [{ caption: 'Image caption text here.' }],
            },
          ],
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
        expect(data['reading_time']).toBeGreaterThan(0);
      });

      it('should extract text from media captions', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: [
            {
              media: {
                caption: 'Media caption text.',
              },
            },
          ],
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
        expect(data['reading_time']).toBeGreaterThan(0);
      });

      it('should handle dynamic zone content', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: [
            {
              __component: 'blocks.rich-text',
              content: 'Rich text component content.',
            },
            {
              __component: 'blocks.quote',
              text: 'Quote component text.',
            },
          ],
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
        expect(data['reading_time']).toBeGreaterThan(0);
      });
    });

    describe('edge cases', () => {
      it('should handle very long content', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: 'word '.repeat(10000), // ~10,000 words = ~50 minutes
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data['reading_time']).toBeGreaterThan(40);
      });

      it('should handle content with special characters', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: 'Héllo wörld! This has spëcial çharacters and émojis 🎉',
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
        expect(data['reading_time']).toBeGreaterThan(0);
      });

      it('should handle content with HTML that gets stripped', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: [
            {
              content: '<p>This is <strong>HTML</strong> content.</p>',
            },
          ],
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
        expect(data['reading_time']).toBeGreaterThan(0);
      });

      it('should handle deeply nested content structures', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: [
            {
              content: [
                {
                  content: [
                    {
                      content: 'Deeply nested text content.',
                    },
                  ],
                },
              ],
            },
          ],
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
        expect(data['reading_time']).toBeGreaterThan(0);
      });
    });

    describe('model lookup', () => {
      it('should find model by uid', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: 'Test content.',
        };
        const ctx = createMockContext(data, 'api::article.article');

        service.storeCalculation(ctx as any);

        expect(data).toHaveProperty('reading_time');
      });

      it('should throw when model is not found in settings', () => {
        const mockStrapi = createMockStrapi({
          models: {},
        });
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: 'Test content.',
        };
        const ctx = createMockContext(data, 'api::unknown.unknown');

        // Note: Current implementation throws when model is not found
        expect(() => service.storeCalculation(ctx as any)).toThrow();
      });
    });
  });
});
