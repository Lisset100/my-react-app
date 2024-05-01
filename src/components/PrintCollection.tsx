import React from "react";
import { handleDeleteOnlyOne, lisitaDocumentCollection } from "../firebase";
import Button from "@mui/material/Button";

interface PrintCollectionProps {
  collection: lisitaDocumentCollection;
}

const PrintCollection: React.FC<PrintCollectionProps> = (props) => {
  return (
    <h1>
      Hola soy {props.collection.name} y tengo {props.collection.age}
      <Button
        variant="contained"
        onClick={() => handleDeleteOnlyOne(props.collection.id)}
        color="error"
      >
        Eliminar Datos
      </Button>
    </h1>
  );
};

export default PrintCollection;
