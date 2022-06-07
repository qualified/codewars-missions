fetch("/api/assessment-results")
  .then(res => {
    if (!res.ok) {
      throw Error(res.status);
    }

    return res.json();
  })
  .then(({data}) => {
    const passRate = ~~((data.passed / data.total) * 100);
    const submissionRate = ~~((data.submitted / data.total) * 100);
    const failRate = submissionRate - passRate;
    const notAttemptedRate = 100 - submissionRate;
    let graph = "";

    if (passRate > 0) {
      graph += `
        <div
          class="stacked-bar"
          style="background:#55df00;width:${passRate}%"
          title="${passRate}% passed"
        >
          ${passRate}% passed
        </div>
      `;
    }

    if (failRate > 0) {
      graph += `
        <div
          class="stacked-bar"
          style="width:${failRate}%;"
          title="${failRate}% failed"
        >
          ${failRate}% failed
        </div>
      `;
    }

    if (notAttemptedRate > 0) {
      graph += `
        <div
          class="stacked-bar"
          style="background:#fffff2;width:${notAttemptedRate}%;"
          title="${notAttemptedRate}% not attempted"
        >
          ${notAttemptedRate}% not attempted
        </div>
      `;
    }

    document.querySelector(".stacked-bar-graph").innerHTML = graph;
    const msg =
      `${data.passed} of ${data.total} ` +
      `warriors (${passRate}%) completed the mission`;
    console.log(msg);
    console.log(data);
    console.log(
      data.accumulatedSeconds.min,
      data.accumulatedSeconds.max
    );
  })
  .catch(err => console.error(err));

