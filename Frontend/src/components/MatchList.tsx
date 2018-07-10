import * as React from 'react';

import Grid from '@material-ui/core/Grid';

import { MatchDto, MatchesClient } from '../api/client';
import AddMatch from './AddMatch';
import MatchCard from './MatchCard';

interface IState {
  data: MatchDto[];
}

class MatchList extends React.Component<{}, IState> {
  private client = new MatchesClient();

  constructor(props: any) {
    super(props);

    this.state = {
      data: []
    };
  }

  public componentDidMount() {
    this.reloadData();
  }

  public render() {
    return (
      <React.Fragment>
        <Grid container={true} spacing={16}>
          {this.state.data.map((match, index) => (
            <Grid key={index} item={true} xs={12} sm={6} md={4} lg={3}>
              <MatchCard data={match} />
            </Grid>
          ))}
        </Grid>

        <AddMatch />
      </React.Fragment>
    );
  }

  private reloadData() {
    // todo: error handling and loading indicator
    this.client.getAll().then(result => {
      this.setState({ data: result });
    });
  }
}

export default MatchList;
