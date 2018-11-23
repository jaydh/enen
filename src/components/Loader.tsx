import * as React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

export default (props: any) =>
  props.pastDelay ? (
    <Grid container={true} alignItems="center" justify="center">
      <CircularProgress />
    </Grid>
  ) : null;
