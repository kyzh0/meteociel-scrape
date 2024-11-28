import {
  CircularProgress,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { APIROOT } from "../constants";
import { useNavigate, useSearchParams } from "react-router-dom";

function Search() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (!searchParams) return;

      const q = searchParams.get("q");
      if (!q) return;

      setLoading(true);
      const { data } = await axios.get(`${APIROOT}/search/?q=${q}`);
      setLoading(false);

      if (data.length === 1) {
        const temp = data[0].url.split("/");
        if (temp.length < 2) return;

        navigate(
          `../${temp[temp.length - 2]}/${temp[temp.length - 1].replace(
            ".htm",
            ""
          )}`
        );
        return;
      }

      setResults(data);
    }

    load();
  }, [searchParams, navigate]);

  return (
    <>
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
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%", p: "1rem" }}
        >
          <Table padding="none">
            <TableBody>
              {results.map((r) => {
                return (
                  <TableRow key={r.name}>
                    <TableCell sx={{ border: "none", pb: "0.3rem" }}>
                      <Link
                        href={r.url}
                        onClick={(e) => {
                          e.preventDefault();

                          const temp = e.target.href.split("/");
                          if (temp.length < 2) return;

                          navigate(
                            `../${temp[temp.length - 2]}/${temp[
                              temp.length - 1
                            ].replace(".htm", "")}`
                          );
                        }}
                      >
                        {r.name}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Stack>
      )}
    </>
  );
}

export default Search;
