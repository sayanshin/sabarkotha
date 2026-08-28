import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!projectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID. ' +
    'Set it in Vercel → Settings → Environment Variables, then redeploy.'
  );
}

// Initialize Firebase Admin (prevents re-initialization on hot reloads)
let app;
if (!getApps().length) {
  if (clientEmail && privateKey) {
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    // Falls back to default initialization if service account keys aren't set
    app = initializeApp({ projectId });
  }
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export default db;
