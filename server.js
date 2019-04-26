var express = require('express');
var exphbs  = require('express-handlebars');
var mongoose = require("mongoose");

var PORT = 3000;
 
var app = express();

//Connect to mongodb
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

//Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
 
app.get('/', function (req, res) {
    res.render('home');
});
 
// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });