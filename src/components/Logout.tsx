import * as React from "react";
import {
  Button,
  Typography,
  Grid,
  Input,
  InputAdornment
} from "@material-ui/core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { logout } from "../actions/user/logout";
import { connectEmail } from "../actions/user/connectEmail";

interface IProps {
  userName: string;
  email?: string;
  handleLogout: () => void;
  handleConnect: (email: string) => void;
}

interface IState {
  showConnect: boolean;
  email?: string;
}

class Logout extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = { showConnect: false };
  }
  public render() {
    const { userName, email } = this.props;
    const { showConnect } = this.state;

    return (
      <>
        <Grid item container justify="center">
          <Typography variant="headline">Signed in as {userName}</Typography>
          {email && <Typography variant="headline">Email: {email}</Typography>}
        </Grid>
        <Grid item container justify="center">
          {!email &&
            (showConnect ? (
              <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
                <Input
                  value={email}
                  margin="dense"
                  placeholder="Email"
                  endAdornment={<InputAdornment position="end" />}
                />
              </form>
            ) : (
              <Button onClick={this.toggleShow}>Connect email</Button>
            ))}
        </Grid>
        <Grid item container justify="center">
          <Button onClick={this.handleLogoff}>Logout</Button>
        </Grid>
      </>
    );
  }

  private handleLogoff = () => this.props.handleLogout();
  private toggleShow = () =>
    this.setState({ showConnect: !this.state.showConnect });
  private handleChange = (e: any) => {
    e.preventDefault();
    this.setState({
      email: e.target.value
    });
  };
  private handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(this.state.email);
    if (this.state.email) {
      this.props.handleConnect(this.state.email);
    }
  };
}

const mapState = (state: any) => {
  return {
    userName: state.user.userName,
    email: state.user.email
  };
};
const mapDispatch = (dispatch: any) =>
  bindActionCreators(
    { handleLogout: logout, handleConnect: connectEmail },
    dispatch
  );

export default connect(
  mapState,
  mapDispatch
)(Logout);
