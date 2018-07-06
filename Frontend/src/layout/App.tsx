import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './Routes';
import Theme from './Theme';

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <Theme>
          <main>
            <Routes />
          </main>
        </Theme>
      </BrowserRouter>
    );
  }
}

export default App;
