import * as React from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import WhistleIcon from 'mdi-material-ui/Whistle';

import { GameDto, MatchDto, MatchesClient } from '../../api/client';
import Error from '../Error';
import Loading from '../Loading';

const styles = {
  delete: {
    marginLeft: 'auto'
  }
};

interface IProps extends WithStyles<typeof styles> {
  data: MatchDto;
  onDeletedHandler: () => void;
}

interface IState {
  dialogOpen: boolean;
  error: boolean;
  loading: boolean;
}

class MatchCard extends React.Component<IProps, IState> {
  private client = new MatchesClient();

  constructor(props: any) {
    super(props);

    this.state = {
      dialogOpen: false,
      error: false,
      loading: false
    };
  }

  public render() {
    return (
      <React.Fragment>
        {this.state.error && <Error message="Error while deleting match." />}

        <Card>
          <CardContent>
            <Typography variant="caption">{this.renderCaption()}</Typography>
            <Table>
              <TableBody>
                <TableRow key="player1">
                  <TableCell component="th" scope="row" padding="none">
                    <Typography
                      variant={this.isMatchWinner(1) ? 'body2' : 'body1'}
                    >
                      {this.props.data.player1}
                    </Typography>
                  </TableCell>
                  {this.renderGame(this.props.data.game1, 1, true)}
                  {this.renderGame(this.props.data.game2, 1)}
                  {this.renderGame(this.props.data.game3, 1)}
                  {this.renderGame(this.props.data.game4, 1)}
                  {this.renderGame(this.props.data.game5, 1)}
                </TableRow>
                <TableRow key="player2">
                  <TableCell component="th" scope="row" padding="none">
                    <Typography
                      variant={this.isMatchWinner(2) ? 'body2' : 'body1'}
                    >
                      {this.props.data.player2}
                    </Typography>
                  </TableCell>
                  {this.renderGame(this.props.data.game1, 2, true)}
                  {this.renderGame(this.props.data.game2, 2)}
                  {this.renderGame(this.props.data.game3, 2)}
                  {this.renderGame(this.props.data.game4, 2)}
                  {this.renderGame(this.props.data.game5, 2)}
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardActions>
            <Link to={'/matches/' + this.props.data.id}>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </Link>
            <Link to={'/matches/' + this.props.data.id + '/referee'}>
              <IconButton>
                <WhistleIcon />
              </IconButton>
            </Link>
            <IconButton
              onClick={this.openDialog}
              className={this.props.classes.delete}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>

        <Dialog
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Delete Match</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this match?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {this.state.loading && <Loading />}
            <Button onClick={this.closeDialog} color="default">
              Cancel
            </Button>
            <Button
              onClick={this.deleteMatch}
              color="secondary"
              autoFocus={true}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  private renderCaption() {
    if (this.isRunning()) {
      return 'Currently running';
    } else if (this.isFinished()) {
      return 'Final result';
    } else {
      return this.props.data.startTime.toLocaleString();
    }
  }

  private renderGame(
    game: GameDto,
    player: number,
    alwaysShow: boolean = false
  ) {
    return (
      (alwaysShow || game.player1Score > 0 || game.player2Score > 0) && (
        <TableCell numeric={true} padding="none">
          <Typography
            variant={this.isGameWinner(game, player) ? 'body2' : 'body1'}
          >
            {game['player' + player + 'Score']}
          </Typography>
        </TableCell>
      )
    );
  }

  private isRunning(): boolean {
    return (
      (this.props.data.game1.player1Score > 0 ||
        this.props.data.game1.player2Score > 0) &&
      !this.isFinished()
    );
  }

  private isFinished(): boolean {
    return this.isMatchWinner(1) || this.isMatchWinner(2);
  }

  private isGameWinner(game: GameDto, player: number): boolean {
    const actualScore = game['player' + player + 'Score'];
    const otherScore = game['player' + (player === 1 ? 2 : 1) + 'Score'];

    return (
      actualScore > otherScore &&
      actualScore >= 11 &&
      actualScore - otherScore >= 2
    );
  }

  private isMatchWinner(player: number): boolean {
    let winningGames = 0;

    for (let i = 1; i <= 5; i++) {
      if (this.isGameWinner(this.props.data['game' + i], player)) {
        winningGames++;
      }
    }

    return winningGames >= 3;
  }

  private openDialog = () => {
    this.setState({ dialogOpen: true });
  };

  private closeDialog = () => {
    this.setState({ dialogOpen: false });
  };

  private deleteMatch = () => {
    this.setState({ loading: true, error: false });

    this.client
      .delete(this.props.data.id)
      .then(() => {
        this.setState(
          {
            loading: false
          },
          () => {
            this.closeDialog();

            if (this.props.onDeletedHandler != null) {
              this.props.onDeletedHandler();
            }
          }
        );
      })
      .catch(() => {
        this.setState({ error: true, loading: false });
      });
  };
}

export default withStyles(styles)(MatchCard);
