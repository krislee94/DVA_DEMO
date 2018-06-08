import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Homepage from './routes/homepage';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Homepage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
