import { useEffect, useState } from "react";
import { db, handleDeleteOnlyOne, lisitaDocumentCollection } from "./firebase";
import { MyForm } from "./components/MyForm";
import { onSnapshot, collection } from "@firebase/firestore";
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
  return (
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
  );
}

export default App;
