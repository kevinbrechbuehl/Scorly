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

import { MatchDto, MatchesClient } from '../../api/client';
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
            <Typography variant="caption">
              {this.props.data.startTime.toLocaleString()}
            </Typography>
            <Table>
              <TableBody>
                <TableRow key="player1">
                  <TableCell component="th" scope="row" padding="none">
                    {this.props.data.player1}
                  </TableCell>
                  <TableCell numeric={true} padding="none">
                    {this.props.data.game1.player1Score}
                  </TableCell>
                </TableRow>
                <TableRow key="player2">
                  <TableCell component="th" scope="row" padding="none">
                    {this.props.data.player2}
                  </TableCell>
                  <TableCell numeric={true} padding="none">
                    {this.props.data.game1.player2Score}
                  </TableCell>
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
