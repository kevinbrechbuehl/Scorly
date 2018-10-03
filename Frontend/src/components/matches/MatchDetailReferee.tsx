import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

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

class MatchDetailReferee extends React.Component<
  RouteComponentProps<IRouterProps>,
  IState
> {
  private client = new MatchesClient();

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
          {this.state.error && (
            <Error message="Error while loading or updating match." />
          )}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Typography>
            {this.state.data.player1}: {this.state.data.game1.player1Score}
            <Button onClick={this.increment.bind(this, 'player1Score')}>
              <AddIcon />
            </Button>
            <Button onClick={this.decrement.bind(this, 'player1Score')}>
              <RemoveIcon />
            </Button>
          </Typography>
          <Typography>
            {this.state.data.player2}: {this.state.data.game1.player2Score}
            <Button onClick={this.increment.bind(this, 'player2Score')}>
              <AddIcon />
            </Button>
            <Button onClick={this.decrement.bind(this, 'player2Score')}>
              <RemoveIcon />
            </Button>
          </Typography>
        </React.Fragment>
      );
    }
  }

  private increment(property: string) {
    if (this.state.data != null) {
      this.state.data.game1[property] = this.state.data.game1[property] + 1;
      this.update();
    }
  }

  private decrement(property: string) {
    if (this.state.data != null) {
      this.state.data.game1[property] = this.state.data.game1[property] - 1;
      this.update();
    }
  }

  private update() {
    this.setState({ error: false });

    if (this.state.data != null) {
      this.client
        .update(this.props.match.params.id, this.state.data)
        .catch(() => {
          this.setState({ error: true });
        });
    }
  }
}

export default withRouter(MatchDetailReferee);
