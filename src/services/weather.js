const axios = require('axios');

const weather = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5'
});

module.exports = weather;