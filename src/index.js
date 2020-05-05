const express = require('express');
const cors = require('cors');

const api = require('./services/weather');
const spotify = require('./services/spotify');

const app = express();

app.use(cors())

const apiKey = '8b5e01396697f31491df14247339a483';
const SpotifyKey = 'BQBf_DKkMCdj3yFE3cTvP1Ze51Lq5x741XIIou6j4NqtmmE85x9GzHJEuychu2-rHBqumMP-wShxwGHHRUqclKaL8SlMVTaKnnuPHIKvNs_eH0ZZHqQJ55_y6B4R6MtAOsHbIJhA';

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
      Authorization: `Bearer ${SpotifyKey}`
    }
  });
  
  return playlist.data.tracks.items.map(track => track.name);
}

// Search temperature by city name query
app.get('/playlist', async (req, res) => {
  const { city } = req.query;
  const response = await api.get(`/weather?q=${city}&units=metric&appid=${apiKey}`);
  const temp = response.data.main.temp;

  const tracks = await getTracksByTemperature(temp)
  res.json(tracks);
});

// Search temperature by coordinates query
app.get('/playlist/coordinates', async (req, res) => {
  const { lat, lon } = req.query;

  const response = await api.get(`/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
  const temp = response.data.main.temp

  const tracks = await getTracksByTemperature(temp)
  res.json(tracks)
});

app.listen(3333);