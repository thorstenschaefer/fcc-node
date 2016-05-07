'use strict';

var format = require("dateformat");
var express = require('express');

var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Bind base URL to a notification that the microservice needs to have a parameter.
app.get("/timestamp", function(req, res) {
    return res.send('Please provide a date in unix or textual format as a parameter');
});

// Bind the microservice
app.get("/timestamp/:dateString", function(req, res) {
    res.send(createDateObject(getDate(req.params.dateString)));
});

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

/**
 * Converts a date in string format into a Javascript date. If the date string
 * is comprised of only numbers, we assume its a unix date and convert it to the
 * corresponding JS date. Otherwise we parse the date using standard Javascript.
 * If the format used in the date string is invalid, NaN is returned. 
 */
function getDate(dateString) {
    if (dateString.match(/^\d+$/)) {
        return new Date(+dateString * 1000);
    } else {
        return Date.parse(dateString);
    }
}

/** 
 * Creates the object which contains natural and unix date as properties.
 * If the given data parameter is invalid (NaN), we return an object with
 * null values for both natural and unix date.
 */
function createDateObject(date) {
    if (Number.isNaN(date))
        return { "natural" : null, "unix" : null };
	return { "natural" : format(date, "mmmm d, yyyy"), "unix" : date/1000 };
}
