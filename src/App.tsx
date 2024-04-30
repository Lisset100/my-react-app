import { useEffect, useState } from "react";
import { db, lisitaDocumentCollection } from "./firebase";
import PrintCollection from "./components/PrintCollection";
import { MyForm } from "./components/MyForm";
import { onSnapshot, collection } from "@firebase/firestore";

function App() {
  const [documentsLisita, setDocumentsLisita] =
    useState<lisitaDocumentCollection[]>();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lisita"), (snapshot) => {
      setDocumentsLisita(
        snapshot.docs.map((data) => {
          return { ...data.data(), id: data.id } as lisitaDocumentCollection;
        })
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <>
      <MyForm />
      {documentsLisita?.map?.((document, index) => (
        <PrintCollection key={index} collection={document} />
      ))}
    </>
  );
}

export default App;
