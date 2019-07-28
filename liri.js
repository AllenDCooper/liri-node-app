// sample commands this CLI program can run
    // node liri.js concert-this "Dave Matthews Band"
    // node liri.js spotify-this-song "Hey Jude"
    // node liri.js spotify-this-song
    // node liri.js movie-this "the matrix"
    // node liri.js movie-this
    // node liri.js do-what-it-says

require("dotenv").config();
var fs = require('fs')
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

// initialize variable for capturing Liri commmand
var command = process.argv[2];

// initialize variable for capturing user entry (i.e. song title or band name)
var entry = process.argv[3]

// liri function to parse user entry and call search functions
function liri (command, entry) {
    switch (command) {

        case "concert-this":
            // API call to "Bands In Town"
            getConcert(command, entry);
            break;

        case "spotify-this-song":
            // API call to Spotify
            if (entry) {
                getSong(command, entry);
            } else {
                getSong(command, "The Sign")
            }
            break;
        
        case "movie-this":
            // API call to OMDB
            if (entry) {
                getMovie(command, entry);
            } else {
                getMovie(command, "Mr Nobody");
            }
            break;
        
        case "do-what-it-says":
            // run random.txt
            getRandom();
            break;
    }
};

function getConcert (command, entry) {
    // Function will display the name of venue, venue location, and date of event
    console.log("Get concert: " + entry);
    console.log("\n--------------------------\n");
    // query bands in town API
    var queryURL = "https://rest.bandsintown.com/artists/" + entry + "/events?app_id=codingbootcamp"
    // uses axios package to make ajax call
    axios.get(queryURL).then(function(response) {
        // assign variable to output total response
        var concertLog = command + " " + entry + "\r\n";
        // loop through array of event responses and print needed data
        response.data.forEach(function(element) {
            // Date of the event (use moment to format this as "MM/DD/YYYY")
            var dateFormatted = moment(element.datetime).format("MM-DD-YYYY");
            // set variable for storing data element
            var concert = element.venue.name + " || " + element.venue.city + ", " + element.venue.region + " || " + dateFormatted;
            // print concert to terminal
            console.log(concert);
            // add data element to concert log
            concertLog += concert + "\r\n";
        })
        console.log("\n------------------------------\n");
        concertLog += "\r\n"
        // print data output to log.txt
        fs.appendFile("log.txt", concertLog, function(err) {
            if (err) {
                console.log(err);
            } console.log("log.txt has been updated");
        })
    })
}

function getSong(command, entry) {
    // Function will display the artist(s), song name, preview link of song in Spotify, and album
    // Print a heading to terminal
    console.log("get song: " + entry);
    console.log("\n--------------------------\n");
    // use node-spotify-api to run api call
    spotify.search({
        type: "track",
        query: entry
    }, function(err, data) {
        if (err) {
            return console.log("Error occurred: " + err)
        }
        // initialize variable to store total output of all tracks 
        var trackLog = command + " " + entry + "\r\n";
        // loop through tracks and return specified elements for each one
        data.tracks.items.forEach(function(element){
            // initiliaze artists array for storing the various artists on the track
            artists = [];
            // loop through the artists, save them to the artists array, and then convert it to a string
            element.album.artists.forEach(function(element){
                artists.push(element.name)
                artists.join(", ")
            })
            // assign variables for object values to be returned
            var previewLink = element.external_urls.spotify;
            var album = element.album.name;
            var song = element.name;
             // set variable for storing data element
            var track = "Artist(s): " + artists + " || " + "Song: " + song + " || " + "Link: " + previewLink + " || " + "Album: " + album
            // print returned info
            console.log(track);
            // add data element to total track
            trackLog += track + "\r\n"
        })
        trackLog += "\r\n"  
        console.log("\n------------------------------\n");
        // write output to log.txt file
        fs.appendFile("log.txt", trackLog, function(err) {
            if (err) {
                console.log(err)
            } console.log("log.txt successfully updated");
        })
    })

}

function getMovie(command, entry) {
    // Function will display movie info in the terminal
    // Print a heading to the terminal
    console.log("Get movie: " + entry);
    console.log("\n--------------------------\n");
    // define queryURL
    var apiKey = "trilogy"
    var title = entry.replace(" ", "+")
    var queryURL = "http://www.omdbapi.com/?apikey=" + apiKey + "&t=" + title
    // use axios to run api call
    axios.get(queryURL).then(function(response) {
        // assign variable to output total response 
        var movieLog = command + " " + entry + "\r\n";
        // assign variables to results
        var title = response.data.Title;
        var year = response.data.Year;
        var imdbRating = response.data.Ratings[0].Value;
        var rtRating = response.data.Ratings[1].Value;
        var country = response.data.Country;
        var language = response.data.Language;
        var plot = response.data.Plot;
        var actors = response.data.Actors;
        var x = "\n";
        var movie = "Title: " + title + x + "Year: " + year + x + "IMDB Rating: " + imdbRating + x + "Rotten Tomatoes: " + rtRating + x + 
        "Country: " + country + x + "Language: " + language + x + "Plot: " + plot + x + "Actors: " + actors
        // print results
        console.log(movie);
        console.log("\n--------------------------\n")
        // add data element to movieLog
        movieLog += movie + "\r\n" + "\r\n";
         // write output to log.txt file
         fs.appendFile("log.txt", movieLog, function(err) {
            if (err) {
                console.log(err)
            } console.log("log.txt successfully updated");
        })
    })
}

function getRandom() {
    fs.readFile("random.txt", "utf-8", function(error, data){
        if (error) {
            console.log(error);
        }
        // split string into two elements (command and entry) to pass into liri function
        var arr = data.split(",")
        console.log(arr[0]);
        console.log(arr[1]);
        liri(arr[0], arr[1]);
    })
}

// call liri function
liri(command, entry);