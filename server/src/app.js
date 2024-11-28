import express from "express";
import cors from "cors";
import axios from "axios";
import iconv from "iconv-lite";
import { decode } from "html-entities";

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
  let data = iconv.decode(response.data, "ISO-8859-1"); // meteociel is encoded in iso8859-1

  if (data.length) {
    // name
    let matches = data.match(/<title>.+<\/title>/g);
    if (matches && matches.length === 1) {
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
        .slice(0, dayText.indexOf("<br><"))
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
        if (matches && matches.length === 1) {
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
        if (matches && matches.length === 2) {
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
        .slice(0, dayText.indexOf("<br><"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let j = 1; j < hourTexts.length; j++) {
        const text = hourTexts[j];
        const dataPoint = result.data.find(
          (x) => x.day === day && x.time === text.slice(0, 5)
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
        if (matches && matches.length === 6) {
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
        .slice(0, dayText.indexOf("<br><"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let j = 1; j < hourTexts.length; j++) {
        const text = hourTexts[j];
        const dataPoint = result.data.find(
          (x) => x.day === day && x.time === text.slice(0, 5)
        );
        if (!dataPoint) continue;

        // sounding link
        start = text.indexOf("javascript:openSoundingWrf(") + 27;
        end = text.indexOf(")", start);
        const temp = text.slice(start, end).split(",");
        if (temp.length === 4) {
          const x1 = temp[0];
          const y1 = temp[1];
          const ech = Number(temp[2]);

          dataPoint.wrfSoundingLink = `https://www.meteociel.com/modeles/sondage2wrf.php?map=1&x1=${x1}&y1=${y1}&ech=${ech}`;

          // get sounding preview urls for 1st entry and/or each 14:00
          // then, check if the sounding is offset from the supposed time
          // because meteociel is broken
          // images need to be force-generated, this will be initiated by client
          const hour = Number(dataPoint.time.slice(0, 2));
          if (
            hour === 14 ||
            (hour > 14 &&
              result.data[0].day === dataPoint.day &&
              result.data[0].time === dataPoint.time)
          ) {
            dataPoint.wrfSoundingPreviewImage = `https://www.meteociel.com/modeles/sondagewrf/sondagewrf_${x1}_${y1}_${ech}_1.png`;

            // tableau de valeurs has a text timestamp
            const { data } = await axios.get(
              `https://www.meteociel.com/modeles/sondage2wrf.php?map=2&x1=${x1}&y1=${y1}&ech=${ech}`
            );
            if (data) {
              start =
                data.indexOf(
                  "<center><table><tr><td align=center class=texte colspan=2><font color=white><b>"
                ) + 79;
              end = data.indexOf(":00 locale", start);
              const soundingHour = Number(data.slice(start, end).slice(-2));
              const offset = Number(dataPoint.time.slice(0, 2)) - soundingHour;

              // only apply offset if > 2 for performance reasons
              // can't apply offsets that result in negative time
              if (Math.abs(offset) > 2 && ech + offset > 0) {
                dataPoint.wrfSoundingPreviewImage = `https://www.meteociel.com/modeles/sondagewrf/sondagewrf_${x1}_${y1}_${
                  ech + offset
                }_1.png`;
                dataPoint.wrfSoundingLink = `https://www.meteociel.com/modeles/sondage2wrf.php?map=1&x1=${x1}&y1=${y1}&ech=${
                  ech + offset
                }`;
              }
            }
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
        .slice(0, dayText.indexOf("<br><"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let j = 1; j < hourTexts.length; j++) {
        const text = hourTexts[j];
        const dataPoint = result.data.find(
          (x) => x.day === day && x.time === text.slice(0, 5)
        );
        if (!dataPoint) continue;

        // temperature
        let matches = text.match(/>-?\d+.+C</g);
        if (matches && matches.length === 1) {
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
        if (matches && matches.length === 2) {
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
        .slice(0, dayText.indexOf("<br><"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let j = 1; j < hourTexts.length; j++) {
        const text = hourTexts[j];
        const dataPoint = result.data.find(
          (x) => x.day === day && x.time === text.slice(0, 5)
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
        if (matches && matches.length === 6) {
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
        .slice(0, dayText.indexOf("<br><"))
        .replaceAll("<br>", " ")
        .trim();

      const hourTexts = dayText.split("<td>");
      for (let j = 1; j < hourTexts.length; j++) {
        const text = hourTexts[j];
        const dataPoint = result.data.find(
          (x) => x.day === day && x.time === text.slice(0, 5)
        );
        if (!dataPoint) continue;

        // sounding link
        start = text.indexOf("javascript:openSoundingArome(") + 29;
        end = text.indexOf(")", start);
        const temp = text.slice(start, end).split(",");
        if (temp.length === 4) {
          dataPoint.aromeSoundingLink = `https://www.meteociel.com/modeles/sondage2arome.php?map=1&lon=${temp[0]}&lat=${temp[1]}&ech=${temp[2]}`;
        }
      }
    }
  }

  res.json(result);
});

app.get("/search", async (req, res) => {
  const { q } = req.query;
  const response = await axios.request({
    method: "GET",
    url: `https://www.meteociel.com/prevville.php?action=getville&ville=${q.replace(
      " ",
      "+"
    )}&envoyer=ici`,
    responseType: "arraybuffer",
    responseEncoding: "binary",
  });
  let data = iconv.decode(response.data, "ISO-8859-1");

  const result = [];
  if (data.length) {
    // not found
    if (data.includes("Aucune ville correspondant")) {
      res.json(result);
      return;
    }

    // single match
    if (!data.includes("</li></td></tr></table></center><br><b>")) {
      const start = data.search("location.href='") + 15;
      const end = data.search("';</script>");
      const path = data.slice(start, end).trim();

      result.push({ name: q, url: `https://www.meteociel.com${path}` });
      res.json(result);
      return;
    }

    const start = data.search("France : </b><br><li> ") + 22;
    const end = data.indexOf("</li></td></tr></table></center><br><b>");

    // multi match
    const locationTexts = data
      .slice(start, end)
      .replaceAll("</li><li>", "~?^|")
      .split("~?^|");

    for (const locText of locationTexts) {
      const path = locText
        .slice(0, locText.indexOf(">"))
        .replaceAll("<a href=", "")
        .replaceAll("'", "")
        .trim();

      const name = decode(
        locText
          .slice(locText.indexOf(">") + 1, locText.indexOf("</a>"))
          .replaceAll("&nbsp;", " ")
          .trim()
      );

      result.push({
        name: name,
        url: `https://www.meteociel.com${path}`,
      });
    }
  }

  res.json(result);
});

// force meteociel to generate sounding previews, client will decide if necessary
app.post("/load-sounding", async (req, res) => {
  const { url } = req.body;
  await axios.get(url);
  res.sendStatus(200);
});

// force meteociel to generate sounding previews, client will decide if necessary
app.post("/check-sounding", async (req, res) => {
  const { url } = req.body;

  const timer = setInterval(async () => {
    const { status } = await axios.get(url);
    if (status === 200) {
      clearInterval(timer);
      res.sendStatus(200);
    }
  }, 1000);
});

const port = process.env.NODE_PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
