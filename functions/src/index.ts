import * as functions from 'firebase-functions';
import * as scrape from 'scrape-metadata';

import { JSDOM } from 'jsdom';
import * as readability from 'readability-node';
const Readability = readability.Readability;

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
