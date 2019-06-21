var Spotify = require('node-spotify-api');
var axios = require("axios");
var inquirer = require("inquirer");
var moment = require("moment")
var fs = require("fs");
require("dotenv").config();
var keys = require("./keys.js");


var movieThis = "";
// var userAction = '';
var userQuery = "";
var artist = '';

inquirer.prompt([
  {
    type: "list",
    message: "Which command would you like to run",
    name: "command",
    choices: ["spotify-this-song", "concert-this", "movie-this", "do-what-it-says"]
  },
])

  .then(function (answer) {
    if (answer.command === "spotify-this-song") {
      spotifyThis();
    }
    else if (answer.command === "movie-this") {
      console.log(answer.command);
      moviePick();
    }
    else if (answer.command === "concert-this") {
      rockOut();
    }
    else if (answer.command === "do-what-it-says") {
      doIt();
    }


    function spotifyThis(userQuery) {
      inquirer.prompt([
        {
          type: "input",
          message: "Which artist would you like to listen to ?",
          name: "artist",

        },
      ])
        .then(function (inquirerResponse) {

          if (inquirerResponse.artist === "") {
            console.log("You didnt enter a song: this is Freaky by Tory Lanez ");
            userQuery = "Freaky"
          }
          else if (inquirerResponse.artist === undefined){
            console.log("This artist dosen't have any upcoming shows  ");
          } 
          else {
            userQuery = inquirerResponse.artist
            console.log(inquirerResponse.artist);
          
          
          }
          var spotify = new Spotify(keys.spotify)
          spotify.search({ type: 'track', query: userQuery }, function (err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            if (data.tracks.items[0]===undefined){
              console.log("This artist dosen't have any songs ");
            }
            else {
            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].album.album_type);
            console.log(data.tracks.items[0].artists[0].external_urls);
            }
          });

        })

    }
    function moviePick() {
      inquirer.prompt([
        {
          type: "input",
          message: "Which movie would you like to see?",
          name: "movie",

        },
      ])
        .then(function (inquirerResponse) {

          if (inquirerResponse.movie === "") {
            console.log("You didnt enter a movie: this is Rocky Balboa  ");
            movieThis = "Rocky Balboa"
            console.log(movieThis);
          }
          else {
            movieThis = inquirerResponse.movie
            console.log(inquirerResponse.movie);
          }


          var queryUrl = ("http://www.omdbapi.com/?t=" + movieThis + "&y=&plot=short&apikey=66048da5")
          axios.get(queryUrl).then(function movieThis(response) {
            if (response.data.Ratings === undefined){
              console.log("This movie dosen't exist ");
            }
            else {
            console.log("\n" + "The Movie Title: " + response.data.Title), "\n"
            console.log("\n" + "Year the movie came out: " + response.data.Year, "\n")
            console.log("\n" + "IMDB gave this movie a rating of: " + response.data.Ratings[0].Value, "\n")
            console.log("\n" + "Rotten Tomatoes rated this movie: " + response.data.Ratings[1].Value, "\n")
            console.log("\n" + "It was produced in this language: " + response.data.Language, "\n")
            console.log("\n" + "Filmed in this country: " + response.data.Country, "\n")
            console.log("\n" + "Here is the plot: " + response.data.Plot, "\n")
            console.log("\n" + "Staring: " + response.data.Actors, "\n")
            }
          })
        })

    }

    function rockOut() {
      inquirer.prompt([
        {
          type: "input",
          message: "Which band would you like to know about?",
          name: "band",
        },
      ])
      .then(function (inquirerResponse) {
      if (inquirerResponse.band === "") {
        console.log("You didn't enter a band: this is Metallica  ");
        artist = "Metallica"
      }
      else {
        artist = inquirerResponse.band
        console.log(inquirerResponse.band);
      }
          // console.log(artist)
          var url = ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=6a1fc55c-04c4-4ddf-844f-e2ee23f4ceba&date=upcoming")
          axios.get(url).then(function (response) {
            if (response.data[0] === undefined){
              console.log("This artist dosen't have any upcoming shows! ");
            }
              else if(response.data[0].venue === undefined){
                console.log("This artist dosen't have any upcoming shows! ");
              }
            else {
            console.log("This artist is having a concert here : " +response.data[0].venue.name);
            console.log("This artist is having a concert in this city : "+ response.data[0].venue.city);
            var datetime = (response.data[0].datetime).slice(0, 10);
            datetimeI = moment(datetime, "YYYY-MM-DD").format("MM/DD/YYYY");
            console.log("Event date: " + datetimeI);
            }
          })
        })
    }
  })

function doIt() {
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    var dataArr = data.split(",");
     if ( dataArr[0]=== "spotify-this-song"){
      userQuery = dataArr[1];
      var spotify = new Spotify(keys.spotify)
      spotify.search({ type: 'track', query: userQuery }, function (err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        if (data.tracks.items[0]===undefined){
          console.log("This artist dosen't have any songs ");
        }
        else {
        console.log(data.tracks.items[0].artists[0].name);
        console.log(data.tracks.items[0].album.album_type);
        console.log(data.tracks.items[0].artists[0].external_urls);
        }
      });
    }
     if ( dataArr[2]=== "movie-this"){
          movieThis = dataArr[3];
          var queryUrl = ("http://www.omdbapi.com/?t=" + movieThis + "&y=&plot=short&apikey=66048da5")
          axios.get(queryUrl).then(function movieThis(response) {
        if (response.data.Ratings === undefined){
        console.log("This movie dosen't exist ");
        }
        else {
        console.log("\n" + "The Movie Title: " + response.data.Title), "\n"
        console.log("\n" + "Year the movie came out: " + response.data.Year, "\n")
        console.log("\n" + "IMDB gave this movie a rating of: " + response.data.Ratings[0].Value, "\n")
        console.log("\n" + "Rotten Tomatoes rated this movie: " + response.data.Ratings[1].Value, "\n")
        console.log("\n" + "It was produced in this language: " + response.data.Language, "\n")
        console.log("\n" + "Filmed in this country: " + response.data.Country, "\n")
        console.log("\n" + "Here is the plot: " + response.data.Plot, "\n")
        console.log("\n" + "Staring: " + response.data.Actors, "\n")
        }
      })
    }
    if ( dataArr[4]=== "concert-this"){
      artist = dataArr[5];
      var url = ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=6a1fc55c-04c4-4ddf-844f-e2ee23f4ceba&date=upcoming")
      axios.get(url).then(function (response) {
        if (response.data[0].venue === undefined){
          console.log("This artist dosen't exist ");
        }else {
        console.log("This artist is having a concert here : "+ response.data[0].venue.name);
        console.log("This artist is having a concert in this city : " + response.data[0].venue.city);
        var datetime = (response.data[0].datetime).slice(0, 10);
        datetimeI = moment(datetime, "YYYY-MM-DD").format("MM/DD/YYYY");
        console.log("Event date: " + datetimeI);
        }
      })
    }
  })
  
}








// switch(userAction){
//   case "spotify-this-song":
//     spotifyThis(userQuery);
//     break;
//   case "movie-this":
//     break;
//   default:
//     console.log("Please type an action");

// }
