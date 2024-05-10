import { initializeApp } from "firebase/app";
import {
  Firestore,
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  GeoPoint,
} from "firebase/firestore";
import { IconNames } from "./App";

export enum TypeLocation {
  HOME = "Home",
  STORE = "LocalConvenienceStore",
}

export interface lisitaDocumentCollection {
  name: string;
  age: number;
  location: {
    type: IconNames;
    location: GeoPoint;
  };
}

const firebaseConfig = {
  apiKey: "AIzaSyByCUJuf6ugF8zvSc5lZaTD6IRTlQHjcxM",
  authDomain: "proyecto-edu-y-lis.firebaseapp.com",
  projectId: "proyecto-edu-y-lis",
  storageBucket: "proyecto-edu-y-lis.appspot.com",
  messagingSenderId: "424222507932",
  appId: "1:424222507932:web:aa99070a8b04ec78ddbe59",
  measurementId: "G-QGN8QQK6N2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function getLisitaCollection(db: Firestore) {
  const citiesCol = collection(db, "lisita");
  const citySnapshot = await getDocs(citiesCol);
  return citySnapshot.docs.map((doc) =>
    doc.data()
  ) as lisitaDocumentCollection[];
}

export const insertData = async (data: lisitaDocumentCollection) => {
  try {
    await addDoc(collection(db, "lisita"), data);
    console.log("¡Datos guardados exitosamente!");
    return true;
  } catch (error) {
    console.error("Error al guardar los datos", error);
  }
};

export const deleteDocument = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "lisita"));
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
      console.log("¡Documento eliminado exitosamente!");
    });
    return true;
  } catch (error) {
    console.error("Error al eliminar el documento", error);
    return false;
  }
};

export const handleDeleteOnlyOne = async (id: string) => {
  try {
    await deleteDoc(doc(db, "lisita", id));
    return true;
  } catch (error) {
    console.error("Error al eliminar el documento", error);
    return false;
  }
};
