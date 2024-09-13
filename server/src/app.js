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
    let matches = data.match(/<title>.+<\/title>/g);
    if (matches && matches.length == 1) {
      const i = matches[0].indexOf("pour ") + 5;
      const j = matches[0].indexOf(") -") + 1;
      result.name = matches[0].slice(i, j);
    }

    // basic data
    const start =
      data.indexOf('<td rowspan=15 align="center" valign="center">') + 46;
    const end = data.indexOf("</td></tr></table><br><table width=100%");
    const dayTexts = data
      .slice(start, end)
      .replaceAll(/<td rowspan=\d+ align="center" valign="center">/g, "|")
      .split("|");

    result.data = [];
    for (const dayText of dayTexts) {
      const day = dayText
        .slice(0, dayText.indexOf("<br></td>"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let i = 1; i < hourTexts.length; i++) {
        const text = hourTexts[i];
        const dataPoint = {
          day: day,
          time: text.slice(0, 5),
        };

        // temperature
        matches = text.match(/>-?\d+.+C</g);
        if (matches && matches.length == 1) {
          dataPoint.temperature = matches[0].slice(1, matches[0].indexOf(" "));
        }

        result.data.push(dataPoint);
      }
    }
  }

  res.json(result);
});

const port = process.env.NODE_PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
