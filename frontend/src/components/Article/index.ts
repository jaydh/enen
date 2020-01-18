import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import deleteArticle from "../../actions/article/deleteArticle";
import component from "./component";

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ deleteArticle }, dispatch);

export default connect(
  undefined,
  mapDispatchToProps
)(component);
