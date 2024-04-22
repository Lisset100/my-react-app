import React, { useState } from "react";
import { db, lisitaDocumentCollection } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const MyForm: React.FC = () => {
  const [nombre, setNombre] = useState<string>("");
  const [edad, setEdad] = useState<number>(0);

  const insertData = async (data: lisitaDocumentCollection) => {
    await addDoc(collection(db, "lisita"), data);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await insertData({ name: nombre, age: edad });
      setNombre("");
      setEdad(0);

      console.log("¡Datos guardados exitosamente!");
    } catch (error) {
      console.error("Error al guardar los datos", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </label>
      <br />
      <label>
        Edad:
        <input
          type="number"
          value={edad}
          onChange={(e) => setEdad(parseInt(e.target.value))}
        />
      </label>
      <br />
      <button type="submit">Guardar Datos</button>
    </form>
  );
};

export default MyForm;
