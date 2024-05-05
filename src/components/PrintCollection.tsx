import { handleDeleteOnlyOne, lisitaDocumentCollection } from "../firebase";
import Button from "@mui/material/Button";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface PrintCollectionProps {
  documentsLisita: lisitaDocumentCollection[] | undefined;
}

const PrintCollection = (props: PrintCollectionProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {["Name", "Age", "Latitude", "Longitude", "Delete"].map(
              (data: string, id) => {
                return (
                  <TableCell key={"HeadRow" + id} align="right">
                    {data}
                  </TableCell>
                );
              }
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.documentsLisita?.map((row, id) => (
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
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PrintCollection;
