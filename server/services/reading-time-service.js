const {
  SERVICE_NAMES,
  calculateReadingTime,
  getPluginService,
} = require('../utils');

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
      .map((r) => data[r]);

    const hasUndefinedFields = referenceFieldValues.length < references.length;
    if (
      (!settings.skipUndefinedReferences && hasUndefinedFields) ||
      !referenceFieldValues.length
    ) {
      return;
    }

    referenceFieldValues = referenceFieldValues.join(' ');
    const time = calculateReadingTime(referenceFieldValues);
    data[field] = time.text;
  },
});
