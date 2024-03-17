const form = document.querySelector("form");
const apiKey = "46ab9f7ad85f55fd2ccc2d8293afa72a";

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const cityInput = document.getElementById("cityInput").value;
  let cityName = cityInput;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const latitude = data.coord.lat;
      const longitude = data.coord.lon;

      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      )
        .then((response) => response.json())
        .then((weatherData) => {
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
              date: new Date(
                weatherData.list[i * 4].dt * 1000
              ).toLocaleDateString(),
              clouds: weatherData.list[i * 4].weather[0].description,
              temp: weatherData.list[i * 4].main.temp,
              windSpeed: weatherData.list[i * 4].wind.speed,
              humidity: weatherData.list[i * 4].main.humidity,
            };
            forecast.push(forecastData);
          }

          const weatherDashboardData = [todayWeather, ...forecast];
          console.log("Weather Dashboard Data:", weatherDashboardData);

          // Store the weatherDashboardData array in local storage
          localStorage.setItem(
            "weatherDashboardData",
            JSON.stringify(weatherDashboardData)
          );
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
