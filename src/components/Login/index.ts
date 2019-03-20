import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import getArticles from "../../actions/article/getArticles";
import { login, register } from "../../actions/user/login";
import component from "./component";

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
)(component);
