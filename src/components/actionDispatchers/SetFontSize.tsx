import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { decreaseFontSize, increaseFontSize } from "../../actions/fontSize";

import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { withStyles } from "@material-ui/core/styles";
import Larger from "@material-ui/icons/Add";
import Size from "@material-ui/icons/FormatSize";
import Smaller from "@material-ui/icons/Remove";

interface IProps {
  classes: any;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

interface IState {
  open: boolean;
  anchorEl: any;
}

class SetFontSize extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { open: false, anchorEl: undefined };
  }

  public render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <>
        <IconButton>
          <Smaller onClick={this.props.decreaseFontSize} />
          <Size fontSize="small" />
          <Larger onClick={this.props.increaseFontSize} />
        </IconButton>
      </>
    );
  }
}

const styles = {
  options: {
    colorPrimary: "#855a91",
    zIndex: 100
  },
  root: {
    display: "flex"
  }
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ increaseFontSize, decreaseFontSize }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(SetFontSize));
