import * as React from 'react';
import { Link } from 'react-router-dom';

import * as moment from 'moment';

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
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';
import WhistleIcon from 'mdi-material-ui/Whistle';

import { GameDto, MatchDto, MatchesClient } from '../../api/client';
import { MatchExtensions } from '../../helpers/match.extensions';
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
  viewMode: boolean;
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
            {!this.props.viewMode && (
              <Typography variant="caption">{this.renderCaption()}</Typography>
            )}
            <Table>
              <TableBody>
                <TableRow key="player1">
                  <TableCell component="th" scope="row" padding="none">
                    <Typography
                      variant={
                        MatchExtensions.isMatchWinner(this.props.data, 1)
                          ? 'body2'
                          : 'body1'
                      }
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
                      variant={
                        MatchExtensions.isMatchWinner(this.props.data, 2)
                          ? 'body2'
                          : 'body1'
                      }
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
          {!this.props.viewMode && (
            <CardActions>
              <Tooltip title="Referee Match">
                <Link to={'/matches/' + this.props.data.id}>
                  <IconButton>
                    <WhistleIcon />
                  </IconButton>
                </Link>
              </Tooltip>
              <Tooltip title="Delete Match">
                <IconButton
                  onClick={this.openDialog}
                  className={this.props.classes.delete}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
          )}
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
    if (MatchExtensions.isRunning(this.props.data)) {
      return 'Currently running';
    } else if (MatchExtensions.isFinished(this.props.data)) {
      return 'Final result';
    } else {
      return moment(this.props.data.startTime).format('DD.MM.YYYY HH:mm');
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
            variant={
              MatchExtensions.isGameWinner(game, player) ? 'body2' : 'body1'
            }
          >
            {game['player' + player + 'Score']}
          </Typography>
        </TableCell>
      )
    );
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
