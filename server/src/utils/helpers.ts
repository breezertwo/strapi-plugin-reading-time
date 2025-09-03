import { ForbiddenError } from '@strapi/utils/dist/errors';
import _ from 'lodash';
import { PLUGIN_ID } from './pluginId';
import { Core, UID } from '@strapi/strapi';

export const getPluginService = (strapi: Core.Strapi, name: string, plugin = PLUGIN_ID) =>
  strapi.plugin(plugin).service(name);

export const hasRequiredModelScopes = async (
  strapi: Core.Strapi,
  uid: UID.ContentType,
  auth: any
) => {
  try {
    await strapi.auth.verify(auth, { scope: [`${uid}.find`] });
  } catch (e) {
    throw new ForbiddenError();
  }
};

export const isValidModelField = (model: any, field: string) =>
  _.get(model, ['attributes', field], false);
