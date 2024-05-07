import { handleDeleteOnlyOne } from "../firebase";
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
import { lisitaDocumentCollectionId } from "../App";
import MapIcon from '@mui/icons-material/Map';

interface PrintCollectionProps {
  documentsLisita: lisitaDocumentCollectionId[] | undefined;
  setCenter: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
}
const openGoogleMaps = () => {
  const mapsUrl = 'https://www.google.com/maps';
  window.open(mapsUrl, '_blank');
};

const PrintCollection = (props: PrintCollectionProps) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table
        stickyHeader
        sx={{ minWidth: 650 }}
        aria-label="sticky table"
        size="small"
      >
        <TableHead>
          <TableRow>
            {["Name", "Age", "Latitude", "Longitude", "Delete", "Go To", "Open GoogleMaps"].map(
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
              <TableCell align="right">
                {row.location.location.latitude}
              </TableCell>
              <TableCell align="right">
                {row.location.location.longitude}
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  onClick={() => handleDeleteOnlyOne(row.id)}
                  color="error"
                  size="small"
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  onClick={() =>
                    props.setCenter({
                      lat: row.location.location.latitude,
                      lng: row.location.location.longitude,
                    })
                  }
                  color="primary"
                  size="small"
                >
                  Go To
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  onClick={openGoogleMaps}
                  
                  
                  color="success"
                  size="small"
                >
                  <MapIcon/>
                  Open 
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
