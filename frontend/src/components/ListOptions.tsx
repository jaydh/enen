import * as React from "react";
import { connect } from "react-redux";
import { Grid, Fade } from "@material-ui/core";
import AddArticleForm from "../components/AddArticleForm";
import Search from "../components/Search";
import Save from "./actionDispatchers/Save";
import Sort from "../components/Sort";

interface IProps {
  listEmpty: boolean;
}

class ListOptions extends React.Component<IProps> {
  public render() {
    const { listEmpty } = this.props;
    return (
      <Grid
        item={true}
        spacing={40}
        alignItems="center"
        justify="center"
        container={true}
        xs={12}
        sm={12}
        md={12}
        lg={12}
      >
        <Grid
          item
          xs={12}
          sm={listEmpty ? 12 : 5}
          md={listEmpty ? 12 : 5}
          lg={listEmpty ? 12 : 5}
        >
          <AddArticleForm />
        </Grid>
        {!listEmpty && (
          <>
            {" "}
            <Fade in={!listEmpty}>
              <Grid item xs={8} sm={5} md={5} lg={2}>
                <Search />
              </Grid>
            </Fade>
            <Fade in={!listEmpty}>
              <Grid item xs={2} sm={1} md={1} lg={1}>
                <Sort />
              </Grid>
            </Fade>
            <Fade in={!listEmpty}>
              <Grid item xs={2} sm={1} md={1} lg={1}>
                <Save />
              </Grid>
            </Fade>
          </>
        )}
      </Grid>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    listEmpty: state.articles.articleIDs.length === 0
  };
};

export default connect(mapStateToProps)(ListOptions);
