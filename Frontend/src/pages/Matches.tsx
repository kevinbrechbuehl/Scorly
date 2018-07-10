import * as React from 'react';

import Typography from '@material-ui/core/Typography';

import MatchList from '../components/MatchList';

class Matches extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Typography variant="headline" gutterBottom={true}>
          Matches
        </Typography>
        <MatchList />
      </React.Fragment>
    );
  }
}

export default Matches;
