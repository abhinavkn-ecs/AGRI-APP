const OPENWEATHER_KEY = "1c1eef0769c31ee8ba5027099fa47761";
const statusEl = document.getElementById("status");
const weatherEl = document.getElementById("weatherBox");

function showStatus(txt){ statusEl.innerText = txt; }

async function getWeather(force=false){
  showStatus("Requesting location permission…");
  if(!navigator.geolocation){ showStatus("Geolocation not supported."); return; }

  navigator.geolocation.getCurrentPosition(async pos=>{
    const lat = pos.coords.latitude.toFixed(6);
    const lon = pos.coords.longitude.toFixed(6);
    showStatus(`Location: ${lat}, ${lon} — fetching weather…`);

    try{
      const url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric&lang=en`;
      const res = await fetch(url);
      const data = await res.json();

      if(data.cod && data.cod!==200){ weatherEl.textContent = `API error: ${data.message}`; showStatus("Error from weather API"); return; }

      weatherEl.textContent = 
`📍 Place: ${data.name || "unknown"}
⛅ Weather: ${data.weather[0].main} — ${data.weather[0].description}
🌡️ Temp: ${data.main.temp} °C (feels like ${data.main.feels_like} °C)
💧 Humidity: ${data.main.humidity}%
💨 Wind: ${data.wind.speed} m/s`;
      showStatus("Weather fetched ✔");
    }catch(err){ weatherEl.textContent = "Fetch error — see console"; showStatus("Error fetching weather"); console.error(err);}
  }, err=>{ showStatus("Location denied/error"); weatherEl.textContent="Allow location to see weather."; }, { enableHighAccuracy:true, timeout:10000 });
}

getWeather();
