// ----------->chart function of create and destroy  <--------------------------------------------
// ------------>chart of containments<-----------------
function initChart(names, populations) {
  if (myChart?.ctx) myChart.destroy();
  //  console.log(names);
  // console.log(populations);
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: names,
      datasets: [
        {
          label: "Population",
          data: populations,
          backgroundColor: names.map((name) =>
            generateColorFromString(name, 0.4)
          ),
          borderColor: names.map((name) => generateColorFromString(name, 0.9)),
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      maintainAspectRatio: false,
    },
  });
}

// ------------------------->from moshe to make my chart colorfully<---------------
function generateColorFromString(string, opacity = 1) {
  // https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37
  let hash = 0;
  if (string.length === 0) return hash;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  let rgb = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 255;
    rgb[i] = value;
  }
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
}
