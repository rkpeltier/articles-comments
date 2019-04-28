//Dependencies
var express = require('express');
var exphbs  = require('express-handlebars');
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

//Require models
var db = require("./models");


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

app.get("/scrape", function(req, res) {
    axios.get("http://www.echojs.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Articles.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

 
// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });