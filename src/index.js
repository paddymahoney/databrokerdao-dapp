import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from './registerServiceWorker';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Switch, Route, withRouter } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import createStore from './redux/create-store';
import AuthContainer from './components/authentication/AuthContainer';
import LandingScreen from './components/landing/LandingScreen';
import StreamsScreen from './components/streams/DiscoverScreen';
import PurchasesScreen from './components/purchases/PurchasesScreen';
import ListingsScreen from './components/listings/ListingsScreen';
import EnlistScreen from './components/listings/EnlistScreen';
import WalletScreen from './components/wallet/WalletScreen';
import StreamDetailsScreen from './components/details/stream/StreamDetailsScreen';
import DatasetsDetailsScreen from './components/details/dataset/DatasetDetailsScreen';
import DatasetsScreen from './components/datasets/DatasetsScreen';
import UnsubscribedScreen from './components/unsubscribed/UnsubscribedScreen';
import Mixpanel from 'mixpanel-browser';
import { ThemeProvider } from 'styled-components';
import BigNumber from 'bignumber.js';

import './styles/index.css';
import WebFontLoader from 'webfontloader';
import {
  userIsNotAuthenticatedRedir,
  userIsAuthenticatedRedir
} from './utils/auth';
import './index.css';
import theme from './utils/theme';

WebFontLoader.load({
  google: {
    families: [
      'Open Sans:300,400,500,700',
      'Titillium Web:300,400,600,700,900',
      'Material Icons'
    ]
  }
});

Mixpanel.init('544eb1c36a2ccbf02c7661d8b7525d81');

// Config bigbumber globally so it will display all numbers with enough decimals. We don't want any scientific notations!
BigNumber.config({ EXPONENTIAL_AT: 256 });

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__INITIAL_STATE__;
const history = createHistory();
const store = createStore(initialState, history);

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

const render = () => {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route
              path="/account"
              component={withRouter(userIsNotAuthenticatedRedir(AuthContainer))}
            />
            <Route path="/streams" component={withRouter(StreamsScreen)} />
            <Route path="/purchases" component={withRouter(PurchasesScreen)} />
            <Route path="/listings" component={withRouter(ListingsScreen)} />
            <Route path="/enlist" component={withRouter(EnlistScreen)} />
            <Route path="/datasets" component={withRouter(DatasetsScreen)} />
            <Route
              path="/wallet"
              component={withRouter(userIsAuthenticatedRedir(WalletScreen))}
            />
            <Route
              path="/stream/:key"
              component={withRouter(StreamDetailsScreen)}
            />
            <Route
              path="/dataset/:key"
              component={withRouter(DatasetsDetailsScreen)}
            />
            <Route
              path="/unsubscribed"
              component={withRouter(UnsubscribedScreen)}
            />
            <Route path="/" component={LandingScreen} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    </ThemeProvider>,
    MOUNT_NODE
  );
};

// ========================================================
// Go!
// ========================================================

render();
if (process.env.NODE_ENV === 'production') {
  unregister(); // disable during dev/test
}
