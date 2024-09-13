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
      fontSize: "0.7rem",
    },
  },
  palette: {
    primary: {
      main: "#303030",
      contrastText: "#fff",
    },
  },
});

function App() {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState(null);
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

    setTitle(data.name);
    setData(data.data);
  }

  function getTemperatureColor(temperature) {
    if (!temperature) return "";

    const t = Number(temperature);
    if (t < -10) {
      return "#eeb4ff";
    } else if (t < -8) {
      return "#dfb4ff";
    } else if (t < -6) {
      return "#ceb4ff";
    } else if (t < -4) {
      return "#bcb4ff";
    } else if (t < -2) {
      return "#b4baff";
    } else if (t < 0) {
      return "#b4cbff";
    } else if (t < 2) {
      return "#b4daff";
    } else if (t < 4) {
      return "#b4ecff";
    } else if (t < 6) {
      return "#b4fcff";
    } else if (t < 8) {
      return "#b4fff4";
    } else if (t < 10) {
      return "#b4ffdf";
    } else if (t < 12) {
      return "#b4ffcc";
    } else if (t < 14) {
      return "#b4ffbe";
    } else if (t < 16) {
      return "#b6ffb4";
    } else if (t < 18) {
      return "#c1ffb4";
    } else if (t < 20) {
      return "#ccffb4";
    } else if (t < 22) {
      return "#d5ffb4";
    } else if (t < 24) {
      return "#dfffb4";
    } else if (t < 26) {
      return "#e9ffb4";
    } else if (t < 28) {
      return "#f4ffb4";
    } else if (t < 30) {
      return "#feffb4";
    } else if (t < 32) {
      return "#fff0b4";
    } else if (t < 34) {
      return "#ffe3b4";
    } else if (t < 36) {
      return "#ffd7b4";
    } else {
      return "ffcab4";
    }
  }

  let color = "";
  return (
    <ThemeProvider theme={theme}>
      <Stack direction="column" width="100%" height="100%">
        <Stack direction="row" width="100%" justifyContent="space-between">
          <TextField
            fullWidth
            size="small"
            id="link"
            label="link"
            name="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onFocus={(e) => e.target.select()}
            sx={{ pr: "0.5rem" }}
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
        {title && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ pt: "1rem", pb: "1rem" }}
          >
            <Typography>{title}</Typography>
          </Stack>
        )}
        {data && (
          <Table padding="none">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="caption">°C</Typography>
                  </Stack>
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="caption">2m</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="caption">1500m</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="caption">2000m</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="caption">3000m</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="caption">4200m</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="caption">5600m</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((d) => {
                if (d.time == "00:00") {
                  color = color ? "" : "#eeeeee";
                }
                return (
                  <TableRow key={`${d.day} ${d.time}`} sx={{ bgcolor: color }}>
                    <TableCell sx={{ pt: "0.3rem", pb: "0.3rem" }}>
                      <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography variant="caption">{d.day}</Typography>
                        <Typography variant="caption">{d.time}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          width="100%"
                          sx={{
                            bgcolor: getTemperatureColor(d.wrfTemperature),
                          }}
                        >
                          <Typography variant="caption">
                            {d.wrfTemperature}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          width="100%"
                          sx={{
                            bgcolor: getTemperatureColor(d.aromeTemperature),
                          }}
                        >
                          <Typography variant="caption">
                            {d.aromeTemperature ? d.aromeTemperature : "-"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <img src={d.wrfMeteoImage} />
                        {d.aromeMeteoImage ? (
                          <img src={d.aromeMeteoImage} />
                        ) : (
                          <Typography variant="caption">-</Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src={d.wrfWindDirectionImage} />
                          <Typography variant="caption">
                            {d.wrfWindAverage} - {d.wrfWindGust}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src={d.aromeWindDirectionImage} />
                          <Typography variant="caption">
                            {d.aromeWindAverage} - {d.aromeWindGust}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src={d.wrfWindDirectionImageZ850} />
                          <Typography variant="caption">
                            {d.wrfWindAverageZ850}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src={d.aromeWindDirectionImageZ850} />
                          <Typography variant="caption">
                            {d.aromeWindAverageZ850
                              ? d.aromeWindAverageZ850
                              : "-"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src={d.wrfWindDirectionImageZ800} />
                          <Typography variant="caption">
                            {d.wrfWindAverageZ800}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src={d.aromeWindDirectionImageZ800} />
                          <Typography variant="caption">
                            {d.aromeWindAverageZ800
                              ? d.aromeWindAverageZ800
                              : "-"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src={d.wrfWindDirectionImageZ700} />
                          <Typography variant="caption">
                            {d.wrfWindAverageZ700}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src={d.aromeWindDirectionImageZ700} />
                          <Typography variant="caption">
                            {d.aromeWindAverageZ700
                              ? d.aromeWindAverageZ700
                              : "-"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src={d.wrfWindDirectionImageZ600} />
                          <Typography variant="caption">
                            {d.wrfWindAverageZ600}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src={d.aromeWindDirectionImageZ600} />
                          <Typography variant="caption">
                            {d.aromeWindAverageZ600
                              ? d.aromeWindAverageZ600
                              : "-"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src={d.wrfWindDirectionImageZ500} />
                          <Typography variant="caption">
                            {d.wrfWindAverageZ500}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img src={d.aromeWindDirectionImageZ500} />
                          <Typography variant="caption">
                            {d.aromeWindAverageZ500
                              ? d.aromeWindAverageZ500
                              : "-"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Stack>
    </ThemeProvider>
  );
}

export default App;
