import express from "express";
import cors from "cors";
import axios from "axios";
import * as iso88592 from "iso-8859-2";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/:id/:name", async (req, res) => {
  const { id, name } = req.params;
  const result = {};

  // WRF
  // basic data
  const response = await axios.request({
    method: "GET",
    url: `https://www.meteociel.com/previsions-wrf-1h/${id}/${name}.htm`,
    responseType: "arraybuffer",
    responseEncoding: "binary",
  });
  let data = iso88592.decode(response.data.toString("binary")); // meteociel is encoded in iso88592

  if (data.length) {
    // name
    let matches = data.match(/<title>.+<\/title>/g);
    if (matches && matches.length == 1) {
      const i = matches[0].indexOf("pour ") + 5;
      const j = matches[0].indexOf(") -") + 1;
      result.name = matches[0].slice(i, j);
    }

    let start = data.search(/<td rowspan=\d+ align="center" valign="center">/g);
    let end = data.indexOf("</td></tr></table><br><table width=100%");
    const dayTexts = data
      .slice(start, end)
      .replaceAll(/<td rowspan=\d+ align="center" valign="center">/g, "~?^|")
      .split("~?^|");

    result.data = [];
    for (let i = 1; i < dayTexts.length; i++) {
      const dayText = dayTexts[i];
      const day = dayText
        .slice(0, dayText.indexOf("<br></td>"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let j = 1; j < hourTexts.length; j++) {
        const text = hourTexts[j];
        const dataPoint = {
          day: day,
          time: text.slice(0, 5),
        };

        // temperature
        matches = text.match(/>-?\d+.+C</g);
        if (matches && matches.length == 1) {
          dataPoint.wrfTemperature = matches[0].slice(
            1,
            matches[0].indexOf(" ")
          );
        }

        // wind dir img
        start = text.indexOf("src='") + 5;
        end = text.indexOf("' alt", start);
        dataPoint.wrfWindDirectionImage = text.slice(start, end);

        // wind avg + gust
        matches = text.slice(end).match(/>\d+</g);
        if (matches && matches.length == 2) {
          dataPoint.wrfWindAverage = matches[0]
            .replace(">", "")
            .replace("<", "");
          dataPoint.wrfWindGust = matches[1].replace(">", "").replace("<", "");
        }

        // meteo img
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("'>", start);
        dataPoint.wrfMeteoImage = text.slice(start, end);

        result.data.push(dataPoint);
      }
    }
  }

  // high altitude
  ({ data } = await axios.get(
    `https://www.meteociel.com/previsions-haute-altitude-wrf-1h/${id}/${name}.htm`
  ));

  if (data.length) {
    let start = data.search(/<td rowspan=\d+ align="center" valign="center">/);
    let end = data.indexOf("</td></tr></table><br><table width=100%");
    const dayTexts = data
      .slice(start, end)
      .replaceAll(/<td rowspan=\d+ align="center" valign="center">/g, "~?^|")
      .split("~?^|");

    for (let i = 1; i < dayTexts.length; i++) {
      const dayText = dayTexts[i];
      const day = dayText
        .slice(0, dayText.indexOf("<br></td>"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let j = 1; j < hourTexts.length; j++) {
        const text = hourTexts[j];
        const dataPoint = result.data.find(
          (x) => x.day == day && x.time == text.slice(0, 5)
        );
        if (!dataPoint) continue;

        // skip first column (2m)
        start = text.indexOf("src='") + 5;
        end = text.indexOf("' alt", start);

        // wind dir img z850
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.wrfWindDirectionImageZ850 = text.slice(start, end);

        // wind dir img z800
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.wrfWindDirectionImageZ800 = text.slice(start, end);

        // wind dir img z700
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.wrfWindDirectionImageZ700 = text.slice(start, end);

        // wind dir img z600
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.wrfWindDirectionImageZ600 = text.slice(start, end);

        // wind dir img z500
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.wrfWindDirectionImageZ500 = text.slice(start, end);

        // wind avg
        const matches = text.match(/>\s\d+</g);
        if (matches && matches.length == 6) {
          // skip 2m value
          dataPoint.wrfWindAverageZ850 = matches[1]
            .replace(">", "")
            .replace("<", "")
            .trim();
          dataPoint.wrfWindAverageZ800 = matches[2]
            .replace(">", "")
            .replace("<", "")
            .trim();
          dataPoint.wrfWindAverageZ700 = matches[3]
            .replace(">", "")
            .replace("<", "")
            .trim();
          dataPoint.wrfWindAverageZ600 = matches[4]
            .replace(">", "")
            .replace("<", "")
            .trim();
          dataPoint.wrfWindAverageZ500 = matches[5]
            .replace(">", "")
            .replace("<", "")
            .trim();
        }
      }
    }
  }

  // orage avance
  ({ data } = await axios.get(
    `https://www.meteociel.com/previsions-orage-wrf-1h/${id}/${name}.htm`
  ));

  if (data.length) {
    let start = data.search(/<td rowspan=\d+ align="center" valign="center">/);
    let end = data.indexOf("</td></tr></table><br><table width=100%");
    const dayTexts = data
      .slice(start, end)
      .replaceAll(/<td rowspan=\d+ align="center" valign="center">/g, "~?^|")
      .split("~?^|");

    for (let i = 1; i < dayTexts.length; i++) {
      const dayText = dayTexts[i];
      const day = dayText
        .slice(0, dayText.indexOf("<br></td>"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let j = 1; j < hourTexts.length; j++) {
        const text = hourTexts[j];
        const dataPoint = result.data.find(
          (x) => x.day == day && x.time == text.slice(0, 5)
        );
        if (!dataPoint) continue;

        // sounding link
        start = text.indexOf("javascript:openSoundingWrf(") + 27;
        end = text.indexOf(")", start);
        const temp = text.slice(start, end).split(",");
        if (temp.length == 4) {
          dataPoint.wrfSoundingLink = `https://www.meteociel.com/modeles/sondage2wrf.php?map=1&x1=${temp[0]}&y1=${temp[1]}&ech=${temp[2]}`;
          dataPoint.wrfSoundingPreviewImage = `https://www.meteociel.com/modeles/sondagewrf/sondagewrf_${temp[0]}_${temp[1]}_${temp[2]}_1.png`;

          // load sounding previews for 1st entry and/or each 14:00
          // must do this because meteociel only generates the png after loading
          const hour = Number(dataPoint.time.slice(0, 2));
          if (
            hour === 14 ||
            (hour > 14 &&
              result.data[0].day === dataPoint.day &&
              result.data[0].time === dataPoint.time)
          ) {
            await axios.get(dataPoint.wrfSoundingLink);
          }
        }
      }
    }
  }

  // AROME
  // basic data
  ({ data } = await axios.get(
    `https://www.meteociel.com/previsions-arome-1h/${id}/${name}.htm`
  ));

  if (data.length) {
    let start = data.search(/<td rowspan=\d+ align="center" valign="center">/g);
    let end = data.indexOf("</td></tr></table><br><table width=100%");
    const dayTexts = data
      .slice(start, end)
      .replaceAll(/<td rowspan=\d+ align="center" valign="center">/g, "~?^|")
      .split("~?^|");

    for (let i = 1; i < dayTexts.length; i++) {
      const dayText = dayTexts[i];
      const day = dayText
        .slice(0, dayText.indexOf("<br></td>"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let j = 1; j < hourTexts.length; j++) {
        const text = hourTexts[j];
        const dataPoint = result.data.find(
          (x) => x.day == day && x.time == text.slice(0, 5)
        );
        if (!dataPoint) continue;

        // temperature
        let matches = text.match(/>-?\d+.+C</g);
        if (matches && matches.length == 1) {
          dataPoint.aromeTemperature = matches[0].slice(
            1,
            matches[0].indexOf(" ")
          );
        }

        // wind dir img
        start = text.indexOf("src='") + 5;
        end = text.indexOf("' alt", start);
        dataPoint.aromeWindDirectionImage = text.slice(start, end);

        // wind avg + gust
        matches = text.slice(end).match(/>\d+</g);
        if (matches && matches.length == 2) {
          dataPoint.aromeWindAverage = matches[0]
            .replace(">", "")
            .replace("<", "");
          dataPoint.aromeWindGust = matches[1]
            .replace(">", "")
            .replace("<", "");
        }

        // meteo img
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("'>", start);
        dataPoint.aromeMeteoImage = text.slice(start, end);
      }
    }
  }

  // high altitude
  ({ data } = await axios.get(
    `https://www.meteociel.com/previsions-haute-altitude-arome-1h/${id}/${name}.htm`
  ));

  if (data.length) {
    let start = data.search(/<td rowspan=\d+ align="center" valign="center">/);
    let end = data.indexOf("</td></tr></table><br><table width=100%");
    const dayTexts = data
      .slice(start, end)
      .replaceAll(/<td rowspan=\d+ align="center" valign="center">/g, "~?^|")
      .split("~?^|");

    for (let i = 1; i < dayTexts.length; i++) {
      const dayText = dayTexts[i];
      const day = dayText
        .slice(0, dayText.indexOf("<br></td>"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let j = 1; j < hourTexts.length; j++) {
        const text = hourTexts[j];
        const dataPoint = result.data.find(
          (x) => x.day == day && x.time == text.slice(0, 5)
        );
        if (!dataPoint) continue;

        // skip first column (2m)
        start = text.indexOf("src='") + 5;
        end = text.indexOf("' alt", start);

        // wind dir img z850
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.aromeWindDirectionImageZ850 = text.slice(start, end);

        // wind dir img z800
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.aromeWindDirectionImageZ800 = text.slice(start, end);

        // wind dir img z700
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.aromeWindDirectionImageZ700 = text.slice(start, end);

        // wind dir img z600
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.aromeWindDirectionImageZ600 = text.slice(start, end);

        // wind dir img z500
        start = text.indexOf("src='", end) + 5;
        end = text.indexOf("' alt", start);
        dataPoint.aromeWindDirectionImageZ500 = text.slice(start, end);

        // wind avg
        const matches = text.match(/>\s\d+</g);
        if (matches && matches.length == 6) {
          // skip 2m value
          dataPoint.aromeWindAverageZ850 = matches[1]
            .replace(">", "")
            .replace("<", "")
            .trim();
          dataPoint.aromeWindAverageZ800 = matches[2]
            .replace(">", "")
            .replace("<", "")
            .trim();
          dataPoint.aromeWindAverageZ700 = matches[3]
            .replace(">", "")
            .replace("<", "")
            .trim();
          dataPoint.aromeWindAverageZ600 = matches[4]
            .replace(">", "")
            .replace("<", "")
            .trim();
          dataPoint.aromeWindAverageZ500 = matches[5]
            .replace(">", "")
            .replace("<", "")
            .trim();
        }
      }
    }
  }

  // orage avance
  ({ data } = await axios.get(
    `https://www.meteociel.com/previsions-orage-arome-1h/${id}/${name}.htm`
  ));

  if (data.length) {
    let start = data.search(/<td rowspan=\d+ align="center" valign="center">/);
    let end = data.indexOf("</td></tr></table><br><table width=100%");
    const dayTexts = data
      .slice(start, end)
      .replaceAll(/<td rowspan=\d+ align="center" valign="center">/g, "~?^|")
      .split("~?^|");

    for (let i = 1; i < dayTexts.length; i++) {
      const dayText = dayTexts[i];
      const day = dayText
        .slice(0, dayText.indexOf("<br></td>"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let j = 1; j < hourTexts.length; j++) {
        const text = hourTexts[j];
        const dataPoint = result.data.find(
          (x) => x.day == day && x.time == text.slice(0, 5)
        );
        if (!dataPoint) continue;

        // sounding link
        start = text.indexOf("javascript:openSoundingArome(") + 29;
        end = text.indexOf(")", start);
        const temp = text.slice(start, end).split(",");
        if (temp.length == 4) {
          dataPoint.aromeSoundingLink = `https://www.meteociel.com/modeles/sondage2arome.php?map=1&lon=${temp[0]}&lat=${temp[1]}&ech=${temp[2]}`;
        }
      }
    }
  }

  res.json(result);
});

const port = process.env.NODE_PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
