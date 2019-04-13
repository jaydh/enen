import {
  CircularProgress,
  Grid,
  Collapse,
  Divider,
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
import Loader from "../../components/Loader";
import { serverIP } from "../../hosts";
import axios from "axios";
import { produce } from "immer";
import { bindActionCreators, Dispatch } from "redux";
import { requestServerParse } from "../../actions/article/requestParse";
import AddArticle from "../actionDispatchers/AddArticle";

const Highlight = Loadable({
  loader: () => import("react-highlight"),
  loading: Loader
});

const styles = {
  button: { fontSize: "15px" },
  embed: { paddingLeft: "1em" },
  image: { padding: "4em" },
  pre: { borderLeft: "4px outset gray", margin: "2em", paddingLeft: "1em" },
  quote: { borderLeft: "4px outset purple", margin: "2em", paddingLeft: "1em" },
  title: { marginBottom: "4em" }
};

interface IProps {
  url: string;
  hyperlinkName: string;
  classes: any;
  fontSize: number;
  requestServerParse: (url: string) => void;
}

interface IState {
  show: boolean;
  articleLinks: HTMLAnchorElement[];
  articleNodeList: Element[];
  HTML?: string;
  metadata?: { title: string; excerpt: string; siteName: string };
  fetching: boolean;
  intervalId?: any;
  requestedParses: string[];
}

class Embedded extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      show: false,
      fetching: true,
      articleLinks: [],
      articleNodeList: [],
      requestedParses: []
    };
  }

  public async componentDidMount() {
    // Find all nodes in page with textContent
    await this.setState({
      articleLinks: Array.from(document.querySelectorAll("div.page a")),
      articleNodeList: Array.from(
        document.querySelectorAll("div.page p")
      ).filter(el => el.textContent)
    });

    const intervalId = setInterval(() => {
      this.getArticlesInView();
    }, 5000);
    this.setState({ intervalId });
  }

  public render() {
    const { url, fontSize, classes, hyperlinkName } = this.props;
    const { show, fetching, HTML, metadata } = this.state;
    const title = metadata && metadata.title ? metadata.title : url;

    const siteName = metadata && metadata.siteName;
    const description = metadata && metadata.excerpt;
    const subtitle = `${siteName ? siteName : ""} ${
      description ? "-" + description : ""
    }`;
    return (
      <span>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {hyperlinkName}
        </a>
        <IconButton onClick={this.handleExpand} color="primary">
          <Read className={classes.button} />
        </IconButton>
        <AddArticle link={url} />
        {show && (
          <Collapse
            timeout={500}
            in={show}
            children={
              <Paper className={classes.embed} style={{ fontSize }}>
                {fetching && (
                  <Grid container={true} alignItems="center" justify="center">
                    <CircularProgress />
                  </Grid>
                )}
                <>
                  <Typography
                    style={{ fontSize: fontSize + 10 }}
                    variant="title"
                  >
                    {title}
                  </Typography>
                  <Typography
                    style={{ fontSize: fontSize + 2 }}
                    variant="subtitle1"
                  >
                    {subtitle}
                  </Typography>
                  <Divider className={classes.title} />

                  {ReactHTMLParser(HTML, {
                    decodeEntities: false,
                    transform: this.transform
                  })}
                </>
              </Paper>
            }
          />
        )}{" "}
      </span>
    );
  }

  private handleExpand = async () => {
    this.setState({ show: !this.state.show });
    if (!this.state.HTML) {
      this.getArticleData();
    }
  };

  private getArticleData = () => {
    const { url } = this.props;
    return axios({
      method: "GET",
      url: `${serverIP}/article/url`,
      params: { url }
    })
      .then(res => {
        console.log(res);
        return this.setState(res.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  private getArticlesInView = () => {
    const { requestedParses } = this.state;
    const targets = this.state.articleLinks.filter((e: HTMLAnchorElement) =>
      this.elementInView(e)
    );
    targets.forEach(async (e: HTMLAnchorElement) => {
      if (!requestedParses.find((url: string) => url === e.href)) {
        this.setState(
          produce(draft => {
            draft.requestedParses.push(e.href);
          })
        );
        this.props.requestServerParse(e.href);
      }
    });
  };

  private elementInView = (e: Element) => {
    const rect = e.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement!.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement!.clientWidth)
    );
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

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ requestServerParse }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Embedded));
