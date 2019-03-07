import * as React from "react";
import { connect } from "react-redux";
import FollowLink from "./actionDispatchers/FollowLink";
import SetFontSize from "./actionDispatchers/SetFontSize";
import ToggleCompleted from "./actionDispatchers/ToggleCompleted";
import {
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  withStyles
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";

interface IProps {
  id: string;
  link: string;
  classes: any;
}

interface IState {
  open: boolean;
  anchorEl: any;
  smallDevice: boolean;
}

class Options extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      open: false,
      anchorEl: undefined,
      smallDevice: window.matchMedia("(max-width: 992px)").matches
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }

  public componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  public componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  }

  public render() {
    const { id, link, classes } = this.props;
    const { open, smallDevice } = this.state;
    return smallDevice ? (
      <div className={classes.root}>
        <Button
          buttonRef={this.handleRef}
          aria-owns={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
        >
          <MoreVert />
        </Button>
        <Popper
          placement="top-end"
          className={classes.options}
          open={open}
          anchorEl={this.state.anchorEl}
          transition={true}
          disablePortal={true}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: "center top"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList className={classes.options}>
                    <MenuItem>
                      <SetFontSize />
                    </MenuItem>
                    <MenuItem>
                      <FollowLink link={link} />
                    </MenuItem>
                    <MenuItem>
                      <ToggleCompleted id={id} />
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    ) : (
      <>
        <FollowLink link={link} />
        <ToggleCompleted id={id} />
        <SetFontSize />
      </>
    );
  }

  private handleRef(node: any) {
    this.setState({ anchorEl: node });
  }

  private handleToggle() {
    this.setState(state => ({ open: !state.open }));
  }

  private handleClose(event: any) {
    if (this.state.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  }
  private handleResize = () =>
    this.setState({
      smallDevice: window.matchMedia("(max-width: 992px)").matches
    });
}

const mapStateToProps = (state: any) => {
  const lastArticle = state.ui.lastArticle;
  return {
    id: lastArticle ? lastArticle.id : undefined,
    link: lastArticle ? lastArticle.link : undefined
  };
};

const styles = {
  options: {
    colorPrimary: "#855a91",
    zIndex: 100
  },
  root: {
    display: "flex"
  }
};

export default withStyles(styles)(connect(mapStateToProps)(Options));
