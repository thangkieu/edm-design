import { getOTP } from '@services/auth';
import { Button, Form, FormItem, Input, Space, Typography } from '@uikits';
import { validateBy } from '@utils/helpers';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

interface StepProps {
  loading?: boolean;
  email: string;
  onSubmit?(otp: number): void;
}

type FormValues = {
  otp: number;
};

const DEFAULT_VALUES = {
  otp: '',
};

const ResetButton = styled(Button)`
  padding-left: 0;
  padding-right: 0;
`;

export const Step2 = memo<StepProps>(({ loading, email, onSubmit }) => {
  const [resending, toggleResend] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const resendTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(
    () => () => {
      if (resendTimeoutRef.current) clearTimeout(resendTimeoutRef.current);
    },
    []
  );

  const handleSubmit = useCallback(
    (values: FormValues) => {
      if (values.otp) onSubmit?.(values.otp);
    },
    [onSubmit]
  );

  const handleResend = useCallback(async () => {
    if (!email || !validateBy('email', email)) return;

    toggleResend(true);
    const resp = await getOTP(email);
    if (resp?.message) setResendStatus(resp?.message);
    resendTimeoutRef.current = setTimeout(() => void setResendStatus(''), 5000);

    toggleResend(false);
  }, [email]);

  const resendBtnLabel = useMemo(() => {
    if (resending) return 'Resending...';
    if (resendStatus) return resendStatus;

    return 'Resend OTP';
  }, [resending, resendStatus]);

  return (
    <Form onFinish={handleSubmit} layout="vertical" initialValues={DEFAULT_VALUES}>
      <Typography.Text type="secondary">
        An OTP has been emailed to you. Enter OTP below.
      </Typography.Text>

      <FormItem label="One-Time Password" name="otp">
        <Input placeholder="OTP" type="number" />
      </FormItem>

      <Space>
        <FormItem
          style={{ margin: 0 }}
          shouldUpdate={(prevValues, curValues) => prevValues.otp !== curValues.otp}
        >
          {(form) => (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!form.getFieldValue('otp')}
            >
              Login
            </Button>
          )}
        </FormItem>
        {resendStatus ? (
          <Typography.Text type="success">{resendStatus}</Typography.Text>
        ) : (
          <ResetButton htmlType="button" type="link" onClick={handleResend}>
            {resendBtnLabel}
          </ResetButton>
        )}
      </Space>
    </Form>
  );
});
