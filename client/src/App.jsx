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
        {title && (
          <Stack direction="row" alignItems="center" justifyContent="center">
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
              {data.map((d) => (
                <TableRow key={`${d.day} ${d.time}`}>
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
                      <Typography variant="caption">
                        {d.wrfTemperature}
                      </Typography>
                      <Typography variant="caption">
                        {d.aromeTemperature ? d.aromeTemperature : "-"}
                      </Typography>
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
              ))}
            </TableBody>
          </Table>
        )}
      </Stack>
    </ThemeProvider>
  );
}

export default App;
