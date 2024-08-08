const apiKey = "2a4080a81999421dc84237ba2c0e28e3";
const getWeatherBtn = document.getElementById("getWeatherBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const currentTimeElement = document.getElementById("currentTime");
const ctx = document.getElementById("temperatureChart").getContext("2d");
let temperatureChart; // Variable to hold the current chart

// Update the current time every second
function updateTime() {
  const now = new Date();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const timeString = now.toLocaleTimeString("en-GB", options);
  currentTimeElement.textContent = `Current Time: ${timeString}`;
}

// Call updateTime every second
setInterval(updateTime, 1000);

// Initial call to set the time immediately
updateTime();

getWeatherBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    getWeather(city);
  }
});

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=vi`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    displayWeatherInfo(data);
    plotTemperatureChart(data);
  } catch (error) {
    weatherInfo.innerText =
      "Sorry, the application only supports city queries.";
  }
}

function displayWeatherInfo(data) {
  const city = data.name;
  const country = data.sys.country;
  const temperature = data.main.temp;
  const description = data.weather[0].description;

  weatherInfo.innerHTML = `
        <h2>${city}, ${country}</h2>
        <p>${description}</p>
        <p>Temperature: ${temperature} °C</p>
    `;
}

function plotTemperatureChart(data) {
  const temperature = data.main.temp;
  const labels = ["Current Temperature"];
  const temperatures = [temperature];

  // Destroy the old chart if it exists
  if (temperatureChart) {
    temperatureChart.destroy();
  }

  // Create a new chart
  temperatureChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temperatures,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
