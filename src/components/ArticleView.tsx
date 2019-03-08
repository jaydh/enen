import { withStyles } from "@material-ui/core/styles";
import * as React from "react";
import ReactHTMLParser, { convertNodeToElement } from "react-html-parser";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import updateBookmark from "../actions/article/updateBookmark";
import updateLastArticle from "../actions/updateLastArticle";
import updateProgress from "../actions/article/updateProgress";
import Loader from "../components/Loader";
import axios from "axios";
import { serverIP } from "../hosts";
import { requestServerParse } from "../actions/article/requestParse";
import { produce } from "immer";

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
  article?: any;
  fontSize: number;
  classes: any;
  getHTML: () => void;
  match: any;
  uid: string;
  updateBookmark: (id: string, bookmark: string) => void;
  updateProgress: (id: string, progress: number) => void;
  updateLastArticle: (t: string) => void;
  requestServerParse: (url: string) => void;
}

interface IState {
  HTML?: string;
  link?: string;
  metadata?: any;
  progress?: number;
  fetching: boolean;
  articleLinks: HTMLAnchorElement[];
  articleNodeList: Element[];
  intervalId: any;
  requestedParses: string[];
}

class ArticleView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      articleLinks: [],
      articleNodeList: [],
      fetching: true,
      intervalId: null,
      requestedParses: []
    };
  }

  public async componentDidMount() {
    const articleId = this.props.match.params.id;
    console.log(articleId);
    const { HTML, link, metadata } = await this.getArticleData(articleId);
    this.setState({ HTML, link, metadata, fetching: false });
    document.title += ` - ${metadata.title}`;

    // Find all nodes in page with textContent
    await this.setState({
      articleLinks: Array.from(document.querySelectorAll("div.page a")),
      articleNodeList: Array.from(
        document.querySelectorAll("div.page p")
      ).filter(el => el.textContent)
    });
    if (this.props.article) {
      const intervalId = setInterval(() => {
        this.getBookmark();
        this.getProgress();
        this.getArticlesInView();
      }, 5000);
      this.scrollToBookmark();
      this.setState({ intervalId });
    }
  }

  public componentWillUnmount() {
    clearInterval(this.state.intervalId);
    document.title = "enen";
  }

  public render() {
    const { classes, fontSize } = this.props;
    const { HTML, fetching, metadata, link } = this.state;
    const title =
      metadata && (metadata.title || metadata.ogTitle)
        ? metadata.title || metadata.ogTitle
        : link;

    const siteName = metadata && (metadata.siteName || metadata.ogSiteName);
    const description = metadata && metadata.excerpt;
    const subtitle = `${siteName ? siteName : ""} ${
      description ? "-" + description : ""
    }`;
    return fetching || HTML ? (
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
                  {ReactHTMLParser(HTML, {
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
  private getArticleData = async (id: string) => {
    const { article } = this.props;
    return article && article.HTMLData
      ? {
          HTML: article.HTMLData,
          fetching: false,
          link: article.link ? article.link : undefined,
          metadata: article.metadata ? article.metadata : undefined
        }
      : await axios({
          method: "GET",
          url: `${serverIP}/article/get/${id}`
        })
          .then(res => {
            return res.data;
          })
          .catch(function(error) {
            console.log(error);
          });
  };

  private transform = (node: any, index: number) => {
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
      return (
        <EmbeddedArticle
          title={node.children[0].data}
          url={node.attribs.href}
        />
      );
    }
    return undefined;
  };

  private getBookmark = () => {
    const elements = this.state.articleNodeList;
    const id = this.props.match.params.id;
    if (elements) {
      for (let i = 0, max = elements.length; i < max; i++) {
        const element = elements[i];
        if (this.elementInView(element)) {
          // Use previous element unless first element
          const newBookmark = elements[i > 0 ? i - 1 : i].textContent;
          if (newBookmark && newBookmark !== this.props.article.bookmark) {
            this.props.updateBookmark(id, newBookmark);
            return;
          }
        }
      }
    }
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

  private scrollToBookmark = () => {
    const elements = this.state.articleNodeList;
    const { bookmark } = this.props.article;
    if (elements) {
      console.log("d", this.state);
      const target = Array.from(elements).find(
        (el: any) => el.textContent === bookmark
      ) as HTMLElement;
      if (target) {
        console.log("as i");
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }
    }
  };

  private getProgress = () => {
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
  };
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    fontSize: state.ui.fontSize,
    uid: state.user.uid,
    article: state.articles.articles.find(
      (t: any) => t.id === ownProps.match.params.id
    )
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      updateLastArticle,
      updateBookmark,
      updateProgress,
      requestServerParse
    },
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
