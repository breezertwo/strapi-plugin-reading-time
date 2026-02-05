import { describe, it, expect, vi, beforeEach } from 'vitest';

// Import after mocking
import settingsService from './settings-service';

describe('settingsService', () => {
  const createMockStrapi = (overrides = {}) => ({
    config: {
      get: vi.fn(),
      set: vi.fn(),
    },
    contentTypes: {
      'api::article.article': {
        modelName: 'article',
        info: {
          singularName: 'article',
        },
        attributes: {
          title: { type: 'string' },
          content: { type: 'richtext' },
          reading_time: { type: 'decimal' },
          body: { type: 'blocks' },
        },
      },
      'api::blog.blog': {
        modelName: 'blog',
        info: {
          singularName: 'blog',
        },
        attributes: {
          title: { type: 'string' },
          content: { type: 'richtext' },
          readingTime: { type: 'decimal' },
        },
      },
    },
    log: {
      warn: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    },
    ...overrides,
  });

  describe('get', () => {
    it('should call strapi.config.get with the correct plugin key', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      service.get();

      expect(mockStrapi.config.get).toHaveBeenCalledWith('plugin::reading-time');
    });

    it('should return the config value', () => {
      const mockConfig = {
        contentTypes: {
          article: {
            field: 'reading_time',
            references: 'content',
          },
        },
      };
      const mockStrapi = createMockStrapi();
      mockStrapi.config.get.mockReturnValue(mockConfig);

      const service = settingsService({ strapi: mockStrapi as any });
      const result = service.get();

      expect(result).toEqual(mockConfig);
    });
  });

  describe('set', () => {
    it('should call strapi.config.set with the correct plugin key and settings', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });
      const newSettings = { contentTypes: { article: { field: 'reading_time' } } };

      service.set(newSettings);

      expect(mockStrapi.config.set).toHaveBeenCalledWith('plugin::reading-time', newSettings);
    });
  });

  describe('build', () => {
    it('should build models from valid contentTypes configuration', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      const settings = {
        contentTypes: {
          article: {
            field: 'reading_time',
            references: 'content',
          },
        },
      };

      const result = service.build(settings);

      expect(result.models).toBeDefined();
      expect(result.models['api::article.article']).toBeDefined();
      expect(result.models['api::article.article'].uid).toBe('api::article.article');
      expect(result.models['api::article.article'].field).toBe('reading_time');
      expect(result.models['api::article.article'].references).toEqual(['content']);
    });

    it('should handle references as array', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      const settings = {
        contentTypes: {
          article: {
            field: 'reading_time',
            references: ['content', 'body'],
          },
        },
      };

      const result = service.build(settings);

      expect(result.models['api::article.article'].references).toEqual(['content', 'body']);
    });

    it('should log warning and return settings if contentTypes is missing', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      const settings = {};

      const result = service.build(settings);

      expect(mockStrapi.log.warn).toHaveBeenCalledWith(
        '[reading-time] skipping registration, invalid configuration.'
      );
      expect(result.models).toEqual({});
    });

    it('should log warning if field does not exist on model', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      const settings = {
        contentTypes: {
          article: {
            field: 'nonexistent_field',
            references: 'content',
          },
        },
      };

      service.build(settings);

      expect(mockStrapi.log.warn).toHaveBeenCalledWith(
        '[reading-time] skipping article registration, invalid field provided.'
      );
    });

    it('should log warning if reference field does not exist on model', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      const settings = {
        contentTypes: {
          article: {
            field: 'reading_time',
            references: 'nonexistent_content_field',
          },
        },
      };

      service.build(settings);

      expect(mockStrapi.log.warn).toHaveBeenCalledWith(
        '[reading-time] skipping article registration, invalid reference field provided.'
      );
    });

    it('should log warning if any reference in array does not exist', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      const settings = {
        contentTypes: {
          article: {
            field: 'reading_time',
            references: ['content', 'nonexistent_field'],
          },
        },
      };

      service.build(settings);

      expect(mockStrapi.log.warn).toHaveBeenCalledWith(
        '[reading-time] skipping article registration, invalid reference field provided.'
      );
    });

    it('should skip content types not in configuration', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      const settings = {
        contentTypes: {
          article: {
            field: 'reading_time',
            references: 'content',
          },
        },
      };

      const result = service.build(settings);

      expect(result.models['api::blog.blog']).toBeUndefined();
    });

    it('should register multiple content types', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      const settings = {
        contentTypes: {
          article: {
            field: 'reading_time',
            references: 'content',
          },
          blog: {
            field: 'readingTime',
            references: 'content',
          },
        },
      };

      const result = service.build(settings);

      expect(result.models['api::article.article']).toBeDefined();
      expect(result.models['api::blog.blog']).toBeDefined();
      expect(result.models['article']).toBeDefined();
      expect(result.models['blog']).toBeDefined();
    });

    it('should include contentType reference in built model', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      const settings = {
        contentTypes: {
          article: {
            field: 'reading_time',
            references: 'content',
          },
        },
      };

      const result = service.build(settings);

      expect(result.models['api::article.article'].contentType).toBeDefined();
      expect(result.models['api::article.article'].contentType.modelName).toBe('article');
    });

    it('should allow access by both uid and modelName', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      const settings = {
        contentTypes: {
          article: {
            field: 'reading_time',
            references: 'content',
          },
        },
      };

      const result = service.build(settings);

      expect(result.models['api::article.article']).toEqual(result.models['article']);
    });

    it('should handle empty contentTypes object', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      const settings = {
        contentTypes: {},
      };

      const result = service.build(settings);

      expect(result.models).toEqual({});
    });

    it('should preserve other settings properties', () => {
      const mockStrapi = createMockStrapi();
      const service = settingsService({ strapi: mockStrapi as any });

      const settings = {
        skipUndefinedReferences: true,
        contentTypes: {
          article: {
            field: 'reading_time',
            references: 'content',
          },
        },
      };

      const result = service.build(settings);

      expect(result.skipUndefinedReferences).toBe(true);
    });
  });
});
