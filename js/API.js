// ------>Catching all the selectors in the page<--
// const setCity = document.querySelector('.city');
const ctx = document.getElementById("myChart")
const africaBtn = document.querySelector('#africa')
const americaBtn = document.querySelector('#america')
const asiaBtn = document.querySelector('#asia')
const europeBtn = document.querySelector('#europe')
const oceaniaBtn = document.querySelector('#oceania')
const chartBox = document.querySelector("#chartBox");
const spinner = document.querySelector(".spinner");
const toggleChartTypeBtn = document.getElementById("toggle-chart-type");


let myChart;

africaBtn.addEventListener("click", function() {
    if (myChart) {
        myChart.destroy();
      }
    getCountriesByRegion("africa")
});

americaBtn.addEventListener("click", function() {
    if (myChart) {
        myChart.destroy();
      }
    americaBtn.disabled = true;
    getCountriesByRegion("americas").finally(function() {
        americaBtn.disabled = false;
    });
});

asiaBtn.addEventListener("click", function() {
    if (myChart) {
        myChart.destroy();
      }
    asiaBtn.disabled = true;
    getCountriesByRegion("asia").finally(function() {
        asiaBtn.disabled = false;
    });
});

europeBtn.addEventListener("click", function() {
    if (myChart) {
        myChart.destroy();
      }
    europeBtn.disabled = true;
    getCountriesByRegion("europe").finally(function() {
        europeBtn.disabled = false;
    });
});

oceaniaBtn.addEventListener("click", function() {
    if (myChart) {
        myChart.destroy();
      }
    oceaniaBtn.disabled = true;
    getCountriesByRegion("oceania").finally(function() {
        oceaniaBtn.disabled = false;
    });
});

spinner.style.display = "none";

// ------->API fetch the populations and names of regions<--

let countryNames = [];
let countryPopulations = [];


async function getCountriesByRegion(region) {
    spinner.style.display = "block";
    try {
        const response = await fetch(`https://restcountries.com/v2/region/${region}`);
        if (!response.ok) throw Error("ERROR!!");
        let data = await response.json();
        console.log(data);
        
         countryNames = [];
         countryPopulations = [];
         
         data.forEach((country) => {
            countryNames.push(country.name);
            countryPopulations.push(country.population);
          });
        console.log(countryNames); 
        console.log(countryPopulations);
        createCountryBtn(data);
        spinner.style.display = "none";
    } catch (error) {
        console.log(`An error occurred while fetching the data: ${error}`);
        spinner.style.display = "none";
    }
    
}


const countryButtons = document.createElement('div');
countryButtons.classList.add("country-btn");
chartBox.append(countryButtons);

// ------------------> create btn and attach them to EventListener <------------------------

const createCountryBtn = (data) => {
    countryButtons.innerHTML = null
    data.forEach(country => {
        const button = document.createElement('button')
        button.classList.add("country-btn")
        button.innerText = country.name
        countryButtons.append(button)
    })
    addEventListenersToCountryBtn();
}


const addEventListenersToCountryBtn = () => {
    const countryBtn = document.querySelectorAll(".country-btn");
    countryBtn.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            initChart(countryNames[index], countryPopulations[index]);
        });
    });
}

// ----------->chart function of create and destroy  <--------------------------------------------

    function initChart(countryNames, countryPopulations) {
      console.log(countryNames); 
      console.log(countryPopulations);
          myChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: countryNames,
              datasets: [{
                label: "Population",
                data: countryPopulations,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1
              }]
            },
            options: {
              scales: {           
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
        };


        
toggleChartTypeBtn.addEventListener("click", function() {
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
async function getCityByCountries(country) {
  try {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/population/cities/filter",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "country": `${country}` }),
      }
    );
  
    let data = await response.json();
    citiesNames = [];
    citiesPopulations = [];
    if (!response.ok) {
      myChart.destroy();
      throw Error("ERROR!!");
    }
    data.forEach((city) => {
        citiesNames.push(city.name);
        citiesPopulations.push(city.population);
      });
      initChart(citiesNames, citiesPopulations);
    } catch (error) {
        console.log("error");
    }
}
