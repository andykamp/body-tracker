import { doc, collection, getDoc, getDocs, setDoc, updateDoc, deleteDoc, writeBatch, type WriteBatch, type DocumentData, type DocumentReference, type Firestore } from "firebase/firestore";

async function initializeDB(db: Firestore) {
  if (!crudApi.db) {
    crudApi.db = db
  }
  else console.log("crudApi.db already initialized")
}

function getDocumentRef(collectionName: string, id: string) {
  return doc(crudApi.db, collectionName, id);
}

async function readCollection<T>(collectionName: string): Promise<T[]> {
  const collectionRef = collection(crudApi.db, collectionName);
  const querySnapshot = await getDocs(collectionRef);
  const out: T[] = [];
  querySnapshot.forEach((doc) => {
    out.push(doc.data() as T);
  });

  return out;
}

async function createDocument<T>(collectionName: string, id: string, data: T): Promise<void> {
  const docRef = getDocumentRef(collectionName, id);
  return await setDoc(docRef, data as any, { merge: true });
}

async function readDocument<T>(collectionName: string, id: string): Promise<T | undefined> {
  const docRef = getDocumentRef(collectionName, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as T;
  } else {
    return undefined;
  }
}

async function updateDocument<T>(collectionName: string, id: string, data: T): Promise<void> {
  const docRef = getDocumentRef(collectionName, id);
  return await updateDoc(docRef, data as any);
}

async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const docRef = getDocumentRef(collectionName, id);
  return await deleteDoc(docRef);
}

// batch operations

const BATCH_LIMIT = 500;
type BatchOperationCallback = (
  docRef: DocumentReference<DocumentData>,
  batch: WriteBatch
) => void;

async function executeBatchedOperations(
  collectionName: string,
  data: { [id: string]: DocumentData },
  operationCallback: BatchOperationCallback
) {
  let batch = writeBatch(crudApi.db);
  let operationCount = 0;

  for (const id in data) {
    const docRef = doc(crudApi.db, collectionName, id)
    operationCallback(docRef, batch);
    operationCount++;

    if (operationCount === BATCH_LIMIT) {
      await batch.commit();
      batch = writeBatch(crudApi.db);
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    await batch.commit();
  }
}

// Set
async function setBatch(collection: string, data: { [id: string]: DocumentData }) {
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
  db: null as unknown as Firestore,
  initializeDB,
  createDocument,
  readDocument,
  readCollection,
  updateDocument,
  deleteDocument,

  executeBatchedOperations,
  setBatch,
  updateBatch,
  deleteBatch,
}

export type CrudApi = typeof crudApi;
export default crudApi;
