const form = document.querySelector("form");
const apiKey = "46ab9f7ad85f55fd2ccc2d8293afa72a";

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
      console.log("Weather Dashboard Data:", weatherDashboardData);
      storeWeatherData(weatherDashboardData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
