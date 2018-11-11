import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';
import SortIcon from '@material-ui/icons/SortByAlpha';

interface IProps {
  classes: any;
}

interface IState {
  open: boolean;
  anchorEl: any;
}

class Sort extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { open: false, anchorEl: undefined };
    this.handleClose = this.handleClose.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }
  public render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <Button
          buttonRef={this.handleRef}
          aria-owns={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
        >
          <SortIcon />
        </Button>
        <Popper
          className={classes.options}
          open={open}
          anchorEl={this.state.anchorEl}
          transition={true}
          disablePortal={true}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList className={classes.options}>
                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                    <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }

  private handleToggle() {
    this.setState(state => ({ open: !state.open }));
  }

  private handleClose(event: any) {
    if (this.state.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  }

  private handleRef(node: any) {
    this.setState({ anchorEl: node });
  }
}

const styles = {
  options: {
    zIndex: 100
  },

  root: {
    display: 'flex'
  }
};

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Sort));
