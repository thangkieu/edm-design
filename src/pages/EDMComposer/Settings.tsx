import { theme } from '@app/theme';
import { Error } from '@components/Error';
import { designConfigState } from '@recoil-atoms/atoms';
import {
  Card,
  ColorPicker,
  Divider,
  Form,
  FormItem,
  Input,
  InputNumber,
  Typography,
} from '@uikits';
import { debounce } from 'lodash';
import { memo, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  overflow-y: auto;
`;

export const Settings = memo(() => {
  const [designConfig, updateDesignConfig] = useRecoilState(designConfigState);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFormChange = useCallback(
    debounce((_, allValues: EdmDesignConfig) => {
      if (!designConfig) return;

      updateDesignConfig({ ...designConfig, ...allValues });
    }, 0),

    [designConfig, updateDesignConfig]
  );

  if (!designConfig) {
    console.error('Edm Design details is missing');

    return <Error message="Component render error" />;
  }

  return (
    <Wrapper>
      <Card bordered={false} bodyStyle={{ paddingBottom: theme.spacing.sm }}>
        <Typography.Title
          level={4}
          style={{
            marginBottom: 0,
          }}
        >
          Settings
        </Typography.Title>
        <Typography.Text type="secondary">
          <small>Global settings for the overall EDM Design</small>
        </Typography.Text>
      </Card>
      <Divider className="no-margin" />

      <Card bordered={false}>
        <Form layout="vertical" onValuesChange={handleFormChange} initialValues={designConfig}>
          <FormItem label="EDM Name" name="name">
            <Input />
          </FormItem>

          <FormItem label="Content Width (px)" name="contentWidth">
            <InputNumber />
          </FormItem>

          <FormItem label="Background Color" name="backgroundColor">
            <ColorPicker id="edm-design-colorpicker" name="backgroundColor" />
          </FormItem>
        </Form>
      </Card>

      <Divider className="no-margin" />
    </Wrapper>
  );
});

export default Settings;
