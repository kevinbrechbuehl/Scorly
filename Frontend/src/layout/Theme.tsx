import * as React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme();

class Theme extends React.Component<{ children: any }> {
  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}

export default Theme;
