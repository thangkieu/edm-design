import { convertHexToRGBA } from '@utils/helpers';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: ${(p) => p.theme.fontSize.base};
  }
   
  b,strong {
    font-weight: 500
  }

  .ant-form-vertical .ant-form-item {
    flex-wrap: nowrap
  }

  .ant-upload-text {
    padding-left: ${(p) => p.theme.spacing.xs};
    padding-right: ${(p) => p.theme.spacing.xs};
  }

  .ant-divider-horizontal.no-margin {
    margin-top: 0;
    margin-bottom: 0;
  }

  .ant-form-vertical .ant-form-item:last-of-type {
    margin-bottom: 0;
  }

  img {
    max-width: 100%;
  }
  
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    text-shadow: none;
  }

  .tabs-left-in-modal.ant-tabs-left {
    > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane, .ant-tabs-left > div > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane {
      padding: 16px;
      
      overflow-y: auto;
      height: 100%;
    }

    > .ant-tabs-nav .ant-tabs-tab {
      padding-left: 16px;
      transition: all 0.3s ease;

      &.ant-tabs-tab-active,
      &:hover{ 
        background-color: ${(p) => convertHexToRGBA(p.theme.colors.primary, 10)};
      }

      + .ant-tabs-tab {
        margin-top: ${(p) => p.theme.spacing.xs}
      }
    }
  }

  .tabs-empty {
    .ant-tabs-content {
      height: 100%;
    }

    .ant-tabs-nav-list .ant-tabs-tab:first-of-type {
      display: none;
    }

    &.tabs-left-in-modal.ant-tabs-left > .ant-tabs-nav .ant-tabs-tab:first-child + .ant-tabs-tab {
      margin-top: 0;
    }
  }

  .ant-layout-header {
    display: flex;
    align-items: center;
    box-shadow: 0 2px 2px #ddd;
  }
}
`;
