var moment = require('moment');
var private = require('./private.js');
var cal		= require('ical');

module.exports = {
	getTodaysSchedule: function(callback) {
		cal.fromURL(private.lindbergh_classes,{}, function(err,data) {
			if (err) throw err;

			for (var k in data){
				if (data.hasOwnProperty(k)) {
					var ev = data[k]
					var start = moment(ev.start);
					var end = moment(ev.end);

					console.log(start);
					console.log(end);

				}
			}

			callback();
		});
	}
}