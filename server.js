var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

var app = express();

app.use(express.static(__dirname + '/public'));
var port = process.env.PORT || 8080;

mongoose.connect("mongodb://localhost/cheeriomongoose");

// for heroku
// var MONGODB_URI = "";
// mongoose.connect(MONGODB_URI, function(err) {
// 	if(err) throw err;
// 	console.log('database connected');
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var expressHandlebars = require('express-handlebars');
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var routes = require('./routes/routes.js');
app.use('/',routes);

app.listen(port, function() {
    console.log("Listening on localhost:" + port);
});