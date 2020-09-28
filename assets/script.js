var apiKey = "77803728622d2e218662d719b1e0d81f"

var currentCityEl = $("#current-city");
var currentDateEl = $("#current-date");
var currentDate = moment().format("dddd, MMMM Do YYYY");

var currentWeatherData;
var forecastData;

var cityName;
var recentCityArr = [];

currentDateEl.text(currentDate);

function getRecentCity() {
    if (localStorage.length !== 0) {
        recentCityArr = localStorage.getItem("City").split(",");
        for (i = 0; i < recentCityArr.length; i++) {
            newDiv = $("<div>");
            if (recentCityArr[i] !== "") {
                ewDiv.text(recentCityArr[i]);
                $("#recent-search").prepend(newDiv, "<hr>");
            }
        }
    }
    if (recentCityArr.length !== 0) {
        cityName = recentCityArr[recentCityArr.length -1];
    } else {
        cityName = "Hartford";
    }
    getWeather();
};

getRecentCity();

function recentSearch() {
    newCity = $("<div>");
    newCity.text(cityName);
    $("#recent-search").prepend(newCity, "<hr>");
};
$("#recent-search").click(function() {
    cityName = event.target.innerHTML;
    console.log(cityName);
    getWeather();
});

$("#searchbar").on("search", function() {
    Event.preventDefault();
    cityName = this.value.trim();
    recentCityArr.push(cityName);
    this.value = "";
    localStorage.setItem("City", recentCityArr);
    recentSearch();
    getWeather();
})

function getWeather() {
    currentCityEl.text(cityName);
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey,
        method: "GET"
    }).then(function(data){
        currentWeatherData = data;
        getForecast();
    });
};

function getForecast() {
    lat = currentWeatherData.coord.lat;
    lon = currentWeatherData.coord.lon;
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=current,minutely,hourly&appid=" + apiKey,
        method: "GET"
    }).then(getForecastData);
}

function getForecastData(data){
    forecastData = data;
    getCurrentData();
    for (var i = 1; i < 6; i++) {
        var k = forecastData.daily[i];
        var j = $('div[value="' + i + '"]')[0].children
        day = convertUnix(k.dt);
        icon = k.weather[0].icon;
        temp = parseInt(k.temp.day);
        humidity = k.humidity;
        j[0].innerHTML = day 
        j[2].setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
        j[4].innerHTML = "Temp: " + temp + "&#8457"
        j[6].innerHTML = "Humidity: " + humidity + "%"
    }
}

function getCurrentData(){
    var temp = parseInt(currentWeatherData.main.temp);
    var humidity = currentWeatherData.main.humidity
    var windSpeed = currentWeatherData.wind.speed.toFixed(1)
    var uvIndex = forecastData.daily[0].uvi;
    var icon = forecastData.daily[0].weather[0].icon;
    $("#current-temp").text( "Temperature: " + temp + "\xB0")
    $("#current-humidity").text( "Humidity: " + humidity + "%" )
    $("#current-wind").text( "Wind Speed: " + windSpeed + " MPH" )
    $("#current-uv").text( uvIndex )
    $("#current-img").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
}

function convertUnix(dt) {
    var unix = dt
    var mili = unix * 1000
    var dateObj = new Date(mili)
    day = dateObj.toLocaleString("en-us", {weekday: "long"})
    return day;
}