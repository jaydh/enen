import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Read from "@material-ui/icons/ChromeReaderMode";
import * as React from "react";
import ReactHTMLParser, { convertNodeToElement } from "react-html-parser";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import Loader from "../components/Loader";
import { database, requestServerParse } from "../firebase";

const Highlight = Loadable({
  loader: () => import("react-highlight"),
  loading: Loader
});
const AddArticle = Loadable({
  loader: () => import("./actionDispatchers/AddArticle"),
  loading: Loader
});

interface IProps {
  title: string;
  id: string;
  link: string;
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
    this.getHTML = this.getHTML.bind(this);
    this.transform = this.transform.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
  }

  public render() {
    const { title, link, fontSize, classes } = this.props;
    const { show, fetching, HTMLData } = this.state;
    return (
      <span>
        <a href={link}>{title}</a>
        <IconButton onClick={this.handleExpand} color="primary">
          <Read />
        </IconButton>
        <AddArticle link={link} />
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
      </span>
    );
  }

  private handleExpand() {
    this.setState({ show: !this.state.show });
    if (!this.state.HTMLData) {
      this.getHTML();
    }
  }
  private async getHTML() {
    const { id, link } = this.props;
    // Document accessor for id must be string
    // tslint:disable:no-empty
    const data = await database
      .collection("articleDB")
      .doc(id)
      .get()
      .then((doc: any) => doc.data());
    if (data) {
      this.setState({ HTMLData: data.HTMLData, fetching: data.fetching });
    } else {
      requestServerParse({ id: id.toString(), link });
      const ref = database.collection("articleDB").doc(id);
      const unsubscribe = ref.onSnapshot(() => {});
      ref.onSnapshot((doc: any) => {
        // tslint:disable:no-shadowed-variable
        const data = doc.data();
        if (data) {
          this.setState({ HTMLData: data.HTMLData, fetching: data.fetching });
          if (data.HTMLData && !data.fetching) {
            unsubscribe();
          }
        }
      });
    }
  }

  private transform(node: any, index: number) {
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
  }
}
const mapStateToProps = (state: any, ownProps: any) => {
  return {
    fontSize: state.ui.fontSize,
    uid: state.user.uid
  };
};

const styles = {
  embed: { borderLeft: "4px outset blue", paddingLeft: "1em" },
  image: { padding: "4em" },
  pre: { borderLeft: "4px outset gray", margin: "2em", paddingLeft: "1em" },
  quote: { borderLeft: "4px outset purple", margin: "2em", paddingLeft: "1em" },
  root: { padding: "2em 4em" },
  title: { marginBottom: "4em" }
};
export default connect(mapStateToProps)(withStyles(styles)(Embedded));
