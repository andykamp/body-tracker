import { doc, collection, getDoc, getDocs, setDoc, updateDoc, deleteDoc, type Firestore } from "firebase/firestore";

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
  return setDoc(docRef, data as any, { merge: true });
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
  return updateDoc(docRef, data as any);
}

async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const docRef = getDocumentRef(collectionName, id);
  return deleteDoc(docRef);
}

const crudApi = {
  db: null as unknown as Firestore,
  initializeDB,
  createDocument,
  readDocument,
  readCollection,
  updateDocument,
  deleteDocument,
}

export type CrudApi = typeof crudApi;
export default crudApi;
