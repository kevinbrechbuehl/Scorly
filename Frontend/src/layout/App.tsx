import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Theme } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import Routes from './Routes';
import ScorlyTheme from './ScorlyTheme';

const styles = (theme: Theme) => ({
  main: {
    margin: theme.spacing.unit * 2
  }
});

class App extends React.Component<WithStyles<typeof styles>> {
  public render() {
    return (
      <BrowserRouter>
        <ScorlyTheme>
          <main className={this.props.classes.main}>
            <Routes />
          </main>
        </ScorlyTheme>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(App);
