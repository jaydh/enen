import * as React from 'react';
import { connect } from 'react-redux';

import loader from '../helpers/loader';
const AddArticle = loader(() => import('../components/AddArticle'));
const List = loader(() => import('../components/List'));
const Search = loader(() => import('../components/Search'));
const Sort = loader(() => import('../components/Sort'));

import Grid from '@material-ui/core/Grid';

interface IProps {
  listEmpty: boolean;
}

class ListMain extends React.Component<IProps> {
  public render() {
    const { listEmpty } = this.props;
    return (
      <Grid container={true} alignItems="center" justify="center">
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
          <Grid item={true}>
            <AddArticle />
          </Grid>
          {!listEmpty && (
            <>
              <Grid item={true}>
                <Search />
              </Grid>
              <Grid item={true}>
                <Sort />
              </Grid>
            </>
          )}
        </Grid>
        <Grid
          item={true}
          container={true}
          justify="center"
          xs={4}
          sm={4}
          md={9}
          lg={7}
        >
          <List />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    listEmpty: state.articles.articles.length === 0
  };
};

export default connect(mapStateToProps)(ListMain);
