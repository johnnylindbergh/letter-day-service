var moment = require('moment');
var private = require('./private.js');
var cal		= require('ical');

module.exports = {
	getTodaysSchedule: function(callback) {
		cal.fromURL(private.lindbergh_classes,{}, function(err,data) {
			if (err) throw err;

			var index = 0;

			for (var k in data){
				if (data.hasOwnProperty(k)) {
					var ev = data[k]
					var start = moment(ev.start);
					var end = moment(ev.end);

					// if class occurs today and is not advisory
					if (start.isSame(global.lastUpdate, 'day') && !ev.summary.match('Advisory')) {
						global.rotation[index].start = start;
						global.rotation[index].end = end;
						index++;

						// global.class_times.push({start: start, end: end});
					}
				}
			}

			callback();
		});
	},

	getCurrentPeriodInfo: function() {
		var currentTime = moment();
		var info = {};
		for (var i = 0; i < global.rotation.length; i++) {
			var period = global.rotation[i];
			if (currentTime.isBetween(period.start, period.end) || currentTime.isSame(period.start) || currentTime.isSame(period.end)) {
				
			}
		}
	}
}