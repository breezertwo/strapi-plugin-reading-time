import {
  calculateReadingTime,
  getPluginService,
  getStrapiTextContent,
  SERVICE_NAMES,
} from '../utils';
import type { Context } from 'koa';
import type { Core } from '@strapi/strapi';

const readingTimeService = ({ strapi }: { strapi: Core.Strapi }) => ({
  storeCalculation(ctx: Context) {
    const settings = getPluginService(strapi, SERVICE_NAMES.settings).get();
    const { params, model: entityModel } = ctx;
    const { data } = params;
    const model = settings.models[entityModel.uid];

    if (!data) {
      return;
    }

    const { field, references } = model as { field: string; references: string[] };

    let referenceFieldValues = references
      .filter((r) => typeof data[r] !== 'undefined' && data[r] !== null)
      .map((r) => {
        const content = data[r];

        if (typeof content === 'string') {
          return content;
        }

        if (Array.isArray(content) || (content && content.content)) {
          const extractedText = getStrapiTextContent(content);

          if (extractedText) {
            return extractedText;
          }
        }

        strapi.log.warn(`Unable to extract text from field ${r}`);
        return '';
      })
      .filter((text: string) => text && text.length > 0);

    const hasUndefinedFields = referenceFieldValues.length < references.length;

    if ((!settings.skipUndefinedReferences && hasUndefinedFields) || !referenceFieldValues.length) {
      return;
    }

    const combinedText = referenceFieldValues.join(' ');
    const time = calculateReadingTime(combinedText);
    data[field] = time.minutes;
  },
});

export default readingTimeService;
