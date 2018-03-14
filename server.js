
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
app.use('/', express.static('views'));

var suffixes = {
	'1': 'st',
	'2': 'nd',
	'3': 'rd',
	'4': 'th',
	'5': 'th', 
	'6': 'th'
}

// get homepage
app.get('/', function(req, res) {
	var today = moment();
	// if info has not been established on this day, find all
	if (!today.isSame(lastUpdate, 'day')) {
		establishAllInfo(function() {
			sendData(res);
		});
	} else {
		sendData(res);
	}
});

// format period data and render response
function sendData(res) {
	renderObject = { letter_day: global.currentLetterDay };
	var rot = [];
	for (var i = 0; i < global.rotation.length; i++) {
		rot.push(global.rotation[i].period);
	}
	renderObject.rotation = rot.join('-');
	renderObject.article = ['A', 'E', 'F'].indexOf(global.currentLetterDay) == -1 ? "a" : "an";

	var info = classTimes.getCurrentPeriodInfo();
	renderObject.during = info.during;
	renderObject.period = info.period;
	renderObject.suffix = suffixes[info.period];

	// currently in period
	if (info.during) {
		renderObject.finish = info.end.format('h:mm A');
	} else {
		// if all periods finished
		if (info.all_finished) {
			renderObject.all_finished = true;
		} else {
			renderObject.time_until = info.time_until;
			renderObject.start_time = info.start.format('h:mm A');
		}
	}

	res.render('client.html', renderObject);
}

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