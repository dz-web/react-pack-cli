import React from 'react';
import { Router, Route, browserHistory } from 'react-router'
import App from './app';
import About from './views/about';
import User from './views/user';

const Wrap = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="about" component={About} />
      <Route path="user" component={User} />
    </Route>
  </Router>
);

export default Wrap;
