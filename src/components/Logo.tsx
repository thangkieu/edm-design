import { appconfig } from '@app/appconfig';
import { Typography } from '@uikits';
import { FC, memo } from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: FC<LogoProps> = memo((props) => (
  <Typography.Title style={{ margin: 0 }} level={1} className={props.className}>
    {appconfig.title}
  </Typography.Title>
));
