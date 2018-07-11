import * as React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { MatchDto, MatchesClient } from '../../api/client';
import Loading from '../Loading';
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
    } else if (this.state.error) {
      return (
        <Typography>
          There was an error loading matches. Please try again later.
        </Typography>
      );
    } else if (!this.state.data || !this.state.data.length) {
      return <Typography>No matches available.</Typography>;
    } else {
      return (
        <Grid container={true} spacing={16}>
          {this.state.data.map((match, index) => (
            <Grid key={index} item={true} xs={12} sm={6} md={4} lg={3}>
              <MatchCard data={match} />
            </Grid>
          ))}
        </Grid>
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
