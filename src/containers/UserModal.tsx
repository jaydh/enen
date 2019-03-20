import * as React from 'react';
import { connect } from 'react-redux';
import Login from '../components/Login';
import Logout from '../components/Logout';
import { Grid, Modal, withStyles } from '@material-ui/core';

interface IProps {
  classes: any;
  show: boolean;
  signedIn: boolean;
  toggler: () => void;
  token: string;
}

interface IState {
  usernameInput?: string;
  passwordInput?: string;
}

const styles = {
  modal: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    marginLeft: '-250px',
    outline: 'none'
  },
  container: {
    backgroundColor: 'white',
    boxShadow: 'lightGray',
    width: '500px',
    height: '400px',
    overflowY: 'auto'
  },
  search: {
    width: '500px',
    backgroundColor: 'white',
    boxShadow: 'lightGray'
  }
} as any;

class UserModal extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  public componentDidUpdate(old: IProps) {
    if (old.token !== this.props.token) {
      this.props.toggler();
    }
  }

  public render() {
    const { classes, show, signedIn } = this.props;
    return (
      <>
        <Modal open={show} onClose={this.props.toggler}>
          <div className={classes.modal}>
            <Grid
              container
              className={classes.container}
              justify="center"
              alignItems="center"
            >
              {!signedIn ? <Login classes={classes} /> : <Logout />}
            </Grid>
          </div>
        </Modal>
      </>
    );
  }
}

const mapState = (state: any) => {
  return {
    signedIn: state.user.signedIn,
    token: state.user.token,
    userName: state.user.userName
  };
};

export default withStyles(styles)(connect(mapState)(UserModal));
