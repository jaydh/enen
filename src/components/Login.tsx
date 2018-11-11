import * as React from 'react';
import { ui, uiConfig } from '../firebase';

export default class Login extends React.Component {
  public componentDidMount() {
    ui.start('#firebaseui-auth-container', uiConfig);
  }
  public render() {
    return (
      <>
        <div id="firebaseui-auth-container" />
        <div id="loader">Loading...</div>{' '}
      </>
    );
  }
}
