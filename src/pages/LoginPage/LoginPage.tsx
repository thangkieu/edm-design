import { getOTP, login } from '@services/auth';
import { Typography } from '@uikits';
import React, { memo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { LayoutSide } from '../../components/Layout/Side';
import { Logo } from '../../components/Logo';
import { userInfoState } from '../../recoil-atoms/user-info';
import { Step1 } from './Step1';
import { Step2 } from './Step2';

const LogoStyle = styled(Logo)`
  font-size: 3em;
`;

export const LoginPage = memo(() => {
  const history = useHistory();

  const [loading, toggleLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const setUserInfo = useSetRecoilState(userInfoState);

  const handleSubmitEmail = useCallback(async (email: string) => {
    if (!email) return;

    toggleLoading(true);
    const resp = await getOTP(email);

    toggleLoading(false);

    if (!resp) return;

    setEmail(email);
    setStep(2);
  }, []);

  const handleSubmitOtp = useCallback(
    async (otp: number) => {
      if (!email || !otp) return;

      toggleLoading(true);
      const resp = await login(email, otp);

      toggleLoading(false);

      if (!resp) return;

      const { jwt, expires_in, ...userInfo } = resp;

      if (userInfo.email) {
        setUserInfo(userInfo);
        history.push('/');
      }
    },
    [email, history, setUserInfo]
  );

  return (
    <LayoutSide>
      <LogoStyle />
      <Typography.Text type="secondary" italic>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </Typography.Text>
      <br />
      {step === 1 && <Step1 loading={loading} onSubmit={handleSubmitEmail} />}
      {step === 2 && <Step2 loading={loading} onSubmit={handleSubmitOtp} email={email} />}
    </LayoutSide>
  );
});

export default LoginPage;
