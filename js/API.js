// ------>catching the all the selectors in the mine page<--
const setContinent = document.querySelector('.continent');
const setCity = document.querySelector('.city');
const ctx = document.querySelector('.myChart')
const africaBtn = document.querySelector('.africa')
const americaBtn = document.querySelector('.america')
const asiaBtn = document.querySelector('.asia')
const europeBtn = document.querySelector('.europe')
const oceaniaBtn = document.querySelector('.oceania')
const chartBox = document.querySelector("#chartBox");
const spinner = chartBox.querySelector(".spinner");

// ------->API fetch the populations and names of regions<--
// ------>and chart creation<-----
async function getCountriesByRegion(region) {
    spinner.style.display = "block";
    try {
        const response = await fetch(`https://restcountries.com/v2/region/${region}`);
        const data = await response.json();
        
        const countryNames = [];
        const countryPopulations = [];
        for (const country of data) {
            countryNames.push(country.name);
            countryPopulations.push(country.population);
        }
        
        const ctx = document.getElementById("myChart").getContext("2d");
         new Chart(ctx, {
            type: "bar",
            data: {
                labels: countryNames,
                datasets: [{
                    label: "Population (in millions)",
                    data: countryPopulations,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)"
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)"
                    ],
                    borderWidth: 1
                }]
            }
        });
        spinner.style.display = "none";
    } catch (error) {
        console.error(`An error occurred while fetching the data: ${error}`);
        spinner.style.display = "none";
    }
}

const regions = ["europe", "africa", "americas", "asia", "oceania"];
for (const region of regions) {
    getCountriesByRegion(region);
}




























