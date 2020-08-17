import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Logon from './pages/Logon';
import Admin from './pages/Admin';
import Home from './pages/Home';

import NewShopkeeper from './pages/NewShopkeeper';
import { isAuthenticated } from './auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route { ...rest} render={props => (
    isAuthenticated() ? (
      <Component {...props} />
    ) : (
      <Redirect to={{ pathname: '/', state: { from: props.location } }} />
    )
  )} />
);

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Logon} />

        <PrivateRoute path="/admin" component={Admin} />
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute path="/shopkeeper/new" component={NewShopkeeper} />

      </Switch>
    </BrowserRouter>
  );
}
