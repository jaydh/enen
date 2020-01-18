import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { logout } from "../../actions/user/logout";
import { connectEmail } from "../../actions/user/connectEmail";
import component from "./component";

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
)(component);
