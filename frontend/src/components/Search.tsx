import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core';
import Filter from '@material-ui/icons/FilterList';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import setSearch from '../actions/setSearch';

interface IProps {
  value: string;
  setSearch: (t: string) => void;
  classes: any;
}

const styles = { root: {} };

class Search extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  public render() {
    const { classes } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          className={classes.root}
          onChange={this.handleChange}
          value={this.props.value}
          margin="dense"
          placeholder="Search"
          endAdornment={
            <InputAdornment position="end">
              <Filter fontSize="small" />
            </InputAdornment>
          }
          inputProps={{
            'aria-label': 'Search'
          }}
        />
      </form>
    );
  }

  private handleChange(event: any) {
    this.props.setSearch(event.target.value);
  }

  private handleSubmit(event: any) {
    event.preventDefault();
  }
}

const mapStateToProps = (state: any) => {
  return { value: state.ui.search };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ setSearch }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Search));
