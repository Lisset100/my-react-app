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
import MapIcon from "@mui/icons-material/Map";
import { GeoPoint } from "@firebase/firestore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

interface PrintCollectionProps {
  documentsLisita: lisitaDocumentCollectionId[] | undefined;
  setCenter: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
}

const openGoogleMaps = (location: GeoPoint) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.latitude}%2C${location.longitude}`;
  window.open(mapsUrl, "_blank");
};

const PrintCollection = (props: PrintCollectionProps) => {
  const [copiedData, setCopiedData] = useState("");

  const copyDataToClipboard = (rowData: lisitaDocumentCollectionId) => {
    const {
      name,
      age,
      location: { location },
      id,
    } = rowData;
    navigator.clipboard
      .writeText(JSON.stringify({ name, age, ...{ location } }))
      .then(() => {
        setCopiedData(id);
        setTimeout(() => setCopiedData(""), 3000);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };

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
            {[
              "Name",
              "Age",
              "Latitude",
              "Longitude",
              "Delete",
              "Go To",
              "Open GoogleMaps",
              "Copy Data",
            ].map((data: string, id) => {
              return (
                <TableCell key={"HeadRow" + id} align="right">
                  {data}
                </TableCell>
              );
            })}
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
                  onClick={() => openGoogleMaps(row.location.location)}
                  color="success"
                  size="small"
                >
                  <MapIcon />
                  Open
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  onClick={() => copyDataToClipboard(row)}
                  color="primary"
                  size="small"
                >
                  <ContentCopyIcon />
                  Copy
                </Button>
                {copiedData === row.id && <span>Copied!</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PrintCollection;
