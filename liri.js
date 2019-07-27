require("dotenv").config();
var fs = require('fs')
var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);

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
        getSong(entry);
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
    // Function will display the following
    // Name of venue
    // Venue location
    // Date of the event (use moment to format this as "MM/DD/YYYY")
    console.log("get concert: " + entry);
}


function getSong(entry) {
    // Function will display the following in terminal:
    // Artist(s)
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from
    // If no song is provided then your program will default to "The Sign" by Ace of Base.
    console.log("get song: " + entry);
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