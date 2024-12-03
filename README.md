[![Test](https://github.com/breezertwo/strapi-plugin-reading-time/actions/workflows/test.yaml/badge.svg)](https://github.com/breezertwo/strapi-plugin-reading-time/actions/workflows/test.yaml)

# Strapi Plugin Reading Time

A plugin for [Strapi](https://github.com/strapi/strapi) that provides the ability to calculate the reading time texed based content.
Supports _plain text_ and Strapis _block rich text_ fields.

## Installation

```bash
npm i @breezertwo/strapi-plugin-reading-time
```

## Configuration

Add the following config to `./config/plugins.js`.

> Please note that the field (e.g reading_time) referenced in the configuration file must exist. You can add it using the Strapi Admin UI. Also note that adding a field at a later point in time will require you to unpublish, change, save and republish the entry/entries in order for this plugin to work correctly.

```javascript
module.exports = ({ env }) => ({
  // ...
  "reading-time": {
    enabled: true,
    config: {
      skipUndefinedReferences: true,
      contentTypes: {
        article: {
          field: "reading_time",
          references: "content",
        },
      },
    },
  },
  // ...
});
```

This will listen for any record created or updated in the `article` content type and set the display time to read value for the `reading_time` field automatically based on the `content` field.

`skipUndefinedReferences`

### Links

- Original plugin author: [Paidly](https://github.com/Paidly/strapi-plugin-reading-time)
