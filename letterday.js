var moment 	= require('moment');
var private = require('./private.js');
var cal		= require('ical');

module.exports = {
	// make api call and update last modified date
	updateLetterDay: function(callback) {

		cal.fromURL(private.lindbergh_school_events,{}, function(err,data) {
			if (err) throw err;

			for (var k in data){
				if (data.hasOwnProperty(k)) {
					var ev = data[k]
					var summary = ev.summary;
					if (summary.match(/(D|d)ay\s\w\s\(US\)/g)) {
						var event_date = moment(ev.start);

						if (event_date.isSame(global.lastUpdate, 'day')) {
							var data = summary.split(' ');
							global.currentLetterDay = data[1];
							var rot = data[3].split('-');

							for (var i = 0; i < rot.length; i++) {
								global.rotation.push({period: rot[i]});
							}
							break;
						}
					}
				}
			}

			callback();
		});
	},

	// get the next available letter day info
	getNextLetterDay: function(callback) {
		var result = {};

		cal.fromURL(private.lindbergh_school_events, {}, function(err, data) {
			if (err) throw err;

			for (var k in data){
				if (data.hasOwnProperty(k)) {
					var ev = data[k]
					var summary = ev.summary;

					if (summary.match(/(D|d)ay\s\w\s\(US\)/g)) {
						var event_date = moment(ev.start);

						// find first letter day AFTER the current date
						if (event_date.isAfter(global.lastUpdate, 'day')) {
							result.next_day = event_date.format('dddd');

							var data = summary.split(' ');
							result.next_letter = data[1];
							result.next_rot = data[3].split('-').join(' - ');
							break;
						}
					}
				}
			}
			callback(result);
		});

	}
}
