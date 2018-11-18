import * as React from 'react';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { withStyles } from '@material-ui/core/styles';

interface IProps {
  user: any;
  classes: any;
}

class User extends React.Component<IProps> {
  public render() {
    const { classes, user } = this.props;
    const { signedIn, displayName, photoUrl, isAnonymous } = user;
    const initials = displayName ? displayName.match(/\b\w/g).join('') : '';
    return (
      <Avatar className={classes.avatar} src={photoUrl}>
        {signedIn && !isAnonymous ? initials : 'Anon'}
      </Avatar>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    user: state.user
  };
};

const styles = {
  avatar: {
    backgroundColor: deepPurple[500],
    color: '#fff'
  },
  root: {
    paddingRight: '2em'
  },
  typo: {
    padding: '1em 2em'
  }
};

export default connect(mapStateToProps)(withStyles(styles)(User));
