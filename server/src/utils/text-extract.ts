export const getPlainText = (block: any): string => {
  const text = block.reduce((acc: any, node: any) => {
    if (node.type === 'text') {
      return acc + node.text;
    }
    return acc + getPlainText(node.children);
  }, '');

  return text;
};

// Enhanced function to extract text from nested Strapi content structures
// Src: https://raw.githubusercontent.com/mintech-dot/strapi-plugin-reading-time
export const getStrapiTextContent = (contentArray: any) => {
  if (contentArray && !Array.isArray(contentArray) && contentArray.content) {
    contentArray = contentArray.content;
  }

  if (!Array.isArray(contentArray)) {
    return '';
  }

  let allText = '';

  const extractTextRecursively = (item: any) => {
    let text = '';

    if (typeof item === 'string') {
      return item.replace(/<[^>]*>/g, '');
    }

    if (item && typeof item === 'object') {
      // Handle direct content strings (like in elements.text)
      if (item.content && typeof item.content === 'string') {
        text += item.content.replace(/<[^>]*>/g, '') + ' ';
      }

      // Handle nested content arrays
      if (item.content && Array.isArray(item.content)) {
        item.content.forEach((nestedItem) => {
          text += extractTextRecursively(nestedItem) + ' ';
        });
      }

      // Handle columns specifically (elements.columns)
      if (item.columns && Array.isArray(item.columns)) {
        item.columns.forEach((column) => {
          text += extractTextRecursively(column) + ' ';
        });
      }

      // Handle column field (singular)
      if (item.column && Array.isArray(item.column)) {
        item.column.forEach((column) => {
          text += extractTextRecursively(column) + ' ';
        });
      }

      // Handle quote text (elements.quote)
      if (item.text && typeof item.text === 'string') {
        text += item.text.replace(/<[^>]*>/g, '') + ' ';
      }

      // Handle carousel items
      if (item.images && Array.isArray(item.images)) {
        item.images.forEach((image) => {
          if (image.caption) {
            text += image.caption.replace(/<[^>]*>/g, '') + ' ';
          }
          if (image.alternativeText) {
            text += image.alternativeText + ' ';
          }
        });
      }

      // Handle asset captions
      if (item.asset && item.asset.caption) {
        text += item.asset.caption.replace(/<[^>]*>/g, '') + ' ';
      }
      if (item.asset && item.asset.alternativeText) {
        text += item.asset.alternativeText + ' ';
      }

      // Handle media captions
      if (item.media && item.media.caption) {
        text += item.media.caption.replace(/<[^>]*>/g, '') + ' ';
      }
      if (item.media && item.media.alternativeText) {
        text += item.media.alternativeText + ' ';
      }

      // Generic handler for other array fields
      Object.keys(item).forEach((key) => {
        if (Array.isArray(item[key]) && !['content', 'columns', 'column', 'images'].includes(key)) {
          item[key].forEach((nestedItem) => {
            text += extractTextRecursively(nestedItem) + ' ';
          });
        }
      });
    }

    return text;
  };

  contentArray.forEach((contentBlock) => {
    if (contentBlock && typeof contentBlock === 'object') {
      allText += extractTextRecursively(contentBlock) + ' ';
    }
  });

  return allText.trim();
};
