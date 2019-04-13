import { connect } from "react-redux";
import component from "./component";

const mapStateToProps = (state: any) => {
  const lastArticle = state.ui.lastArticle;
  return {
    id: lastArticle && lastArticle._id,
    url: lastArticle && lastArticle.url
  };
};

export default connect(mapStateToProps)(component);
