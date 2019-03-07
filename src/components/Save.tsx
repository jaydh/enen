import * as React from "react";
import { IconButton } from "@material-ui/core";
import { Save } from "@material-ui/icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import saveArticles from "../actions/article/saveArticles";

interface IProps {
  onClick: () => void;
}

class SaveC extends React.Component<IProps> {
  public render() {
    const { onClick } = this.props;
    return (
      <IconButton onClick={onClick}>
        <Save />
      </IconButton>
    );
  }
}

const mapDispatch = (dispatch: any) =>
  bindActionCreators({ onClick: saveArticles }, dispatch);

export default connect(
  undefined,
  mapDispatch
)(SaveC);
