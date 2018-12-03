import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import addArticle from '../actions/addArticle';
import hash from '../helpers/hash';
import parseUri from '../helpers/parseURI';
import { IArticle } from '../reducers/articles';
import AddArticle from './actionDispatchers/AddArticle';

interface IProps {
  addArticle: (t: string) => void;
  articles: IArticle[];
}

interface IState {
  valid: boolean;
  value: string;
}

// ask db to fetch article in background

class AddArticleForm extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = { valid: false, value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.readClipboard = this.readClipboard.bind(this);
  }

  public componentDidMount() {
    document.addEventListener('visibilitychange', this.readClipboard, false);
  }

  public componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.readClipboard, false);
  }

  public render() {
    return (
      <div id="add-article" className="aligner">
        <form onSubmit={this.handleSubmit}>
          <Input
            error={this.state.value.length > 0 && !this.state.valid}
            onChange={this.handleChange}
            value={this.state.value}
            margin="dense"
            placeholder="Save Article"
            endAdornment={
              <InputAdornment position="end">
                <AddArticle link={this.state.value} />
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

  private readClipboard() {
    // Copy from clipboard if valid article
    if (!document.hidden && (navigator as any).clipboard.readText) {
      (navigator as any).clipboard
        .readText()
        .then(
          (text: any) =>
            this.getValidationState(text)
              ? this.setState({ value: text, valid: true })
              : Promise.resolve()
        );
    }
  }
}

const mapStateToProps = (state: any) => {
  return {
    articles: state.articles
  };
};
const mapDispatch = (dispatch: any) =>
  bindActionCreators({ addArticle }, dispatch);
export default connect(
  mapStateToProps,
  mapDispatch
)(AddArticleForm);
