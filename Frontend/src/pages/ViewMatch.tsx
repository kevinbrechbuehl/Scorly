import * as React from 'react';

import Typography from '@material-ui/core/Typography';

import MatchDetail from '../components/matches/MatchDetail';

class ViewMatch extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Typography variant="headline" gutterBottom={true}>
          View Match
        </Typography>
        <MatchDetail />
      </React.Fragment>
    );
  }
}

export default ViewMatch;
