import _ from 'lodash';
import { getPluginService, SUPPORTED_LIFECYCLES } from './utils';
import { Core } from '@strapi/strapi';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const settingsService = getPluginService(strapi, 'settingsService');
  const settings = settingsService.get();

  // build settings structure
  const normalizedSettings = settingsService.build(settings);

  // reset plugin settings
  settingsService.set(normalizedSettings);

  // set up lifecycles
  const subscribe = {
    models: _.map(normalizedSettings.models, (m) => m.uid),
  };

  SUPPORTED_LIFECYCLES.forEach((lifecycle) => {
    subscribe[lifecycle] = (ctx: any) => {
      getPluginService(strapi, 'readingTimeService').storeCalculation(ctx);
    };
  });

  strapi.db.lifecycles.subscribe(subscribe);
  strapi.log.info('Reading time plugin registered');
};

export default bootstrap;
