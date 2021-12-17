import { ModuleTypeEnum } from '@app/enums';
import { getS3ImageUrl } from '@services/helpers';
import { equal, imgPlaceholder, paragraph } from '@utils/handlebars-helpers';
import Handlebars from 'handlebars';

Handlebars.registerHelper('equal', equal);
Handlebars.registerPartial('img-placeholder', imgPlaceholder);
Handlebars.registerPartial('paragraph', paragraph);

const styleMapping: Record<keyof ModuleTextStyle, string> = {
  fontSize: 'font-size',
  weight: 'font-weight',
  color: 'color',
  padding: 'padding',
  backgroundImage: 'background-image',
};

function getTextStyle(tmplModule: ModuleConfig) {
  if (tmplModule.type === ModuleTypeEnum.Spacer || !tmplModule.config.textStyle) return '';

  let str = 'word-break: break-word; vertical-align: top;';
  str += (Object.keys(tmplModule.config.textStyle) as Array<keyof ModuleTextStyle>)
    .map((key) =>
      key !== 'backgroundImage' ? `${styleMapping[key]}: ${tmplModule.config.textStyle[key]}` : ''
    )
    .join(';');

  return str;
}

export function renderModule(tmplModule: ModuleConfig, transformImgToS3Url?: boolean) {
  const htmlStr = Handlebars.compile(tmplModule.template)(tmplModule.config);

  if (tmplModule.type === ModuleTypeEnum.Spacer) return htmlStr;

  const div = document.createElement('div');
  div.innerHTML = htmlStr;

  // clear all padding, margin of potential elements
  div.querySelectorAll<HTMLDivElement>('h1,h2,h3,h4,h5,h6,p,td').forEach((el) => {
    const marginLeft = parseInt(el.style.marginLeft, 10) || 0;
    const marginRight = parseInt(el.style.marginRight, 10) || 0;
    const marginBottom = parseInt(el.style.marginBottom, 10) || 0;
    const marginTop = parseInt(el.style.marginTop, 10) || 0;
    el.style.margin = `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`;

    const paddingLeft = parseInt(el.style.paddingLeft, 10) || 0;
    const paddingRight = parseInt(el.style.paddingRight, 10) || 0;
    const paddingBottom = parseInt(el.style.paddingBottom, 10) || 0;
    const paddingTop = parseInt(el.style.paddingTop, 10) || 0;
    el.style.padding = `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`;
  });

  // clear all padding, margin of potential elements
  div.querySelectorAll<HTMLTableCellElement>('td').forEach((el) => {
    el.style.verticalAlign = 'top';
  });

  // clear all padding, margin of potential elements
  div.querySelectorAll<HTMLTableCellElement>('[background]').forEach((el) => {
    el.style.backgroundPosition = 'top left';
    el.style.backgroundSize = 'cover';
    el.style.backgroundRepeat = 'no-repeat';

    if (transformImgToS3Url) {
      const src = el.getAttribute('background');
      if (src) el.setAttribute('background', getS3ImageUrl(src));
    }
  });

  const firstElementChild = div.firstElementChild as HTMLDivElement;

  if (firstElementChild && tmplModule.config?.backgroundColor) {
    firstElementChild.style.backgroundColor = tmplModule.config.backgroundColor;
  }

  const textEls = div.querySelectorAll<HTMLDivElement>('.block-text');
  if (tmplModule.config.textStyle && textEls) {
    textEls.forEach((el) => {
      el.style.cssText += getTextStyle(tmplModule);
    });
  }

  // add placeholder text for empty .block-text
  if (!tmplModule.config.text && tmplModule.config.textPlaceholder) {
    textEls.forEach((el) => {
      el.style.cssText += getTextStyle(tmplModule);
    });
  }

  // standardize table
  const tables = div.querySelectorAll<HTMLTableElement>('table');
  tables?.forEach((table) => {
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.height = table.style.height || '1px'; // trick to make element inside table cell has height 100%
  });

  // standardize images
  const imgs = div.querySelectorAll<HTMLTableElement>('img:not([aria-img-placeholder])');
  imgs?.forEach((img) => {
    img.style.display = 'block';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.marginLeft = 'auto';
    img.style.marginRight = 'auto';
  });

  // add box-sizing
  div.querySelectorAll<HTMLDivElement>('*').forEach((el) => {
    el.style.boxSizing = 'content-box';
  });

  return div.innerHTML;
}

export function hasText(type: ModuleTypeEnum) {
  return [
    ModuleTypeEnum.Text,
    ModuleTypeEnum.Header,
    ModuleTypeEnum.Footer,
    ModuleTypeEnum.ImageText,
  ].includes(type);
}
