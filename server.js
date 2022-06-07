const axios = require("axios");
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/assessment-results", (req, res) => {
  const url =
    'https://www.qualified.io/api/v1/assessments?includes[]=digest&orderBy=state DESC,title ASC&page=1&per=1&q=&where={"id":"57b63e627416b8000ed1c0f0"}';
  // samples:
  // 5ebb8baa5c19b1000ee16710
  // 57b63e627416b8000ed1c0f0
  // 5bbe36049c59930013c33783
  // 591a602a5b75b400125be4cf

  axios
    .get(url, {
      headers: {
        Authorization: process.env.qualified_template_team_api_key,
      },
    })
    .then(response => {
      if (response.status !== 200) {
        throw Error(response.status);
      }

      const {data: {data: [data]}} = response;
      const {
        digest: {
          passRate,
          submissionRate,
          subjectStats,
          counts: {
            total,
            passed,
            states: {submitted},
          },
        },
      } = data;
      res.json({
        data: {
          passRate,
          total,
          passed,
          submitted,
          submissionRate,
          accumulatedSeconds: {
            min: subjectStats.accumulated_seconds?.points.min,
            max: subjectStats.accumulated_seconds?.points.max,
          },
        },
      });
    })
    .catch((err) => {
      console.error(err.message);
      res.sendStatus(500);
    });
});

app.listen(port, () => console.log(`listening on port ${port}!`));

