import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { syncAction } from './model/action';

import './css/main.scss'; // import global css style

class App extends Component {
  render() {
    const { dispatch, appState:{ data } } = this.props;
    return (
      // App root node
      <div>
        <div>{data}</div>
        <button onClick={() => dispatch(syncAction(`You click me! ${Math.random()}`))}>
          click me!
        </button>
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

function mapStateToProps(state) {
  return {
    appState: state.appState,
  };
}

export default connect(mapStateToProps)(App);
