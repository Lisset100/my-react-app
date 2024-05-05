import React, { useState } from "react";
import {
  insertData,
  lisitaDocumentCollection,
  deleteDocument,
} from "../firebase";
import { Button, InputLabel, TextField } from "@mui/material";
import { FormControl } from "@mui/base/FormControl";
import { GeoPoint } from "firebase/firestore";

const inialData = {
  id: "",
  place: "",
  age: 0,
  location: {
    latitude: 0,
    longitude: 0,
    isEqual: (_other: GeoPoint) => true,
    toJSON: () => ({
      latitude: 0,
      longitude: 0,
    }),
  },
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
            <InputLabel htmlFor="place">Lugar:</InputLabel>
            <TextField
              id="place"
              type="text"
              value={data.place}
              onChange={(e) =>
                setData((beforeData) => {
                  return { ...beforeData, place: e.target.value };
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
          <div>
            <Button type="submit" variant="contained" color="success" style={{display: "inline-grid"}}>
              Guardar Datos
            </Button>
            <Button
          variant="outlined"
          onClick={() => handleDeleteAll()}
          color="error"
          style={{display: "inline-grid", marginLeft: "350px"}}
        >
          Eliminar Todo
        </Button>
        
        </div>
      
      </FormControl>
      </form>
    </div>
  );
};

export default MyForm;
