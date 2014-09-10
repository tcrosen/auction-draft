/**
 * PlayerController
 *
 * @description :: Server-side logic for managing players
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	import: function(req, res) {
		request('https://www.kimonolabs.com/api/24yxvxeo?apikey=abe6b22285a4d123b8d3ed875ac78331', function(err, response, body) {
			var players = PlayerService.parseYahooJson(body);

			Player.create(players).exec(function(err, players) {
				if (err) {
					return res.serverError(err);
				}

				return res.json({ message: players.length + ' created successfully!' });
			});
		});
	}
};
