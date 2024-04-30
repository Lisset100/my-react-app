import React, { useState } from "react";
import {
  insertData,
  lisitaDocumentCollection,
  deleteDocument,
} from "../firebase";

const inialData = {
  id: "",
  name: "",
  age: 0,
};

export const MyForm: React.FC = () => {
  const [data, setData] = useState<lisitaDocumentCollection>(inialData);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await insertData(data);
    if (result) setData(inialData);
  };

  const handleDeleteAll = async () => {
    const result = await deleteDocument();
    if (result) setData(inialData);
  };

  return (
    <div>
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
      <button onClick={handleDeleteAll}>Eliminar Datos</button>
    </div>
  );
};

export default MyForm;
