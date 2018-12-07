import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/NoteAdd';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import addArticle from '../../actions/addArticle';

interface IProps {
  addArticle: (t: string) => Promise<void>;
  link: string;
}

class AddArticle extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    return (
      <IconButton color="primary" onClick={this.handleSubmit}>
        <Add fontSize="small" />
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
)(AddArticle);
