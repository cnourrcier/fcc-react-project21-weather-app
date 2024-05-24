import { useEffect, useState } from "react";
import Search from "../search";


export default function Weather() {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [tempFormat, setTempFormat] = useState('Celsius');

    async function fetchWeatherData(param) {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=${import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY}`
            );
            if (!res.ok) {
                throw new Error('Error occured. Please try again.');
            }
            const data = await res.json();
            setWeatherData(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch() {
        fetchWeatherData(search);
    }

    function getCurrentDate() {
        return new Date().toLocaleDateString('en-us', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    function convertKelvinToCelsius(kelvin) {
        return Math.round(kelvin - 273.15) + ' °C';
    }

    function convertKelvinToFahrenheit(kelvin) {
        return Math.round((kelvin - 273.15) * (9 / 5) + 32) + ' °F';
    }

    function handleClick() {
        setTempFormat(tempFormat === 'Celsius' ? 'Fahrenheit' : 'Celsius');
    }

    useEffect(() => {
        fetchWeatherData('passaic');
    }, [])

    if (error) {
        return <p>{error.message}</p>
    }
    console.log(weatherData);
    return (
        <div>
            <Search
                search={search}
                setSearch={setSearch}
                handleSearch={handleSearch}
            />
            {
                loading
                    ? <div className='loading'>Loading...</div>
                    : <div className='card-container'>
                        <div className='city-name'>
                            <h2>{weatherData?.name}, <span>{weatherData?.sys?.country}</span></h2>
                        </div>
                        <div className='date'>
                            <span>{getCurrentDate()}</span>
                        </div>
                        <div className='temperature'>
                            {tempFormat === 'Celsius'
                                ? convertKelvinToCelsius(weatherData?.main?.temp)
                                : convertKelvinToFahrenheit(weatherData?.main?.temp)}
                        </div>
                        <button
                            className='temp-format-button'
                            onClick={handleClick}>
                            Change to {tempFormat === 'Celsius' ? 'Fahrenheit' : 'Celsius'}
                        </button>
                        <p className='description'>{weatherData?.weather[0]?.description}</p>
                        <div className='weather-info'>
                            <div className='weather-info-column'>
                                <div>
                                    <p className='wind'>{weatherData?.wind?.speed}</p>
                                    <p>Wind Speed</p>
                                </div>
                            </div>
                            <div className='weather-info-column'>
                                <div>
                                    <p className='humidity'>{weatherData?.main?.humidity}</p>
                                    <p>Humidity</p>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}