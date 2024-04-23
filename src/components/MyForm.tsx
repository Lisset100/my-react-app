import React, { useState, useEffect } from "react";
import { insertData, lisitaDocumentCollection } from "../firebase";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

export const db = getFirestore();

const inialData = {
  name: "",
  age: 0,
};

export const MyForm: React.FC = () => {
  const [data, setData] = useState<lisitaDocumentCollection>(inialData);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lisita"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          setData(change.doc.data() as lisitaDocumentCollection);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await insertData(data);
    if (result) setData(inialData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input
          type="text"
          value={data.name}
          onChange={(e) =>
            setData((beforeData) => {
              return { ...beforeData, name: e.target.value };
            })
          }
        />
      </label>
      <br />
      <label>
        Edad:
        <input
          type="number"
          value={data.age}
          onChange={(e) =>
            setData((beforeData) => {
              return { ...beforeData, age: parseInt(e.target.value) };
            })
          }
        />
      </label>
      <br />
      <button type="submit">Guardar Datos</button>
    </form>
  );
};

export default MyForm;
