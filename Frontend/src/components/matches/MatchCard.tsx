import * as React from 'react';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
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

import { MatchDto } from '../../api/client';

const styles = {
  delete: {
    marginLeft: 'auto'
  }
};

interface IProps extends WithStyles<typeof styles> {
  data: MatchDto;
}

class MatchCard extends React.Component<IProps> {
  public render() {
    return (
      <Card>
        <CardContent>
          <Typography variant="caption">
            {this.props.data.startTime.toLocaleString()}
          </Typography>
          <Table>
            <TableBody>
              <TableRow key="player1">
                <TableCell component="th" scope="row" padding="none">
                  {this.props.data.player1Name}
                </TableCell>
                <TableCell numeric={true} padding="none">
                  {this.props.data.player1Score}
                </TableCell>
              </TableRow>
              <TableRow key="player2">
                <TableCell component="th" scope="row" padding="none">
                  {this.props.data.player2Name}
                </TableCell>
                <TableCell numeric={true} padding="none">
                  {this.props.data.player2Score}
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
          <IconButton className={this.props.classes.delete}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(MatchCard);
