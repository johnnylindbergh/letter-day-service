var anyDB 			= require('any-db');
var con 			= anyDB.createConnection('sqlite3://redundancy.db');
var request 		= require('request');

var letterDays = ['A','B','C','D','E','F'];

con.query('CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, letter INTEGER, report_count INTEGER)');

// for (var l = 0; l < 6; l++){
// 	con.query('insert into reports (letter, report_count) values (?,0)',[l]);
// }

module.exports = {

	init: function(app){
		app.get('/redundancy', function(req, res) {
		console.log(global.currentLetterDay);

			res.render('redundancy.html');

		});

		app.post('/report', function(req,res){
			res.redirect('/');
			var gRecaptcha = req.body['g-recaptcha-response'];
			var letter = req.body.letter;
			if (gRecaptcha){
				request.post('https://www.google.com/recaptcha/api/siteverify?secret=6LdFdEwUAAAAAOySni7LA-vdWg6M6XcLpASvH56s&response='+gRecaptcha,
   				 	function (error, response, body) {
      			  		if (!error && response.statusCode == 200) {
      			  			body = JSON.parse(body);
            				if (body && body.success){
            					con.query('update reports set report_count = report_count + 1 where letter = ? ',[letter], function(err){
            						if (!err){
            							con.query('select * from reports where report_count > 2', function(err, results){
            								if (!err && results != undefined && results.rows[0] != undefined){
            									global.currentLetterDay = letterDays[results.rows[0].letter]; 
            									console.log(global.currentLetterDay);
            								}
            							});
            						}

            					});


            				} 
            				
       			 		}
    			});
			}

		});

	}



}