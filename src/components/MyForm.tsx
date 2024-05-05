import React, { useState } from "react";
import {
  insertData,
  lisitaDocumentCollection,
  deleteDocument,
} from "../firebase";
import { Button, TextField } from "@mui/material";
import { FormControl } from "@mui/base/FormControl";
import { GeoPoint } from "firebase/firestore";
import { StandaloneSearchBox } from "@react-google-maps/api";

const initialData = {
  id: "",
  name: "",
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

interface MyFormProps {
  isLoaded: boolean;
}

export const MyForm: React.FC<MyFormProps> = (props) => {
  const [data, setData] = useState<lisitaDocumentCollection>(initialData);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await insertData(data);
    if (result) setData(initialData);
  };

  const handleDeleteAll = async () => {
    const result = await deleteDocument();
    if (result) setData(initialData);
  };
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <div>
            <TextField
              id="name"
              type="text"
              label={"Name"}
              value={data.name}
              onChange={(e) =>
                setData((beforeData) => {
                  return { ...beforeData, name: e.target.value };
                })
              }
            />
            <TextField
              id="age"
              type="number"
              label={"Age"}
              value={data.age}
              onChange={(e) =>
                setData((beforeData) => ({
                  ...beforeData,
                  age: parseInt(e.target.value),
                }))
              }
            />
            {props.isLoaded && (
              <StandaloneSearchBox
                onPlacesChanged={() =>
                  searchBox?.getPlaces()?.forEach((data) => {
                    console.log("=====>data", data);
                  })
                }
                onLoad={(ref) => {
                  setSearchBox(ref);
                }}
              >
                <TextField fullWidth label="Location" variant="outlined" />
              </StandaloneSearchBox>
            )}
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
