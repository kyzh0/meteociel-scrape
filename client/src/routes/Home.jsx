import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleGoClick() {
    const regex = /https:\/\/www\.meteociel\.com\/.+\/\d+\/.+.htm/g;
    if (query && query.match(regex)) {
      const temp = query.split("/");
      setQuery("");
      if (temp.length < 2) return;

      navigate(
        `${temp[temp.length - 2]}/${temp[temp.length - 1].replace(".htm", "")}`
      );
    } else {
      navigate(`search/?q=${query}`);
    }
  }

  return (
    <Stack direction="column" width="100%" height="100%">
      <Stack direction="row" width="100%" justifyContent="space-between">
        <TextField
          fullWidth
          size="small"
          id="search"
          label="search"
          name="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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

      <Outlet />
    </Stack>
  );
}

export default SearchBar;
