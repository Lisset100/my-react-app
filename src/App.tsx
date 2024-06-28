import { useCallback, useEffect, useState } from "react";
import { db, lisitaDocumentCollection } from "./firebase";
import { MyForm, initialData } from "./components/MyForm";
import { onSnapshot, collection, GeoPoint } from "@firebase/firestore";
import { useJsApiLoader, Marker, GoogleMap } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";

import { MyComponent } from "./components/MyComponent";
import PrintCollection from "./components/PrintCollection";
import { Grid } from "@mui/material";
import ReactDOMServer from "react-dom/server";
import * as Icons from "@mui/icons-material";

const initCenter = {
  lat: 20.587805,
  lng: -100.387108,
};

export interface lisitaDocumentCollectionId extends lisitaDocumentCollection {
  id: string;
}

export type IconNames = keyof typeof Icons;
console.log("=========================>1")
const svgIconToDataUrl = (IconComponent: IconNames) => {
  const MyIcon = Icons[IconComponent];
  const iconString = ReactDOMServer.renderToString(<MyIcon />);
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(iconString, "image/svg+xml");
  return svgDoc.querySelector("path")?.getAttribute("d") as string;
};

export const YOUR_GOOGLE_MAPS_API_KEY =
  "AIzaSyCrbQkZChVHat_uiZDKIhJxOuYHLpY7kAc";

const libraries = ["places"] as Library[];
function App() {
  const [data, setData] = useState<lisitaDocumentCollection>(initialData);

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
      <Grid item sm={6}>
        <MyComponent argument1={"hola"} />
        <MyForm
          isLoaded={isLoaded}
          setCenter={setCenter}
          data={data}
          setData={setData}
          documentsLisita={documentsLisita}
        />
        <PrintCollection
          documentsLisita={documentsLisita}
          setCenter={setCenter}
        />
      </Grid>
      <Grid item sm={6}>
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
            onClick={(event) => {
              setData((data) => {
                const latLngJson = event.latLng?.toJSON();
                if (latLngJson?.lat && latLngJson.lng) {
                  return {
                    ...data,
                    location: {
                      ...data.location,
                      location: new GeoPoint(latLngJson.lat, latLngJson.lng),
                    },
                  };
                }
                return data;
              });
              console.log(".........data", event.latLng?.toJSON());
            }}
            onUnmount={onUnmount}
          >
            {/* Child components, such as markers, info windows, etc. */}
            {documentsLisita?.map((data, id) => (
              <Marker
                icon={{
                  path: svgIconToDataUrl(data.location.type),
                  fillColor: "#fff",
                  strokeColor: "#d32f2f",
                  strokeWeight: 2,
                  fillOpacity: 1,
                  scale: 1,
                }}
                key={"marker" + id}
                position={{
                  lat: data.location.location.latitude,
                  lng: data.location.location.longitude,
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
