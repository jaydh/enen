import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import addArticle from "../../actions/article/addArticle";
import component from "./component";
const mapStateToProps = (state: any) => {
  return {
    articles: state.articles
  };
};
const mapDispatch = (dispatch: any) =>
  bindActionCreators({ addArticle }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatch
)(component);
