import { describe, it, expect } from 'vitest';
import { getStrapiTextContent } from './text-extract';

describe('text-extract', () => {
  describe('getStrapiTextContent', () => {
    describe('basic content handling', () => {
      it('should return empty string for null input', () => {
        expect(getStrapiTextContent(null)).toBe('');
      });

      it('should return empty string for undefined input', () => {
        expect(getStrapiTextContent(undefined)).toBe('');
      });

      it('should return empty string for empty array', () => {
        expect(getStrapiTextContent([])).toBe('');
      });

      it('should return empty string for non-array input', () => {
        expect(getStrapiTextContent('string')).toBe('');
        expect(getStrapiTextContent(123)).toBe('');
        expect(getStrapiTextContent({})).toBe('');
      });

      it('should handle object with content property', () => {
        const input = {
          content: [
            {
              content: 'Hello world',
            },
          ],
        };
        expect(getStrapiTextContent(input)).toBe('Hello world');
      });
    });

    describe('direct content strings', () => {
      it('should extract content from direct content string', () => {
        const input = [
          {
            content: 'This is direct content.',
          },
        ];
        expect(getStrapiTextContent(input)).toBe('This is direct content.');
      });

      it('should strip HTML tags from content strings', () => {
        const input = [
          {
            content: '<p>This is <strong>HTML</strong> content.</p>',
          },
        ];
        expect(getStrapiTextContent(input)).toBe('This is HTML content.');
      });

      it('should handle multiple content blocks', () => {
        const input = [
          { content: 'First block.' },
          { content: 'Second block.' },
          { content: 'Third block.' },
        ];
        expect(getStrapiTextContent(input)).toContain('First block.');
        expect(getStrapiTextContent(input)).toContain('Second block.');
        expect(getStrapiTextContent(input)).toContain('Third block.');
      });
    });

    describe('nested content arrays', () => {
      it('should extract text from nested content arrays', () => {
        const input = [
          {
            content: [{ content: 'Nested content 1' }, { content: 'Nested content 2' }],
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Nested content 1');
        expect(getStrapiTextContent(input)).toContain('Nested content 2');
      });

      it('should handle deeply nested content', () => {
        const input = [
          {
            content: [
              {
                content: [
                  {
                    content: 'Deep nested text',
                  },
                ],
              },
            ],
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Deep nested text');
      });
    });

    describe('text property handling', () => {
      it('should extract text from text property', () => {
        const input = [
          {
            text: 'This is text from text property.',
          },
        ];
        expect(getStrapiTextContent(input)).toBe('This is text from text property.');
      });

      it('should strip HTML from text property', () => {
        const input = [
          {
            text: '<em>Emphasized</em> and <strong>strong</strong> text.',
          },
        ];
        expect(getStrapiTextContent(input)).toBe('Emphasized and strong text.');
      });
    });

    describe('columns handling', () => {
      it('should extract text from columns array', () => {
        const input = [
          {
            columns: [{ content: 'Column 1 content' }, { content: 'Column 2 content' }],
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Column 1 content');
        expect(getStrapiTextContent(input)).toContain('Column 2 content');
      });

      it('should extract text from column array (singular)', () => {
        const input = [
          {
            column: [{ content: 'Single column content' }],
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Single column content');
      });

      it('should handle nested content within columns', () => {
        const input = [
          {
            columns: [
              {
                content: [{ content: 'Nested in column 1' }, { text: 'More text in column 1' }],
              },
              {
                content: [{ content: 'Nested in column 2' }],
              },
            ],
          },
        ];
        const result = getStrapiTextContent(input);
        expect(result).toContain('Nested in column 1');
        expect(result).toContain('More text in column 1');
        expect(result).toContain('Nested in column 2');
      });
    });

    describe('image handling', () => {
      it('should extract caption from images array', () => {
        const input = [
          {
            images: [{ caption: 'Image caption 1' }, { caption: 'Image caption 2' }],
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Image caption 1');
        expect(getStrapiTextContent(input)).toContain('Image caption 2');
      });

      it('should extract alternativeText from images', () => {
        const input = [
          {
            images: [
              { alternativeText: 'Alt text for image 1' },
              { alternativeText: 'Alt text for image 2' },
            ],
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Alt text for image 1');
        expect(getStrapiTextContent(input)).toContain('Alt text for image 2');
      });

      it('should extract both caption and alternativeText from images', () => {
        const input = [
          {
            images: [
              {
                caption: 'Beautiful sunset',
                alternativeText: 'A sunset over the ocean',
              },
            ],
          },
        ];
        const result = getStrapiTextContent(input);
        expect(result).toContain('Beautiful sunset');
        expect(result).toContain('A sunset over the ocean');
      });

      it('should strip HTML from image captions', () => {
        const input = [
          {
            images: [{ caption: '<p>HTML <strong>caption</strong></p>' }],
          },
        ];
        expect(getStrapiTextContent(input)).toContain('HTML caption');
      });
    });

    describe('asset handling', () => {
      it('should extract caption from asset', () => {
        const input = [
          {
            asset: {
              caption: 'Asset caption text',
            },
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Asset caption text');
      });

      it('should extract alternativeText from asset', () => {
        const input = [
          {
            asset: {
              alternativeText: 'Asset alt text',
            },
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Asset alt text');
      });

      it('should extract both caption and alternativeText from asset', () => {
        const input = [
          {
            asset: {
              caption: 'Asset caption',
              alternativeText: 'Asset alternative text',
            },
          },
        ];
        const result = getStrapiTextContent(input);
        expect(result).toContain('Asset caption');
        expect(result).toContain('Asset alternative text');
      });

      it('should strip HTML from asset caption', () => {
        const input = [
          {
            asset: {
              caption: '<div>Asset <span>caption</span></div>',
            },
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Asset caption');
      });
    });

    describe('media handling', () => {
      it('should extract caption from media', () => {
        const input = [
          {
            media: {
              caption: 'Media caption text',
            },
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Media caption text');
      });

      it('should extract alternativeText from media', () => {
        const input = [
          {
            media: {
              alternativeText: 'Media alt text',
            },
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Media alt text');
      });

      it('should extract both caption and alternativeText from media', () => {
        const input = [
          {
            media: {
              caption: 'Video caption',
              alternativeText: 'Video description',
            },
          },
        ];
        const result = getStrapiTextContent(input);
        expect(result).toContain('Video caption');
        expect(result).toContain('Video description');
      });

      it('should strip HTML from media caption', () => {
        const input = [
          {
            media: {
              caption: '<p>Media <em>caption</em></p>',
            },
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Media caption');
      });
    });

    describe('generic array field handling', () => {
      it('should extract text from custom array fields', () => {
        const input = [
          {
            customField: [
              { content: 'Custom field content 1' },
              { content: 'Custom field content 2' },
            ],
          },
        ];
        const result = getStrapiTextContent(input);
        expect(result).toContain('Custom field content 1');
        expect(result).toContain('Custom field content 2');
      });

      it('should extract text from items array', () => {
        const input = [
          {
            items: [{ text: 'Item 1 text' }, { text: 'Item 2 text' }],
          },
        ];
        const result = getStrapiTextContent(input);
        expect(result).toContain('Item 1 text');
        expect(result).toContain('Item 2 text');
      });

      it('should handle accordion-style components', () => {
        const input = [
          {
            accordionItems: [
              {
                title: 'Accordion title 1',
                content: 'Accordion content 1',
              },
              {
                title: 'Accordion title 2',
                content: 'Accordion content 2',
              },
            ],
          },
        ];
        const result = getStrapiTextContent(input);
        expect(result).toContain('Accordion content 1');
        expect(result).toContain('Accordion content 2');
      });
    });

    describe('Strapi Blocks Editor content', () => {
      it('should handle Strapi Blocks paragraph', () => {
        const input = [
          {
            type: 'paragraph',
            content: [{ type: 'text', content: 'Paragraph text' }],
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Paragraph text');
      });

      it('should handle Strapi Blocks heading', () => {
        const input = [
          {
            type: 'heading',
            level: 1,
            content: [{ type: 'text', content: 'Heading text' }],
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Heading text');
      });

      it('should handle Strapi Blocks list', () => {
        const input = [
          {
            type: 'list',
            format: 'unordered',
            content: [
              {
                type: 'list-item',
                content: [{ type: 'text', content: 'List item 1' }],
              },
              {
                type: 'list-item',
                content: [{ type: 'text', content: 'List item 2' }],
              },
            ],
          },
        ];
        const result = getStrapiTextContent(input);
        expect(result).toContain('List item 1');
        expect(result).toContain('List item 2');
      });

      it('should handle Strapi Blocks quote', () => {
        const input = [
          {
            type: 'quote',
            content: [{ type: 'text', content: 'Quote text here' }],
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Quote text here');
      });

      it('should handle Strapi Blocks code', () => {
        const input = [
          {
            type: 'code',
            content: [{ type: 'text', content: 'const code = true;' }],
          },
        ];
        expect(getStrapiTextContent(input)).toContain('const code = true;');
      });

      it('should handle Strapi Blocks image with caption', () => {
        const input = [
          {
            type: 'image',
            image: {
              alternativeText: 'Image description',
            },
            content: [{ type: 'text', content: 'Image caption' }],
          },
        ];
        expect(getStrapiTextContent(input)).toContain('Image caption');
      });
    });

    describe('complex mixed content', () => {
      it('should handle a realistic blog post structure', () => {
        const input = [
          {
            type: 'heading',
            level: 1,
            content: [{ type: 'text', content: 'Blog Post Title' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', content: 'This is the introduction paragraph.' }],
          },
          {
            type: 'image',
            asset: {
              caption: 'A beautiful hero image',
              alternativeText: 'Hero image showing landscape',
            },
          },
          {
            type: 'heading',
            level: 2,
            content: [{ type: 'text', content: 'First Section' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', content: 'Content of the first section.' }],
          },
          {
            type: 'list',
            content: [
              {
                type: 'list-item',
                content: [{ type: 'text', content: 'Point one' }],
              },
              {
                type: 'list-item',
                content: [{ type: 'text', content: 'Point two' }],
              },
            ],
          },
          {
            type: 'quote',
            text: 'This is an important quote.',
          },
        ];

        const result = getStrapiTextContent(input);
        expect(result).toContain('Blog Post Title');
        expect(result).toContain('This is the introduction paragraph.');
        expect(result).toContain('A beautiful hero image');
        expect(result).toContain('Hero image showing landscape');
        expect(result).toContain('First Section');
        expect(result).toContain('Content of the first section.');
        expect(result).toContain('Point one');
        expect(result).toContain('Point two');
        expect(result).toContain('This is an important quote.');
      });

      it('should handle page builder with multiple component types', () => {
        const input = [
          {
            __component: 'blocks.hero',
            title: 'Welcome to our site',
            content: 'Hero description text',
          },
          {
            __component: 'blocks.text-columns',
            columns: [{ content: 'Left column text' }, { content: 'Right column text' }],
          },
          {
            __component: 'blocks.gallery',
            images: [
              { caption: 'Gallery image 1', alternativeText: 'Alt 1' },
              { caption: 'Gallery image 2', alternativeText: 'Alt 2' },
            ],
          },
          {
            __component: 'blocks.cta',
            text: 'Call to action text',
            buttonText: 'Click here',
          },
        ];

        const result = getStrapiTextContent(input);
        expect(result).toContain('Hero description text');
        expect(result).toContain('Left column text');
        expect(result).toContain('Right column text');
        expect(result).toContain('Gallery image 1');
        expect(result).toContain('Gallery image 2');
        expect(result).toContain('Alt 1');
        expect(result).toContain('Alt 2');
        expect(result).toContain('Call to action text');
      });

      it('should handle carousel/slider components', () => {
        const input = [
          {
            __component: 'blocks.carousel',
            images: [
              {
                caption: 'Slide 1 caption',
                alternativeText: 'Slide 1 description',
              },
              {
                caption: 'Slide 2 caption',
                alternativeText: 'Slide 2 description',
              },
              {
                caption: 'Slide 3 caption',
                alternativeText: 'Slide 3 description',
              },
            ],
          },
        ];

        const result = getStrapiTextContent(input);
        expect(result).toContain('Slide 1 caption');
        expect(result).toContain('Slide 1 description');
        expect(result).toContain('Slide 2 caption');
        expect(result).toContain('Slide 2 description');
        expect(result).toContain('Slide 3 caption');
        expect(result).toContain('Slide 3 description');
      });
    });

    describe('edge cases', () => {
      it('should handle empty objects in array', () => {
        const input = [{}, {}, {}];
        expect(getStrapiTextContent(input)).toBe('');
      });

      it('should handle null values in content', () => {
        const input = [{ content: null }, { text: null }, { caption: null }];
        expect(() => getStrapiTextContent(input)).not.toThrow();
      });

      it('should handle undefined values in content', () => {
        const input = [{ content: undefined }, { text: undefined }];
        expect(() => getStrapiTextContent(input)).not.toThrow();
      });

      it('should handle mixed valid and invalid content', () => {
        const input = [
          { content: 'Valid content' },
          { content: null },
          { text: 'Valid text' },
          {},
          { content: 'More valid content' },
        ];
        const result = getStrapiTextContent(input);
        expect(result).toContain('Valid content');
        expect(result).toContain('Valid text');
        expect(result).toContain('More valid content');
      });

      it('should handle very long content', () => {
        const longText = 'word '.repeat(10000);
        const input = [{ content: longText }];
        const result = getStrapiTextContent(input);
        expect(result).toContain('word');
        expect(result.length).toBeGreaterThan(40000);
      });

      it('should handle special characters', () => {
        const input = [{ content: 'Text with émojis 🎉 and spëcial çharacters' }];
        expect(getStrapiTextContent(input)).toContain('émojis 🎉');
        expect(getStrapiTextContent(input)).toContain('spëcial çharacters');
      });

      it('should handle newlines and whitespace', () => {
        const input = [{ content: 'Line 1\nLine 2\n\nLine 3' }];
        const result = getStrapiTextContent(input);
        expect(result).toContain('Line 1');
        expect(result).toContain('Line 2');
        expect(result).toContain('Line 3');
      });

      it('should strip complex HTML', () => {
        const input = [
          {
            content: `
            <div class="container">
              <h1>Title</h1>
              <p style="color: red;">Paragraph with <a href="#">link</a></p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          `,
          },
        ];
        const result = getStrapiTextContent(input);
        expect(result).not.toContain('<div');
        expect(result).not.toContain('<h1>');
        expect(result).not.toContain('<p');
        expect(result).not.toContain('<a');
        expect(result).not.toContain('<ul>');
        expect(result).not.toContain('<li>');
        expect(result).toContain('Title');
        expect(result).toContain('Paragraph');
        expect(result).toContain('link');
        expect(result).toContain('Item 1');
        expect(result).toContain('Item 2');
      });
    });

    describe('Dynamic Zone content', () => {
      it('should handle dynamic zone with multiple component types', () => {
        const input = [
          {
            __component: 'content.rich-text',
            content: [{ type: 'paragraph', content: [{ content: 'Rich text content' }] }],
          },
          {
            __component: 'content.media',
            media: {
              caption: 'Media component caption',
              alternativeText: 'Media alt text',
            },
          },
          {
            __component: 'content.quote',
            text: 'Quote component text',
          },
        ];

        const result = getStrapiTextContent(input);
        expect(result).toContain('Rich text content');
        expect(result).toContain('Media component caption');
        expect(result).toContain('Media alt text');
        expect(result).toContain('Quote component text');
      });
    });

    describe('Repeatable components', () => {
      it('should handle repeatable FAQ components', () => {
        const input = [
          {
            faqs: [
              {
                text: 'What is Strapi?',
                content: 'Strapi is a headless CMS.',
              },
              {
                text: 'How does it work?',
                content: 'It provides an API for your content.',
              },
            ],
          },
        ];

        const result = getStrapiTextContent(input);
        expect(result).toContain('What is Strapi?');
        expect(result).toContain('Strapi is a headless CMS');
        expect(result).toContain('It provides an API');
      });

      it('should handle repeatable feature components', () => {
        const input = [
          {
            features: [
              {
                text: 'Feature 1',
                content: 'Description of feature 1',
              },
              {
                text: 'Feature 2',
                content: 'Description of feature 2',
              },
            ],
          },
        ];

        const result = getStrapiTextContent(input);
        expect(result).toContain('Feature 1');
        expect(result).toContain('Description of feature 1');
        expect(result).toContain('Feature 2');
        expect(result).toContain('Description of feature 2');
      });
    });
  });
});
