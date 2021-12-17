import { CloudUploadOutlined } from '@icons';
import { getToken } from '@services/api/base-api';
import { Upload, UploadChangeParam, UploadFile, UploadFileStatus } from '@uikits';
import { loadFile, preventUpload } from '@utils/helpers';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

interface UploadImageProps {
  name?: string;
  defaultValue?: string;
  value?: string;
  className?: string;
  buttonRender?: React.ReactNode;
  onChange?(imageUrl?: string | null): void;
}

const Wrapper = styled.div<{ isHide?: boolean }>`
  position: relative;

  ${(p) =>
    p.isHide
      ? css`
          .ant-upload {
            opacity: 0;
          }
        `
      : css`
          .ant-upload-list-picture-card {
            pointer-events: none;
          }
        `}

  .ant-upload-list-picture-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .ant-upload-list-picture-card-container {
    width: 100%;
    height: 100%;
  }
`;

export const UploadImage = memo<UploadImageProps>(
  ({ value, onChange, buttonRender, className, defaultValue }) => {
    const defaultFileList = useMemo(() => {
      if (!defaultValue) return [];

      return [
        {
          uid: '-1',
          name: defaultValue,
          status: 'done' as UploadFileStatus,
          url: defaultValue,
        },
      ];
    }, [defaultValue]);

    const [fileList, setFileList] = useState<UploadFile<any>[]>(defaultFileList);

    const handleChange = useCallback(
      async (info: UploadChangeParam<UploadFile<any>>) => {
        setFileList(info.fileList as any);

        switch (info.file.status) {
          case 'done':
            onChange?.(info.file.response.url);
            setFileList(
              info.fileList.map((item) => ({
                ...item,
                url: item.response.url,
              }))
            );
            break;
          case 'removed':
            onChange?.('');
            break;
          default:
            const base64 = await loadFile(info.file as any, 'image');
            onChange?.(base64);
        }
      },
      [onChange]
    );

    useEffect(() => {
      if (value && fileList.length === 0) {
        const newFileList = [
          {
            uid: '-1',
            name: 'value',
            url: value,
            status: 'done' as UploadFileStatus,
          },
        ];

        setFileList(newFileList);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Wrapper className={className} isHide={fileList?.length === 1}>
        <Upload.Dragger
          multiple={false}
          action={`${process.env.REACT_APP_BASE_API}/upload_file/images`}
          headers={{
            Authorization: `Bearer ${getToken()}`,
          }}
          name="file_obj"
          onChange={handleChange}
          fileList={fileList}
          listType="picture-card"
          maxCount={1}
          showUploadList={{ showRemoveIcon: true, showPreviewIcon: false }}
          beforeUpload={preventUpload}
        >
          {buttonRender || (
            <>
              <p className="ant-upload-drag-icon" style={{ marginBottom: '0.5rem' }}>
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag image to this area to upload</p>
            </>
          )}
        </Upload.Dragger>
      </Wrapper>
    );
  }
);
