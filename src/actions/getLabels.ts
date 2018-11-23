import { database } from '../firebase';

export default () => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: 'GET_LABELS_REQUESTED' });
    const user = getState().user.uid;
    if (user) {
      const ref = database.collection('userData').doc(user);
      const labels = await ref
        .get()
        .then((doc: any) => (doc.exists ? doc.data().labels : null));
      dispatch({ type: 'GET_LABELS_FULFILLED', labels });
    }
  };
};
