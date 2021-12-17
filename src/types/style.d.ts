// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      border: string;
      bg: string;
      link: string;
      disabled: string;
      tableHeader: string;
      tableRowEven: string;
      danger: string;
      subtle: string;
      success: string;
      error: string;
      warning: string;
      validating: string;
      text: string;
      tags: {
        success: string;
        danger: string;
        primary: string;
      };
      placeholder: string;
    };
    fontSize: {
      base: string;
      body: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
  }
}
