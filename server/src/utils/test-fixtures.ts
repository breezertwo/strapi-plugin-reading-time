/**
 * Test fixtures for common Strapi content structures
 * These fixtures can be used across tests to validate reading time calculation
 */

// ============================================================================
// Rich Text (Blocks Editor) Fixtures
// ============================================================================

/**
 * Simple paragraph block
 */
export const simpleParagraph = [
  {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: 'This is a simple paragraph with some text content.',
      },
    ],
  },
];

/**
 * Multiple paragraphs
 */
export const multipleParagraphs = [
  {
    type: 'paragraph',
    children: [{ type: 'text', text: 'First paragraph of content.' }],
  },
  {
    type: 'paragraph',
    children: [{ type: 'text', text: 'Second paragraph with more words.' }],
  },
  {
    type: 'paragraph',
    children: [{ type: 'text', text: 'Third paragraph to complete the set.' }],
  },
];

/**
 * Heading with different levels
 */
export const headings = [
  {
    type: 'heading',
    level: 1,
    children: [{ type: 'text', text: 'Main Heading' }],
  },
  {
    type: 'heading',
    level: 2,
    children: [{ type: 'text', text: 'Sub Heading' }],
  },
  {
    type: 'heading',
    level: 3,
    children: [{ type: 'text', text: 'Section Heading' }],
  },
];

/**
 * Text with inline formatting (bold, italic, etc.)
 */
export const formattedText = [
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'Normal text ' },
      {
        type: 'bold',
        children: [{ type: 'text', text: 'bold text' }],
      },
      { type: 'text', text: ' and ' },
      {
        type: 'italic',
        children: [{ type: 'text', text: 'italic text' }],
      },
      { type: 'text', text: ' and ' },
      {
        type: 'underline',
        children: [{ type: 'text', text: 'underlined' }],
      },
      { type: 'text', text: '.' },
    ],
  },
];

/**
 * Unordered list
 */
export const unorderedList = [
  {
    type: 'list',
    format: 'unordered',
    children: [
      {
        type: 'list-item',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'First list item' }],
          },
        ],
      },
      {
        type: 'list-item',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Second list item' }],
          },
        ],
      },
      {
        type: 'list-item',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Third list item' }],
          },
        ],
      },
    ],
  },
];

/**
 * Ordered list
 */
export const orderedList = [
  {
    type: 'list',
    format: 'ordered',
    children: [
      {
        type: 'list-item',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Step one of the process' }],
          },
        ],
      },
      {
        type: 'list-item',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Step two of the process' }],
          },
        ],
      },
      {
        type: 'list-item',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Step three of the process' }],
          },
        ],
      },
    ],
  },
];

/**
 * Blockquote
 */
export const blockquote = [
  {
    type: 'quote',
    children: [
      {
        type: 'text',
        text: 'This is an inspiring quote that someone once said.',
      },
    ],
  },
];

/**
 * Code block
 */
export const codeBlock = [
  {
    type: 'code',
    children: [
      {
        type: 'text',
        text: 'const greeting = "Hello, World!";\nconsole.log(greeting);',
      },
    ],
  },
];

/**
 * Link
 */
export const linkText = [
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'Visit our ' },
      {
        type: 'link',
        url: 'https://example.com',
        children: [{ type: 'text', text: 'website' }],
      },
      { type: 'text', text: ' for more information.' },
    ],
  },
];

// ============================================================================
// Strapi Content Array Fixtures (getStrapiTextContent format)
// ============================================================================

/**
 * Simple content blocks
 */
export const simpleContentBlocks = [
  { content: 'First block of content.' },
  { content: 'Second block of content.' },
  { content: 'Third block of content.' },
];

/**
 * Content with text property
 */
export const textPropertyContent = [
  { text: 'Text using the text property.' },
  { text: 'Another text block here.' },
];

/**
 * Two-column layout
 */
export const twoColumnLayout = [
  {
    columns: [
      { content: 'Left column content goes here with some words.' },
      { content: 'Right column content with additional text.' },
    ],
  },
];

