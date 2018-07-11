import * as React from 'react';

import Typography from '@material-ui/core/Typography';

import AddMatch from '../components/matches/AddMatch';
import MatchList from '../components/matches/MatchList';

class Matches extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Typography variant="headline" gutterBottom={true}>
          Matches
        </Typography>
        <MatchList />
        <AddMatch />
      </React.Fragment>
    );
  }
}

export default Matches;
