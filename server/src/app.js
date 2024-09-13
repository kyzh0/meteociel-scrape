import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.get("/:id/:name/basic", async (req, res) => {
  const { id, name } = req.params;
  const { data } = await axios.get(
    `https://www.meteociel.com/previsions-wrf-1h/${id}/${name}.htm`
  );

  const result = {};

  if (data.length) {
    // name
    const matches = data.match(/<title>.+<\/title>/g);
    if (matches && matches.length == 1) {
      const i = matches[0].indexOf("pour ") + 5;
      const j = matches[0].indexOf(") -") + 1;
      result.name = matches[0].slice(i, j);
    }

    // basic meteo data
    // const meteo = {};
    // let start =
    //   data.indexOf('<td rowspan=15 align="center" valign="center">') + 46;
    // let end = data.indexOf("</td></tr></table><br><table width=100%");
    // const days = data
    //   .slice(start, end)
    //   .replaceAll(/<td rowspan=\d+ align="center" valign="center">/g);
    // let j = data.indexOf("</td>", i);
    // let date = data.slice(i, j).replaceAll("<br>", " ").trim();
  }

  res.json(result);
});

const port = process.env.NODE_PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
