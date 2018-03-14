var moment			= require('moment');
var private 		= require('./private.js');
var cal 			= require('ical');


module.exports = {
	// make api call and update last modified date
	updateLetterDay: function(callback) {
		lastUpdate = moment();	// update last update
		currentLetterDay = undefined;

		cal.fromURL(private.lindbergh_school_events,{}, function(err,data) {
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
}