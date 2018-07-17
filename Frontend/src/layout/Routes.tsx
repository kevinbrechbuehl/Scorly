import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import Matches from '../pages/Matches';
import RefereeMatch from '../pages/RefereeMatch';
import ViewMatch from '../pages/ViewMatch';

class Routes extends React.Component {
  public render() {
    return (
      <Switch>
        <Route exact={true} path="/" component={Matches} />
        <Route path="/matches/:id/referee" component={RefereeMatch} />
        <Route path="/matches/:id" component={ViewMatch} />
      </Switch>
    );
  }
}

export default Routes;
