import { useCallback, useEffect, useState } from "react";
import { db, lisitaDocumentCollection } from "./firebase";
import { MyForm } from "./components/MyForm";
import { onSnapshot, collection } from "@firebase/firestore";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MyComponent } from "./components/MyComponent";
import PrintCollection from "./components/PrintCollection";
import CircularProgress from '@mui/material/CircularProgress';

const center = {
  lat: 20.587805,
  lng: -100.387108,
};

function App() {
  const [documentsLisita, setDocumentsLisita] = useState<lisitaDocumentCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "lisita"), (snapshot) => {
      setDocumentsLisita(
        snapshot.docs.map((data) => {
          return { ...data.data(), id: data.id } as lisitaDocumentCollection;
        })
      );
      setLoading(false);
    }, error => {
      setError(error.message);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "GoogleMapsApiKey",
    googleMapsApiKey: "AIzaSyCrbQkZChVHat_uiZDKIhJxOuYHLpY7kAc",
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
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <MyComponent argument1={"hola"} />
        <MyForm />
        <PrintCollection documentsLisita={documentsLisita} />
      </div>
      <div style={{ position: "relative", width: "100%", height: "500px" }}>
        {loading && (
          <CircularProgress
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
        <div style={{ width: "100%", height: "100%" }}>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "100%",
              }}
              center={center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {/* Child components, such as markers, info windows, etc. */}
              {documentsLisita.map((data) => (
                <Marker
                  key={data.id}
                  position={{
                    lat: data.location.latitude,
                    lng: data.location.longitude,
                  }}
                />
              ))}
            </GoogleMap>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;