import * as React from 'react';

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

const styles = {
  delete: {
    marginLeft: 'auto'
  }
};

class MatchCard extends React.Component<WithStyles<typeof styles>> {
  public render() {
    return (
      <Card>
        <CardContent>
          <Typography variant="caption">
            {new Date().toLocaleString()}
          </Typography>
          <Table>
            <TableBody>
              <TableRow key="player1">
                <TableCell component="th" scope="row" padding="none">
                  Sven McLaughlin
                </TableCell>
                <TableCell numeric={true} padding="none">
                  11
                </TableCell>
              </TableRow>
              <TableRow key="player2">
                <TableCell component="th" scope="row" padding="none">
                  Adrian Wintheiser
                </TableCell>
                <TableCell numeric={true} padding="none">
                  3
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardActions>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
          <IconButton>
            <WhistleIcon />
          </IconButton>
          <IconButton className={this.props.classes.delete}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(MatchCard);
