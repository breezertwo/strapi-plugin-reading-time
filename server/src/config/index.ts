import { pluginConfigSchema } from './schema';

export default {
  default: {
    contentTypes: {},
    skipUndefinedReferences: false,
  },
  async validator(config: unknown) {
    await pluginConfigSchema.parseAsync(config);
  },
};
