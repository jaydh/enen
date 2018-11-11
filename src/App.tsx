import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import getArticles from './actions/getArticles';
import AddArticle from './components/AddArticle';
import ArticleView from './components/ArticleView';
import List from './components/List';
import Login from './components/Login';
import Nav from './components/Nav';
import Search from './components/Search';
import Sort from './components/Sort';
import User from './components/User';
import './index.css';

import Grid from '@material-ui/core/Grid';

import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends React.Component<{ signedIn: boolean }> {
  public render() {
    return (
      <Router>
        <div className="App">
          <Route path="/list" component={ListMain} />
          <Route path="/me" component={UserPage} />
          <Route path="/article/:id" component={ArticleView} />
          <Nav />
        </div>
      </Router>
    );
  }
}

const ListMain = (match: any) => (
  <>
    <Grid container={true} spacing={40} alignItems="center" justify="center">
      <Grid item={true}>
        <AddArticle />
      </Grid>
      <Grid item={true}>
        <Search />
      </Grid>
      <Grid item={true}>
        <Sort />
      </Grid>
    </Grid>
    <List />
  </>
);

const UserPage = () => (
  <Grid container={true} justify="center" alignItems="center">
    <Grid item={true}>
      <User />
    </Grid>
    <Grid item={true}>
      <Login />
    </Grid>
  </Grid>
);

const mapStateToProps = (state: any) => {
  return {
    signedIn: state.user.signedIn
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ getArticles }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
