import { useState } from "react";
"use client"; 
import "./App.css";
function App(){
const [location, setLocation] = useState('');
const [loading, setLoading] = useState(false);
const [weather, setWeatherData] = useState(null);
const [error, setError] = useState(null);

const handleSearch = async (e) => {
  e.preventDefault();
  const trimLocation = location.trim();
  if (trimLocation === "") {
    setError("Please enter a valid location.");
    setWeatherData(null);
    return;
  }

  setLoading(true);
  setError(null);
  setWeatherData(null);

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_SECRET_KEY}&q=${trimLocation}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const weatherData = {
      location: data.location.name,
      temperature: data.current.temp_c,
      description: data.current.condition.text,
      unit: "C"
    };
    setWeatherData(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    setError("City not found. Please try again.");
    setWeatherData(null);
  } finally {
    setLoading(false);
  }
};

const getTempMessage = (temperature, unit) => {
  if (unit === "C") {
    if (temperature < 0) {
      return `Brrr! It's a freezing ${temperature}°C outside. Make sure to layer up!`;
    } else if (temperature < 10) {
      return `Chilly weather at ${temperature}°C. A warm coat is recommended.`;
    } else if (temperature < 20) {
      return `Mild and cool at ${temperature}°C. A light jacket should suffice.`;
    } else if (temperature < 30) {
      return `Lovely weather at ${temperature}°C. Perfect for outdoor activities!`;
    } else {
      return `It's a warm ${temperature}°C. Remember to stay hydrated and wear sunscreen!`;
    }
  } else {
    return `Unsupported unit: ${unit}. Please use Celsius ("C").`;
  }
};

const getLMessage = (location) => {
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour < 6;
  return `${location} ${isNight ? "at Night" : "During the Day"}`;
};

const getWeatherMessage = (description) => {
  switch (description.toLowerCase()) {
    case "sunny":
      return "Enjoy the sunshine! It's a bright and beautiful day.";
    case "partly cloudy":
      return "A mix of clouds and sunshine today. A perfect balance!";
    case "cloudy":
      return "The sky is filled with clouds, creating a soft, muted light.";
    case "overcast":
      return "A blanket of gray covers the sky. It's an overcast day.";
    case "rain":
      return "Rain is falling. Don't forget to carry an umbrella!";
    case "thunderstorm":
      return "Stay indoors if possible; thunderstorms are on the horizon.";
    case "snow":
      return "Snow is falling. Bundle up and enjoy the winter wonderland!";
    case "mist":
      return "A misty day ahead, with a gentle haze in the air.";
    case "fog":
      return "Dense fog is present; drive carefully and stay alert.";
    default:
      return `Current weather: ${description}.`;
  }
};

return (
  <>
    <div className="card">
      <header className="hed">
        <h1>WORLD WEATHER</h1>
        <h3>Search for the current weather conditions in your city.</h3>
      </header>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name..."
          className="in8put"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="gicon">
          <div className="temp">
            <div className="msg">
              <div className="g">{getTempMessage(weather.temperature, weather.unit)}</div>
            </div>
          </div>
          <div className="cloud">
            <div className="msg">
              <div className="g">{getWeatherMessage(weather.description)}</div>
            </div>
          </div>
          <div className="location">
            <div className="msg">
              <div className="g">{getLMessage(weather.location)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
    
  </>

);
}

export default App;
