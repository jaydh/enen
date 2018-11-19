import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import * as firebaseui from 'firebaseui';
import getArticles from './actions/getArticles';
import { store } from './index';

const config = {
  apiKey: 'AIzaSyB7kVd6i9DQo4yeldW1jqU-tjS4VIuUphY',
  authDomain: 'enen-c3566.firebaseapp.com',
  databaseURL: 'https://enen-c3566.firebaseio.com',
  messagingSenderId: '615274053731',
  projectId: 'enen-c3566',
  storageBucket: 'enen-c3566.appspot.com'
};

export const provider = new firebase.auth.GoogleAuthProvider();
const firebaseApp = firebase.initializeApp(config);
const functions = firebase.functions();
const deleteUser = functions.httpsCallable('deleteUser');

export const database = firebaseApp.firestore();
const settings = { timestampsInSnapshots: true };
database.settings(settings);
export const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

firebase.auth().onAuthStateChanged((user: any) => {
  if (user) {
    store.dispatch({ type: 'SIGN_IN', user });
    store.dispatch(getArticles());
  } else {
    store.dispatch({ type: 'SIGN_OUT' });
    auth.signInAnonymously();
  }
});

export const uiConfig = {
  autoUpgradeAnonymousUsers: true,
  callbacks: {
    signInFailure: async (error: any) => {
      if (error.code !== 'firebaseui/anonymous-upgrade-merge-conflict') {
        return Promise.resolve();
      }
      // Store old data
      const tempUser = store.getState().user;
      const tempRef = database.collection('userData').doc(tempUser.uid);
      const data = await tempRef
        .collection('articles')
        .get()
        .then((querySnapshot: any) => {
          const temp: any = [];
          querySnapshot.forEach((doc: any) => temp.push(doc.data()));
          return temp;
        });

      // The credential the user tried to sign in with.
      const cred = error.credential;
      await firebase.auth().signInWithCredential(cred);
      const uid = firebase.auth().currentUser!.uid;
      const newRef = database
        .collection('userData')
        .doc(uid)
        .collection('articles');

      // Merge new data and then request delete
      return Promise.all(data.map((t: any) => newRef.doc(t.id).set(t))).then(
        () => deleteUser({ uid: tempUser.uid })
      );
    },
    signInSuccessWithAuthResult: (authResult: any, redirectUrl: any) => {
      return false;
    },
    uiShown: () => {
      document.getElementById('loader')!.style.display = 'none';
    },

    signInSuccessUrl: `https://${window.location.host}/`
  } as any,
  signInFlow: 'redirect',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
};
export const ui = new firebaseui.auth.AuthUI(firebaseApp.auth());
