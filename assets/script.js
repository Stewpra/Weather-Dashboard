const form = document.querySelector("form");
const apiKey = "46ab9f7ad85f55fd2ccc2d8293afa72a";

function createWeatherCard(weather, isFirstCard) {
  // Convert temperature from Kelvin to Fahrenheit
  const tempKelvin = weather.temp;
  const tempFahrenheit = ((tempKelvin - 273.15) * 9) / 5 + 32;

  // Map different cloud conditions to emojis
  const cloudEmojis = {
    "clear sky": "☀️",
    "few clouds": "🌤️",
    "scattered clouds": "⛅",
    "broken clouds": "☁️",
    "overcast clouds": "☁️",
    mist: "🌫️",
    fog: "🌫️",
    "light rain": "🌧️",
    "moderate rain": "🌧️",
    "heavy intensity rain": "🌧️",
    // Add more cloud conditions and corresponding emojis as needed
  };

  // Get the emoji for the cloud condition
  const cloudEmoji = cloudEmojis[weather.clouds.toLowerCase()] || "☁️";

  let cardContent = `
    <div class="weather-card ${isFirstCard ? "first-card" : ""}">
      <h4>${isFirstCard ? weather.city : ""}</h4>
      <p>Date: ${weather.date} ${cloudEmoji}</p>
      <p>Temp: ${tempFahrenheit.toFixed(2)}°F</p>
      <p>Wind Speed: ${weather.windSpeed} mph</p>
      <p>Humidity: ${weather.humidity}%</p>
    </div>
  `;

  return cardContent;
}

form.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();
  const cityInput = document.getElementById("cityInput").value;
  let cityName = cityInput;

  fetchCurrentWeather(cityName)
    .then((data) => {
      const latitude = data.coord.lat;
      const longitude = data.coord.lon;
      return fetchForecastData(latitude, longitude);
    })
    .then((weatherData) => {
      const weatherDashboardData = processWeatherData(cityName, weatherData);
      displayWeatherCards(weatherDashboardData);
      storeWeatherData(weatherDashboardData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayWeatherCards(weatherData) {
  const todayWeather = weatherData[0];
  const forecastWeather = weatherData.slice(1);

  const todayCard = createWeatherCard(todayWeather, true);
  const forecastCards = forecastWeather.map((weather) =>
    createWeatherCard(weather, false)
  );

  const todayWeatherElement = document.getElementById("todayWeather");
  const forecastWeatherElement = document.getElementById("forecastWeather");

  if (todayWeatherElement && forecastWeatherElement) {
    todayWeatherElement.innerHTML = todayCard;
    forecastWeatherElement.innerHTML = forecastCards.join("");
  } else {
    console.error("Error");
  }
}

function fetchCurrentWeather(cityName) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  ).then((response) => response.json());
}

function fetchForecastData(latitude, longitude) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
  ).then((response) => response.json());
}

function processWeatherData(cityName, weatherData) {
  const todayWeather = {
    city: cityName,
    date: new Date().toLocaleDateString(),
    clouds: weatherData.list[0].weather[0].description,
    temp: weatherData.list[0].main.temp,
    windSpeed: weatherData.list[0].wind.speed,
    humidity: weatherData.list[0].main.humidity,
  };

  const forecast = [];
  for (let i = 1; i <= 5; i++) {
    const forecastData = {
      city: cityName,
      date: new Date(weatherData.list[i * 4].dt * 1000).toLocaleDateString(),
      clouds: weatherData.list[i * 4].weather[0].description,
      temp: weatherData.list[i * 4].main.temp,
      windSpeed: weatherData.list[i * 4].wind.speed,
      humidity: weatherData.list[i * 4].main.humidity,
    };
    forecast.push(forecastData);
  }

  return [todayWeather, ...forecast];
}

function storeWeatherData(weatherData) {
  localStorage.setItem("weatherDashboardData", JSON.stringify(weatherData));
}
