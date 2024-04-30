import React from "react";
import { handleDeleteOnlyOne, lisitaDocumentCollection } from "../firebase";

interface PrintCollectionProps {
  collection: lisitaDocumentCollection;
}

const PrintCollection: React.FC<PrintCollectionProps> = (props) => {
  return (
    <h1>
      Hola soy {props.collection.name} y tengo {props.collection.age}
      <button onClick={() => handleDeleteOnlyOne(props.collection.id)}>
        Eliminar Datos
      </button>
    </h1>
  );
};

export default PrintCollection;
