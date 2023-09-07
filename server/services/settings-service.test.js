const settingsService = require('./settings-service');

describe('settingsService', () => {
  const strapi = {
    config: {
      get: jest.fn(),
      set: jest.fn(),
    },
    contentTypes: {
      'test-model': {
        modelName: 'test-model',
        info: {
          singularName: 'Test Model',
        },
        fields: {
          title: {
            type: 'string',
          },
          content: {
            type: 'text',
          },
        },
      },
    },
    log: {
      warn: jest.fn(),
    },
  };

  const service = settingsService({ strapi });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('get function should call strapi.config.get with the correct key', () => {
    service.get();
    expect(strapi.config.get).toHaveBeenCalledWith('plugin.reading-time');
  });

  test('set function should call strapi.config.set with the correct key and value', () => {
    const settings = { test: true };
    service.set(settings);
    expect(strapi.config.set).toHaveBeenCalledWith(
      'plugin.reading-time',
      settings
    );
  });

  test('build function should log a warning if an invalid reference field is provided', () => {
    const settings = {
      models: {
        'test-model': {
          fields: {
            content: true,
          },
          relations: {
            invalid: {
              plugin: 'users-permissions',
              model: 'user',
            },
          },
        },
      },
    };
    service.build(settings);
    expect(strapi.log.warn).toHaveBeenCalledWith(
      '[reading-time] skipping registration, invalid configuration.'
    );
  });
});
