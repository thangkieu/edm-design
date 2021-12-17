import { CloudUploadOutlined } from '@components/Icons';
import { Space } from '@uikits';
import { memo, useMemo } from 'react';
import styled from 'styled-components';
import { OverlayActions } from './OverlayActions';
import { UploadImage } from './UploadImage';

interface PhotoSelectionProps {
  hasNone?: boolean;
  name: string;
  id?: string;
  images: BackgroundItem[];
  onChange?: (imgUrl: string) => void | React.ChangeEventHandler<HTMLInputElement>;
  onUploaded?: (imgUrl: string) => void;
  onRemoveUploaded?: (id: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  maxUploaded?: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ItemStyle = styled.div`
  flex: 1 1 33.333333%;
  position: relative;

  label {
    border: 1px solid ${(p) => p.theme.colors.border};
    background-position: center;
    background-size: cover;
    padding-bottom: 50%;
    display: block;
    position: relative;
    background-color: white;
  }

  input {
    opacity: 0;
    appearance: none;
    position: absolute;
    top: 0;
    left: 0;

    &:checked + label {
      border-color: ${(p) => p.theme.colors.primary};
      box-shadow: inset 2px 2px 0 ${(p) => p.theme.colors.primary},
        inset -2px -2px 0 ${(p) => p.theme.colors.primary};
    }
  }
`;

const Text = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UploadButton = styled(UploadImage)`
  flex: 1 1 33.333333%;
  min-height: 5rem;
`;

export const PhotoSelection = memo<PhotoSelectionProps>(
  ({ onChange, onUploaded, onRemoveUploaded, maxUploaded = 1, ...props }) => {
    const shouldShowUploaded = useMemo(
      () =>
        maxUploaded > 0
          ? props.images.filter((item) => item.type === 'uploaded').length < maxUploaded
          : true,
      [props.images, maxUploaded]
    );

    return (
      <Wrapper className={props.className}>
        {props.hasNone && (
          <ItemStyle>
            <input
              type="radio"
              name={props.name}
              value=""
              id={`${props.id}-${props.name}`}
              onChange={onChange as any}
              checked={props.value === ''}
            />
            <label htmlFor={`${props.id}-${props.name}`}>
              <Text>None</Text>
            </label>
          </ItemStyle>
        )}
        {props.images?.map((image, index) => (
          <ItemStyle key={image.id}>
            <input
              id={`${image.id}-${props.id}`}
              type="radio"
              name={props.name}
              value={image.image}
              onChange={onChange as any}
              checked={props.value === image.image}
            />
            <label
              htmlFor={`${image.id}-${props.id}`}
              style={{ backgroundImage: `url(${image.thumbnail})` }}
            >
              {image.type === 'uploaded' && (
                <OverlayActions data={image.id} onDelete={onRemoveUploaded} />
              )}
            </label>
          </ItemStyle>
        ))}

        {shouldShowUploaded && (
          <UploadButton
            onChange={onUploaded}
            buttonRender={
              <Space direction="horizontal">
                <CloudUploadOutlined style={{ fontSize: 16 }} />
                <span>Upload</span>
              </Space>
            }
          />
        )}
      </Wrapper>
    );
  }
);
