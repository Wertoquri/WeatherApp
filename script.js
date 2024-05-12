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
    } catch(error) {
        return { error: { message: "Місто не знайдено" } };
    }
}


function getWeatherIcon(condition) {
    switch(condition.toLowerCase()) {
        case 'sunny':
            return 'images/clear.png';
        case 'clear':
            return 'images/clear.png';
        case 'cloudy':
            return  'images/cloud.png';
        case 'partly cloudy':
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
        weatherInfoDiv.innerText = `Помилка: ${weatherData['error']['message']}`;
        alertify.error(weatherData['error']['message']);
    } else {
        const locationName = weatherData.location.name;
        const country = weatherData.location.country;
        const tempCelsius = weatherData.current.temp_c;
        const condition = weatherData.current.condition.text;
        const windSpeedKph = weatherData.current.wind_kph;
        const humidity = weatherData.current.humidity;
        const weatherIcon = getWeatherIcon(condition);


        const weatherInfoText = `
            <div class="info-weather">          
            <p>Weather in  ${locationName}, ${country}:</p>
            <p class="sigma"></p>
            <p>Temperature: ${tempCelsius} °С</p>
            <p class="sigma"></p>
            <p>Condition: ${condition}</p>
            </div>
            <img src="${weatherIcon}" alt="${condition}">
            <div class="info-weather">
            <p>Wind speed: ${windSpeedKph} Km/h</p>
            <p class="sigma"></p>
            <p>Humidity: ${humidity}%</p>
            </div>

        `;

        weatherInfoDiv.innerHTML = weatherInfoText;
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
