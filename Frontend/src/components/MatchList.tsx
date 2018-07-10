import * as React from 'react';

import Grid from '@material-ui/core/Grid';

import AddMatch from './AddMatch';
import MatchCard from './MatchCard';

class MatchList extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Grid container={true} spacing={16}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(value => (
            <Grid key={value} item={true} xs={12} sm={6} md={4} lg={3}>
              <MatchCard />
            </Grid>
          ))}
        </Grid>

        <AddMatch />
      </React.Fragment>
    );
  }
}

export default MatchList;
