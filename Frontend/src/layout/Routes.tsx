import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import MatchDetail from '../components/matches/MatchDetail';
import MatchesOverview from '../components/matches/MatchesOverview';

class Routes extends React.Component {
  public render() {
    return (
      <Switch>
        <Route exact={true} path="/" component={MatchesOverview} />
        <Route path="/matches/:id" component={MatchDetail} />
      </Switch>
    );
  }
}

export default Routes;
