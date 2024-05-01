import { useEffect, useState } from "react";
import { db, lisitaDocumentCollection } from "./firebase";
import PrintCollection from "./components/PrintCollection";
import { MyForm } from "./components/MyForm";
import { onSnapshot, collection } from "@firebase/firestore";

function App() {
  const [documentsLisita, setDocumentsLisita] =
    useState<lisitaDocumentCollection[]>();
  console.log(documentsLisita[0].location);

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
    <div>
      <MyForm />
      {documentsLisita?.map?.((document, index) => (
        <PrintCollection key={index} collection={document} />
      ))}
    </div>
  );
}

export default App;
