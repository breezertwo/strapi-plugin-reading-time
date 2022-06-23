'use strict';

const { pluginConfigSchema } = require('./schema');

module.exports = {
  default() {
    return {
      contentTypes: {},
      skipUndefinedReferences: false,
    };
  },
  async validator(config) {
    await pluginConfigSchema.validate(config);
  },
};
