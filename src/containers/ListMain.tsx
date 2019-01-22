import * as React from "react";

import loader from "../helpers/loader";
const List = loader(() => import("../components/List"));
const ListOptions = loader(() => import("../components/ListOptions"));
import { Grid } from "@material-ui/core";

export default class ListMain extends React.Component {
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
