import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [link, setLink] = useState("");
  const navigate = useNavigate();

  function handleGoClick() {
    const regex = /https:\/\/www.meteociel.com\/previsions\/\d+\/.+.htm/g;
    if (link && link.match(regex)) {
      const temp = link.split("/");
      setLink("");
      if (temp.length < 2) return;

      navigate(
        `${temp[temp.length - 2]}/${temp[temp.length - 1].replace(".htm", "")}`
      );
    } else {
    }
  }

  return (
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
  );
}

export default SearchBar;
