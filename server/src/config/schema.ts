import { z } from 'zod';

export const pluginConfigSchema = z.object({
  contentTypes: z.record(
    z.object({
      field: z.string(),
      references: z.union([z.string(), z.array(z.string())]),
    })
  ),
  skipUndefinedReferences: z.boolean().optional(),
});
