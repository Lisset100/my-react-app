import React, { useRef, useState } from "react";
import {
  insertData,
  lisitaDocumentCollection,
  deleteDocument,
  TypeLocation,
} from "../firebase";
import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FormControl } from "@mui/base/FormControl";
import { GeoPoint } from "firebase/firestore";
import { StandaloneSearchBox } from "@react-google-maps/api";

const initialData = {
  name: "",
  age: 0,
  location: {
    type: TypeLocation.HOME,
    location: new GeoPoint(0, 0),
  },
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
        lat: data.location.location.latitude,
        lng: data.location.location.longitude,
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
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <FormControl>
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
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
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
            </FormControl>
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
                        location: {
                          ...data.location,
                          location: new GeoPoint(location.lat, location.lng),
                        },
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
            )}
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <InputLabel id="select-icon-label">Type</InputLabel>
              <Select
                fullWidth
                defaultValue={TypeLocation.HOME}
                labelId="select-icon-label"
                id="select-icon"
                value={data.location.type}
                label="Type"
                onChange={(e) => {
                  setData((data) => ({
                    ...data,
                    location: {
                      ...data.location,
                      type: e.target.value as TypeLocation,
                    },
                  }));
                }}
              >
                {Object.entries(TypeLocation).map((data) => (
                  <MenuItem value={data[1]}>{data[0]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          paddingTop={3}
          paddingBottom={3}
        >
          <Button type="submit" variant="contained" color="success">
            Save Data
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleDeleteAll()}
            color="error"
          >
            Delete All
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default MyForm;
