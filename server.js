'use strict';

var format = require("dateformat");
var express = require('express');

var app = express();

// Bind base URL to a notification that the microservice needs to have a parameter.
app.get("/", function(req, res) {
    return res.send('Please provide a date in unix or textual format as a parameter');
});

// Bind the microservice
app.get("/:dateString", function(req, res) {
    res.send(createDateObject(getDate(req.params.dateString)));
});

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
