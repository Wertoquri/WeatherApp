const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

async function getWeather(apiKey, location) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch(error) {
        // Обробляємо помилку, якщо місто не знайдено
        container.classList.remove('active');
        error404.classList.add('active');
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
    } else {
        const locationName = weatherData.location.name;
        const country = weatherData.location.country;
        const tempCelsius = weatherData.current.temp_c;
        const condition = weatherData.current.condition.text;
        const windSpeedKph = weatherData.current.wind_kph;
        const humidity = weatherData.current.humidity;
        const weatherIcon = getWeatherIcon(condition);
        const windIcon = 'images/wind-regular-24.png'; // підставте свій шлях до іконки для вітру
        const humidityIcon = 'images/water-regular-24.png'; // підставте свій шлях до іконки для вологості


        const weatherInfoText = `
            <p>Weather in  ${locationName}, ${country}:</p>
            <p>temperature: ${tempCelsius} °С</p>
            <p>Condition: ${condition}</p>
            <img src="${weatherIcon}" alt="${condition}">
            <p>Wind speed: ${windSpeedKph} km/h <img src="${windIcon}" alt="wind" id="wind"></p>
            <p>Humidity: ${humidity}% <img src="${humidityIcon}" alt="humidity" id="humidity"></p>
        `;

        weatherInfoDiv.innerHTML = weatherInfoText;
    }
    
}

async function getWeatherInfo() {
    const apiKey = "05742d4e978c485d93971659240505";
    const locationInput = document.getElementById('locationInput');
    const location = locationInput.value.trim();

    if (location === '') {
        alert('Будь ласка, введіть місце');
        return;
    }

    const weatherData = await getWeather(apiKey, location);
    
    if ('error' in weatherData) {
        // Якщо виникла помилка під час отримання погоди, приховуємо блок з погодою
        weatherBox.style.display = 'none';
        // Показуємо блок з повідомленням про помилку
        error404.classList.add('active');
        return;
    } else {
        // Приховуємо блок з повідомленням про помилку
        error404.classList.remove('active');
        // Показуємо блок з погодою
        weatherBox.style.display = 'block';
        displayWeather(weatherData);
    }
}
