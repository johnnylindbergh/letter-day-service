
var express         = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser      = require('body-parser');
var moment			= require('moment');
var cal 			= require('ical');
var private			= require('./private.js');
var letterDay		= require('./letterday.js');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.engine('html', mustacheExpress());
app.use('/', express.static('static'));

var lastUpdate;
var currentLetterDay;

app.get('/', function(req, res) {
	var today = moment();
	if (!today.isSame(lastUpdate, 'day')) {
		letterDay.updateLetterDay(function() {
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