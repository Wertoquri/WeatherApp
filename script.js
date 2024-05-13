const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetailsBox = document.querySelector(".info-weather");
const weatherDetails = document.querySelector(".weather-details");


async function getWeather(apiKey, location) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        return { error: { message: "Місто не знайдено" } };
    }
}


function getWeatherIcon(condition) {
    switch (condition.toLowerCase()) {
        case 'sunny':
            return 'images/clear.png';
        case 'clear':
            return 'images/clear.png';
        case 'cloudy':
            return 'images/cloud.png';
        case 'partly cloudy':
            return 'images/cloud.png';
        case 'overcast':
            return 'images/cloud.png';
        case 'mist':
            return 'images/mist.png';
        case 'fog':
            return 'images/snow.png';
        case 'patchy rain nearby':
            return 'images/rain.png';
        case 'light rain':
            return 'images/rain.png';
        case 'light rain shower':
            return 'images/rain.png';
        case 'moderate rain':
            return 'images/rain.png';
        case 'snow':
            return 'images/snow.png';
        default:
            return 'images/404.png';
    }
}



function displayWeather(weatherData) {
    const weatherInfoDiv = document.getElementById('weatherInfo');
    weatherInfoDiv.innerHTML = '';

    if ('error' in weatherData) {
        weatherInfoDiv.innerText = `Error: ${weatherData['error']['message']}`;
        alertify.error(weatherData['error']['message']);
    } else {
        const locationName = weatherData.location.name;
        const country = weatherData.location.country;
        const currentWeather = weatherData.current;
        const condition = weatherData.current.condition.text;

        const humidity = weatherData.current.humidity;
        const weatherIcon = getWeatherIcon(condition);
        const forecast = weatherData.forecast ? weatherData.forecast.forecastday : [];
        const tempUnit = document.getElementById('tempUnit').value;
        const windUnit = document.getElementById('windUnit').value;

        let tempValue = currentWeather.temp_c;
        let windSpeedValue = currentWeather.wind_kph;
        let tempUnitSymbol, windSpeedUnitSymbol;

        switch (tempUnit) {
            case 'celsius':
                tempValue = currentWeather.temp_c;
                tempUnitSymbol = '°C';
                break;
            case 'fahrenheit':
                tempValue = currentWeather.temp_f;
                tempUnitSymbol = '°F';
                break;
            case 'kelvin':
                tempValue = Math.floor(currentWeather.temp_c + 273.15);
                tempUnitSymbol = 'K';
                break;
        }

        switch (windUnit) {
            case 'kph':
                windSpeedValue = currentWeather.wind_kph;
                windSpeedUnitSymbol = 'km/h';
                break;
            case 'ms':
                windSpeedValue = Math.floor(currentWeather.wind_mph * 0.44704);
                windSpeedUnitSymbol = 'm/s';
                break;
            case 'knots':
                windSpeedValue = Math.floor(currentWeather.wind_mph * 0.868976);
                windSpeedUnitSymbol = 'knots';
                break;
        }

        let forecastHTML = '';
        if (forecast.length > 0) {
            forecast.forEach(day => {
                const date = new Date(day.date_epoch * 1000).toLocaleDateString();
                const maxTemp = convertTemperature(day.day.maxtemp_c, tempUnit);
                const minTemp = convertTemperature(day.day.mintemp_c, tempUnit);
                const icon = getWeatherIcon(day.day.condition.text);

                forecastHTML += `
                    <div class="forecast-day">
                        <p>${date}</p>
                        <img src="${icon}" alt="${day.day.condition.text}">
                        <p>Max: ${maxTemp}${tempUnitSymbol}</p>
                        <p>Min: ${minTemp}${tempUnitSymbol}</p>
                    </div>
                `;
            });
        }


        const weatherInfoText = `
            <div class="info-weather">          
            <p>Weather in ${locationName}, ${country}:</p>
            <p class="sigma"></p>
            <p>Temperature: ${tempValue} ${tempUnitSymbol}</p>
            <p class="sigma"></p>
            <p>Condition: ${condition}</p>
            </div>
            <img src="${weatherIcon}" alt="${condition}">
            <div class="info-weather">
            <p>Wind speed: ${windSpeedValue} ${windSpeedUnitSymbol}</p>
            <p class="sigma"></p>
            <p>Humidity: ${humidity}%</p>
            </div>
            <p class="sigma"></p>
            <div class="forecast">
                ${forecastHTML}
            </div>
        `;

        weatherInfoDiv.innerHTML = weatherInfoText;

    }

}

function convertTemperature(temp, unit) {
    switch (unit) {
        case 'celsius':
            return temp;
        case 'fahrenheit':
            return (temp * 9 / 5) + 32;
        case 'kelvin':
            return temp + 273.15;
        default:
            return temp;
    }
}

const geolocateBtn = document.getElementById('geolocateBtn');
geolocateBtn.addEventListener('click', getLocation);


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alertify.error("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const location = `${latitude},${longitude}`;

    // Отримуємо поле введення і вводимо місцезнаходження
    const locationInput = document.getElementById('locationInput');
    locationInput.value = location;

    // Викликаємо функцію getWeatherInfo з введеним місцезнаходженням
    getWeatherInfo();
}


function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alertify.error("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alertify.error("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alertify.error("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alertify.error("An unknown error occurred.");
            break;
    }
}

async function getWeatherInfo() {
    const apiKey = "05742d4e978c485d93971659240505";
    const locationInput = document.getElementById('locationInput');
    const location = locationInput.value.trim();

    if (location === '') {
        alertify.error("Введіть назву міста");
        return;
    }

    const weatherData = await getWeather(apiKey, location);

    if ('400' in weatherData) {
        // Якщо виникла помилка під час отримання погоди, приховуємо блок з погодою
        weatherBox.style.display = 'none';
        // Показуємо блок з повідомленням про помилку
        error404.classList.add('active');
        return;
    } else {
        // Показуємо блок з погодою
        weatherBox.style.display = 'block';

        displayWeather(weatherData);
    }
}
