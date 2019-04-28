//Dependencies
var express = require('express');
var exphbs  = require('express-handlebars');
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

//Require models
// var db = require("./models");


var PORT = 3000;
var app = express();


//Connect to mongodb
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

//Middleware
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//Get route to handlebars home
app.get("/", function (req, res) {
    res.render("home");
});

//Scraper

app.get("/scraper", function(req, res){
    // Making a request via axios for `nhl.com`'s homepage
    axios.get("https://www.nhl.com/").then(function(response) {

    // Load the body of the HTML into cheerio
    var $ = cheerio.load(response.data);
  
    // Empty array to save our scraped data
    var results = [];
  
    // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
    $("h4.headline-link").each(function(i, element) {
  
      // Save the text of the h4-tag as "title"
      var title = $(element).text();
  
      // Find the h4 tag's parent a-tag, and save it's href value as "link"
      var link = $(element).parent().attr("href");
  
      // Make an object with data we scraped for this h4 and push it to the results array
        results.push({
        title: title,
        link: link
      });
    });
  
    // After looping through each h4.headline-link, log the results
    console.log(results);
  });
});

 
// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });