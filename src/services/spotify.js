const axios = require('axios');

const spotify =  axios.create({
  baseURL: 'https://api.spotify.com/v1'
});

module.exports = spotify;