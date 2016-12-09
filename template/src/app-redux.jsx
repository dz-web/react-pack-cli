import React, { Component } from 'react';
import { connect } from 'react-redux';
import User from './views/user';
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
        <User />
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
