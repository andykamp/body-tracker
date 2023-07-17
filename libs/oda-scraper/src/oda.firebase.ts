import crudApi from "@/oda-scraper/firebase/firebase.api";
import admin from "firebase-admin"
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync(process.env.SERVICE_ACCOUNT_PATH, 'utf8'));
console.log('serviceAccount', serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get a reference to the Firestore service
const db = admin.firestore();
console.log('db', db);


const SHOULD_CONNECT_TO_EMULATOR = true
if (SHOULD_CONNECT_TO_EMULATOR) {
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });
}


// initilize database
crudApi.initializeDB(db);

function storeProducts(products: any) {
  crudApi.setBatch('oda_products', products)
}


const firebaseCrudApi = {
  storeProducts
}

export type FirebaseCrudApi = typeof firebaseCrudApi
export default firebaseCrudApi
