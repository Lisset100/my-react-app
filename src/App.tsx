import { useEffect, useState } from "react";
import { getCities, db, lisitaDocumentCollection } from "./firebase";
import Welcome from "./Welcome";

function App() {
  const [documentsLisita, setDocumentsLisita] =
    useState<lisitaDocumentCollection[]>();
  useEffect(() => {
    getCities(db).then((data) => {
      //data.map((data)=>{console.log("data:", data)})
      setDocumentsLisita(data);
    });
  }, []);
  return (
    <>
      {documentsLisita?.map((document, index) => (
        <Welcome key={index} nombre={document.name} />
      ))}
    </>
  );
}

export default App;
