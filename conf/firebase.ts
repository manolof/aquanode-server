import * as firebase from 'firebase-admin';

import serviceAccount from './firestore-service-account';

const app = firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount as any),
});

const firestore = firebase.firestore(app);
firestore.settings({
	timestampsInSnapshots: true,
});

const temperatureLogCollection = firestore.collection('temperatureLog');

export {
	temperatureLogCollection,
};
