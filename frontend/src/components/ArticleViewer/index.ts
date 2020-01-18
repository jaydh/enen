import component from "./component";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import updateBookmark from "../../actions/article/updateBookmark";
import updateLastArticle from "../../actions/updateLastArticle";
import updateProgress from "../../actions/article/updateProgress";
import { requestServerParse } from "../../actions/article/requestParse";

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    fontSize: state.ui.fontSize,
    uid: state.user.uid,
    article: state.articles.articleData[ownProps.match.params.id]
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      updateLastArticle,
      updateBookmark,
      updateProgress,
      requestServerParse
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(component);
