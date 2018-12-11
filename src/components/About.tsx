import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typo from '@material-ui/core/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';
import bookmark from '../static/bookmark.gif';
import embed from '../static/embed.gif';
import save from '../static/save.gif';

interface IProps {
  classes: any;
}

class About extends React.Component<IProps> {
  public render() {
    const { classes } = this.props;
    return (
      <Grid container={true} justify="center">
        <Grid
          className={classes.item}
          xs={12}
          sm={12}
          md={10}
          lg={8}
          item={true}
        >
          <Card className={classes.card}>
            <CardMedia className={classes.media} image={save} />
            <CardContent>
              <Typo gutterBottom={true} variant="h5" component="h2">
                Easily Save Articles
              </Typo>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          className={classes.item}
          xs={12}
          sm={12}
          md={10}
          lg={8}
          item={true}
        >
          <Card className={classes.card}>
            <CardMedia className={classes.media} image={bookmark} />
            <CardContent>
              <Typo gutterBottom={true} variant="h5" component="h2">
                Automatic bookmarks for synced reading between devices
              </Typo>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          className={classes.item}
          xs={12}
          sm={12}
          md={10}
          lg={8}
          item={true}
        >
          <Card className={classes.card}>
            <CardMedia className={classes.media} image={embed} />
            <CardContent>
              <Typo gutterBottom={true} variant="h5" component="h2">
                Embedded reader for skimming linked articles
              </Typo>
            </CardContent>
          </Card>
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
const styles = {
  card: {
    minWidth: 275
  },
  item: {
    padding: '2em'
  },
  media: {
    minHeight: 600
  },
  title: {
    fontSize: 14
  }
};
export default withStyles(styles)(About);
