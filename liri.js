require("dotenv").config();
var fs = require('fs')
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

// Make it so liri.js can take in one of the following commands:
//    * `concert-this`
//    * `spotify-this-song`
//    * `movie-this`
//    * `do-what-it-says`

// initialize variable for capturing Liri commmand
var command = process.argv[2];

// initialize variable for capturing user entry (i.e. song title or band name)
var entry = process.argv[3];

switch (command) {

    case "concert-this":
        // API call to "Bands In Town"
        getConcert(entry);
        break;

    case "spotify-this-song":
        // API call to Spotify
        if (entry) {
            getSong(entry);
        } else {
            getSong("The Sign")
        }
        break;
    
    case "movie-this":
        // API call to OMDB
        getMovie(entry);
        break;
    
    case "do-what-it-says":
        // API call to Spotify using random.txt
        getRandomSong();
        break;
}

function getConcert (entry) {
    // Function will display the name of venue, venue location, and date of event
    console.log("Get concert: " + entry);
    // query bands in town API
    var queryURL = "https://rest.bandsintown.com/artists/" + entry + "/events?app_id=codingbootcamp"
    // uses axios package to make ajax call
    axios.get(queryURL).then(function(response) {
        // loop through array of event responses and print needed data
        response.data.forEach(function(element) {
            // Date of the event (use moment to format this as "MM/DD/YYYY")
            var dateFormatted = moment(element.datetime).format("MM-DD-YYYY");
            console.log(element.venue.name + " || " + element.venue.city + ", " + element.venue.region + " || " + dateFormatted);
        })
        console.log("\n------------------------------\n");
    })
}

function getSong(entry) {
    // Function will display the artist(s), song name, preview link of song in Spotify, and album
    console.log("get song: " + entry);
    spotify.search({
        type: "track",
        query: entry
    }, function(err, data){
        if (err) {
            return console.log("Error occurred: " + err)
        } 
        data.tracks.items.forEach(function(element){
            // console.log(JSON.stringify(element));
            artists = [];
            // loop through the artists, save them to the artists array, and then convert it to a string
            element.album.artists.forEach(function(element){
                artists.push(element.name)
                artists.join(", ")
            })
            // assign variables for keys
            var previewLink = element.external_urls.spotify;
            var album = element.album.name;
            var song = element.name;
            // print returned info
            console.log("Artists: " + artists + " || " + "Song: " + song + " || " + "Link: " + previewLink + " || " + "Album: " + album);
            })
        console.log("\n------------------------------\n");
    })
}

function getMovie(entry) {
    // Function will display the following in terminal"
    // Title of the movie.
    // Year the movie came out.
    // IMDB Rating of the movie.
    // Rotten Tomatoes Rating of the movie.
    // Country where the movie was produced.
    // Language of the movie.
    // Plot of the movie.
    // Actors in the movie.
    // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    console.log("get movie: " + entry);
}

function getRandomSong() {
    console.log("get random song: " + entry)
}