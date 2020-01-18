import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import setArticleComplete from "../../actions/article/setArticleComplete";

import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/Done";

import { withStyles } from "@material-ui/core/styles";

interface IProps {
  completedOn?: Date;
  classes: any;
  setArticleComplete: (t: boolean) => void;
}

class ToggleCompleted extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
  }

  public render() {
    const { classes, completedOn } = this.props;
    return (
      <IconButton
        className={classes.button}
        color={completedOn ? "secondary" : "primary"}
        aria-label="Mark Complete"
        onClick={this.handleToggleComplete}
      >
        <DoneIcon />
      </IconButton>
    );
  }

  private handleToggleComplete() {
    return this.props.completedOn
      ? this.props.setArticleComplete(false)
      : this.props.setArticleComplete(true);
  }
}

const mapStateToProps = (state: any, ownProps: { id: string }) => {
  const article = state.articles.articleData[ownProps.id];
  return {
    completedOn: article ? article.completedOn : undefined
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: { id: string }) =>
  bindActionCreators(
    { setArticleComplete: (t: boolean) => setArticleComplete(ownProps.id, t) },
    dispatch
  );

const styles = {
  button: {
    colorPrimary: "#ff0000",
    colorSecondary: "#ff0000",
    margin: 5
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ToggleCompleted));
