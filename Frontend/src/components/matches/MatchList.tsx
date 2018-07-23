import * as React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { MatchDto, MatchesClient } from '../../api/client';
import Error from '../Error';
import Loading from '../Loading';
import AddMatch from './AddMatch';
import MatchCard from './MatchCard';

interface IState {
  data: MatchDto[];
  error: boolean;
  loading: boolean;
}

class MatchList extends React.Component<{}, IState> {
  private client = new MatchesClient();

  constructor(props: any) {
    super(props);

    this.reloadData = this.reloadData.bind(this);

    this.state = {
      data: [],
      error: false,
      loading: false
    };
  }

  public componentDidMount() {
    this.reloadData();
  }

  public render() {
    if (this.state.loading) {
      return <Loading />;
    } else if (!this.state.data || !this.state.data.length) {
      return (
        <React.Fragment>
          <Typography>No matches available.</Typography>
          <AddMatch onAddedHandler={this.reloadData} />
          {this.state.error && <Error message="Error while loading matches." />}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Grid container={true} spacing={16}>
            {this.state.data.map((match, index) => (
              <Grid key={index} item={true} xs={12} sm={6} md={4} lg={3}>
                <MatchCard data={match} />
              </Grid>
            ))}
          </Grid>
          <AddMatch onAddedHandler={this.reloadData} />
        </React.Fragment>
      );
    }
  }

  private reloadData() {
    this.setState({ loading: true, error: false });

    this.client
      .getAll()
      .then(result => {
        this.setState({ data: result, loading: false });
      })
      .catch(() => {
        this.setState({ error: true, loading: false });
      });
  }
}

export default MatchList;