/**
 * Three-column layout
 */
export const threeColumnLayout = [
  {
    columns: [
      { content: 'First column text.' },
      { content: 'Second column text.' },
      { content: 'Third column text.' },
    ],
  },
];

/**
 * Image gallery with captions
 */
export const imageGallery = [
  {
    images: [
      {
        caption: 'A beautiful sunset over the mountains.',
        alternativeText: 'Sunset photograph showing orange and purple sky.',
      },
      {
        caption: 'City skyline at night.',
        alternativeText: 'Urban landscape with illuminated buildings.',
      },
      {
        caption: 'Forest path in autumn.',
        alternativeText: 'Trail surrounded by colorful fall foliage.',
      },
    ],
  },
];

/**
 * Media with caption
 */
export const mediaWithCaption = [
  {
    media: {
      caption: 'Video explaining our product features.',
      alternativeText: 'Product demonstration video.',
    },
  },
];

/**
 * Asset with caption
 */
export const assetWithCaption = [
  {
    asset: {
      caption: 'Downloadable PDF guide.',
      alternativeText: 'Getting started guide document.',
    },
  },
];

/**
 * Nested content structure
 */
export const nestedContent = [
  {
    content: [
      {
        content: [
          { content: 'Deeply nested content block one.' },
          { content: 'Deeply nested content block two.' },
        ],
      },
    ],
  },
];

// ============================================================================
// Dynamic Zone Fixtures
// ============================================================================

/**
 * Hero component
 */
export const heroComponent = {
  __component: 'blocks.hero',
  title: 'Welcome to Our Website',
  content: 'Discover amazing products and services that will transform your life.',
  buttonText: 'Get Started',
};

/**
 * Rich text component
 */
export const richTextComponent = {
  __component: 'blocks.rich-text',
  content: [
    { type: 'paragraph', content: [{ content: 'This is rich text content in a component.' }] },
  ],
};

/**
 * Feature list component
 */
export const featureListComponent = {
  __component: 'blocks.features',
  features: [
    { text: 'Fast Performance', content: 'Our system is optimized for speed.' },
    { text: 'Easy to Use', content: 'Intuitive interface for all users.' },
    { text: 'Secure', content: 'Enterprise-grade security features.' },
  ],
};

/**
 * FAQ component
 */
export const faqComponent = {
  __component: 'blocks.faq',
  faqs: [
    { text: 'What is this product?', content: 'This is an amazing product that does great things.' },
    { text: 'How much does it cost?', content: 'Pricing starts at a competitive rate.' },
    { text: 'Is there support?', content: 'Yes, we offer round the clock support.' },
  ],
};

/**
 * Quote component
 */
export const quoteComponent = {
  __component: 'blocks.quote',
  text: 'This product changed everything for our business.',
  author: 'Jane Doe',
  role: 'CEO, Example Corp',
};

/**
 * Call-to-action component
 */
export const ctaComponent = {
  __component: 'blocks.cta',
  text: 'Ready to get started? Sign up today and receive a free trial.',
  buttonText: 'Sign Up Now',
};

/**
 * Complete dynamic zone page
 */
export const completeDynamicZone = [
  heroComponent,
  richTextComponent,
  featureListComponent,
  faqComponent,
  quoteComponent,
  ctaComponent,
];

// ============================================================================
// Full Page/Article Fixtures
// ============================================================================

/**
 * Complete blog article (Rich Text Blocks format)
 */
