import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.get("/:id/:name", async (req, res) => {
  const { id, name } = req.params;
  const result = {};

  // basic data
  let { data } = await axios.get(
    `https://www.meteociel.com/previsions-wrf-1h/${id}/${name}.htm`
  );

  if (data.length) {
    // name
    let matches = data.match(/<title>.+<\/title>/g);
    if (matches && matches.length == 1) {
      const i = matches[0].indexOf("pour ") + 5;
      const j = matches[0].indexOf(") -") + 1;
      result.name = matches[0].slice(i, j);
    }

    let start =
      data.indexOf('<td rowspan=15 align="center" valign="center">') + 46;
    let end = data.indexOf("</td></tr></table><br><table width=100%");
    const dayTexts = data
      .slice(start, end)
      .replaceAll(/<td rowspan=\d+ align="center" valign="center">/g, "|")
      .split("|");

    result.wrf = [];
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

        // wind dir img
        start = text.indexOf("src='") + 5;
        end = text.indexOf("' alt", start);
        dataPoint.windDirectionImage = text.slice(start, end);

        // wind avg + gust
        matches = text.slice(end).match(/>\d+</g);
        if (matches && matches.length == 2) {
          dataPoint.windAverage = matches[0].replace(">", "").replace("<", "");
          dataPoint.windGust = matches[1].replace(">", "").replace("<", "");
        }

        // meteo img
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("'>", start);
        dataPoint.meteoImage = text.slice(start, end);

        result.wrf.push(dataPoint);
      }
    }
  }

  // high altitude
  ({ data } = await axios.get(
    `https://www.meteociel.com/previsions-haute-altitude-wrf-1h/${id}/${name}.htm`
  ));

  if (data.length) {
    let start =
      data.indexOf('<td rowspan=15 align="center" valign="center">') + 46;
    let end = data.indexOf("</td></tr></table><br><table width=100%");
    const dayTexts = data
      .slice(start, end)
      .replaceAll(/<td rowspan=\d+ align="center" valign="center">/g, "|")
      .split("|");

    for (const dayText of dayTexts) {
      const day = dayText
        .slice(0, dayText.indexOf("<br></td>"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let i = 1; i < hourTexts.length; i++) {
        const text = hourTexts[i];
        const dataPoint = result.wrf.find(
          (x) => x.day == day && x.time == text.slice(0, 5)
        );

        if (!dataPoint) continue;

        // skip first column (2m)
        start = text.indexOf("src='") + 5;
        end = text.indexOf("' alt", start);

        // wind dir img z850
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.windDirectionImageZ850 = text.slice(start, end);

        // wind dir img z800
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.windDirectionImageZ800 = text.slice(start, end);

        // wind dir img z700
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.windDirectionImageZ700 = text.slice(start, end);

        // wind dir img z600
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.windDirectionImageZ600 = text.slice(start, end);

        // wind dir img z500
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.windDirectionImageZ500 = text.slice(start, end);

        // wind avg
        const matches = text.match(/>\s\d+</g);
        if (matches && matches.length == 6) {
          // skip 2m value
          dataPoint.windAverageZ850 = matches[1]
            .replace(">", "")
            .replace("<", "")
            .trim();
          dataPoint.windAverageZ800 = matches[2]
            .replace(">", "")
            .replace("<", "")
            .trim();
          dataPoint.windAverageZ700 = matches[3]
            .replace(">", "")
            .replace("<", "")
            .trim();
          dataPoint.windAverageZ600 = matches[4]
            .replace(">", "")
            .replace("<", "")
            .trim();
          dataPoint.windAverageZ500 = matches[5]
            .replace(">", "")
            .replace("<", "")
            .trim();
        }
      }
    }
  }

  res.json(result);
});

const port = process.env.NODE_PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
