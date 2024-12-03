[![Test](https://github.com/breezertwo/strapi-plugin-reading-time/actions/workflows/test.yaml/badge.svg)](https://github.com/breezertwo/strapi-plugin-reading-time/actions/workflows/test.yaml)

# Strapi Plugin Reading Time

A plugin for [Strapi](https://github.com/strapi/strapi) that provides the ability to calculate the reading time of
texed based fields.

Supported field types:
- Text
- Rich text (Blocks)

## Installation

```bash
npm i @breezertwo/strapi-plugin-reading-time
```

## Configuration

Add the following config to `./config/plugins.js`.

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
        // ...
      },
    },
  },
  // ...
});
```

This will listen for any record created or updated in the `article` collection type and set the display time to read value for the `reading_time` field automatically based on the `content` field.

The field (e.g reading_time) referenced in the configuration file must exist. You can add it to the collection-type using the Strapi Admin UI.

> Adding a field to an existing collection-type will require you to change, save or republish the entry/entries in order for this plugin to update the field correctly.

`skipUndefinedReferences`: If `true` the plugin will ignore any empty references fields. This is useful if you have a collection-type that has a field that is not required but you want to still calculate the reading time for it if it exists.

### Links

- Original plugin author: [Paidly](https://github.com/Paidly/strapi-plugin-reading-time)
