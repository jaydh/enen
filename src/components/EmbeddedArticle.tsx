import {
  CircularProgress,
  Grid,
  Grow,
  IconButton,
  Paper,
  withStyles,
  Typography
} from "@material-ui/core";
import Read from "@material-ui/icons/ChromeReaderMode";
import * as React from "react";
import ReactHTMLParser, { convertNodeToElement } from "react-html-parser";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import Loader from "../components/Loader";
import { serverIP } from "../hosts";
import axios from "axios";

const Highlight = Loadable({
  loader: () => import("react-highlight"),
  loading: Loader
});
const AddArticle = Loadable({
  loader: () => import("./actionDispatchers/AddArticle"),
  loading: Loader
});

const styles = {
  button: { fontSize: "15px" },
  embed: { borderLeft: "4px outset blue", paddingLeft: "1em" },
  image: { padding: "4em" },
  pre: { borderLeft: "4px outset gray", margin: "2em", paddingLeft: "1em" },
  quote: { borderLeft: "4px outset purple", margin: "2em", paddingLeft: "1em" },
  root: { display: "inline-block" },
  title: { marginBottom: "4em" }
};

interface IProps {
  title: string;
  url: string;
  classes: any;
  fontSize: number;
}

interface IState {
  show: boolean;
  HTMLData?: string;
  fetching: boolean;
}

class Embedded extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { show: false, fetching: true };
  }

  public render() {
    const { title, url, fontSize, classes } = this.props;
    const { show, fetching, HTMLData } = this.state;
    return (
      <>
        <div className={classes.root}>
          <a href={url}>{title}</a>
          <IconButton onClick={this.handleExpand} color="primary">
            <Read className={classes.button} />
          </IconButton>
          <AddArticle link={url} />
        </div>
        {show && (
          <Grow
            in={show}
            children={
              <Paper className={classes.embed} style={{ fontSize }}>
                {fetching && (
                  <Grid container={true} alignItems="center" justify="center">
                    <CircularProgress />
                  </Grid>
                )}
                {show &&
                  HTMLData &&
                  ReactHTMLParser(HTMLData, {
                    decodeEntities: false,
                    transform: this.transform
                  })}
              </Paper>
            }
          />
        )}{" "}
      </>
    );
  }

  private handleExpand = async () => {
    this.setState({ show: !this.state.show });
    if (!this.state.HTMLData) {
      this.getHTML();
    }
  };
  private getHTML = async () => {
    const { url } = this.props;
    const request = async () => {
      const { article } = await axios({
        method: "POST",
        url: `${serverIP}/article`,
        data: { url }
      })
        .then(res => res.data)
        .catch(function(error) {
          console.log(error);
        });

      // Stop polling after server signals done fetching
      if (!article.fetching) {
        window.clearInterval(interval);
        this.setState({ HTMLData: article.HTML, fetching: article.fetching });
      }
    };

    request();
    const interval = window.setInterval(request, 1500);
  };

  private transform = (node: any, index: number) => {
    if (node) {
      const { classes, fontSize } = this.props;
      if (node.name && node.name.startsWith("h")) {
        return (
          <Typography
            variant="h1"
            gutterBottom={true}
            style={{ fontSize: fontSize + 4 }}
          >
            {convertNodeToElement(node, index, this.transform)}
          </Typography>
        );
      }
      if (node.name === "img") {
        node.attribs.class = "img-fluid";
        return (
          <Grid container={true} justify="center" className={classes.image}>
            {convertNodeToElement(node, index, this.transform)}
          </Grid>
        );
      }
      if (node.name === "p") {
        return (
          <Typography paragraph={true} style={{ fontSize }}>
            {convertNodeToElement(node, index, this.transform)}
          </Typography>
        );
      }
      if (node.name === "pre") {
        return (
          <div className={classes.pre}>
            <Highlight>{convertNodeToElement(node)}</Highlight>
          </div>
        );
      }
      if (node.name === "blockquote") {
        return (
          <div className={classes.quote}>
            {node.children.map((t: any) => (
              <Typography style={{ fontSize }}>
                {t.data ? t.data : null}
              </Typography>
            ))}
          </div>
        );
      }
      return undefined;
    }
    return undefined;
  };
}
const mapStateToProps = (state: any, ownProps: any) => {
  return {
    fontSize: state.ui.fontSize,
    uid: state.user.uid
  };
};
export default connect(mapStateToProps)(withStyles(styles)(Embedded));
