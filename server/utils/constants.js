'use strict';

const SUPPORTED_LIFECYCLES = ['beforeCreate', 'beforeUpdate'];

const SERVICE_NAMES = {
  readingTime: 'readingTimeService',
  settings: 'settingsService',
};

module.exports = {
  SUPPORTED_LIFECYCLES,
  SERVICE_NAMES,
};
