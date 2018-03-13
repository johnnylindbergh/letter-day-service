
var express         = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser      = require('body-parser');
var moment			= require('moment');
var cal 			= require('ical');

// local modules
var private			= require('./private.js');
var letterDay		= require('./letterday.js');
var redundancy		= require('./redundancy.js');
var classTimes		= require('./classtimes.js');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.engine('html', mustacheExpress());
app.use('/', express.static('static'));

// get homepage
app.get('/', function(req, res) {
	var today = moment();
	// if info has not been established on this day, find all
	if (!today.isSame(lastUpdate, 'day')) {
		establishAllInfo(function() {
			res.send(currentLetterDay);
		});
	} else {
		res.send(currentLetterDay);
	}
});

var server = app.listen(8080, function() {
    console.log('Letter day server listening on port %s', server.address().port);

    establishAllInfo(function() {
    	console.log("Finished initial establishment on server start.");
    	console.log(classTimes.getCurrentPeriodInfo());
    });
});

function establishAllInfo(callback) {
	// record that update has been made and reset all info
	global.lastUpdate = moment();
	global.currentLetterDay = undefined;
	global.rotation = [];

	letterDay.updateLetterDay(function() {
		classTimes.getTodaysSchedule(function() {
			callback();
		});
	});
}