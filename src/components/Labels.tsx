import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import setLabel from '../actions/setLabel';

import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import IconB from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Delete from '@material-ui/icons/Delete';

// tslint:disable:max-classes-per-file

interface IProps {
  labels: [];
  onSet: (t: string) => void;
}

interface IState {
  showOptions: boolean;
}

class Labels extends React.Component<IProps, IState> {
  public render() {
    const { labels, onSet } = this.props;
    return (
      <>
        {labels.map((t: string) => (
          <Label setHandler={onSet} key={'label' + t} label={t} />
        ))}
      </>
    );
  }
}

interface ILabel {
  label: string;
  setHandler: (t: string) => void;
}

class Label extends React.Component<ILabel, IState> {
  constructor(props: ILabel) {
    super(props);
    this.state = { showOptions: false };
    this.toggleShow = this.toggleShow.bind(this);
    this.onSet = this.onSet.bind(this);
  }
  public render() {
    const { label } = this.props;
    const { showOptions } = this.state;

    return (
      <MenuItem onMouseEnter={this.toggleShow} onMouseLeave={this.toggleShow}>
        <Grid container={true} alignItems="center">
          <Grid item={true} xs={9} sm={9} md={9} lg={9}>
            <Button onClick={this.onSet} variant="flat">
              {label}
            </Button>
          </Grid>
          <Grid item={true} xs={2} sm={2} md={2} lg={2}>
            <Fade in={showOptions}>
              <IconB color="secondary">
                <Delete />
              </IconB>
            </Fade>
          </Grid>
        </Grid>
      </MenuItem>
    );
  }
  private toggleShow() {
    this.setState({ showOptions: !this.state.showOptions });
  }
  private onSet() {
    this.props.setHandler(this.props.label);
  }
}

const mapState = (state: any) => {
  return { labels: state.articles.labels };
};

const mapDispatch = (dispatch: any) => {
  return bindActionCreators({ onSet: setLabel }, dispatch);
};

export default connect(
  mapState,
  mapDispatch
)(Labels);
