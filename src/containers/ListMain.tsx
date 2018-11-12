import * as React from 'react';
import { connect } from 'react-redux';
import AddArticle from '../components/AddArticle';
import List from '../components/List';
import Search from '../components/Search';
import Sort from '../components/Sort';

import Grid from '@material-ui/core/Grid';

interface IProps {
  listEmpty: boolean;
}

class ListMain extends React.Component<IProps> {
  public render() {
    const { listEmpty } = this.props;
    return (
      <>
        <Grid
          container={true}
          spacing={40}
          alignItems="center"
          justify="center"
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
        <Grid container={true} style={{ height: '90vh' }}>
          <Grid item={true}>
            <List />
          </Grid>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    listEmpty: state.articles.articles.length === 0
  };
};

export default connect(mapStateToProps)(ListMain);
