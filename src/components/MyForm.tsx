import React, { useState } from "react";
import {
  insertData,
  lisitaDocumentCollection,
  deleteDocument,
} from "../firebase";
import { Button, InputLabel, TextField } from "@mui/material";
import { FormControl } from "@mui/base/FormControl";

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
        <FormControl>
          <div>
            <InputLabel htmlFor="name">Nombre:</InputLabel>
            <TextField
              id="name"
              type="text"
              value={data.name}
              onChange={(e) =>
                setData((beforeData) => {
                  return { ...beforeData, name: e.target.value };
                })
              }
            />
            <InputLabel htmlFor="age">Edad:</InputLabel>
            <TextField
              id="age"
              type="number"
              value={data.age}
              onChange={(e) =>
                setData((beforeData) => {
                  return { ...beforeData, age: parseInt(e.target.value) };
                })
              }
            />
          </div>
          <Button type="submit" variant="contained" color="success">
            Guardar Datos
          </Button>
        </FormControl>
      </form>
      <Button
        variant="outlined"
        onClick={() => handleDeleteAll()}
        color="error"
      >
        Eliminar Todo
      </Button>
    </div>
  );
};

export default MyForm;
