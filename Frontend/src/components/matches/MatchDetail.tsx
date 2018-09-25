import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import Typography from '@material-ui/core/Typography';

import { MatchDto, MatchesClient } from '../../api/client';
import Error from '../Error';
import Loading from '../Loading';

interface IRouterProps {
  id: string;
}

interface IProps extends RouteComponentProps<IRouterProps> {}

interface IState {
  data?: MatchDto;
  error: boolean;
  loading: boolean;
}

class MatchDetail extends React.Component<IProps, IState> {
  private client = new MatchesClient();

  constructor(props: any) {
    super(props);

    this.state = {
      data: undefined,
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
    if (this.state.loading) {
      return <Loading />;
    } else if (this.state.data == null) {
      return (
        <React.Fragment>
          {this.state.error && <Error message="Error while loading match." />}
        </React.Fragment>
      );
    } else {
      return (
        <Typography>
          {this.state.data.player1Name} {this.state.data.player1Score} -{' '}
          {this.state.data.player2Score} {this.state.data.player2Name}
        </Typography>
      );
    }
  }
}

export default withRouter(MatchDetail);
