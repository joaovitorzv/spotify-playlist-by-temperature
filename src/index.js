const express = require('express');
const cors = require('cors');
require('dotenv').config();

const weather = require('./services/weather');
const spotify = require('./services/spotify');

const app = express();

app.use(cors())

const weatherKey = process.env.WEATHER_KEY;
const spotifyKey = process.env.SPOTIFY_KEY;

async function getTracksByTemperature(temp) {
  let genre = '';

  if (temp < 10) {
    genre = 'Classic'
  }

  if (temp >= 10 && temp <= 14) {
    genre = 'Rock'
  }

  if (temp >= 15 && temp <= 30) {
    genre = 'Pop'
  }

  if (temp > 30) {
    genre = 'Party'
  }

  const playlist = await spotify.get(`/search?q=%20genre:${genre}&type=track`, {
    headers: {
      Authorization: `Bearer ${spotifyKey}`
    }
  });
  
  return playlist.data.tracks.items.map(track => track.name);
}

// Search temperature by city name query
app.get('/playlist', async (req, res) => {
  const { city } = req.query;
  const response = await weather.get(`/weather?q=${city}&units=metric&appid=${weatherKey}`);
  const temp = response.data.main.temp;

  const tracks = await getTracksByTemperature(temp)
  res.json(tracks);
});

// Search temperature by coordinates query
app.get('/playlist/coordinates', async (req, res) => {
  const { lat, lon } = req.query;

  const response = await weather.get(`/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherKey}`);
  const temp = response.data.main.temp

  const tracks = await getTracksByTemperature(temp)
  res.json(tracks)
});

app.listen(3333);