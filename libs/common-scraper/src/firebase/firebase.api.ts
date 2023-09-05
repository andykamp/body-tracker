import * as admin from 'firebase-admin';

// @note: this is only for server-side usage
// use the common crud.api.ts for client-side usage

const BATCH_LIMIT = 500;

// InitializeDB function
async function initializeDB(db: admin.firestore.Firestore) {
  if (!crudApi.db) {
    crudApi.db = db;
  } else {
    console.log("crudApi.db already initialized");
  }
}
type BatchOperationCallback = (
  docRef: admin.firestore.DocumentReference,
  batch: admin.firestore.WriteBatch
) => void;

async function executeBatchedOperations(
  collectionName: string,
  data: { [id: string]: admin.firestore.DocumentData },
  operationCallback: BatchOperationCallback
) {
  let batch = admin.firestore().batch();
  let operationCount = 0;

  for (const id in data) {
    console.log('iddd',id );
    const docRef = admin.firestore().collection(collectionName).doc(id);
    operationCallback(docRef, batch);
    operationCount++;

    if (operationCount === BATCH_LIMIT) {
      await batch.commit();
      batch = admin.firestore().batch();
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    await batch.commit();
  }
}

// Set
async function setBatch(collection: string, data: { [id: string]: admin.firestore.DocumentData }) {
  await executeBatchedOperations(collection, data, (docRef, batch) => {
    batch.set(docRef, data[docRef.id]);
  });
}

// Update
async function updateBatch(collection: string, data: { [id: string]: any }) {
  await executeBatchedOperations(collection, data, (docRef, batch) => {
    batch.update(docRef, data[docRef.id]);
  });
}

// Delete
async function deleteBatch(collection: string, data: { [id: string]: any }) {
  await executeBatchedOperations(collection, data, (docRef, batch) => {
    batch.delete(docRef);
  });
}

const crudApi = {
  db: null as admin.firestore.Firestore | null,
  initializeDB,

  executeBatchedOperations,
  setBatch,
  updateBatch,
  deleteBatch,
}

export type CrudApi = typeof crudApi;
export default crudApi;
