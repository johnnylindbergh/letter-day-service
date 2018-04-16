var moment 	= require('moment');
var private = require('./private.js');
var cal		= require('ical');

module.exports = {
	// get rotation data (start and end times as well as period numbers) for today
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
					if (start.isSame(global.lastUpdate, 'day') && ev.description.match(/Block:\sUS:\d/g)) {
						global.rotation[index].start = start;
						global.rotation[index].end = end;
						index++;

						if (index > 2) {
							break;
						}
					}
				}
			}

			callback();
		});
	},

	// get info about current time relative to period schedule (rotation data MUST exist)
	getCurrentPeriodInfo: function(currentTime) {
		var info = {};
		
		for (var i = 0; i < global.rotation.length; i++) {
			var period = global.rotation[i];;
			if (currentTime.isBetween(period.start, period.end) || currentTime.isSame(period.start) || currentTime.isSame(period.end)) {
				// return that period is in session / period data
				return Object.assign({during: true}, period);
			} else if (currentTime.isBefore(period.start)) {
				// calculate time until next period
				var difference = moment.utc(period.start.diff(currentTime)).format("H:m");
				return Object.assign({during: false, time_until: difference, period: period.period}, period);
			}
		}

		// indicate that all periods for today have been finished
		return {during: false, all_finished: true};


	}
}
