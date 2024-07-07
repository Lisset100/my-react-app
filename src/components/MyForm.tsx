import { FormControl } from "@mui/base/FormControl";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { GeoPoint } from "firebase/firestore";
import { json2csv } from "json-2-csv";
import React, { useRef, useState } from "react";
import { lisitaDocumentCollectionId } from "../App";
import {
  deleteDocument,
  insertData,
  lisitaDocumentCollection,
  TypeLocation,
} from "../firebase";

export const initialData = {
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
  data: lisitaDocumentCollection;
  setData: React.Dispatch<React.SetStateAction<lisitaDocumentCollection>>;
  documentsLisita: lisitaDocumentCollectionId[] | undefined;
}

export const MyForm: React.FC<MyFormProps> = (props) => {
  const [switchTypeSearch, setSwitchTypeSearch] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await insertData(props.data);
    if (result) {
      props.setData(initialData);
      props.setCenter({
        lat: props.data.location.location.latitude,
        lng: props.data.location.location.longitude,
      });
      if (searchBoxRef.current) searchBoxRef.current.value = "";
    }
  };

  const handleDeleteAll = async () => {
    const result = await deleteDocument();
    if (result) props.setData(initialData);
  };
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);

  const searchBoxRef = useRef<HTMLInputElement>(null);

  function formatArray() {
    const result = props.documentsLisita?.map?.((data) => {
      const location = data.location.location.toJSON();
      return {
        age: data.age,
        name: data.name,
        ...location,
      };
    });
    if (result) {
      return json2csv(result, {
        emptyFieldValue: "", // Set empty strings for null or undefined fields
      });
    }
    return "";
  }

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
                value={props.data.name}
                onChange={(e) =>
                  props.setData((beforeData) => ({
                    ...beforeData,
                    name: e.target.value,
                  }))
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
                value={props.data.age}
                onChange={(e) =>
                  props.setData((beforeData) => ({
                    ...beforeData,
                    age: parseInt(e.target.value),
                  }))
                }
              />
            </FormControl>
          </Grid>

          <Grid container alignItems="center" item xs={12}>
            <Grid item>
              <Typography fontSize="20px" variant="body1" component="span" style={{ marginRight: '8px' }}>
                Location
              </Typography>
            </Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={switchTypeSearch}
                  onChange={() => {
                    setSwitchTypeSearch((data) => !data);
                  }}
                  name="gilad"
                />
              }
              label="Select on Map"
            />
          </Grid>
          {props.isLoaded && !switchTypeSearch && (
            <Grid item xs={12}>
              <StandaloneSearchBox
                onPlacesChanged={() => {
                  searchBox?.getPlaces()?.forEach((data) => {
                    const location = data.geometry?.location?.toJSON();
                    if (location) {
                      props.setData((data) => ({
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
                  label="Type the location or select on the map"
                  variant="outlined"
                  placeholder=""
                  inputRef={searchBoxRef}
                />
              </StandaloneSearchBox>
            </Grid>
          )}
          {switchTypeSearch && (
            <>
              <Grid item xs={6}>
                <TextField
                  disabled
                  required
                  id="outlined-required"
                  label="latitude"
                  defaultValue="0"
                  placeholder=""
                  fullWidth
                  value={props.data.location.location.latitude}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled
                  id="outlined-disabled"
                  label="Longitude"
                  defaultValue="0"
                  placeholder=""
                  fullWidth
                  value={props.data.location.location.longitude}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <FormControl>
              <FormLabel sx={{ fontSize: '1.2rem', color: 'black', marginBottom: '10px' }} id="select-icon-label">Type</>
              <Select
                fullWidth
                defaultValue={TypeLocation.HOME}
                labelId="select-icon-label"
                id="select-icon"
                value={props.data.location.type}
                label="Type"
                onChange={(e) => {
                  props.setData((data) => ({
                    ...data,
                    location: {
                      ...data.location,
                      type: e.target.value as TypeLocation,
                    },
                  }));
                }}
              >
                {Object.entries(TypeLocation).map((data, index) => (
                  <MenuItem key={"menu" + index} value={data[1]}>
                    {data[0]}
                  </MenuItem>
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
          <Button
            type="submit"
            variant="contained"
            color="success"
            endIcon={<SaveIcon />}
          >
            Save Data
          </Button>
          <Grid container item justifyContent="space-between" xs={6}>
            <Button
              variant="outlined"
              onClick={() => {
                const blob = new Blob([formatArray()], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                // Create a link to download it
                const pom = document.createElement("a");
                pom.href = url;
                pom.setAttribute("download", "filename.csv");
                pom.click();
              }}
              color="success"
              endIcon={<CloudDownloadIcon />}
              disabled={!props.documentsLisita?.length}
            >
              Download
            </Button>

            <Button
              variant="outlined"
              onClick={() => handleDeleteAll()}
              color="error"
              disabled={!props.documentsLisita?.length}
              endIcon={<DeleteIcon />}
            >
              Delete All
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default MyForm;
