// ------>Catching all the selectors in the page<--
const setContinent = document.querySelector('.continent');
const setCity = document.querySelector('.city');
const ctx = document.getElementById("myChart").getContext("2d");
const africaBtn = document.querySelector('.africa')
const americaBtn = document.querySelector('.america')
const asiaBtn = document.querySelector('.asia')
const europeBtn = document.querySelector('.europe')
const oceaniaBtn = document.querySelector('.oceania')
const chartBox = document.querySelector("#chartBox");
const spinner = chartBox.querySelector(".spinner");

// ------->API fetch the populations and names of regions<--

let countryNames = [];
let countryPopulations = [];


async function getCountriesByRegion(region) {
    spinner.style.display = "block";
    try {
        const response = await fetch(`https://restcountries.com/v2/region/${region}`);
        if (!response.ok) throw Error("ERROR!!");
        const data = await response.json();
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
        initChart( countryNames , countryPopulations);
        
        spinner.style.display = "none";
    } catch (error) {
        console.error(`An error occurred while fetching the data: ${error}`);   ;
        spinner.style.display = "none";
    }
}



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
            drawChart(countryNames[index], countryPopulations[index]);
        });
    });
}

// ----------->chart function of create and destroy  <--------------------------------------------
function initChart(countryNames, countryPopulations) {

    if (myChart !== null) {
        myChart.destroy();
      }

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
    }


// ---------------------> second API fetching each country <-----------------
// https://documenter.getpostman.com/view/1134062/T1LJjU52/

try {
    const response = await fetch('https://countriesnow.space/api/v0.1/countries/population', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "country": `${country}` })
    })

    if(!response.ok) {
        throw new Error(response.status)
    }
    const populationData = await response.json()

























