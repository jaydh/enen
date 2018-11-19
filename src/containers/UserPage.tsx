import * as React from 'react';
import { connect } from 'react-redux';
import Login from '../components/Login';
import User from '../components/User';
import { auth } from '../firebase';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

interface IProps {
  signedIn: boolean;
  anon: boolean;
}

class UserPage extends React.Component<IProps> {
  public render() {
    const { anon, signedIn } = this.props;
    return (
      <Grid container={true} justify="center" alignItems="center">
        <Grid item={true}>
          <User />
        </Grid>
        <Grid item={true}>
          {!signedIn || anon ? (
            <Login />
          ) : (
            <Button onClick={this.handleLogoff}>Logout</Button>
          )}
        </Grid>
      </Grid>
    );
  }

  private handleLogoff() {
    auth.signOut();
  }
}

const mapState = (state: any) => {
  return { signedIn: state.user.signedIn, anon: state.user.isAnonymous };
};

export default connect(mapState)(UserPage);
