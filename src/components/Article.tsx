import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import deleteArticle from '../actions/deleteArticle';
import setArticleComplete from '../actions/setArticleComplete';
import { IArticle } from '../reducers/articles';

import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import ReadIcon from '@material-ui/icons/ChromeReaderMode';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import ExternalIcon from '@material-ui/icons/Launch';

import { withStyles } from '@material-ui/core/styles';

interface IProps {
  article: IArticle;
  id: string;
  classes: any;
  expanded: boolean;
  handler: (event: any, expanded: any) => void;
  deleteArticle: (id: string) => void;
  setArticleComplete: (id: string, t: boolean) => void;
}

interface IState {
  showRead: boolean;
}

class Article extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { showRead: false };
    this.handleDelete = this.handleDelete.bind(this);
    this.toggleShowRead = this.toggleShowRead.bind(this);
    this.handleGoToLink = this.handleGoToLink.bind(this);
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
  }

  public render() {
    const { article, classes } = this.props;

    const title =
      article.metadata && (article.metadata.title || article.metadata.ogTitle)
        ? article.metadata.title || article.metadata.ogTitle
        : article.link;

    const description = article.metadata
      ? (article.metadata.siteName || article.metadata.ogSiteName) +
        ' - ' +
        (article.metadata.ogDescrption || article.metadata.description)
      : '';

    const image =
      article.metadata && article.metadata.images
        ? article.metadata.images[0]
        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/N_cursiva.gif/400px-N_cursiva.gif';

    return (
      <>
        <ListItem
          button={true}
          divider={true}
          onMouseEnter={this.toggleShowRead}
          onMouseLeave={this.toggleShowRead}
        >
          <ExpansionPanel
            className={classes.root}
            expanded={this.props.expanded}
            onChange={this.props.handler}
          >
            <ExpansionPanelSummary>
              <Avatar src={image} />
              <ListItemText primary={title} secondary={description} />
              <Fade in={this.state.showRead || this.props.expanded}>
                <Link to={`/article/${article.id}`}>
                  <IconButton
                    disabled={true}
                    className={classes.button}
                    aria-label="Delete"
                  >
                    <ReadIcon />
                  </IconButton>
                </Link>
              </Fade>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Icon>
                <DateRangeIcon />
              </Icon>
              <Typography>
                {new Date(article.addedAt).toLocaleDateString()}
              </Typography>
              <Grid container={true} alignItems="flex-end" justify="flex-end">
                <IconButton
                  className={classes.button}
                  color={article.completedOn ? 'secondary' : 'primary'}
                  aria-label="Mark Complete"
                  onClick={this.handleToggleComplete}
                >
                  <DoneIcon />
                </IconButton>
                <IconButton
                  className={classes.button}
                  color="primary"
                  aria-label="Go to link"
                  onClick={this.handleGoToLink}
                >
                  <ExternalIcon />
                </IconButton>
                <IconButton
                  className={classes.button}
                  color="secondary"
                  aria-label="Delete"
                  onClick={this.handleDelete}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </ListItem>
      </>
    );
  }

  private toggleShowRead() {
    this.setState({ showRead: !this.state.showRead });
  }

  private handleDelete() {
    this.props.deleteArticle(this.props.id);
  }

  private handleGoToLink() {
    window.open(this.props.article.link, '_blank');
  }

  private handleToggleComplete() {
    const id = this.props.article.id;
    return this.props.article.completedOn
      ? this.props.setArticleComplete(id, false)
      : this.props.setArticleComplete(id, true);
  }
}

const mapStateToProps = (state: any, ownProps: { id: string }) => {
  return {
    article: state.articles.articles.find((t: any) => t.id === ownProps.id)
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ deleteArticle, setArticleComplete }, dispatch);

const styles = {
  button: {
    colorPrimary: '#ff0000',
    colorSecondary: '#ff0000',
    margin: 5
  },
  root: {
    width: '100%'
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Article));
