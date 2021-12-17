import { FormInstance } from 'antd/es/form';
import { memo, useCallback, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { theme } from '@app/theme';
import { getHTML } from '@components/ExportEdmDesign';
import { MultipleInput } from '@components/FormControls/MultipleInput';
import { CheckCircleTwoTone, MailOutlined } from '@icons';
import { designConfigState } from '@recoil-atoms/atoms';
import {
  designModulesConfigInOrderSelector,
  saveDesignSelector
} from '@recoil-atoms/selectors';
import { userInfoState } from '@recoil-atoms/user-info';
import { apiHelpers } from '@services/api';
import { saveCurentDesign } from '@services/themes';
import { Button, Form, FormItem, Input, Modal, Typography } from '@uikits';
import { validateBy } from '@utils/helpers';
import { notify } from '@utils/notification';

interface SendEmailProps {
  data?: Partial<SendEmailForm>;
  onSubmit?(data: SendEmailForm): void;
}

const Box = styled.div`
  text-align: center;
`;

export const SendEmail = memo<SendEmailProps>((props) => {
  const currentModuleList = useRecoilValue(designModulesConfigInOrderSelector);
  const designConfig = useRecoilValue(designConfigState);
  const userInfo = useRecoilValue(userInfoState);
  const saveDesign = useSetRecoilState(saveDesignSelector);

  const [isSendingEmail, toggleSendingEmail] = useState(false);
  const [isSent, toggleIsSent] = useState(false);
  const [isShowSendEmailForm, toggleModal] = useState(false);

  const formRef = useRef<FormInstance>(null);

  const sendEmail = useCallback(
    async (message: string, values: SendEmailForm) => {
      toggleSendingEmail(true);

      await saveCurentDesign(saveDesign);

      try {
        await apiHelpers.post('/api/send-email', {
          body: JSON.stringify({
            message: message,
            subject: values.subject,
            receivers: values.emails,
            sender: userInfo?.email,
            reply_to: values.replyTo || userInfo?.email,
          } as SendEmailBody),
        });

        toggleIsSent(true);
      } catch (err: any) {
        notify.error(err.message);
      }

      toggleSendingEmail(false);
    },
    [userInfo?.email, saveDesign]
  );

  const handleSendEmail = useCallback(
    async (values: SendEmailForm) => {
      if (!designConfig) return;

      const mergedConfig = {
        ...designConfig,
        modules: currentModuleList,
      };

      let htmlStr = getHTML(mergedConfig, true);

      sendEmail(htmlStr, values);
    },
    [currentModuleList, designConfig, sendEmail]
  );

  const handleToggleSendEmail = useCallback(() => {
    toggleModal(!isShowSendEmailForm);
  }, [isShowSendEmailForm]);

  const handleSubmitForm = useCallback(() => {
    formRef.current?.submit();
  }, []);

  const handleCancel = useCallback(() => {
    toggleSendingEmail(false);
    toggleIsSent(false);
    toggleModal(false);
  }, []);

  return (
    <>
      <Button
        icon={<MailOutlined />}
        disabled={
          !currentModuleList || currentModuleList.length === 0 || isSendingEmail || !designConfig
        }
        loading={isSendingEmail}
        onClick={handleToggleSendEmail}
      >
        Send Emails
      </Button>
      <Modal
        title="Send Emails"
        visible={isShowSendEmailForm}
        okText="Send"
        okButtonProps={{
          type: 'primary',
          loading: isSendingEmail,
          disabled: true,
          style: {
            display: isSent ? 'none' : 'inline-block',
          },
        }}
        cancelButtonProps={{
          type: isSent ? 'primary' : undefined,
        }}
        cancelText={isSent ? 'OK' : undefined}
        onCancel={handleCancel}
        onOk={handleSubmitForm}
      >
        {isSent ? (
          <Box>
            <p>
              <CheckCircleTwoTone style={{ fontSize: 30 }} twoToneColor={theme.colors.success} />
            </p>
            <Typography.Paragraph>Emails sent successfully</Typography.Paragraph>
          </Box>
        ) : (
          <Form
            ref={formRef}
            layout="vertical"
            onFinish={handleSendEmail}
            initialValues={{ subject: designConfig?.name, emails: [], replyTo: userInfo?.email }}
          >
            <FormItem label="Subject" name="subject" rules={[{ required: true, type: 'string' }]}>
              <Input />
            </FormItem>
            <FormItem label="Reply To" name="replyTo">
              <Input />
            </FormItem>
            <FormItem
              label="Emails"
              name="emails"
              rules={[
                {
                  required: true,
                  type: 'array',
                  message: 'Please enter at least one email',
                },
                {
                  validator: (values, value: string[], allValues) => {
                    if (value.some((email) => !validateBy('email', email))) {
                      return Promise.reject(new Error('Please enter a valid email'));
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <MultipleInput />
            </FormItem>

            <Typography.Text type="secondary">
              Need an email server to trigger send email
            </Typography.Text>
          </Form>
        )}
      </Modal>
    </>
  );
});
