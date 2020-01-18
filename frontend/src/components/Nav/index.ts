import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import component from "./component";

const mapStateToProps = (state: any) => {
  return {
    lastArticleId: state.ui.lastArticle ? state.ui.lastArticle.id : undefined,
    user: state.user,
    signedIn: state.user.signedIn
  };
};

const connected = connect(mapStateToProps)(component);

export default withRouter(connected);
