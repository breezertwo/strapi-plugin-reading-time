const readingTime = require('reading-time');

const calculateReadingTime = (input) => readingTime(input);

module.exports = {
  calculateReadingTime,
};
