/* eslint no-use-before-define: ['error', { 'functions': false }] */
/* eslint no-global-assign: 'warn' */
/* eslint-env browser */

const ERROR_TYPE_CODES = [
  'Unknown error',
  'Permission denied by user',
  'Position is not available',
  'Request timed out',
];

let tempK = 0;

function getLocation() {
  const url = 'http://ipinfo.io/json';

  return fetch(url).then((response) => {
    if (!response.ok) {
      const errorMessage =
        `${ERROR_TYPE_CODES[0]}: ${response.status} (${response.statusText}) by fetching ${url}`;
      console.log(errorMessage);
      throw response;
    }
    return response.json();
  });
}

function getWeather(coordinates) {
  const apiEndpoint = 'http://api.openweathermap.org';
  const appid = 'd34f85f7f7d240f79ee5e6d8ef0fdc26';
  const url =
    `${apiEndpoint}/data/2.5/weather?q=${coordinates.city},${coordinates.country}&APPID=${appid}`;

  return fetch(url).then((response) => {
    if (!response.ok) {
      const errorMessage =
        `${ERROR_TYPE_CODES[0]}: ${response.status} (${response.statusText}) by fetching ${url}`;
      console.log(errorMessage);
      throw response;
    }
    return response.json();
  });
}

function kalvinToCelsius(temp) {
  return temp - 273.15;
}
function kalvinToFahrenheit(temp) {
  return Math.round(((temp * 1.8) - 459.67) * 100) / 100;
}

function render(forecast) {
  const forecastEl = document.querySelector('forecast');
  tempK = forecast.main.temp;

  forecastEl.innerHTML = '';
  forecastEl.innerHTML = `<div class="city">${forecast.name},&nbsp;<span class="country">${forecast.sys.country}</span></div>
  <img class="icon" src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png" width="50px" height="50px" alt="${forecast.weather[0].main}"/>
  <div class="weather">${forecast.weather[0].main}</div>
  <div class="temperature">${kalvinToCelsius(tempK)}&deg;<button class="scale celsius" title="change scale">C</button>
  </div>`;
}

document.querySelector('body').addEventListener('click', (event) => {
  const el = event.target;
  if (!el.classList.contains('scale')) {
    return;
  }
  const forecastEl = document.querySelector('forecast');
  const tempEl = forecastEl.querySelector('.temperature');
  const scaleEl = tempEl.querySelector('.scale');
  const div = document.createElement('div');
  if (scaleEl.classList.contains('celsius')) {
    forecastEl.removeChild(tempEl);
    div.innerHTML = `${kalvinToFahrenheit(tempK)}&deg;<button class="scale fahrenheit" title="change scale">F</button>`;
  } else {
    forecastEl.removeChild(tempEl);
    div.innerHTML = `${kalvinToCelsius(tempK)}&deg;<button class="scale celsius" title="change scale">C</button>`;
  }
  div.classList.add('temperature');
  forecastEl.appendChild(div);
});

getLocation()
  .then(coordinates => getWeather(coordinates))
  .then((forecast) => {
    const message = `${forecast.name}, ${forecast.sys.country}, ${forecast.weather[0].main}, ${forecast.weather[0].icon} ${forecast.main.temp}`;
    console.log(message);
    render(forecast);
  });
