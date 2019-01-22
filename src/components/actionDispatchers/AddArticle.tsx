import { IconButton, withStyles } from '@material-ui/core';
import Add from '@material-ui/icons/NoteAdd';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import addArticle from '../../actions/addArticle';

interface IProps {
  addArticle: (t: string) => (dispatch: any, getState: any) => Promise<void>;
  link: string;
  classes: any;
}
const styles = {
  button: { fontSize: '15px' }
};
class AddArticle extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    const { classes } = this.props;
    return (
      <IconButton color="primary" onClick={this.handleSubmit}>
        <Add className={classes.button} />
      </IconButton>
    );
  }

  private handleSubmit(event: any) {
    event.preventDefault();
    this.props.addArticle(this.props.link);
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) =>
  bindActionCreators({ addArticle }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(AddArticle));
