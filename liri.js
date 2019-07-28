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
var entry = process.argv[3];

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
                getSong("The Sign")
            }
            break;
        
        case "movie-this":
            // API call to OMDB
            if (entry) {
                getMovie(command, entry);
            } else {
                getMovie("Mr Nobody");
            }
            break;
        
        case "do-what-it-says":
            // run random.txt
            getRandom(command, entry);
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
        var totalOutput = command + " " + entry + "\r\n";
        // loop through array of event responses and print needed data
        response.data.forEach(function(element) {
            // Date of the event (use moment to format this as "MM/DD/YYYY")
            var dateFormatted = moment(element.datetime).format("MM-DD-YYYY");
            // set variable for storing data element
            var output = element.venue.name + " || " + element.venue.city + ", " + element.venue.region + " || " + dateFormatted;
            // print output to terminal
            console.log(output);
            // add data element to total output
            totalOutput += output + "\r\n";
        })
        console.log("\n------------------------------\n");
        // print data output to log.txt
        fs.appendFile("log.txt", totalOutput, function(err) {
            if (err) {
                console.log(err);
            } console.log("log.txt has been updated");
        })
    })
}

function getSong(command, entry) {
    // Function will display the artist(s), song name, preview link of song in Spotify, and album
    console.log("get song: " + entry);
    console.log("\n--------------------------\n");
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
            console.log("Artist(s): " + artists + " || " + "Song: " + song + " || " + "Link: " + previewLink + " || " + "Album: " + album);
            })
        console.log("\n------------------------------\n");
    })
}

function getMovie(command, entry) {
    // Function will display movie info in the terminal
    console.log("Get movie: " + entry);
    console.log("\n--------------------------\n");
    // define queryURL
    var apiKey = "trilogy"
    var title = entry.replace(" ", "+")
    var queryURL = "http://www.omdbapi.com/?apikey=" + apiKey + "&t=" + title
    // use axios to run api call
    axios.get(queryURL).then(function(response) {
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
        // print results
        console.log("Title: " + title + x + "Year: " + year + x + "IMDB Rating: " + imdbRating + x + "Rotten Tomatoes: " + rtRating + x + 
        "Country: " + country + x + "Language: " + language + x + "Plot: " + plot + x + "Actors: " + actors);
        console.log("\n--------------------------\n")
    })
}

function getRandom(command, entry) {
    fs.readFile("random.txt", "utf-8", function(error, data){
        if (error) {
            console.log(error);
        }
        // split string into two elements (command and entry) to pass into liri function
        var arr = data.split(",")

        liri(arr[0], arr[1]);
    })
}

// call liri function
liri(command, entry);