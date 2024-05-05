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
  const [documentsLisita, setDocumentsLisita] = useState<lisitaDocumentCollection[]>();
  const [isLoading, setIsLoading] = useState(true);

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
    googleMapsApiKey: "TuClaveDeAPIdeGoogleMaps",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    map.setZoom(12);
    setIsLoading(false); 
  }, []);

  const onUnmount = useCallback(() => {}, []);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <MyComponent argument1={"hola"} />
        <MyForm />
        <PrintCollection documentsLisita={documentsLisita} />
      </div>
      <div style={{ width: "100%" }}>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "500px" }}>
            <CircularProgress />
          </div>
        ) : (
          isLoaded && (
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
                  key={data.id}
                  position={{
                    lat: data.location.latitude,
                    lng: data.location.longitude,
                  }}
                />
              ))}
            </GoogleMap>
          )
        )}
      </div>
    </div>
  );
}

export default App;
