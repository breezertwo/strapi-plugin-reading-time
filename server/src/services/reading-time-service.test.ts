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

      it('should calculate correct reading time based on word count', () => {
        const mockStrapi = createMockStrapi();
        const service = readingTimeService({ strapi: mockStrapi as any });
        const data = {
          content: 'word '.repeat(200), // ~200 words = ~1 minute
        };
        const ctx = createMockContext(data);

        service.storeCalculation(ctx as any);

        expect(data['reading_time']).toBeCloseTo(1, 0);
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
