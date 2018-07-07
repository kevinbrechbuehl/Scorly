import * as React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import WhistleIcon from 'mdi-material-ui/Whistle';

const styles = {
  delete: {
    marginLeft: 'auto'
  },
  title: {
    marginBottom: 16
  }
};

class MatchCard extends React.Component<WithStyles<typeof styles>> {
  public render() {
    return (
      <React.Fragment>
        <Card>
          <CardContent>
            <Typography color="textSecondary">
              {new Date().toLocaleString()}
            </Typography>
            <Typography
              variant="headline"
              component="h2"
              className={this.props.classes.title}
            >
              Sven McLaughlin
              <Typography variant="caption">vs.</Typography>
              Adrian Wintheiser
            </Typography>
            <Typography component="p">11-4</Typography>
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MatchCard);
