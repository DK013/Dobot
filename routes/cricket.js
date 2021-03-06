const request    = require('request');
const cheerio    = require('cheerio');
exports.getScore = getScore;


function getScore(callback){
	request('http://www.cricbuzz.com', function (error, response, html) {
			if (!error && response.statusCode == 200) {
	 			var $                = cheerio.load(html);
	 			var featured_section = $("div[ng-if*='Featured'] .cb-mtch-blk");
	 			var match_reports    = [];
				var separator        = ', ';
				var bullet           = '* ';
				featured_section.each(function() {
					var data = $(this).children().first();
					var status_class = data.children().last().attr('class');
					if(status_class.indexOf('cb-text-preview') !== -1) {
						var iter = data.children().first();
						var team1 = iter.text();
						var iter = iter.next();
						var team2 = iter.text();
						var team2 = iter.text();
						var iter = iter.next();
						var status = 'Upcoming';
						var report = bullet +
							team1 + ' Vs. ' + team2 + separator +
							status + separator +
							Date(iter.attr('ng-bind').split(' ')[0]);
							
					}
					else {
						var iter = data.children().first();
						var team1 = iter.children().first().text();
						var team1_score = iter.children().last().text();
						var iter = iter.next();
						var team2 = iter.children().first().text();
						var team2_score = iter.children().last().text();
						var iter = iter.next();
						if(iter.attr('class').indexOf('cb-text-live') !== -1) {
							var status = 'In Progress';
						}
						else {
							var status = 'Completed';
						}
						var report = bullet +
							team1 + ' Vs. ' + team2 + separator +
							status + separator +
							team1 + ': ' + team1_score + separator +
							team2 + ': ' + team2_score;
					}
					match_reports.push(report);
				})
				return callback(null, match_reports.join('\n'));
			}
		}); 	
}
