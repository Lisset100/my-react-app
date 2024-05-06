import { useCallback, useEffect, useState } from "react";
import { db, lisitaDocumentCollection } from "./firebase";
import { MyForm } from "./components/MyForm";
import { onSnapshot, collection } from "@firebase/firestore";
import { useJsApiLoader, Marker, GoogleMap } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";

import { MyComponent } from "./components/MyComponent";
import PrintCollection from "./components/PrintCollection";
import { Grid } from "@mui/material";

const initCenter = {
  lat: 20.587805,
  lng: -100.387108,
};

export interface lisitaDocumentCollectionId extends lisitaDocumentCollection {
  id: string;
}

export const YOUR_GOOGLE_MAPS_API_KEY =
  "AIzaSyCrbQkZChVHat_uiZDKIhJxOuYHLpY7kAc";

const libraries = ["places"] as Library[];
function App() {
  const [documentsLisita, setDocumentsLisita] =
    useState<lisitaDocumentCollectionId[]>();

  const [center, setCenter] = useState(initCenter);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lisita"), (snapshot) => {
      setDocumentsLisita(
        snapshot.docs.map((data) => {
          return { ...data.data(), id: data.id } as lisitaDocumentCollectionId;
        })
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const { isLoaded, loadError: _loadError } = useJsApiLoader({
    id: "GoogleMapsApiKey",
    googleMapsApiKey: YOUR_GOOGLE_MAPS_API_KEY,
    libraries,
    language: "es",
  });

  const [_map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    map.setZoom(12);
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <MyComponent argument1={"hola"} />
        <MyForm isLoaded={isLoaded} setCenter={setCenter} />
        <PrintCollection
          documentsLisita={documentsLisita}
          setCenter={setCenter}
        />
      </Grid>
      <Grid item xs={6}>
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
            {documentsLisita?.map((data, id) => (
              <Marker
                key={"marker" + id}
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
      </Grid>
    </Grid>
  );
}

export default App;
