import loadable from '@loadable/component';
import React from 'react';
import { TinyEditorProps } from './TinyEditor';

const TinyEditor = loadable(() => import('./TinyEditor'));

export const TinyEditorRef = React.forwardRef<null, TinyEditorProps>((props, ref) => {
  return <TinyEditor {...props}>{props.children}</TinyEditor>;
});
