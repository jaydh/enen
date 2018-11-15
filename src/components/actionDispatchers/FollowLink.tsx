import * as React from 'react';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import ExternalIcon from '@material-ui/icons/Launch';

interface IProps {
  classes: any;
  id: string;
  link: string;
}

class FollowLink extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.handleGoToLink = this.handleGoToLink.bind(this);
  }

  public render() {
    const { classes } = this.props;
    return (
      <IconButton
        className={classes.button}
        color="secondary"
        aria-label="Go to link"
        onClick={this.handleGoToLink}
      >
        <ExternalIcon />
      </IconButton>
    );
  }
  private handleGoToLink() {
    window.open(this.props.link, '_blank');
  }
}

const mapStateToProps = (state: any, ownProps: { id: string }) => {
  const article = state.articles.articles.find(
    (t: any) => t.id === ownProps.id
  );
  return {
    link: article ? article.link : undefined
  };
};

const styles = {
  button: {
    colorPrimary: '#ff0000',
    colorSecondary: '#ff0000',
    margin: 5
  }
};

export default connect(mapStateToProps)(withStyles(styles)(FollowLink));
