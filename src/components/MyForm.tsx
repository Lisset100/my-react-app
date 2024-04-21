import React, { useState } from "react";
import { insertData } from "./firebase";

export const MyForm: React.FC = () => {
  const [nombre, setNombre] = useState<string>("");
  const [edad, setEdad] = useState<number>(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await insertData({ name: nombre, age: edad });
    if (result) {
      setNombre("");
      setEdad(0);
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
