import React, { useRef, useState } from "react";
import {
  insertData,
  lisitaDocumentCollection,
  deleteDocument,
} from "../firebase";
import { Button, Grid, TextField } from "@mui/material";
import { FormControl } from "@mui/base/FormControl";
import { GeoPoint } from "firebase/firestore";
import { StandaloneSearchBox } from "@react-google-maps/api";

const initialData = {
  name: "",
  age: 0,
  location: new GeoPoint(0, 0),
};

interface MyFormProps {
  isLoaded: boolean;
  setCenter: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
}

export const MyForm: React.FC<MyFormProps> = (props) => {
  const [data, setData] = useState<lisitaDocumentCollection>(initialData);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await insertData(data);
    if (result) {
      setData(initialData);
      props.setCenter({
        lat: data.location.latitude,
        lng: data.location.longitude,
      });
      if (searchBoxRef.current) searchBoxRef.current.value = "";
    }
  };

  const handleDeleteAll = async () => {
    const result = await deleteDocument();
    if (result) setData(initialData);
  };
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);

  const searchBoxRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                fullWidth
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
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
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
            </Grid>
            <Grid item xs={12}>
              {props.isLoaded && (
                <StandaloneSearchBox
                  onPlacesChanged={() => {
                    searchBox?.getPlaces()?.forEach((data) => {
                      const location = data.geometry?.location?.toJSON();
                      if (location) {
                        setData((data) => ({
                          ...data,
                          location: new GeoPoint(location.lat, location.lng),
                        }));
                      }
                    });
                  }}
                  onLoad={(ref) => {
                    setSearchBox(ref);
                  }}
                >
                  <TextField
                    fullWidth
                    label="Location"
                    variant="outlined"
                    placeholder=""
                    inputRef={searchBoxRef}
                  />
                </StandaloneSearchBox>
              )}{" "}
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="success">
            Save Data
          </Button>
        </FormControl>
      </form>
      <Button
        variant="outlined"
        onClick={() => handleDeleteAll()}
        color="error"
      >
        Delete All
      </Button>
    </div>
  );
};

export default MyForm;
