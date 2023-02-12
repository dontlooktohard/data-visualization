// ------>Catching all the selectors in the page<--
// const setCity = document.querySelector('.city');
const ctx = document.querySelector("#chartBox canvas.myChart");
const continentsUi = document.querySelector(".continent");

const chartBox = document.querySelector("#chartBox");
const spinner = document.querySelector(".spinner");
const toggleChartTypeBtn = document.getElementById("toggle-chart-type");
let myChart = null;
spinner.style.display = "none";

function activateContinentsButtons() {
  continentsUi.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "I") return;
    let target = e.target;
    if (e.target.tagName === "I") target = e.target.parentElement;
    getCountriesByRegion(target.dataset.continent);
    //  initChart(continentNames,continentPopulations);
  });
}

// MOSHE =================================
async function getAllContinents() {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all");
    if (!res.ok) throw new Error("someone needs to sleep");
    const data = await res.json();
    return Array.from(
      data.reduce(
        (continents, country) => continents.add(country.continents.join("")),
        new Set()
      )
    );
  } catch (err) {
    console.log(err);
    return 0;
  }
}
async function showContinentsUi() {
  const continentsNames = await getAllContinents();
  //console.log(continentsNames);
  continentsNames.forEach((continentName) => {
    const newEl = document.createElement("button");
    newEl.innerHTML = '<i class="fa-solid fa-earth-africa fa-4x"></i><br>';
    newEl.innerHTML += continentName;
    newEl.className = `continent ${continentName
      .toLowerCase()
      .replace(" ", "-")}`;
    newEl.setAttribute("data-continent", continentName);
    //console.log(newEl);
    continentsUi.appendChild(newEl);
  });
  activateContinentsButtons();
}

showContinentsUi();
//===================

// ------->API fetch the populations and names of regions<--

let countryNames = [];
let countryPopulations = [];

async function getCountriesByRegion(region) {
  spinner.style.display = "block";
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/region/${region}`
    );
    if (!response.ok) throw Error("ERROR!!");
    let data = await response.json();
    data = data.sort((c1, c2) => c1.population - c2.population);
    console.log(data);

    countryNames = [];
    countryPopulations = [];

    data.forEach((country) => {
      countryNames.push(country.name.official);
      countryPopulations.push(country.population);
    });

    console.log(countryNames);
    console.log(countryPopulations);
    createCountryBtn(countryNames);
    spinner.style.display = "none";
    myChart = initChart(
      countryNames.slice(1, 15),
      countryPopulations.slice(1, 15)
    );
  } catch (error) {
    console.log(`An error occurred while fetching the data: ${error}`);
    spinner.style.display = "none";
  }
}

const countryButtons = document.createElement("div");
countryButtons.classList.add("country-container");
chartBox.append(countryButtons);

// ------------------> create btn and attach them to EventListener <------------------------

const createCountryBtn = (countryNames) => {
  countryButtons.innerHTML = null;
  countryNames.forEach((name) => {
    const button = document.createElement("button");
    button.setAttribute("data-country-name", name);
    button.innerText = name;
    countryButtons.append(button);
  });
  addEventListenersToCountryBtn();
};

const addEventListenersToCountryBtn = () => {
  const countryContainer = document.querySelector(".country-container");
  countryContainer.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;
    e.stopPropagation();
    getCityByCountries(e.target.dataset.countryName);
  });
};

toggleChartTypeBtn.addEventListener("click", function () {
  if (myChart.config.type === "bar") {
    myChart.config.type = "line";
  } else {
    myChart.config.type = "bar";
  }
  myChart.update();
});
// ---------------------> second API fetching each country <-----------------
// https://documenter.getpostman.com/view/1134062/T1LJjU52/

let citiesNames = [];
let citiesPopulations = [];
let populationByYear = [];

async function getCityByCountries(countryName) {
  spinner.style.display = "block";
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country: `${countryName}` }),
      }
    );
    if (!response.ok) throw Error("ERROR!!");

    let data = (await response.json()).data;
    console.log(data);

    citiesNames = [];
    citiesPopulations = [];
    //populationByYear = [];

    data.forEach((city) => {
      citiesNames.push(city.city);
      citiesPopulations.push(city.populationCounts[0].value);
      // city.populationCounts.forEach((population) => {
      //populationByYear.push(city.populationCounts[0].year);
      //});
    });

    myChart = initChart(citiesNames.slice(-15), citiesPopulations.slice(-15));
    spinner.style.display = "none";
  } catch (error) {
    console.log(error);
    spinner.style.display = "none";
  }
}

