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
    const artistData = data.body.artists.items;
    res.render('artist-search-results', { artistData })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
}) 

/* GET id albums*/
app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((dataFromDB) => {
      const albums = dataFromDB.body;
      res.render("albums", albums);
    })
    .catch((error) => {
      console.log("The error while searching artists occurred:", error);
    });
});

/* GET tracks list */
app.get("/tracks/:trackId", (req, res, next) => {
  const { trackId } = req.params;
  spotifyApi
    .getAlbumTracks(trackId)
    .then((data) => {
      const tracks = data.body;
      res.render("tracks", tracks);
    })
    .catch((error) => {
      console.log("The error while searching tracks occurred:", error);
    });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
