import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import Matches from '../pages/Matches';

class Routes extends React.Component {
  public render() {
    return (
      <Switch>
        <Route exact={true} path="/" component={Matches} />
      </Switch>
    );
  }
}

export default Routes;
