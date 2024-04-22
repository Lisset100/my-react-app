import { useEffect, useState } from "react";
import { getLisitaCollection, db, lisitaDocumentCollection } from "./firebase";
import PrintCollection from "./components/PrintCollection";
import { MyForm } from "./components/MyForm";

function App() {
  const [documentsLisita, setDocumentsLisita] =
    useState<lisitaDocumentCollection[]>();
  useEffect(() => {
    getLisitaCollection(db).then((data) => setDocumentsLisita(data));
  }, []);
  return (
    <>
      <MyForm />
      {documentsLisita?.map((document, index) => (
        <PrintCollection key={index} collection={document} />
      ))}
    </>
  );
}

export default App;
