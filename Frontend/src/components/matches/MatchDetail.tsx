import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

import Typography from '@material-ui/core/Typography';

import { MatchDto, MatchesClient } from '../../api/client';
import Error from '../Error';
import Loading from '../Loading';

interface IRouterProps {
  id: string;
}

interface IState {
  data: MatchDto | null;
  error: boolean;
  loading: boolean;
}

class MatchDetail extends React.Component<
  RouteComponentProps<IRouterProps>,
  IState
> {
  private client = new MatchesClient();
  private hubConnection: HubConnection | null;

  constructor(props: any) {
    super(props);

    this.state = {
      data: null,
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
      .then(() => {
        this.hubConnection = new HubConnectionBuilder()
          .withUrl(process.env.REACT_APP_API_URL + '/scoreChange')
          .build();

        this.hubConnection.on('updateScore', match => {
          this.updateScore(match);
        });

        this.hubConnection.start();
      })
      .catch(() => {
        this.setState({ error: true, loading: false });
      });
  }

  public componentWillUnmount() {
    if (this.hubConnection != null) {
      this.hubConnection.stop();
    }
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
          {this.state.data.player1} {this.state.data.game1.player1Score} -{' '}
          {this.state.data.game1.player2Score} {this.state.data.player2}
        </Typography>
      );
    }
  }

  private updateScore(match: MatchDto) {
    if (match.id === this.props.match.params.id) {
      this.setState({
        data: match
      });
    }
  }
}

export default withRouter(MatchDetail);
