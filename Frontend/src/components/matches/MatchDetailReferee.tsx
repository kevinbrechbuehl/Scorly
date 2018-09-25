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

interface IProps extends RouteComponentProps<IRouterProps> {}

interface IState {
  // TODO: Null Handling must be better, a needed casting on every get is not nice...
  data?: MatchDto;
  error: boolean;
  loading: boolean;
}

class MatchDetailReferee extends React.Component<IProps, IState> {
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
    // TODO: Share code with match detail
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
        <React.Fragment>
          <Typography>
            {this.state.data.player1Name}: {this.state.data.player1Score}
            <Button onClick={this.incrementPlayer1Score}>
              <AddIcon />
            </Button>
            <Button onClick={this.decrementPlayer1Score}>
              <RemoveIcon />
            </Button>
          </Typography>
          <Typography>
            {this.state.data.player2Name}: {this.state.data.player2Score}
            <Button onClick={this.incrementPlayer2Score}>
              <AddIcon />
            </Button>
            <Button onClick={this.decrementPlayer2Score}>
              <RemoveIcon />
            </Button>
          </Typography>
        </React.Fragment>
      );
    }
  }

  // TODO: Use one method to increment and decrement
  private incrementPlayer1Score = () => {
    const match = this.state.data as MatchDto;
    match.player1Score++;

    this.setState(
      {
        ...this.state,
        data: match
      },
      this.update
    );
  };

  private incrementPlayer2Score = () => {
    const match = this.state.data as MatchDto;
    match.player2Score++;

    this.setState(
      {
        ...this.state,
        data: match
      },
      this.update
    );
  };

  private decrementPlayer1Score = () => {
    const match = this.state.data as MatchDto;
    match.player1Score--;

    this.setState(
      {
        ...this.state,
        data: match
      },
      this.update
    );
  };

  private decrementPlayer2Score = () => {
    const match = this.state.data as MatchDto;
    match.player2Score--;

    this.setState(
      {
        ...this.state,
        data: match
      },
      this.update
    );
  };

  private update() {
    this.setState({ error: false });

    // TODO: Error message should be different than while loading the match
    this.client
      .update(this.props.match.params.id, this.state.data as MatchDto)
      .catch(() => {
        this.setState({ error: true });
      });
  }
}

export default withRouter(MatchDetailReferee);
