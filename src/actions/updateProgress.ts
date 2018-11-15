import { database } from '../firebase';

function updateProgressRequested() {
  return {
    type: 'UPDATE_PROGRESS_REQUESTED'
  };
}

function updateProgressRejected(reason: string) {
  return {
    reason,
    type: 'UPDATE_PROGRESS_REJECTED'
  };
}

function updateProgressCompleted(id: string, progress: number) {
  return {
    id,
    progress,
    type: 'UPDATE_PROGRESS_FULFILLED'
  };
}

export default function updateBookmark(id: string, progress: number) {
  return async (dispatch: any, getState: any) => {
    dispatch(updateProgressRequested());
    const userRef = database
      .collection('userData')
      .doc(getState().user.uid)
      .collection('articles')
      .doc(id);

    return userRef
      .update({
        progress
      })
      .then(() => dispatch(updateProgressCompleted(id, progress)))
      .catch((e: string) => dispatch(updateProgressRejected(e)));
  };
}
