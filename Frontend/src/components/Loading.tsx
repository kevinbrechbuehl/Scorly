import * as React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

class Loading extends React.Component {
  public render() {
    return <CircularProgress size={32} />;
  }
}

export default Loading;
