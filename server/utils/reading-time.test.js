const { calculateReadingTime } = require('./reading-time');

describe('calculateReadingTime', () => {
  test('should return an object with the expected properties', () => {
    const input = 'This is a test article.';
    const result = calculateReadingTime(input);
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('time');
    expect(result).toHaveProperty('words');
    expect(result).toHaveProperty('minutes');
  });

  test('should return the expected reading time for a short article', () => {
    const input = 'This is a short article.';
    const result = calculateReadingTime(input);
    expect(result.minutes).toBe(0.025);
  });

  test('should return the expected reading time for a long article', () => {
    const input =
      'This is a very long article. It has many words and will take a while to read.';
    const result = calculateReadingTime(input);
    expect(result.minutes).toBe(0.085);
  });
});
