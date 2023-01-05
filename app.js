require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



/* GET home page */
app.get('/', function (req, res, next) {
  res.render('index');
}) 


/* GET search */
app.get('/artist-search', function (req, res, next) {
  const query = req.query.title
  spotifyApi
  .searchArtists(query)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const artistData = data.body.artists.items;
    console.log(`artistsData: ${ artistData }`)
    res.render('artist-search-results', { artistData })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
}) 



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
