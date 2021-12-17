import { Button, Form, FormItem, Input, Typography } from '@uikits';
import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ActionStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const RightAction = styled.div`
  text-align: right;
`;

const ContactUsButton = styled(Button)`
  margin-right: -23px;
`;

interface StepProps {
  loading?: boolean;
  onSubmit?(email: string): void;
}

type FormValues = {
  email: string;
};

const DEFAULT_VALUES = { email: '' };

function shouldUpdate(prev: FormValues, curr: FormValues) {
  return prev.email !== curr.email;
}

export const Step1 = memo<StepProps>(({ loading, onSubmit }) => {
  const handleSubmit = useCallback(
    (values: FormValues) => {
      onSubmit?.(values.email);
    },
    [onSubmit]
  );

  return (
    <Form onFinish={handleSubmit} layout="vertical" initialValues={DEFAULT_VALUES}>
      <Typography style={{ marginBottom: '1rem' }}>
        Enter your Email Addess and we will send you One-Time Password (OTP) to enter below.
      </Typography>

      <FormItem
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: 'email',
          },
        ]}
      >
        <Input autoComplete="off" placeholder="abc@example.com" type="email" />
      </FormItem>
      <FormItem shouldUpdate={shouldUpdate}>
        {(form) => (
          <ActionStyle>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!form.getFieldValue('email')}
            >
              Get OTP
            </Button>
            <RightAction>
              <Typography>Not a registered user yet?</Typography>
              <ContactUsButton type="link">
                <Link to="https://google.com">Contact Us.</Link>
              </ContactUsButton>
            </RightAction>
          </ActionStyle>
        )}
      </FormItem>
    </Form>
  );
});
