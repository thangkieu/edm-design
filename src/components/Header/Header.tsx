import { appconfig } from '@app/appconfig';
import { Typography } from '@uikits';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '../CommonStyles';

interface HeaderProps {
  actions?: React.ReactNode;
}

const HeaderContent = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
  line-height: 1;
`;

const LogoStyle = styled(Link)`
  color: white;
  text-decoration: none;
`;

export const Header = memo<HeaderProps>((props) => {
  return (
    <HeaderContent>
      <LogoStyle to="/">
        <Typography.Title level={3} style={{ margin: 0, lineHeight: 1 }}>
          {appconfig.title}
        </Typography.Title>
        <Typography.Text type="secondary">
          <small>{appconfig.subTitle}</small>
        </Typography.Text>
      </LogoStyle>
      {props.actions}
    </HeaderContent>
  );
});
