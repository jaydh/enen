import * as React from 'react';
import Login from '../components/Login';
import User from '../components/User';
import { auth } from '../firebase';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

class UserPage extends React.Component {
  public render() {
    return (
      <Grid container={true} justify="center" alignItems="center">
        <Grid item={true}>
          <User />
        </Grid>
        <Grid item={true}>
          <Login />
        </Grid>
        <Grid item={true}>
          <Button onClick={this.handleLogoff}>Logout</Button>
        </Grid>
      </Grid>
    );
  }

  private handleLogoff() {
    auth.signOut();
  }
}

export default UserPage;
