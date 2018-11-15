import * as React from 'react';
import * as Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import getArticles from './actions/getArticles';
import Loader from './components/Loader';
import './index.css';

const ListMain = Loadable({
  loader: () => import('./containers/ListMain'),
  loading: Loader as any
});
const UserPage = Loadable({
  loader: () => import('./containers/UserPage'),
  loading: Loader as any
});
const ArticleView = Loadable({
  loader: () => import('./components/ArticleView'),
  loading: Loader as any
});
const StatsMain = Loadable({
  loader: () => import('./containers/StatsMain'),
  loading: Loader as any
});
const Nav = Loadable({
  loader: () => import('./components/Nav'),
  loading: Loader as any
});

class App extends React.Component<{ getArticles: () => void }> {
  public componentDidMount() {
    this.props.getArticles();
  }
  public render() {
    return (
      <Router>
        <>
          <Route exact={true} path="/" component={ListMain} />
          <Route path="/list" component={ListMain} />
          <Route path="/me" component={UserPage} />
          <Route path="/article/:id" component={ArticleView} />
          <Route path="/stats" component={StatsMain} />
          <Nav />
        </>
      </Router>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ getArticles }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(App);
