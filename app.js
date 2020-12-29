const cityElement=document.querySelector('.city')
const dateElement=document.querySelector('.date')
const tempElement=document.querySelector('.temp')
const weatherElement=document.querySelector('.weather')
const hinlowElement=document.querySelector('.hinlow')
const visibElement=document.querySelector('.visib')
const windElement=document.querySelector('.wind')
var back= document.querySelector(".bg")

// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEY
const key = "0dee913a4ab87358f63a796dc048bc95";
//base url
const base= "https://api.openweathermap.org/data/2.5/"

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showerr);
}
else{
    cityElement.innerHTML = "Browser doesn't Support Geolocation. ";
}


// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showerr(error){
    cityElement.innerHTML = ` ${error.message} `;
    document.querySelector(".bg").style.backgroundImage = "url('./error.jpg')";
}


// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            console.log(data)
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            if(weather.description=="clear sky"){
                document.querySelector(".bg").style.backgroundImage = "url('./clear.jpg')";
            }
            else if(weather.description=="haze"){
                document.querySelector(".bg").style.backgroundImage = "url('./haze.jpg')";
            }
            else{
                document.querySelector(".bg").style.backgroundImage = "url('./else.jpg')";
            }
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.visibility=data.visibility;
            weather.wind=data.wind.speed;
            weather.hi=Math.floor(data.main.temp_max-KELVIN);
            weather.low=Math.floor(data.main.temp_min-KELVIN);
        })
        .then(function(){
            displayWeather();
        });
}

//calling new function to call api
const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}
 function getResults(query){
    fetch(`${base}weather?q=${query}&units=metric&APPID=${key}`)
    .then(response => {
      return response.json();
    }).then(function(data){
        weather.temperature.value = Math.floor(data.main.temp);
        weather.description = data.weather[0].description;
        if(weather.description=="haze"){
            document.querySelector(".bg").style.backgroundImage = "url('./haze.jpg')";
        }
        else if(weather.description=="clear sky"){
            document.querySelector(".bg").style.backgroundImage = "url('./clear.jpg')";
        }
        else{
            document.querySelector(".bg").style.backgroundImage = "url('./else.jpg')";
        }
        weather.city = data.name;
        weather.country = data.sys.country;
        weather.visibility=data.visibility;
        weather.wind=data.wind.speed;
        weather.hi=Math.floor(data.main.temp_max);
        weather.low=Math.floor(data.main.temp_min);
    })
    .then(function(){
        displayWeather();
    });
}










//insertion of info in DOM
function displayWeather(){
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weatherElement.innerHTML = weather.description;
    cityElement.innerHTML = `${weather.city}, ${weather.country} `;
    visibElement.innerHTML=` ${weather.visibility} `;
    windElement.innerHTML=` ${weather.wind} `;
    hinlowElement.innerHTML=`${weather.hi}°c / ${weather.low}°c`
    let now = new Date();
    dateElement.innerHTML=dateBuilder(now)
}




// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});



function dateBuilder (d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day} ${date} ${month} ${year}`;
  }
