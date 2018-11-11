import * as React from 'react';
import ReactHTMLParser from 'react-html-parser';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import updateLastArticle from '../actions/updateLastArticle';
import { database } from '../firebase';
import { IArticle } from '../reducers/articles';

import Typography from '@material-ui/core/Typography';

interface IProps {
  id: string;
  article: IArticle;
  fontSize: number;
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
    // tslint:disable:no-console
    console.log(this.props);

    // Remember last viewed article
    if (this.props.match.params.id) {
      console.log('here');
      this.props.updateLastArticle(this.props.match.params.id);
    }

    this.setState({
      HTMLData: await database
        .collection('articleDB')
        .doc(this.props.match.params.id)
        .get()
        .then((doc: any) => doc.data().HTMLData),
      fetching: false
    });
    // Find all nodes in page with textContent
    this.setState({
      articleNodeList: Array.from(
        document.querySelectorAll('div.page p')
      ).filter(el => el.textContent)
    });
  }

  public render() {
    const { HTMLData } = this.state;
    return (
      <Typography>
        {ReactHTMLParser(HTMLData, {
          transform: (node: any, index: number) => {
            if (node.name === 'img') {
              node.attribs.class = 'img-fluid';
              return undefined;
            }
            return undefined;
          }
        })}
      </Typography>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ updateLastArticle }, dispatch);

const mapStateToProps = (state: any, ownProps: any) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleView);
