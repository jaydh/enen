import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { JSDOM } from 'jsdom';
import * as scrape from 'scrape-metadata';
import * as readability from 'readability-node';

const Readability = readability.Readability;
const config = {
  apiKey: 'AIzaSyB7kVd6i9DQo4yeldW1jqU-tjS4VIuUphY',
  authDomain: 'enen-c3566.firebaseapp.com',
  databaseURL: 'https://enen-c3566.firebaseio.com',
  messagingSenderId: '615274053731',
  projectId: 'enen-c3566',
  storageBucket: 'enen-c3566.appspot.com'
};
admin.initializeApp(config);

exports.getMetadata = functions.firestore
  .document('articleDB/{id}')
  .onCreate(async (change, context) => {
    await change.ref.set({ fetching: true }, { merge: true });

    const link = change.data().link;
    const metadata = await new Promise(function(resolve, reject) {
      scrape(link, (err, meta) => resolve(meta));
    });
    const HTMLData = await JSDOM.fromURL(link, {}).then(dom => {
      const loc = dom.window.location;
      const uri = {
        spec: loc.href,
        host: loc.host,
        prePath: loc.protocol + '//' + loc.host,
        scheme: loc.protocol.substr(0, loc.protocol.indexOf(':')),
        pathBase:
          loc.protocol +
          '//' +
          loc.host +
          loc.pathname.substr(0, loc.pathname.lastIndexOf('/') + 1)
      };
      const parsed = new Readability(uri, dom.window.document).parse();
      return parsed.content;
    });
    return change.ref.set(
      {
        metadata,
        HTMLData,
        fetching: false
      },
      { merge: true }
    );
  });

exports.deleteUser = functions.https.onCall((data, context) => {
  const userRef = admin
    .firestore()
    .collection('userData')
    .doc(data.uid);
  return deleteCollection(userRef.collection('articles'), 20).then(() =>
    userRef.delete()
  );
});

function deleteCollection(ref, batchSize) {
  const query = ref.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, batchSize, resolve, reject);
  });
}

function deleteQueryBatch(query, batchSize, resolve, reject) {
  query
    .get()
    .then(snapshot => {
      // When there are no documents left, we are done
      if (snapshot.size === 0) {
        return 0;
      }

      // Delete documents in a batch
      const batch = admin.firestore().batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then(numDeleted => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}
