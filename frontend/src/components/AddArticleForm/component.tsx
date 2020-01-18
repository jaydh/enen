import { Grid, Input, InputAdornment } from "@material-ui/core";
import * as React from "react";
import { IArticle } from "../../reducers/articles";
import AddArticle from "../actionDispatchers/AddArticle";
import parseUri from "../../helpers/parseURI";

interface IProps {
  addArticle: (t: string) => (dispatch: any, getState: any) => Promise<void>;
  articles: IArticle[];
}

interface IState {
  valid: boolean;
  value: string;
}

class AddArticleForm extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = { valid: false, value: "" };
  }

  public componentDidMount() {
    document.addEventListener("visibilitychange", this.readClipboard, false);
  }

  public componentWillUnmount() {
    document.removeEventListener("visibilitychange", this.readClipboard, false);
  }

  public render() {
    return (
      <Grid container justify="center">
        <Grid item>
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
                "aria-label": "Save article"
              }}
            />
          </form>
        </Grid>
      </Grid>
    );
  }

  private handleChange = (event: any) => {
    this.setState({
      valid: this.getValidationState(event.target.value),
      value: event.target.value
    });
  };

  private handleSubmit = (event: any) => {
    event.preventDefault();
    this.props.addArticle(this.state.value);
    this.state.valid
      ? this.setState({ value: "", valid: false })
      : alert("invalid hyperlink");
  };

  private getValidationState = (value: string) => {
    const parse = parseUri(value) as any;
    const exists = false;
    // Checks if valid hyperlink
    return !exists && parse.authority && parse.protocol ? true : false;
  };

  private readClipboard = () => {
    // Copy from clipboard if valid article
    if (!document.hidden && (navigator as any).clipboard.readText) {
      (navigator as any).clipboard
        .readText()
        .then((text: any) =>
          this.getValidationState(text)
            ? this.setState({ value: text, valid: true })
            : Promise.resolve()
        );
    }
  };
}

export default AddArticleForm;
