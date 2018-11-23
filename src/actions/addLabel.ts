import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { database } from '../firebase';

export default function addLabel(label: string) {
  return async (dispatch: any, getState: any) => {
    const userRef = database.collection('userData').doc(getState().user.uid);

    return userRef
      .update({
        labels: firebase.firestore.FieldValue.arrayUnion(label)
      })
      .then(() => dispatch({ type: 'ADD_LABEL_FULFILLED', label }));
  };
}
