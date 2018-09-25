import * as React from 'react';

import Typography from '@material-ui/core/Typography';

import MatchDetailReferee from '../components/matches/MatchDetailReferee';

class RefereeMatch extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Typography variant="headline" gutterBottom={true}>
          Referee Match
        </Typography>
        <MatchDetailReferee />
      </React.Fragment>
    );
  }
}

export default RefereeMatch;
