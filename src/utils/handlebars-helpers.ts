import placeholderImg from '../icons/image.svg';

/**
 * {{#equal first second}}{{/equal}}
 */
export function equal(first: string, second: string, options: any) {
  if (first === second) {
    // @ts-ignore
    return options.fn(this);
  }

  // @ts-ignore
  return options.inverse(this);
}

export function imgPlaceholder() {
  return `<img aria-img-placeholder src="${placeholderImg}" alt="Image Placeholder" height="100" />`;
}

/**
 * partial helper to show image with link
 */
export function paragraph(params: { tagName?: string; text: string }) {
  let tagName = params.tagName || 'div';

  let paragraph = `<${tagName} class="block-text">${params.text || ''}</${tagName}>`;

  return paragraph;
}
