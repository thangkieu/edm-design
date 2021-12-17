import { appconfig } from '@app/appconfig';
import { Layout } from '@components/UIKits';
import { memo } from 'react';

interface HeaderProps {
  className?: string;
}

export const Footer = memo<HeaderProps>((props) => {
  return (
    <Layout.Footer className={props.className} style={{ textAlign: 'center' }}>
      {appconfig.footnote}
    </Layout.Footer>
  );
});
