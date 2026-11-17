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

// Add event listener for Enter key on the input field
cityInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    getWeatherBtn.click();
  }
});

getWeatherBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    getWeather(city);
  } else {
    showError("Vui lòng nhập tên thành phố");
  }
});

function showError(message) {
  weatherInfo.innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      ${message}
    </div>
  `;
}

async function getWeather(city) {
  try {
    weatherInfo.innerHTML = '<div class="loading">Đang tải dữ liệu...</div>';
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=vi`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Không tìm thấy thành phố, vui lòng kiểm tra lại tên");
      } else {
        throw new Error("Lỗi kết nối đến máy chủ");
      }
    }
    
    const data = await response.json();
    displayWeatherInfo(data);
    plotTemperatureChart(data);
  } catch (error) {
    weatherInfo.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        ${error.message || "Đã xảy ra lỗi, vui lòng thử lại sau"}
      </div>
    `;
  }
}

function displayWeatherInfo(data) {
  const city = data.name;
  const country = data.sys.country;
  const temperature = Math.round(data.main.temp * 10) / 10; // Round to 1 decimal place
  const feelsLike = Math.round(data.main.feels_like * 10) / 10;
  const description = data.weather[0].description;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  weatherInfo.innerHTML = `
    <h2>${city}, ${country}</h2>
    <div class="weather-main">
      <img src="${iconUrl}" alt="${description}" class="weather-icon">
      <div class="temperature-container">
        <p class="temperature">${temperature}°C</p>
        <p class="feels-like">Cảm giác như: ${feelsLike}°C</p>
      </div>
    </div>
    <p class="description">${description.charAt(0).toUpperCase() + description.slice(1)}</p>
    <div class="weather-details">
      <div class="detail">
        <span class="detail-label">Độ ẩm:</span>
        <span class="detail-value">${humidity}%</span>
      </div>
      <div class="detail">
        <span class="detail-label">Gió:</span>
        <span class="detail-value">${windSpeed} m/s</span>
      </div>
    </div>
  `;
}

function plotTemperatureChart(data) {
  // Get more detailed temperature data
  const mainTemp = data.main.temp;
  const feelsLike = data.main.feels_like;
  const minTemp = data.main.temp_min;
  const maxTemp = data.main.temp_max;

  const labels = ["Nhiệt độ", "Cảm giác", "Thấp nhất", "Cao nhất"];
  const temperatures = [mainTemp, feelsLike, minTemp, maxTemp];

  // Destroy the old chart if it exists
  if (temperatureChart) {
    temperatureChart.destroy();
  }

  // Set the chart colors to match the dark theme
  const primaryColor = '#bb86fc';
  const secondaryColor = '#03dac6';
  
  // Create gradient for bar colors
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(187, 134, 252, 0.8)');
  gradient.addColorStop(1, 'rgba(3, 218, 198, 0.3)');

  // Create a new chart
  temperatureChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Nhiệt độ (°C)",
          data: temperatures,
          backgroundColor: gradient,
          borderColor: primaryColor,
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#e0e0e0'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(30, 30, 30, 0.8)',
          titleColor: primaryColor,
          bodyColor: '#ffffff',
          borderColor: '#444',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `${context.parsed.y}°C`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#e0e0e0'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#e0e0e0'
          }
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      }
    },
  });
}