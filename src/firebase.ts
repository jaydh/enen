import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
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
export const database = firebaseApp.firestore();
const settings = { timestampsInSnapshots: true };
database.settings(settings);
export const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch({ type: 'SIGN_IN', user });
    store.dispatch(getArticles());
  } else {
    store.dispatch({ type: 'SIGN_OUT' });
  }
});

export const uiConfig = {
  autoUpgradeAnonymousUsers: true,
  callbacks: {
    signInSuccessWithAuthResult: (authResult: any, redirectUrl: any) => {
      return false;
    },
    uiShown: () => {
      document.getElementById('loader')!.style.display = 'none';
    },

    signInSuccessUrl: `https://${window.location.host}/`
  },
  signInFlow: 'redirect',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
};

export const ui = new firebaseui.auth.AuthUI(firebaseApp.auth());
