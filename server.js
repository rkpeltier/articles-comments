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

//Get articles from db to diplay on client
app.get("/articles", function(req, res){
    db.Articles.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    db.Articles.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

// Route for grabbing all notes
app.get("/note", function(req, res) {
    db.Articles.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

//Scraper
app.get("/scrape", function(req, res) {
    axios.get("http://www.echojs.com/").then(function(response) {
      var $ = cheerio.load(response.data);
  
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Articles.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

 
// Start the server
app.listen(process.env.PORT || 3000, function(){
    console.log("App is listening on port 3000");
  });