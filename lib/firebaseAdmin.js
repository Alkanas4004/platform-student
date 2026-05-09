import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
    databaseURL: "https://date-student-default-rtdb.firebaseio.com",
  });
}

const db = admin.database();

export { db };
