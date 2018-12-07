import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import addLabel from '../actions/addLabel';
import setSort from '../actions/setSort';
import toggleShowCompleted from '../actions/toggleShowCompleted';
import Labels from './Labels';

import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Divider from '@material-ui/core/Divider';
import Grow from '@material-ui/core/Grow';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Down from '@material-ui/icons/KeyboardArrowDown';
import Up from '@material-ui/icons/KeyboardArrowUp';
import SortIcon from '@material-ui/icons/Sort';
import TitleIcon from '@material-ui/icons/SortByAlpha';
import Update from '@material-ui/icons/Update';

interface IProps {
  classes: any;
  currentSort: string;
  showCompleted: boolean;
  addLabel: (t: string) => Promise<void>;
  setSort: (t: string) => void;
  toggleShowCompleted: () => void;
}

interface IState {
  open: boolean;
  anchorEl: any;
  newProject: string;
}

class Sort extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { open: false, anchorEl: undefined, newProject: '' };
    this.handleClose = this.handleClose.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleRef = this.handleRef.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    const { classes, currentSort } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <Button
          buttonRef={this.handleRef}
          aria-owns={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
        >
          <SortIcon fontSize="small" />
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
                    <MenuItem>
                      Show Completed
                      <Switch
                        className={classes.switch}
                        color="primary"
                        checked={this.props.showCompleted}
                        onChange={this.props.toggleShowCompleted}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={
                        currentSort === 'date'
                          ? this.handleSort('date-reverse')
                          : this.handleSort('date')
                      }
                    >
                      <Update fontSize="small" /> Dated Added{' '}
                      {currentSort.startsWith('date') &&
                        (currentSort === 'date' ? <Down /> : <Up />)}
                    </MenuItem>
                    <MenuItem
                      onClick={
                        currentSort === 'title'
                          ? this.handleSort('title-reverse')
                          : this.handleSort('title')
                      }
                    >
                      <TitleIcon fontSize="small" /> Title{' '}
                      {currentSort.startsWith('title') &&
                        (currentSort === 'title' ? <Down /> : <Up />)}
                    </MenuItem>
                    <Divider />
                    <Labels />
                    <MenuItem>
                      <form onSubmit={this.handleSubmit}>
                        <Input
                          onChange={this.handleChange}
                          value={this.state.newProject}
                          margin="dense"
                          placeholder="Add Label"
                        />
                      </form>
                    </MenuItem>
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

  private handleSort = (sort: string) => () => {
    this.props.setSort(sort);
  };
  private handleChange(event: any) {
    this.setState({
      newProject: event.target.value
    });
  }

  private handleSubmit(event: any) {
    event.preventDefault();
    this.props.addLabel(this.state.newProject);
    this.setState({ newProject: '' });
  }
}

const styles = {
  options: {
    colorPrimary: '#855a91',
    zIndex: 100
  },
  root: {
    display: 'flex'
  }
};

const mapStateToProps = (state: any) => {
  return {
    currentSort: state.ui.sort,
    showCompleted: state.ui.showCompleted
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ addLabel, setSort, toggleShowCompleted }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Sort));
