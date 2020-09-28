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