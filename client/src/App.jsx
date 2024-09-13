import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

function App() {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");

  async function scrape() {
    const { data } = await axios.get(link);
    console.log(data);

    setLink("");
  }

  return (
    <Stack direction="column">
      <Stack direction="row">
        <TextField
          id="link"
          label="Link"
          name="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onFocus={(e) => e.target.select()}
        />
        <Button
          variant="contained"
          onClick={() => {
            scrape();
          }}
        >
          Go
        </Button>
      </Stack>
      <Typography>{link}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Temp</TableCell>
            <TableCell>.</TableCell>
            <TableCell>Avg</TableCell>
            <TableCell>Gust</TableCell>
            <TableCell>1500m</TableCell>
            <TableCell>2000m</TableCell>
            <TableCell>3000m</TableCell>
            <TableCell>4200m</TableCell>
            <TableCell>5600m</TableCell>
            <TableCell>Avg</TableCell>
            <TableCell>Gust</TableCell>
            <TableCell>1500m</TableCell>
            <TableCell>2000m</TableCell>
            <TableCell>3000m</TableCell>
            <TableCell>4200m</TableCell>
            <TableCell>5600m</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Ven. 13</TableCell>
            <TableCell>1400</TableCell>
            <TableCell>12</TableCell>
            <TableCell>SUN</TableCell>
            <TableCell>5</TableCell>
            <TableCell>10</TableCell>
            <TableCell>1</TableCell>
            <TableCell>1</TableCell>
            <TableCell>1</TableCell>
            <TableCell>1</TableCell>
            <TableCell>1</TableCell>
            <TableCell>1</TableCell>
            <TableCell>1</TableCell>
            <TableCell>1</TableCell>
            <TableCell>1</TableCell>
            <TableCell>1</TableCell>
            <TableCell>1</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  );
}

export default App;
