import { database } from '../firebase';

function updateBookmarkRequested() {
  return {
    type: 'UPDATE_BOOKMARK_REQUESTED'
  };
}

function updateBookmarkRejected(reason: string) {
  return {
    reason,
    type: 'UPDATE_BOOKMARK_REJECTED'
  };
}

function updateBookmarkFulfilled(id: string, bookmark: string) {
  return {
    bookmark,
    id,
    type: 'UPDATE_BOOKMARK_FULFILLED'
  };
}

export default function updateBookmark(id: string, bookmark: string) {
  return async (dispatch: any, getState: any) => {
    dispatch(updateBookmarkRequested());
    const userRef = database
      .collection('userData')
      .doc(getState().user.uid)
      .collection('articles')
      .doc(id);

    return userRef
      .update({
        bookmark
      })
      .then(() => dispatch(updateBookmarkFulfilled(id, bookmark)))
      .catch((e: string) => dispatch(updateBookmarkRejected(e)));
  };
}
