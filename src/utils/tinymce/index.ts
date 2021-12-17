// prettier-ignore
import tinymce,{ Editor } from 'tinymce/tinymce';

import 'tinymce/themes/silver';

/* Import the skin */
import 'tinymce/skins/ui/oxide/skin.css';

/* Import plugins */
//  import 'tinymce/plugins/advlist';
//  import 'tinymce/plugins/code';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/link';
//  import 'tinymce/plugins/lists';
//  import 'tinymce/plugins/table';

/* Import premium plugins */
/* NOTE: Download separately and add these to /src/plugins */
/* import './plugins/checklist/plugin'; */
/* import './plugins/powerpaste/plugin'; */
/* import './plugins/powerpaste/js/wordimport'; */

/* Import content css */
// @ts-ignore
//  import contentUiCss from 'tinymce/skins/ui/oxide/content.css';
// @ts-ignore
//  import contentCss from 'tinymce/skins/content/default/content.css';
// @ts-ignore
import customCss from './custom.css';

import {icons} from './icons';

tinymce.IconManager.add('default', { icons });

/* Initialize TinyMCE */
export function renderTinyMce(element: HTMLElement, placeholder: string = 'Enter your text here...') {
  if (!element) throw new Error('Selector is missing');
  
  return tinymce.init({
    target: element,
    plugins: 'emoticons link',
    toolbar: 'fontsizeselect | formatgroup | paragraphgroup | link emoticons',
    toolbar_groups: {
      formatgroup: {
        icon: 'format',
        tooltip: 'Formatting',
        items:
          'bold italic underline strikethrough | forecolor backcolor | superscript subscript | removeformat',
      },
      paragraphgroup: {
        icon: 'paragraph',
        tooltip: 'Paragraph format',
        items: 'bullist numlist | alignleft aligncenter alignright | indent outdent',
      },
    },
    fontsize_formats: '8px 12px 14px 16px 24px 32px 40px',
    skin: false,
    content_css: false,
    menubar: false,
    content_style: [customCss.toString()].join('\n'),
    inline: true,
    body_class: 'tinymce-custom-body',
    placeholder,
  });
}

export { tinymce, Editor };