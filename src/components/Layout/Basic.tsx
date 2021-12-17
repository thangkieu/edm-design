import { Header } from '@components/Header';
import { Layout } from '@uikits';
import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { Container } from '../CommonStyles';
import { Footer } from './Footer';

const ContainerOverride = styled(Container)`
  height: 100%;
  overflow: hidden;
`;

interface LayoutProps {
  className?: string;
  actions?: React.ReactNode;
  isMinFullHeight?: boolean;
  hideFooter?: boolean;
}

export const LayoutBasic: FC<LayoutProps> = memo((props) => {
  return (
    <Layout
      className={props.className}
      style={props.isMinFullHeight ? { minHeight: '100vh' } : undefined}
    >
      <Layout.Header style={{ padding: 0 }}>
        <Header actions={props.actions} />
      </Layout.Header>

      <Layout.Content>
        <ContainerOverride>{props.children}</ContainerOverride>
      </Layout.Content>

      {!props.hideFooter && <Footer />}
    </Layout>
  );
});
