import {
  Box,
  Button,
  CircularProgress,
  createTheme,
  IconButton,
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
import { useEffect, useState } from "react";
import { APIROOT } from "./constants";
import { useNavigate, useParams } from "react-router-dom";

import SsidChartIcon from "@mui/icons-material/SsidChart";

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: "0.5rem",
      // sm breakpoint
      "@media (min-width:600px)": {
        fontSize: "0.7rem",
      },
    },
    caption: {
      fontSize: "0.7rem",
      // sm breakpoint
      "@media (min-width:600px)": {
        fontSize: "1rem",
      },
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
  const { id, name } = useParams();
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const [title, setTitle] = useState(null);
  const [data, setData] = useState(null);
  const [previewsLoading, setPreviewsLoading] = useState(false);
  const [previewsReady, setPreviewsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (!id || !name) return;

      setPreviewsReady(false);

      setLoading(true);
      const { data } = await axios.get(`${APIROOT}/${id}/${name}`);
      setLoading(false);

      setTitle(data.name);
      setData(data.data);

      document.title = data.name;
    }

    load();
  }, [id, name]);

  // load sounding previews if not mobile view
  useEffect(() => {
    if (!data || !data.length) return;

    async function load() {
      const previewsVisible = window.matchMedia("(min-width: 600px)").matches; // mui 'sm' = 600px
      if (previewsVisible) {
        for (const d of data) {
          if (d.wrfSoundingPreviewImage && d.wrfSoundingLink)
            axios.post(`${APIROOT}/load-sounding`, {
              url: d.wrfSoundingLink,
            });
        }
        setPreviewsLoading(true);
      }
    }

    load();
  }, [data]);

  // force load previews on window resize if not already loaded
  useEffect(() => {
    async function handleResize() {
      if (!data || !data.length) return;

      const previewsVisible = window.matchMedia("(min-width: 600px)").matches; // mui 'sm' = 600px
      if (previewsVisible && !previewsReady) {
        for (const d of data) {
          if (d.wrfSoundingPreviewImage && d.wrfSoundingLink)
            axios.post(`${APIROOT}/load-sounding`, {
              url: d.wrfSoundingLink,
            });
        }
        setPreviewsLoading(true);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id, name, previewsReady, data]);

  // poll to check if soundings are finished loading
  useEffect(() => {
    if (!previewsLoading || !data || !data.length) return;

    async function checkSounding() {
      for (const d of data.filter((el) => el.wrfSoundingPreviewImage)) {
        await axios.post(`${APIROOT}/check-sounding`, {
          url: d.wrfSoundingPreviewImage,
        });
      }

      setTimeout(() => {
        setPreviewsLoading(false);
        setPreviewsReady(true);
      }, 500);
    }

    checkSounding();
  }, [previewsLoading, data]);

  function handleGoClick() {
    const temp = link.split("/");
    setLink("");
    if (temp.length < 2) return;

    navigate(
      `${temp[temp.length - 2]}/${temp[temp.length - 1].replace(".htm", "")}`
    );
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

  function getWindColor(wind) {
    if (!wind) return "";

    const w = Number(wind);
    if (w < 2) {
      return "#b4e8ff";
    } else if (w < 4) {
      return "#b4f3ff";
    } else if (w < 6) {
      return "#b4feff";
    } else if (w < 8) {
      return "#b4fff5";
    } else if (w < 10) {
      return "#b4ffec";
    } else if (w < 12) {
      return "#b4ffe0";
    } else if (w < 14) {
      return "#b4ffd5";
    } else if (w < 16) {
      return "#b4ffcc";
    } else if (w < 18) {
      return "#bfffb4";
    } else if (w < 20) {
      return "#cbffb4";
    } else if (w < 22) {
      return "#dcffb4";
    } else if (w < 24) {
      return "#ecffb4";
    } else if (w < 26) {
      return "#f9ffb4";
    } else if (w < 28) {
      return "#fff3b4";
    } else if (w < 30) {
      return "#ffe5b4";
    } else if (w < 32) {
      return "#ffd6b4";
    } else if (w < 34) {
      return "#ffcab4";
    } else if (w < 36) {
      return "#ffc1b4";
    } else {
      return "#ffb4b4";
    }
  }

  let rowColor = "";
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
            onKeyUp={(e) => {
              if (e.key === "Enter") handleGoClick();
            }}
            sx={{ pr: "0.5rem" }}
          />
          <Button variant="contained" onClick={handleGoClick}>
            Go
          </Button>
        </Stack>

        {loading ? (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%", pt: "10rem" }}
          >
            <CircularProgress />
          </Stack>
        ) : (
          <Box>
            {title && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ pt: "0.7rem", pb: "0.7rem" }}
              >
                <Typography>{title}</Typography>
              </Stack>
            )}

            {data && (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="stretch"
                sx={{ height: "100%", width: "100%" }}
              >
                <Table
                  padding="none"
                  sx={{ width: { xs: "100%", sm: "60%", md: "50%" } }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        bgcolor: "#fff",
                      }}
                    >
                      <TableCell></TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography variant="subtitle1">°C</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography variant="subtitle1">2m</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography variant="subtitle1">1500m</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography variant="subtitle1">2000m</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography variant="subtitle1">3000m</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography variant="subtitle1">4200m</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography variant="subtitle1">5600m</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">em.</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((d) => {
                      if (d.time === "00:00") {
                        rowColor = rowColor ? "" : "#eeeeee";
                      }
                      return (
                        <TableRow
                          key={`${d.day} ${d.time}`}
                          sx={{ bgcolor: rowColor }}
                        >
                          <TableCell sx={{ pt: "0.3rem", pb: "0.3rem" }}>
                            <Stack
                              direction="column"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Typography variant="caption">{d.day}</Typography>
                              <Typography variant="caption">
                                {d.time}
                              </Typography>
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
                                  bgcolor: getTemperatureColor(
                                    d.wrfTemperature
                                  ),
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
                                  bgcolor: getTemperatureColor(
                                    d.aromeTemperature
                                  ),
                                }}
                              >
                                <Typography variant="caption">
                                  {d.aromeTemperature
                                    ? d.aromeTemperature
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
                              <Box
                                component="img"
                                src={d.wrfMeteoImage}
                                alt="WRF Weather Icon"
                              />
                              {d.aromeMeteoImage ? (
                                <Box
                                  component="img"
                                  src={d.aromeMeteoImage}
                                  alt="AROME Weather Icon"
                                />
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
                                <Box
                                  component="img"
                                  src={d.wrfWindDirectionImage}
                                  alt="WRF Average Wind Direction"
                                />
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="center"
                                  width="100%"
                                  sx={{
                                    bgcolor: getWindColor(d.wrfWindAverage),
                                  }}
                                >
                                  <Typography variant="caption">
                                    {d.wrfWindAverage} - {d.wrfWindGust}
                                  </Typography>
                                </Stack>
                              </Stack>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {d.aromeWindDirectionImage && (
                                  <Box
                                    component="img"
                                    src={d.aromeWindDirectionImage}
                                    alt="AROME Average Wind Direction"
                                  />
                                )}
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="center"
                                  width="100%"
                                  sx={{
                                    bgcolor: getWindColor(d.aromeWindAverage),
                                  }}
                                >
                                  <Typography variant="caption">
                                    {d.aromeWindAverage} - {d.aromeWindGust}
                                  </Typography>
                                </Stack>
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
                                <Box
                                  component="img"
                                  src={d.wrfWindDirectionImageZ850}
                                  alt="WRF Z850 Wind Direction"
                                />
                                <Typography variant="caption">
                                  {d.wrfWindAverageZ850}
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {d.aromeWindDirectionImageZ850 && (
                                  <Box
                                    component="img"
                                    src={d.aromeWindDirectionImageZ850}
                                    alt="AROME Z850 Wind Direction"
                                  />
                                )}
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
                                <Box
                                  component="img"
                                  src={d.wrfWindDirectionImageZ800}
                                  alt="WRF Z800 Wind Direction"
                                />
                                <Typography variant="caption">
                                  {d.wrfWindAverageZ800}
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {d.aromeWindDirectionImageZ800 && (
                                  <Box
                                    component="img"
                                    src={d.aromeWindDirectionImageZ800}
                                    alt="AROME Z800 Wind Direction"
                                  />
                                )}
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
                                <Box
                                  component="img"
                                  src={d.wrfWindDirectionImageZ700}
                                  alt="WRF Z700 Wind Direction"
                                />
                                <Typography variant="caption">
                                  {d.wrfWindAverageZ700}
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {d.aromeWindDirectionImageZ700 && (
                                  <Box
                                    component="img"
                                    src={d.aromeWindDirectionImageZ700}
                                    alt="AROME Z700 Wind Direction"
                                  />
                                )}
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
                                <Box
                                  component="img"
                                  src={d.wrfWindDirectionImageZ600}
                                  alt="WRF Z600 Wind Direction"
                                />
                                <Typography variant="caption">
                                  {d.wrfWindAverageZ600}
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {d.aromeWindDirectionImageZ600 && (
                                  <Box
                                    component="img"
                                    src={d.aromeWindDirectionImageZ600}
                                    alt="AROME Z600 Wind Direction"
                                  />
                                )}
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
                                <Box
                                  component="img"
                                  src={d.wrfWindDirectionImageZ500}
                                  alt="WRF Z500 Wind Direction"
                                />
                                <Typography variant="caption">
                                  {d.wrfWindAverageZ500}
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {d.aromeWindDirectionImageZ500 && (
                                  <Box
                                    component="img"
                                    src={d.aromeWindDirectionImageZ500}
                                    alt="AROME Z500 Wind Direction"
                                  />
                                )}
                                <Typography variant="caption">
                                  {d.aromeWindAverageZ500
                                    ? d.aromeWindAverageZ500
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
                              <IconButton
                                color="primary"
                                sx={{
                                  width: { xs: "18px", sm: "24px" },
                                  height: { xs: "18px", sm: "24px" },
                                  backgroundColor: "none",
                                  color: "#333333",
                                  borderRadius: "4px",
                                  "&:hover": {
                                    backgroundColor: "#f4f4f4",
                                  },
                                }}
                                href={d.wrfSoundingLink}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <SsidChartIcon
                                  sx={{
                                    transform: "rotate(270deg)",
                                    width: { xs: "14px", sm: "20px" },
                                    height: { xs: "14px", sm: "20px" },
                                  }}
                                />
                              </IconButton>
                              {d.aromeSoundingLink ? (
                                <IconButton
                                  color="primary"
                                  sx={{
                                    width: { xs: "18px", sm: "24px" },
                                    height: { xs: "18px", sm: "24px" },
                                    backgroundColor: "none",
                                    color: "#333333",
                                    borderRadius: "4px",
                                    "&:hover": {
                                      backgroundColor: "#f4f4f4",
                                    },
                                  }}
                                  href={d.aromeSoundingLink}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <SsidChartIcon
                                    sx={{
                                      transform: "rotate(270deg)",
                                      width: { xs: "14px", sm: "20px" },
                                      height: { xs: "14px", sm: "20px" },
                                    }}
                                  />
                                </IconButton>
                              ) : (
                                <Typography variant="caption">-</Typography>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {previewsReady && data && (
                  <Stack
                    direction="column"
                    justifyContent="space-around"
                    alignItems="center"
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      width: { sm: "40%", md: "50%" },
                    }}
                  >
                    {data.map((d) => {
                      return (
                        d.wrfSoundingPreviewImage && (
                          <Box
                            key={`${d.day} ${d.time}`}
                            component="a"
                            href={d.wrfSoundingLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Box
                              component="img"
                              src={d.wrfSoundingPreviewImage}
                              alt="WRF Sounding Preview"
                              sx={{ width: "100%" }}
                            />
                          </Box>
                        )
                      );
                    })}
                  </Stack>
                )}
              </Stack>
            )}
          </Box>
        )}
      </Stack>
    </ThemeProvider>
  );
}

export default App;
