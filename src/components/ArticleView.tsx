import { withStyles } from "@material-ui/core/styles";
import * as React from "react";
import ReactHTMLParser, { convertNodeToElement } from "react-html-parser";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import updateBookmark from "../actions/updateBookmark";
import updateLastArticle from "../actions/updateLastArticle";
import updateProgress from "../actions/updateProgress";
import Loader from "../components/Loader";
import { database, requestServerParse } from "../firebase";
import hash from "../helpers/hash";

const Divider = Loadable({
  delay: 200,
  loader: () => import("@material-ui/core/Divider"),
  loading: Loader
});
import EmbeddedArticle from "./EmbeddedArticle";
const Grid = Loadable({
  delay: 200,
  loader: () => import("@material-ui/core/Grid"),
  loading: Loader
});
const Paper = Loadable({
  delay: 200,
  loader: () => import("@material-ui/core/Paper"),
  loading: Loader
});
const Typography = Loadable({
  delay: 200,
  loader: () => import("@material-ui/core/Typography"),
  loading: Loader
});
const Highlight = Loadable({
  delay: 200,
  loader: () => import("react-highlight"),
  loading: Loader
});

interface IProps {
  fontSize: number;
  classes: any;
  getHTML: () => void;
  match: any;
  uid: string;
  updateBookmark: (id: string, bookmark: string) => void;
  updateProgress: (id: string, progress: number) => void;
  updateLastArticle: (t: string) => void;
}

interface IState {
  HTMLData?: string;
  bookmark?: string;
  link?: string;
  metadata?: any;
  progress?: number;
  fetching: boolean;
  articleLinks: HTMLAnchorElement[];
  articleNodeList: Element[];
  intervalId: any;
}

class ArticleView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      articleLinks: [],
      articleNodeList: [],
      fetching: true,
      intervalId: null
    };
    this.getBookmark = this.getBookmark.bind(this);
    this.scrollToBookmark = this.scrollToBookmark.bind(this);
    this.getProgress = this.getProgress.bind(this);
    this.transform = this.transform.bind(this);
    this.getArticlesInView = this.getArticlesInView.bind(this);
  }

  public async componentDidMount() {
    const articleId = this.props.match.params.id;
    await database
      .collection("articleDB")
      .doc(articleId)
      .get()
      .then((doc: any) => {
        // Remember last viewed article
        this.props.updateLastArticle(doc.data());
        return this.setState({
          HTMLData: doc.data() ? doc.data().HTMLData : undefined,
          fetching: false,
          link: doc.data() ? doc.data().link : undefined,
          metadata: doc.data() ? doc.data().metadata : undefined
        });
      });

    await database
      .collection("userData")
      .doc(this.props.uid)
      .collection("articles")
      .doc(articleId)
      .get()
      .then((doc: any) =>
        this.setState({
          bookmark: doc.data() ? doc.data().bookmark : undefined,
          progress: doc.data() ? doc.data().progress : undefined
        })
      );
    const intervalId = setInterval(() => {
      this.getBookmark();
      this.getProgress();
      this.getArticlesInView();
    }, 20000);

    // Find all nodes in page with textContent
    await this.setState({
      articleLinks: Array.from(document.querySelectorAll("div.page a")),
      articleNodeList: Array.from(
        document.querySelectorAll("div.page p")
      ).filter(el => el.textContent),

      intervalId
    });
    this.scrollToBookmark();
  }

  public componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  public render() {
    const { classes, fontSize } = this.props;
    const { HTMLData, fetching, metadata, link } = this.state;
    const title =
      metadata && (metadata.title || metadata.ogTitle)
        ? metadata.title || metadata.ogTitle
        : link;

    const siteName = metadata && (metadata.siteName || metadata.ogSiteName);
    const description =
      metadata && (metadata.ogDescrption || metadata.description);
    const subtitle = `${siteName ? siteName : ""} ${
      description ? "-" + description : ""
    }`;
    return fetching || HTMLData ? (
      <Grid container={true} alignItems="center" justify="center">
        <Grid
          item={true}
          xs={12}
          sm={12}
          md={8}
          lg={8}
          className={classes.root}
        >
          <Paper elevation={10} className={classes.root}>
            <Typography style={{ fontSize: fontSize + 10 }} variant="title">
              {title}
            </Typography>
            <Typography style={{ fontSize: fontSize + 2 }} variant="subtitle1">
              {subtitle}
            </Typography>
            <Divider className={classes.title} />
            <div>
              {fetching ? (
                <Loader pastDelay={false} isLoading={fetching} />
              ) : (
                <div style={{ fontSize, lineHeight: "1.5" }}>
                  {ReactHTMLParser(HTMLData!.replace(/(&nbsp;)*/g, ""), {
                    decodeEntities: false,
                    transform: this.transform
                  })}
                </div>
              )}
            </div>
          </Paper>
        </Grid>
      </Grid>
    ) : (
      <Grid container={true} alignItems="center" justify="center">
        <Typography variant="h3">Unavailable</Typography>
      </Grid>
    );
  }

  private transform(node: any, index: number) {
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
    if (
      node.name === "a" &&
      node.children &&
      node.children[0] &&
      node.children[0].data
    ) {
      const id = hash(node.attribs.href);
      return (
        <EmbeddedArticle
          title={node.children[0].data}
          id={id.toString()}
          link={node.attribs.href}
        />
      );
    }
    return undefined;
  }

  private getBookmark() {
    const elements = this.state.articleNodeList;
    const id = this.props.match.params.id;

    if (elements) {
      for (let i = 0, max = elements.length; i < max; i++) {
        const element = elements[i];
        if (this.elementInView(element)) {
          // Use previous element unless first element
          const newBookmark = elements[i > 0 ? i - 1 : i].textContent;
          if (newBookmark) {
            this.props.updateBookmark(id, newBookmark);
          }
        }
      }
    }
  }

  private getArticlesInView() {
    const targets = this.state.articleLinks.filter((e: HTMLAnchorElement) =>
      this.elementInView(e)
    );
    targets.forEach(async (e: HTMLAnchorElement) => {
      const id = hash(e.href).toString();
      const data = await database
        .collection("articleDB")
        .doc(id)
        .get()
        .then((doc: any) => doc.data());
      if (!data) {
        requestServerParse({ id, link: e.href });
      }
    });
  }

  private elementInView(e: Element) {
    const rect = e.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement!.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement!.clientWidth)
    );
  }

  private scrollToBookmark() {
    const elements = this.state.articleNodeList;
    if (elements) {
      const target = Array.from(elements).find(
        (el: any) => el.textContent === this.state.bookmark
      ) as HTMLElement;
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }
    }
  }

  private getProgress() {
    const h = document.getElementById("main");
    if (h) {
      const id = this.props.match.params.id;
      const b = document.body;
      const st = "scrollTop";
      const sh = "scrollHeight";
      const newProgress =
        ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
      if (newProgress !== this.state.progress) {
        this.props.updateProgress(id, newProgress);
        this.setState({ progress: newProgress });
      }
    }
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    fontSize: state.ui.fontSize,
    uid: state.user.uid
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    { updateLastArticle, updateBookmark, updateProgress },
    dispatch
  );

const styles = {
  image: { padding: "4em" },
  pre: { borderLeft: "4px outset gray", margin: "2em", paddingLeft: "1em" },
  quote: { borderLeft: "4px outset purple", margin: "2em", paddingLeft: "1em" },
  root: { padding: "2em 1em" },
  title: { marginBottom: "4em" }
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ArticleView));
