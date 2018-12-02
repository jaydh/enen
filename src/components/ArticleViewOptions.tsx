import * as React from 'react';
import { connect } from 'react-redux';
import FollowLink from './actionDispatchers/FollowLink';
import SetFontSize from './actionDispatchers/SetFontSize';
import ToggleCompleted from './actionDispatchers/ToggleCompleted';

interface IProps {
  id?: string;
  link?: string;
}

class Options extends React.Component<IProps> {
  public render() {
    const { id, link } = this.props;
    return id && link ? (
      <>
        <FollowLink link={link} />
        <ToggleCompleted id={id} />
        <SetFontSize />
      </>
    ) : null;
  }
}

const mapStateToProps = (state: any) => {
  const lastArticle = state.ui.lastArticle;
  return {
    id: lastArticle ? lastArticle.id : undefined,
    link: lastArticle ? lastArticle.link : undefined
  };
};

export default connect(mapStateToProps)(Options);
