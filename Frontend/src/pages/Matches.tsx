import * as React from 'react';

import Grid from '@material-ui/core/Grid';

import MatchCard from '../components/MatchCard';

class Matches extends React.Component {
  public render() {
    return (
      <Grid container={true} spacing={16}>
        {[0, 1, 2, 3, 4, 5, 6].map(value => (
          <Grid key={value} item={true} xs={12} sm={6} md={3}>
            <MatchCard />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default Matches;
