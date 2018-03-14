
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

	// get info for current time
	var info = classTimes.getCurrentPeriodInfo(moment());

	var renderObject = Object.assign({
		during: info.during,
		period: info.period,
		suffix: suffixes[info.period]
	}, global.renderObject);

	// currently in period
	if (info.during) {
		renderObject.finish = info.end.format('h:mm A');
	} else {
		// if all periods finished
		if (info.all_finished) {
			renderObject.all_finished = true;
		} else {
			var split = info.time_until.split(':');
			if (split[0] != '0') {
				renderObject.hours = true;
				renderObject.time_until_hr = split[0];
			} else {
				renderObject.hours = false;
			}
			renderObject.time_until_min = split[1];
			renderObject.start_time = info.start.format('h:mm A');
		}
	}

	res.render('client.html', renderObject);
}

// init a template render object (no time-specific data)
function prepGlobalRenderObject() {
	global.renderObject = { letter_day: global.currentLetterDay };
	var rot = [];
	for (var i = 0; i < global.rotation.length; i++) {
		rot.push(global.rotation[i].period);
	}
	global.renderObject.rotation = rot.join(' - ');
	global.renderObject.article = ['A', 'E', 'F'].indexOf(global.currentLetterDay) == -1 ? "a" : "an";
}

var server = app.listen(8080, function() {
    console.log('Letter day server listening on port %s', server.address().port);

    establishAllInfo(function() {
    	console.log("Finished initial establishment on server start.");
    });
});

function establishAllInfo(callback) {
	// record that update has been made and reset all info
	global.lastUpdate = moment();			// time of last update
	global.currentLetterDay = undefined;	// current letter for today
	global.rotation = [];					// all periods that occur today and their start and end times

	letterDay.updateLetterDay(function() {
		classTimes.getTodaysSchedule(function() {
			prepGlobalRenderObject();
			callback();
		});
	});
}