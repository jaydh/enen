import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Add from '@material-ui/icons/NoteAdd';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import addArticle from '../actions/addArticle';
import hash from '../helpers/hash';
import parseUri from '../helpers/parseURI';
import { IArticle } from '../reducers/articles';

interface IProps {
  addArticle: (t: string) => void;
  articles: IArticle[];
}

interface IState {
  valid: boolean;
  value: string;
}

// ask db to fetch article in background

class AddArticle extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = { valid: false, value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
  }

  public componentDidMount() {
    // Copy from clipboard if valid article
    (navigator as any).clipboard
      .readText()
      .then(
        (text: any) =>
          this.getValidationState(text) ? this.setState({ value: text }) : null
      );
  }

  public render() {
    return (
      <div id="add-article" className="aligner">
        <form onSubmit={this.handleSubmit}>
          <Input
            autoFocus={true}
            error={this.state.value.length > 0 && !this.state.valid}
            onChange={this.handleChange}
            value={this.state.value}
            margin="dense"
            placeholder="Save Article"
            endAdornment={
              <InputAdornment position="end">
                <Add fontSize="small" />
              </InputAdornment>
            }
            inputProps={{
              'aria-label': 'Save article'
            }}
          />
        </form>
      </div>
    );
  }

  private handleChange(event: any) {
    this.setState({
      valid: this.getValidationState(event.target.value),
      value: event.target.value
    });
  }

  private handleSubmit(event: any) {
    event.preventDefault();
    this.props.addArticle(this.state.value);
    this.state.valid
      ? this.setState({ value: '', valid: false })
      : alert('invalid hyperlink');
  }

  private getValidationState(value: string) {
    const parse = parseUri(value) as any;
    const exists = this.props.articles[hash(value)];
    // Checks if valid hyperlink
    return !exists && parse.authority && parse.protocol ? true : false;
  }
}

const mapStateToProps = (state: any) => {
  return {
    articles: state.articles
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ addArticle }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddArticle);
