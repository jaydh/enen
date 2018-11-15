import * as React from 'react';
import { connect } from 'react-redux';
import FollowLink from './actionDispatchers/FollowLink';
import SetFontSize from './actionDispatchers/SetFontSize';
import ToggleCompleted from './actionDispatchers/ToggleCompleted';

interface IProps {
  id: string;
}

class Options extends React.Component<IProps> {
  public render() {
    const { id } = this.props;
    return (
      <>
        <FollowLink id={id} />
        <ToggleCompleted id={id} />
        <SetFontSize />
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { id: state.ui.lastArticle };
};

export default connect(mapStateToProps)(Options);
