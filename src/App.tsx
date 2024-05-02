import { useCallback, useEffect, useState } from "react";
import { db, handleDeleteOnlyOne, lisitaDocumentCollection } from "./firebase";
import { MyForm } from "./components/MyForm";
import { onSnapshot, collection } from "@firebase/firestore";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const center = {
  lat: 20.587805,
  lng: -100.387108,
};

function App() {
  const [documentsLisita, setDocumentsLisita] =
    useState<lisitaDocumentCollection[]>();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lisita"), (snapshot) => {
      setDocumentsLisita(
        snapshot.docs.map((data) => {
          return { ...data.data(), id: data.id } as lisitaDocumentCollection;
        })
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "GoogleMapsApiKey",
    googleMapsApiKey: "AIzaSyCrbQkZChVHat_uiZDKIhJxOuYHLpY7kAc",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (map) map.setZoom(12);
  }, [map]);

  const onLoad = useCallback((map: google.maps.Map) => {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div>
        <MyForm />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {["Name", "Age", "Latitude", "Longitude", "Delete"].map(
                  (data: string) => {
                    return <TableCell align="right">{data}</TableCell>;
                  }
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {documentsLisita?.map((row, id) => (
                <TableRow
                  key={"row" + id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right">{row.name}</TableCell>
                  <TableCell align="right">{row.age}</TableCell>
                  <TableCell align="right">{row.location.latitude}</TableCell>
                  <TableCell align="right">{row.location.longitude}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      onClick={() => handleDeleteOnlyOne(row.id)}
                      color="error"
                    >
                      Eliminar Datos
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div
        style={{
          width: "100%",
        }}
      >
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{
              margin: "auto",
              width: "100%",
              height: "500px",
            }}
            center={center}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Child components, such as markers, info windows, etc. */}
            {documentsLisita?.map((data) => (
              <Marker
                position={{
                  lat: data.location.latitude,
                  lng: data.location.longitude,
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default App;
