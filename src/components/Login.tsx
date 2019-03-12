import * as React from "react";
import {
  Button,
  Divider,
  Grid,
  Input,
  InputAdornment
} from "@material-ui/core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import getArticles from "../actions/article/getArticles";
import { login, register } from "../actions/user/login";

interface IProps {
  classes: any;
  login: (username: string, password: string) => any;
  register: (username: string, password: string) => any;
  getArticles: () => void;
}

interface IState {
  usernameInput?: string;
  passwordInput?: string;
}

class Login extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  public render() {
    const { classes } = this.props;
    const { usernameInput, passwordInput } = this.state;

    return (
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
          <form onChange={this.handleUserChange} onSubmit={this.handleLogin}>
            <Input
              value={usernameInput}
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
          <form onChange={this.handlePassChange} onSubmit={this.handleLogin}>
            <Input
              value={passwordInput}
              type="password"
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
    );
  }

  private handleUserChange = (e: any) => {
    e.preventDefault();
    this.setState({
      usernameInput: e.target.value
    });
  };
  private handlePassChange = (e: any) => {
    e.preventDefault();
    this.setState({
      passwordInput: e.target.value
    });
  };

  private handleLogin = (e?: any) => {
    e && e.preventDefault();
    return (
      this.state.usernameInput &&
      this.state.passwordInput &&
      this.props
        .login(this.state.usernameInput, this.state.passwordInput)
        .then(() => this.props.getArticles())
    );
  };

  private handleRegister = (e?: any) => {
    e && e.preventDefault();
    this.state.usernameInput &&
      this.state.passwordInput &&
      this.props
        .register(this.state.usernameInput, this.state.passwordInput)
        .then(() => this.props.getArticles());
  };
}

const mapState = (state: any) => {
  return {
    userName: state.user.userName,
    email: state.user.email
  };
};

const mapDispatch = (dispatch: any) =>
  bindActionCreators({ login, register, getArticles }, dispatch);

export default connect(
  mapState,
  mapDispatch
)(Login);
