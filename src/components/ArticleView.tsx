import * as React from 'react';
import ReactHTMLParser from 'react-html-parser';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import updateLastArticle from '../actions/updateLastArticle';
import Loader from '../components/Loader';
import { database } from '../firebase';
import { IArticle } from '../reducers/articles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

interface IProps {
  id: string;
  article: IArticle;
  fontSize: number;
  classes: any;
  getHTML: () => void;
  match: any;
  updateLastArticle: (t: string) => void;
}

interface IState {
  HTMLData: string;
  fetching: boolean;
  articleNodeList: any;
}

class ArticleView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      HTMLData: '',
      articleNodeList: null,
      fetching: true
    };
  }

  public async componentDidMount() {
    // Remember last viewed article
    if (this.props.match.params.id) {
      this.props.updateLastArticle(this.props.match.params.id);
    }

    await database
      .collection('articleDB')
      .doc(this.props.match.params.id)
      .get()
      .then((doc: any) =>
        this.setState({ HTMLData: doc.data().HTMLData, fetching: false })
      );
    // Find all nodes in page with textContent
    this.setState({
      articleNodeList: Array.from(
        document.querySelectorAll('div.page p')
      ).filter(el => el.textContent)
    });
  }

  public render() {
    const { classes } = this.props;
    const { HTMLData, fetching } = this.state;
    return (
      <Grid container={true} alignItems="center" justify="center">
        <Paper elevation={10} className={classes.root}>
          {fetching ? (
            <Loader isLoading={fetching} />
          ) : (
            ReactHTMLParser(HTMLData, {
              transform: (node: any, index: number) => {
                if (node.name === 'img') {
                  node.attribs.class = 'img-fluid';
                  return undefined;
                }
                return undefined;
              }
            })
          )}
        </Paper>
      </Grid>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ updateLastArticle }, dispatch);

const styles = {
  root: { maxWidth: '75vw', padding: '8em 4em' }
};
export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(ArticleView));
