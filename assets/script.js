// Get the form element
const form = document.querySelector("form");
const apiKey = "46ab9f7ad85f55fd2ccc2d8293afa72a";

// Add an event listener for form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the form from submitting

  // Get the input value
  const cityInput = document.getElementById("cityInput").value;
  let cityName = cityInput; // Store the input value in a variable for later use

  console.log("City Name:", cityName);

  // Make a request to the Geocoding API
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Extract latitude and longitude from the API response
      const latitude = data.coord.lat;
      const longitude = data.coord.lon;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      // Make a request to the Weather API using the latitude and longitude
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      )
        .then((response) => response.json())
        .then((weatherData) => {
          // Handle the weather data returned from the API
          console.log("Weather Data:", weatherData);
          // You can now use the weatherData to display weather information on your dashboard
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
