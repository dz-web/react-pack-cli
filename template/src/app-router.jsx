import React, { Component } from 'react';
import { Link } from 'react-router';

import './css/main.scss'; // import global css style

export default class App extends Component {
  render() {
    return (
      // App root node
      <div>
        <dl>
          <dt>Pages</dt>
          <dd><Link to='/about'>About</Link></dd>
          <dd><Link to='/user'>User</Link></dd>
        </dl>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
