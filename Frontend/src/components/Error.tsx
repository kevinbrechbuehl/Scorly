import * as React from 'react';

import { Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';

const styles = (theme: Theme) => ({
  closeIcon: {
    height: theme.spacing.unit * 4,
    width: theme.spacing.unit * 4
  },
  content: {
    backgroundColor: theme.palette.error.dark
  },
  icon: {
    fontSize: 20
  },
  message: {
    alignItems: 'center',
    display: 'flex'
  },
  messageIcon: {
    marginRight: theme.spacing.unit,
    opacity: 0.9
  }
});

interface IProps extends WithStyles<typeof styles> {
  message: string;
}

interface IState {
  open: boolean;
}

class Error extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      open: true
    };
  }

  public render() {
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={this.state.open}
        onClose={this.close}
      >
        <SnackbarContent
          className={this.props.classes.content}
          message={
            <span className={this.props.classes.message}>
              <ErrorIcon
                className={[
                  this.props.classes.icon,
                  this.props.classes.messageIcon
                ].join(' ')}
              />
              {this.props.message}
            </span>
          }
          action={
            <IconButton
              color="inherit"
              className={this.props.classes.closeIcon}
              onClick={this.close}
            >
              <CloseIcon className={this.props.classes.icon} />
            </IconButton>
          }
        />
      </Snackbar>
    );
  }

  private close = () => {
    this.setState({ open: false });
  };
}

export default withStyles(styles)(Error);
