import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './Routes';
import ScorlyTheme from './ScorlyTheme';

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <ScorlyTheme>
          <Routes />
        </ScorlyTheme>
      </BrowserRouter>
    );
  }
}

export default App;
