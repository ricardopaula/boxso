import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Index from './pages/Index';
import Logon from './pages/Logon';
import Admin from './pages/Admin';
import Home from './pages/Home';


import NewShopkeeper from './pages/NewShopkeeper';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Index} />

        <Route path="/login" exact component={Logon} />

        <Route path="/admin" component={Admin} />
        <Route path="/home" component={Home} />

        <Route path="/shopkeeper/new" component={NewShopkeeper} />

      </Switch>
    </BrowserRouter>
  );
}