export const completeBlogArticle = [
  {
    type: 'heading',
    level: 1,
    children: [{ type: 'text', text: 'The Complete Guide to Modern Web Development' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: 'Web development has evolved significantly over the past decade. In this comprehensive guide, we will explore the latest trends, tools, and best practices that every developer should know.',
      },
    ],
  },
  {
    type: 'heading',
    level: 2,
    children: [{ type: 'text', text: 'Getting Started' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: 'Before diving into complex frameworks and libraries, it is essential to have a solid foundation in the core technologies: HTML, CSS, and JavaScript.',
      },
    ],
  },
  {
    type: 'list',
    format: 'unordered',
    children: [
      {
        type: 'list-item',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Learn semantic HTML for better accessibility' }],
          },
        ],
      },
      {
        type: 'list-item',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Master CSS layouts with Flexbox and Grid' }],
          },
        ],
      },
      {
        type: 'list-item',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Understand modern JavaScript ES6 features' }],
          },
        ],
      },
    ],
  },
  {
    type: 'heading',
    level: 2,
    children: [{ type: 'text', text: 'Choosing a Framework' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: 'Once you have mastered the basics, you can explore popular frameworks like React, Vue, or Angular. Each has its own strengths and use cases.',
      },
    ],
  },
  {
    type: 'quote',
    children: [
      {
        type: 'text',
        text: 'The best framework is the one that solves your specific problem effectively.',
      },
    ],
  },
  {
    type: 'heading',
    level: 2,
    children: [{ type: 'text', text: 'Conclusion' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: 'Web development is a continuous journey of learning. Stay curious, keep practicing, and always be open to new technologies and approaches.',
      },
    ],
  },
];

/**
 * Complete landing page (Strapi content array format)
 */
export const completeLandingPage = [
  {
    type: 'hero',
    content: 'Transform your business with our innovative solutions.',
  },
  {
    columns: [
      { content: 'Fast and reliable performance for your applications.' },
      { content: 'Scalable infrastructure that grows with your needs.' },
      { content: 'Dedicated support team available around the clock.' },
    ],
  },
  {
    content: 'Our platform has helped thousands of businesses achieve their goals.',
  },
  {
    images: [
      { caption: 'Dashboard overview showing key metrics.', alternativeText: 'Analytics dashboard' },
      { caption: 'Team collaboration features in action.', alternativeText: 'Collaboration tools' },
    ],
  },
  {
    text: 'Join over ten thousand satisfied customers today.',
  },
];

// ============================================================================
// Edge Case Fixtures
// ============================================================================

/**
 * Content with HTML tags
 */
export const contentWithHtml = [
  {
    content: '<p>This is a <strong>paragraph</strong> with <em>HTML</em> formatting.</p>',
  },
  {
    content: '<div><h2>Heading</h2><ul><li>Item 1</li><li>Item 2</li></ul></div>',
  },
];

/**
 * Content with special characters
 */
export const contentWithSpecialChars = [
  { content: 'Café résumé naïve façade' },
  { content: 'Emojis: 🎉 🚀 ✨ 💡' },
  { content: 'Symbols: © ® ™ € £ ¥' },
];

/**
 * Empty and null content
 */
export const emptyContent = [
  { content: '' },
  { content: null },
  { text: '' },
  {},
];

/**
 * Mixed valid and invalid content
 */
export const mixedContent = [
  { content: 'Valid content here.' },
  { content: null },
  { text: 'More valid text.' },
  {},
  { content: '' },
  { content: 'Final valid content.' },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate content with a specific word count
 * @param wordCount - Number of words to generate
 * @returns Array with content containing the specified number of words
 */
export const generateContentWithWordCount = (wordCount: number) => {
  const words = Array(wordCount).fill('word').join(' ');
  return [{ content: words }];
};

/**
 * Generate rich text blocks with a specific word count
 * @param wordCount - Number of words to generate
 * @returns Rich text blocks array
 */
export const generateRichTextWithWordCount = (wordCount: number) => {
  const words = Array(wordCount).fill('word').join(' ');
  return [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: words }],
    },
  ];
};

/**
 * Calculate expected reading time in minutes
 * @param wordCount - Number of words
 * @param wordsPerMinute - Reading speed (default: 200)
 * @returns Expected minutes
 */
export const calculateExpectedMinutes = (wordCount: number, wordsPerMinute = 200): number => {
  return wordCount / wordsPerMinute;
};
