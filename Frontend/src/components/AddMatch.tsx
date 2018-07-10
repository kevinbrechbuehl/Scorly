import * as React from 'react';

import { Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';

const styles = (theme: Theme) => ({
  add: {
    position: 'fixed' as 'fixed',

    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  }
});

class AddMatch extends React.Component<WithStyles<typeof styles>> {
  public render() {
    return (
      <Button variant="fab" color="primary" className={this.props.classes.add}>
        <AddIcon />
      </Button>
    );
  }
}

export default withStyles(styles)(AddMatch);
