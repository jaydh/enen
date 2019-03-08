import * as React from "react";

import loader from "../helpers/loader";
const List = loader(() => import("../components/List"));
const ListOptions = loader(() => import("../components/ListOptions"));
import { Grid } from "@material-ui/core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import getArticles from "../actions/article/getArticles";
import { validateToken } from "../actions/user/validateToken";

interface IProps {
  getArticles: () => void;
  validateToken: () => void;
}

class ListMain extends React.Component<IProps> {
  public async componentDidMount() {
    this.props.validateToken();
    this.props.getArticles();
  }
  public render() {
    return (
      <Grid container={true} alignItems="center" justify="center">
        <ListOptions />
        <Grid
          item={true}
          container={true}
          justify="center"
          xs={12}
          sm={10}
          md={9}
          lg={7}
        >
          <List />
        </Grid>
      </Grid>
    );
  }
}
const mapDispatch = (dispatch: any) =>
  bindActionCreators({ getArticles, validateToken }, dispatch);
export default connect(
  undefined,
  mapDispatch
)(ListMain);
