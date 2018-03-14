
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


redundancy.init(app);


global.lastUpdate;
global.currentLetterDay;
global.rotation;


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

    lastUpdate = moment();	// init last update & letter day
    letterDay.updateLetterDay(function() {
    	console.log("Initialized letter day.");
    });
});