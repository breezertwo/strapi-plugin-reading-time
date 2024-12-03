const {
  SERVICE_NAMES,
  calculateReadingTime,
  getPluginService,
} = require('../utils');
const { getPlainText } = require('../utils/get-plain-text-from-node');

module.exports = ({ strapi }) => ({
  storeCalculation(ctx) {
    const settings = getPluginService(strapi, SERVICE_NAMES.settings).get();

    const { params, model: entityModel } = ctx;
    const { data } = params;

    const model = settings.models[entityModel.uid];

    if (!data) {
      return;
    }

    const { field, references } = model;

    // ensure the reference field has data
    let referenceFieldValues = references
      .filter((r) => typeof data[r] !== 'undefined' && data[r].length)
      .map((r) => {
        const content = data[r];

        if (typeof content === 'string') {
          return content;
        }

        return getPlainText(content);
      });

    const hasUndefinedFields = referenceFieldValues.length < references.length;
    if (
      (!settings.skipUndefinedReferences && hasUndefinedFields) ||
      !referenceFieldValues.length
    ) {
      return;
    }

    const time = calculateReadingTime(referenceFieldValues.join(' '));

    data[field] = time.minutes;
  },
});
