import * as React from "react";
import ReactHTMLParser, { convertNodeToElement } from "react-html-parser";
import Loadable from "react-loadable";
import Loader from "../../components/Loader";
import axios from "axios";
import { serverIP } from "../../hosts";
import { produce } from "immer";
import {
  Divider,
  Grid,
  Paper,
  Typography,
  withStyles
} from "@material-ui/core";
import * as he from "he";

const Highlight = Loadable({
  delay: 200,
  loader: () => import("react-highlight"),
  loading: Loader
});

const EmbeddedArticle = Loadable({
  delay: 200,
  loader: () => import("./EmbeddedArticle"),
  loading: Loader
});

const styles = {
  image: { padding: "1em" },
  pre: { borderLeft: "4px outset gray", margin: "2em", paddingLeft: "1em" },
  quote: { borderLeft: "4px outset purple", margin: "2em", paddingLeft: "1em" },
  root: { padding: "2em 1em" },
  title: { marginBottom: "4em" }
};

interface IProps {
  article?: any;
  fontSize: number;
  classes: any;
  match: any;
  updateBookmark: (id: string, bookmark: string) => void;
  updateProgress: (id: string, progress: number) => void;
  updateLastArticle: (t: string) => void;
  requestServerParse: (url: string) => void;
}

interface IState {
  HTML?: string;
  url?: string;
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
    const article = await this.getArticleData(articleId);
    const { HTML, url, metadata } = article;
    this.props.updateLastArticle(article);
    this.setState({ HTML, url, metadata, fetching: false });
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
    const { HTML: html, fetching, metadata, url } = this.state;
    // decode HTML Entities
    const HTML = html && he.decode(html);
    const title =
      metadata && (metadata.title || metadata.ogTitle)
        ? metadata.title || metadata.ogTitle
        : url;

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
          url: article.url,
          metadata: article.metadata
        }
      : await axios({
          method: "GET",
          url: `${serverIP}/article/id`,
          params: { id }
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
      console.log(node.name);
      return (
        <Typography variant={node.name} gutterBottom={true} align="center">
          {convertNodeToElement(node, index, this.transform)}
        </Typography>
      );
    }
    if (node.name === "img") {
      node.attribs.class = "img-fluid";
      return (
        <Grid container={true} item justify="center" className={classes.image}>
          {convertNodeToElement(node, index, this.transform)}
        </Grid>
      );
    }
    if (node.name === "p") {
      return (
        <Typography paragraph={true} inline={true} style={{ fontSize }}>
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
          hyperlinkName={node.children[0].data}
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
      const target = Array.from(elements).find(
        (el: any) => el.textContent === bookmark
      ) as HTMLElement;
      if (target) {
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

export default withStyles(styles)(ArticleView);
