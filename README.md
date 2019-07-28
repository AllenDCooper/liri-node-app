# liri-node-app
This is a CLI node app called LIRI (Language Interpretation and Recognition Interface). It is built with:

* node.js,
* JavaScript,
* npm packages:
  * axios
  * dotenv
  * moment
  * node-spotify-api


## Overview
The liri-node-app takes in parameters from the command line and can perform four different tasks:

Num | Task | Parameter
:--- | :--- | :--- |
1 | Find a concert | concert-this "artist name"
2 | Find a song | spotify-this-song "track name"
3 | Find a movie | movie-this "movie name"
4 | Search from txt file | do-what-it-says

The parameters are parsed using JavaScript, and then passed into dedicated JavaScript functions using switch statements. Each function calls a different API to return the appropriate data, which is then printed to the console:

Num | Function | API | npm 
:--- | :--- | :--- | :---
1 | getConcert | Bands In Town | axios
2 | getSong | Spotify | node-spotify-api
3 | getMovie | OMDB | axios
4 | getRandom | var | var

Notes:

* getRandom uses fs.readFile to intake its parameters from random.txt
* All functions also print to the data to a log.txt file, using fs.appendFile
* Default values are provided for getSong and getMovie if no track or movie is provided.
* A dotenv is required for spotify keys
* getConcert uses moment.js to format date

## Functionality
![Screenshot of app](images/screenshot.gif)