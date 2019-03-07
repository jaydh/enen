import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import loader from "../helpers/loader";
import { login, register } from "../actions/user/login";
import getArticles from "../actions/article/getArticles";
import { logout } from "../actions/user/logout";

import User from "../components/User";

import {
  Avatar,
  Button,
  Divider,
  Input,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItem,
  ListItemText,
  Grid,
  Collapse,
  Modal,
  Tooltip,
  Typography,
  withStyles
} from "@material-ui/core";

interface IProps {
  classes: any;
  show: boolean;
  signedIn: boolean;
  toggler: () => void;
  logout: () => void;
  login: (username: string, password: string) => any;
  register: (username: string, password: string) => any;
  getArticles: () => void;
}

interface IState {
  username?: string;
  password?: string;
}

const styles = {
  modal: {
    position: "absolute",
    top: "30%",
    left: "50%",
    marginLeft: "-250px",
    outline: "none"
  },
  container: {
    backgroundColor: "white",
    boxShadow: "lightGray",
    width: "500px",
    height: "400px",
    overflowY: "auto"
  },
  search: {
    width: "500px",
    backgroundColor: "white",
    boxShadow: "lightGray"
  }
} as any;

class UserModal extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {};
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
              {!signedIn ? (
                <>
                  <Grid
                    className={classes.search}
                    item
                    container
                    justify="center"
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                  >
                    <form onChange={this.handleUserChange}>
                      <Input
                        value={this.state.username}
                        margin="dense"
                        placeholder="Username"
                        endAdornment={<InputAdornment position="end" />}
                      />
                    </form>
                  </Grid>
                  <Divider />
                  <Grid
                    className={classes.search}
                    item
                    container
                    justify="center"
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                  >
                    <form onChange={this.handlePassChange}>
                      <Input
                        value={this.state.password}
                        margin="dense"
                        placeholder="Password"
                        endAdornment={<InputAdornment position="end" />}
                      />
                    </form>
                  </Grid>
                  <Divider />
                  <Grid
                    className={classes.search}
                    item
                    container
                    justify="center"
                    xs={12}
                    sm={12}
                    md={3}
                    lg={3}
                  >
                    <Button onClick={this.handleLogin}>Login</Button>
                  </Grid>
                  <Grid
                    className={classes.search}
                    item
                    container
                    justify="center"
                    xs={12}
                    sm={12}
                    md={3}
                    lg={3}
                  >
                    <Button onClick={this.handleRegister}>Register</Button>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid
                    className={classes.search}
                    item
                    container
                    justify="center"
                  >
                    <Button onClick={this.handleLogoff}>Logout</Button>
                  </Grid>
                </>
              )}
            </Grid>
          </div>
        </Modal>
      </>
    );
  }

  private handleUserChange = (e: any) => {
    e.preventDefault();
    this.setState({
      username: e.target.value
    });
  };
  private handlePassChange = (e: any) => {
    e.preventDefault();
    this.setState({
      password: e.target.value
    });
  };

  private handleLogin = () =>
    this.state.username &&
    this.state.password &&
    this.props
      .login(this.state.username, this.state.password)
      .then(() => this.props.getArticles());

  private handleRegister = () =>
    this.state.username &&
    this.state.password &&
    this.props.register(this.state.username, this.state.password);
  private handleLogoff = () => this.props.logout();
}

const mapState = (state: any) => {
  return { signedIn: state.user.signedIn, anon: state.user.isAnonymous };
};
const mapDispatch = (dispatch: any) =>
  bindActionCreators({ login, logout, register, getArticles }, dispatch);

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(UserModal)
);
