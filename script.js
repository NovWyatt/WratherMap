const apiKey = "2a4080a81999421dc84237ba2c0e28e3";
const getWeatherBtn = document.getElementById("getWeatherBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const ctx = document.getElementById("temperatureChart").getContext("2d");
let temperatureChart; // Đặt một biến để giữ biểu đồ hiện tại

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
      "Thành Thật Xin Lỗi Ứng Dụng Chỉ Có Thể Tra Cứu Thành Phố: ";
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
        <p>Nhiệt độ: ${temperature} °C</p>
    `;
}

function plotTemperatureChart(data) {
  const temperature = data.main.temp;
  const labels = ["Nhiệt độ hiện tại"];
  const temperatures = [temperature];

  // Hủy biểu đồ cũ nếu tồn tại
  if (temperatureChart) {
    temperatureChart.destroy();
  }

  // Tạo biểu đồ mới
  temperatureChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Nhiệt độ (°C)",
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
