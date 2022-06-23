const { SERVICE_NAMES, SUPPORTED_LIFECYCLES } = require('./constants');
const {
  getPluginService,
  hasRequiredModelScopes,
  isValidModelField,
} = require('./helpers');
const { pluginId } = require('./pluginId');
const { calculateReadingTime } = require('./reading-time');

module.exports = {
  SERVICE_NAMES,
  SUPPORTED_LIFECYCLES,
  calculateReadingTime,
  getPluginService,
  hasRequiredModelScopes,
  isValidModelField,
  pluginId,
};
