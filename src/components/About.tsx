import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typo from '@material-ui/core/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';

class About extends React.Component {
  public render() {
    return (
      <Grid container={true} justify="center">
        <Grid item={true}>
          <Typo variant="h3">Easily add articles for later</Typo>
          <img
            style={{ width: '60vw' }}
            src="https://firebasestorage.googleapis.com/v0/b/enen-c3566.appspot.com/o/add%20article.gif?alt=media&token=d1d744c3-dadd-486c-ae93-939abe6e7c27"
          />
        </Grid>
        <Grid item={true}>
          <Typo variant="h3">
            Automatic bookmarks for synced reading between devices
          </Typo>
          <img
            style={{ width: '60vw' }}
            src="https://firebasestorage.googleapis.com/v0/b/enen-c3566.appspot.com/o/bookmark.gif?alt=media&token=618551f0-783a-4301-8f9a-79bca11d7921"
          />
        </Grid>
        <Grid item={true}>
          <Typo variant="h3">Embedded reader for skimming linked articles</Typo>
          <img
            style={{ width: '60vw' }}
            src="https://firebasestorage.googleapis.com/v0/b/enen-c3566.appspot.com/o/embed.gif?alt=media&token=37dab8e2-bab4-44b7-b0ca-e42ed250df19"
          />
        </Grid>
        <Grid
          item={true}
          container={true}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          justify="center"
        >
          <Grid item={true}>
            <Link to="/list">
              <Button variant="fab" color="primary">
                Try Anonymously
              </Button>
            </Link>
          </Grid>
          <Grid item={true}>
            <Link to="/list">
              <Button variant="fab" color="primary">
                Create account
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default About;
