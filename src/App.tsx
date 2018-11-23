import * as React from 'react';
import * as Loadable from 'react-loadable';
import { BrowserRouter as Router, Route } from 'react-router-dom';
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

class App extends React.Component {
  public render() {
    return (
      <Router>
        <>
          <div style={{ height: '90vh', overflow: 'auto' }}>
            <Route exact={true} path="/" component={ListMain} />
            <Route path="/list" component={ListMain} />
            <Route path="/me" component={UserPage} />
            <Route path="/article/:id" component={ArticleView} />
            <Route path="/stats" component={StatsMain} />
          </div>
          <Nav />
        </>
      </Router>
    );
  }
}

export default App;
