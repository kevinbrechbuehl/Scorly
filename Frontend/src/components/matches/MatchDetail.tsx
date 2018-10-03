import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import compose from 'recompose/compose';

import { Theme, Tooltip } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RemoveIcon from '@material-ui/icons/Remove';

import { GameDto, MatchDto, MatchesClient } from '../../api/client';
import { MatchExtensions } from '../../helpers/match.extensions';
import Error from '../Error';
import Loading from '../Loading';

const styles = (theme: Theme) => ({
  backButton: {
    marginLeft: -12
  },
  grow: {
    flexGrow: 1,
    marginLeft: 20
  },
  main: {
    margin: theme.spacing.unit * 3
  },
  score: {
    display: 'inline-block',
    width: 35
  },
  scoreButtonLeft: {
    marginRight: 5
  },
  scoreButtonRight: {
    marginLeft: 5
  }
});

interface IRouterProps {
  id: string;
}

interface IProps
  extends RouteComponentProps<IRouterProps>,
    WithStyles<typeof styles> {}

interface IState {
  data: MatchDto | null;
  error: boolean;
  loading: boolean;
}

class MatchDetail extends React.Component<IProps, IState> {
  private client = new MatchesClient();

  constructor(props: any) {
    super(props);

    this.state = {
      data: null,
      error: false,
      loading: false
    };
  }

  public componentDidMount() {
    this.setState({ loading: true, error: false });

    this.client
      .getById(this.props.match.params.id)
      .then(result => {
        this.setState({ data: result, loading: false });
      })
      .catch(() => {
        this.setState({ error: true, loading: false });
      });
  }

  public render() {
    return (
      <React.Fragment>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Tooltip title="Back to Overview">
              <Link to={'/'} style={{ color: 'white' }}>
                <IconButton
                  className={this.props.classes.backButton}
                  color="inherit"
                >
                  <ArrowBackIcon />
                </IconButton>
              </Link>
            </Tooltip>
            <Typography
              variant="title"
              color="inherit"
              className={this.props.classes.grow}
            >
              Match Detail
            </Typography>
          </Toolbar>
        </AppBar>
        <main className={this.props.classes.main}>{this.renderContent()}</main>
        {this.state.error && (
          <Error message="Error while loading or updating match." />
        )}
      </React.Fragment>
    );
  }

  private renderContent() {
    if (this.state.loading) {
      return <Loading />;
    } else if (this.state.data != null) {
      return (
        <React.Fragment>
          <Grid container={true} spacing={40}>
            <Grid item={true} xs={6}>
              <Typography variant="headline" align="right">
                {this.state.data.player1}
              </Typography>
            </Grid>
            <Grid item={true} xs={6}>
              <Typography variant="headline">
                {this.state.data.player2}
              </Typography>
            </Grid>
            {this.renderGame(1)}
            {this.renderGame(2)}
            {this.renderGame(3)}
            {this.renderGame(4)}
            {this.renderGame(5)}
          </Grid>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  private renderGame(gameNumber: number) {
    if (this.state.data == null) {
      return null;
    }

    const game = this.state.data['game' + gameNumber];
    const previousGame = this.state.data['game' + (gameNumber - 1)];
    const nextGame = this.state.data['game' + (gameNumber + 1)];

    if (previousGame != null && !MatchExtensions.isGameFinished(previousGame)) {
      return null;
    }

    if (
      game.player1Score === 0 &&
      game.player2Score === 0 &&
      MatchExtensions.isMatchFinished(this.state.data)
    ) {
      return null;
    }

    return (
      <React.Fragment>
        <Grid item={true} xs={6}>
          <Typography align="right" variant="display1">
            <IconButton
              className={this.props.classes.scoreButtonLeft}
              onClick={this.decrement.bind(this, game, 1)}
              disabled={
                game.player1Score === 0 ||
                (nextGame != null &&
                  (nextGame.player1Score > 0 || nextGame.player2Score > 0))
              }
            >
              <RemoveIcon />
            </IconButton>
            <IconButton
              className={this.props.classes.scoreButtonLeft}
              onClick={this.increment.bind(this, game, 1)}
              disabled={MatchExtensions.isGameFinished(game)}
            >
              <AddIcon />
            </IconButton>
            <span className={this.props.classes.score}>
              {game.player1Score}
            </span>
          </Typography>
        </Grid>
        <Grid item={true} xs={6}>
          <Typography variant="display1">
            <span className={this.props.classes.score}>
              {game.player2Score}
            </span>
            <IconButton
              className={this.props.classes.scoreButtonRight}
              onClick={this.increment.bind(this, game, 2)}
              disabled={MatchExtensions.isGameFinished(game)}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              className={this.props.classes.scoreButtonRight}
              onClick={this.decrement.bind(this, game, 2)}
              disabled={
                game.player2Score === 0 ||
                (nextGame != null &&
                  (nextGame.player1Score > 0 || nextGame.player2Score > 0))
              }
            >
              <RemoveIcon />
            </IconButton>
          </Typography>
        </Grid>
      </React.Fragment>
    );
  }

  private increment(game: GameDto, player: number) {
    game['player' + player + 'Score'] = game['player' + player + 'Score'] + 1;
    this.update();
  }

  private decrement(game: GameDto, player: number) {
    game['player' + player + 'Score'] = game['player' + player + 'Score'] - 1;
    this.update();
  }

  private update() {
    this.setState({ error: false });

    if (this.state.data != null) {
      this.client
        .update(this.props.match.params.id, this.state.data)
        .catch(() => {
          this.setState({ error: true });
        });
    }
  }
}

export default compose(
  withStyles(styles),
  withRouter
)(MatchDetail);
