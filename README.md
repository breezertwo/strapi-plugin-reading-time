# Strapi Plugin Reading Time

A plugin for [Strapi](https://github.com/strapi/strapi) that provides the ability to automatically calculate the reading time of text based fields.
Supports extracting text from nearly all field types. (e.g Text, Rich text (Blocks), Markdown, Lists, Image captions, ...)

<center>
  <a href="https://www.npmjs.com/package/@breezertwo/strapi-plugin-reading-time">
    <img src="https://img.shields.io/npm/v/%40breezertwo%2Fstrapi-plugin-reading-time?style=flat-square&color=blue" alt="NPM Version" />
  </a>
  <a href="https://github.com/strapi/strapi">
    <img src="https://img.shields.io/badge/strapi-v5.0.0+-green?style=flat-square" alt="Strapi Version" />
  </a>
  <a href="https://github.com/breezertwo/strapi-plugin-reading-time/actions/workflows/test.yaml">
    <img src="https://github.com/breezertwo/strapi-plugin-reading-time/actions/workflows/test.yaml/badge.svg" alt="Test" />
  </a>
</center>

## Installation

```bash
npm i @breezertwo/strapi-plugin-reading-time
```

## Configuration

Add the following config to `./config/plugins.ts`.

```javascript
module.exports = ({ env }) => ({
  // ...
  'reading-time': {
    enabled: true,
    config: {
      skipUndefinedReferences: true,
      contentTypes: {
        article: {                                // API ID of your collection-type
          field: 'reading_time',                  // the field name for the reading time value in your schema
          references: ['content', 'description'], // the names of the fields to extract text from
        },
        // ...
      },
    },
  },
  // ...
});
```

The field (e.g reading_time) referenced in the configuration file must exist. You can add it to the collection-type using the Strapi Admin UI.

_Adding the reading time key/field to an existing collection-type will require you to change, save or republish the entry/entries in order for this plugin to update the field correctly._

`skipUndefinedReferences`: If `true` the plugin will ignore any empty references fields. This is useful if you have a collection-type that has a field that is not required but you want to still calculate the reading time for it if it exists.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE.md) file for details.

If you find this plugin helpful, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs and issues
- 🤝 **Contributing** to the project
- 💡 **Suggesting** new features
- 📣 **Sharing** with others who might benefit
