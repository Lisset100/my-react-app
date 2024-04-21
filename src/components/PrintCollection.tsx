import React from "react";
import { lisitaDocumentCollection } from "./firebase";

interface PrintCollectionProps {
  collection: lisitaDocumentCollection;
}

const PrintCollection: React.FC<PrintCollectionProps> = (props) => {
  return (
    <h1>
      Hola soy {props.collection.name} y tengo {props.collection.age}
    </h1>
  );
};

export default PrintCollection;
