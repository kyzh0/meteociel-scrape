import {
  Button,
  createTheme,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { APIROOT } from "./constants";

const theme = createTheme({
  typography: {
    caption: {
      fontSize: "0.6rem",
    },
  },
});

function App() {
  const [link, setLink] = useState("");
  const [data, setData] = useState(null);

  async function scrape() {
    const temp = link.split("/");
    setLink("");
    if (temp.length < 2) return;

    const { data } = await axios.get(
      `${APIROOT}/${temp[temp.length - 2]}/${temp[temp.length - 1].replace(
        ".htm",
        ""
      )}`
    );

    setData(data);
  }

  return (
    <ThemeProvider theme={theme}>
      <Stack direction="column">
        <Stack direction="row">
          <TextField
            id="link"
            label="link"
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
        {data && <Typography>{data.name}</Typography>}
        {data && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: 0 }}></TableCell>
                <TableCell sx={{ padding: 0 }}>
                  <Typography variant="caption">°C</Typography>
                </TableCell>
                <TableCell sx={{ padding: 0 }}></TableCell>
                <TableCell sx={{ padding: 0 }}>
                  <Typography variant="caption">2m</Typography>
                </TableCell>
                <TableCell sx={{ padding: 0 }}>
                  <Typography variant="caption">1500m</Typography>
                </TableCell>
                <TableCell sx={{ padding: 0 }}>
                  <Typography variant="caption">2000m</Typography>
                </TableCell>
                <TableCell sx={{ padding: 0 }}>
                  <Typography variant="caption">3000m</Typography>
                </TableCell>
                <TableCell sx={{ padding: 0 }}>
                  <Typography variant="caption">4200m</Typography>
                </TableCell>
                <TableCell sx={{ padding: 0 }}>
                  <Typography variant="caption">5600m</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.wrf.map((d) => (
                <TableRow key={`${d.day} ${d.time}`}>
                  <TableCell sx={{ padding: 0 }}>
                    <Stack
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="caption">{d.day}</Typography>
                      <Typography variant="caption">{d.time}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <Typography variant="caption">{d.temperature}</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <img src={d.meteoImage} />
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <img src={d.windDirectionImage} />
                      <Typography variant="caption">
                        {d.windAverage} - {d.windGust}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <Typography variant="caption">
                      {d.windAverageZ850}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <Typography variant="caption">
                      {d.windAverageZ800}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <Typography variant="caption">
                      {d.windAverageZ700}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <Typography variant="caption">
                      {d.windAverageZ600}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <Typography variant="caption">
                      {d.windAverageZ500}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Stack>
    </ThemeProvider>
  );
}

export default App;
