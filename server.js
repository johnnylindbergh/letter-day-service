var cal = require('ical');
cal.fromURL('https://api.veracross.com/stab/subscribe/14F14099-B662-439F-BBCE-9CF991E8DA96.ics',{}, function(err,data){
	//console.log(data);
	//console.log(err);
	for (var k in data){
		if (data.hasOwnProperty(k)) {
			var ev = data[k]
			console.log("Event",
				ev.summary,
				'is in',
				ev.location,
				'on', ev.start.getDate());
		}
	}
});
