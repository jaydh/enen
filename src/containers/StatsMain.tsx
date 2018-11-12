import * as React from 'react';
import Graph from '../components/Graph';

import Grid from '@material-ui/core/Grid';

class StatsMain extends React.Component {
  public render() {
    return (
      <Grid container={true} justify="center" alignItems="center">
        <Grid item={true}>
          <Graph />
        </Grid>
      </Grid>
    );
  }
}

export default StatsMain;
