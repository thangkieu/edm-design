import { notification } from 'antd';

export const notify = {
  error(message: string) {
    notification.error({
      message: 'Error',
      description: message,
    });
  },
  success({ message, title = 'Success' }: { message: string; title?: string }) {
    notification.success({
      message: title,
      description: message,
    });
  },
};
