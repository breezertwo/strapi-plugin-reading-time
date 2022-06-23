# Strapi Plugin Reading Time


A plugin for [Strapi](https://github.com/strapi/strapi) that provides the ability to calculate the reading time for a piece of content


## Requirements

The installation requirements are the same as Strapi itself and can be found in the documentation on the [Quick Start](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html) page in the Prerequisites info card.

### Supported Strapi versions

- v4.x.x

**NOTE**: While this plugin may work with the older Strapi versions, they are not supported, it is always recommended to use the latest version of Strapi.


## Configuration

The plugin configuration is stored in a config file located at `./config/plugins.js`.

> Please note that the field referenced in the configuration file must exist. You can add it using the Strapi Admin UI. Also note that adding a field at a later point in time will require you to unpublish, change, save and republish the entry/entries in order for this plugin to work correctly.

A sample configuration

```javascript
module.exports = ({ env }) => ({
  // ...
  "reading-time": {
    enabled: true,
    config: {
      contentTypes: {
        article: {
          field: 'readingTime',
          references: 'content',
        },
      },
    },
  },
  // ...
});
```

This will listen for any record created or updated in the `article` content type and set the display time to read value for the `readingTime` field automatically based on the `content` field.