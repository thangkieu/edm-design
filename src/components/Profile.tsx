import { logoutSelector } from '@recoil-atoms/selectors';
import { Button, Dropdown, Menu } from '@uikits';
import { memo, useCallback, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import { FileImageOutlined, LogoutOutlined, UserOutlined } from './Icons';

interface ProfileProps {
  className?: string;
}

export const Profile = memo<ProfileProps>((props) => {
  const history = useHistory();
  const logout = useResetRecoilState(logoutSelector);

  const handleLogout = useCallback(() => {
    logout();
    history.push('/login');
  }, [history, logout]);

  const menu = useMemo(
    () => (
      <Menu>
        <Menu.Item key="edm-composer">
          <Link to="/edm-composer">
            <FileImageOutlined /> EDM Composer
          </Link>
        </Menu.Item>
        <Menu.Item onClick={handleLogout} key="logout">
          <LogoutOutlined /> Logout
        </Menu.Item>
      </Menu>
    ),
    [handleLogout]
  );

  return (
    <Dropdown overlay={menu} placement="bottomLeft" arrow>
      <Button shape="circle" icon={<UserOutlined />}></Button>
    </Dropdown>
  );
});
