
var express         = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser      = require('body-parser');
var moment			= require('moment');
var cal 			= require('ical');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.engine('html', mustacheExpress());
app.use('/', express.static('static'));

var lastUpdate;
var currentLetterDay;

var url = ['https://api.veracross.com/stab/subscribe/14F14099-B662-439F-BBCE-9CF991E8DA96.ics'];

//debug
updateLetterDay(function() {
	console.log("Finished,.");
});

// console.log("Event",
// 	ev.summary,
// 	'is in',
// 	ev.location,
// 	'on', ev.start.getDate());

// make api call and update last modified date
function updateLetterDay(callback) {
	lastUpdate = moment();	// update last update

	cal.fromURL(url[0],{}, function(err,data) {
		if (err) throw err;

		for (var k in data){
			if (data.hasOwnProperty(k)) {
				var ev = data[k]
				var summary = ev.summary;
				if (summary.match(/(D|d)ay\s\w\s\(US\)/g)) {
					var event_date = moment(ev.start);

					if (event_date.isSame(lastUpdate, 'day')) {
						currentLetterDay = summary.split(' ')[1];
						break;
					}
				}
			}
		}

		callback();
	});
}

app.get('/', function(req, res) {
	var today = moment();
	if (!today.isSame(lastUpdate, 'day')) {
		updateLetterDay(function() {
			res.send(currentLetterDay);
		});
	} else {
		res.send(currentLetterDay);
	}

});


var server = app.listen(8080, function() {
    console.log('Letter day server listening on port %s', server.address().port);
    lastUpdate = moment();
});