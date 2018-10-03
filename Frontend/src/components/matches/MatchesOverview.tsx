import * as React from 'react';

import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

import { Theme, Tooltip } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import VisibilityIcon from '@material-ui/icons/Visibility';

import { MatchDto, MatchesClient } from '../../api/client';
import { MatchExtensions } from '../../helpers/match.extensions';
import Error from '../Error';
import Loading from '../Loading';
import AddMatch from './AddMatch';
import MatchCard from './MatchCard';

const styles = (theme: Theme) => ({
  grid: {
    marginBottom: theme.spacing.unit * 10
  },
  grow: {
    flexGrow: 1
  },
  main: {
    margin: theme.spacing.unit * 3
  }
});

interface IState {
  data: MatchDto[];
  error: boolean;
  loading: boolean;
  viewMode: boolean;
}

class MatchesOverview extends React.Component<
  WithStyles<typeof styles>,
  IState
> {
  private client = new MatchesClient();
  private hubConnection: HubConnection | null;

  constructor(props: any) {
    super(props);

    this.reloadData = this.reloadData.bind(this);

    this.state = {
      data: [],
      error: false,
      loading: false,
      viewMode: false
    };
  }

  public componentDidMount() {
    this.reloadData();

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_URL + '/scoreChange')
      .build();

    this.hubConnection.on('updateScore', match => {
      const data = this.state.data;
      const index = data.map(e => e.id).indexOf(match.id);
      if (index >= 0) {
        data[index] = match;
        this.setState({ data });
      }
    });

    this.hubConnection.start();
  }

  public componentWillUnmount() {
    if (this.hubConnection != null) {
      this.hubConnection.stop();
    }
  }

  public render() {
    return (
      <React.Fragment>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={this.props.classes.grow}
            >
              Scorly
            </Typography>
            {this.state.data &&
              this.state.data.length > 0 && (
                <div>
                  <Tooltip title="Toggle View Mode">
                    <IconButton color="inherit" onClick={this.toggleViewMode}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
          </Toolbar>
        </AppBar>
        <main className={this.props.classes.main}>{this.renderContent()}</main>
        {this.state.error && <Error message="Error while loading matches." />}
      </React.Fragment>
    );
  }

  private renderContent() {
    if (this.state.loading) {
      return <Loading />;
    } else if (!this.state.data || !this.state.data.length) {
      return (
        <React.Fragment>
          <Typography variant="subheading">No matches available.</Typography>
          <AddMatch onAddedHandler={this.reloadData} />}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Grid
            container={true}
            spacing={16}
            className={this.props.classes.grid}
          >
            {this.state.data
              .filter(e => !this.state.viewMode || MatchExtensions.isRunning(e))
              .map((match, index) => (
                <Grid key={index} item={true} xs={12} sm={6} md={4} lg={3}>
                  <MatchCard
                    data={match}
                    onDeletedHandler={this.reloadData}
                    viewMode={this.state.viewMode}
                  />
                </Grid>
              ))}
          </Grid>
          {!this.state.viewMode && (
            <AddMatch onAddedHandler={this.reloadData} />
          )}
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

  private toggleViewMode = () => {
    this.setState({ viewMode: !this.state.viewMode });
  };
}

export default withStyles(styles)(MatchesOverview);
