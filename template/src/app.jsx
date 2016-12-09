import React, { Component } from 'react';
import User from './views/user';

import './css/main.scss'; // import global css style

export default class App extends Component {
  render() {
    return (
      // App root node
      <div>
        <div>Hello world!</div>
        <User />
      </div>
    );
  }
}
