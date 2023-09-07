'use strict';
const _ = require('lodash');

const { ForbiddenError } = require('@strapi/utils');

const { pluginId } = require('./pluginId');

/**
 * A helper function to obtain a plugin service
 *
 * @return service
 */
const getPluginService = (strapi, name, plugin = pluginId) =>
  strapi.plugin(plugin).service(name);

const hasRequiredModelScopes = async (strapi, uid, auth) => {
  try {
    await strapi.auth.verify(auth, { scope: `${uid}.find` });
  } catch (e) {
    throw new ForbiddenError();
  }
};

const isValidModelField = (model, field) =>
  _.get(model, ['attributes', field], false);

module.exports = {
  getPluginService,
  hasRequiredModelScopes,
  isValidModelField,
};
