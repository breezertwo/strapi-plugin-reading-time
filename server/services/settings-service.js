'use strict';

const _ = require('lodash');

const { isValidModelField, pluginId } = require('../utils');

module.exports = ({ strapi }) => ({
  get() {
    return strapi.config.get(`plugin::${pluginId}`);
  },
  set(settings) {
    return strapi.config.set(`plugin::{pluginId}`, settings);
  },
  build(settings) {
    // build models
    settings.models = {};

    if (!settings.contentTypes) {
      strapi.log.warn(
        '[reading-time] skipping registration, invalid configuration.'
      );
      return settings;
    }

    _.each(strapi.contentTypes, (contentType, uid) => {
      const model = settings.contentTypes[contentType.modelName];
      if (!model) {
        return;
      }

      // ensure provided fields are present on the model
      const hasField = isValidModelField(contentType, model.field);
      if (!hasField) {
        strapi.log.warn(
          `[reading-time] skipping ${contentType.info.singularName} registration, invalid field provided.`
        );
        return;
      }

      let references = _.isArray(model.references)
        ? model.references
        : [model.references];
      const hasReferences = references.every((r) =>
        isValidModelField(contentType, r)
      );
      if (!hasReferences) {
        strapi.log.warn(
          `[reading-time] skipping ${contentType.info.singularName} registration, invalid reference field provided.`
        );
        return;
      }

      const data = {
        uid,
        ...model,
        contentType,
        references,
      };
      settings.models[uid] = data;
      settings.models[contentType.modelName] = data;
    });

    _.omit(settings, ['contentTypes']);

    return settings;
  },
});
