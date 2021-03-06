import * as React from "react";
import ArticleViewOptions from "../ArticleViewOptions";
import UserModal from "../../containers/UserModal";

import {
  BottomNavigationAction,
  BottomNavigation,
  Fade,
  Typography,
  withStyles,
  Tooltip
} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import CollectionsBookmark from "@material-ui/icons/CollectionsBookmark";
import List from "@material-ui/icons/List";
import Person from "@material-ui/icons/Person";
import Timeline from "@material-ui/icons/Timeline";

interface IProps {
  user: any;
  classes: any;
  history: any;
  location: any;
  match: any;
  lastArticleId?: string;
  signedIn: boolean;
}

interface IState {
  smallDevice: boolean;
  showModal: boolean;
}

class Nav extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      smallDevice: window.matchMedia("(max-width: 992px)").matches,
      showModal: !props.signedIn
    };
  }

  public componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  public componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  }
  public render() {
    const { classes, location, user } = this.props;
    const { smallDevice } = this.state;
    const { displayName } = user;
    const initials = displayName ? displayName.match(/\b\w/g).join("") : "";
    const value = location.pathname;

    return (
      <BottomNavigation
        className={classes.root}
        showLabels={true}
        value={value}
        onChange={this.handleChange}
      >
        {value.startsWith("/article/") && <Typography />}
        <BottomNavigationAction label="List" value="/list" icon={<List />} />
        <BottomNavigationAction
          label="Article"
          value={"/article/" + this.props.lastArticleId}
          icon={<CollectionsBookmark />}
        />
        <Tooltip title="coming soon!">
          <BottomNavigationAction label="Stats" icon={<Timeline />} />
        </Tooltip>
        <BottomNavigationAction
          label={initials}
          icon={<Person />}
          onClick={this.toggleModal}
        />
        {value.startsWith("/article/") && (
          <Fade in={value.startsWith("/article/")}>
            <Toolbar
              className={smallDevice ? classes.smallDevice : classes.rightSide}
            >
              <ArticleViewOptions />
            </Toolbar>
          </Fade>
        )}
        <UserModal show={this.state.showModal} toggler={this.toggleModal} />
      </BottomNavigation>
    );
  }

  private handleChange = (event: any, value: string) => {
    this.props.history.push(value);
  };
  private handleResize = () =>
    this.setState({
      smallDevice: window.matchMedia("(max-width: 992px)").matches
    });

  private toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };
}

const styles = {
  rightSide: { position: "absolute", right: 0 },
  root: {
    backgroundColor: "#F4ECD8",
    borderTop: "inset 1px",
    height: "10vh",
    justifyContent: "center",
    padding: 0,
    width: "100%",
    zIndex: 100
  }
} as any;

export default withStyles(styles)(Nav);
