import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import deleteArticle from '../actions/deleteArticle';
import { IArticle } from '../reducers/articles';
import FollowLink from './actionDispatchers/FollowLink';
import ToggleCompleted from './actionDispatchers/ToggleCompleted';

import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import ReadIcon from '@material-ui/icons/ChromeReaderMode';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';

interface IProps {
  article: IArticle;
  id: string;
  classes: any;
  expanded: boolean;
  handler: (event: any, expanded: any) => void;
  deleteArticle: (id: string) => void;
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
  }

  public render() {
    const { article, classes } = this.props;
    const { progress } = article;

    // tslint:disable:no-console
    console.log(progress);

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
              <Grid container={true}>
                <Grid item={true} xs={3} sm={2} md={1} lg={1}>
                  <Avatar src={image} />
                </Grid>
                <Grid item={true} xs={6} sm={8} md={10} lg={10}>
                  <ListItemText primary={title} secondary={description} />
                </Grid>
                <Grid item={true} xs={3} sm={2} md={1} lg={1}>
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
                </Grid>
                <Grid item={true} xs={12} sm={12} md={12} lg={12}>
                  {progress && (
                    <div style={{ width: '100%' }}>
                      <LinearProgress variant="determinate" value={progress} />
                    </div>
                  )}
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Icon>
                <DateRangeIcon />
              </Icon>
              <Typography>
                {new Date(article.addedAt).toLocaleDateString()}
              </Typography>
              <Grid container={true} alignItems="flex-end" justify="flex-end">
                <ToggleCompleted id={article.id} />
                <FollowLink id={article.id} />
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
}

const mapStateToProps = (state: any, ownProps: { id: string }) => {
  return {
    article: state.articles.articles.find((t: any) => t.id === ownProps.id)
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ deleteArticle }, dispatch);

const styles = {
  button: {
    colorPrimary: '#ff0000',
    colorSecondary: '#ff0000',
    margin: 5
  },
  root: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%'
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Article));
