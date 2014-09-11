/**
 * PlayerController
 *
 * @description :: Server-side logic for managing players
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');

module.exports = {
	import: function(req, res) {
		var sourceUrl = 'https://www.kimonolabs.com/api/24yxvxeo?apikey=abe6b22285a4d123b8d3ed875ac78331';

		request(sourceUrl, function(err, response, body) {
			if (err) {
				return res.serverError(err);
			}

			// Save the raw import data for debugging purposes
			PlayerImport.create({
				source: sourceUrl,
				data: body
			}).exec(function(err, importedData) {
				if (err) {
					return res.serverError(err);
				}

				sails.log('Player import completed: ', importedData);

				var players = PlayerService.parseYahooJson(body);

				// Update with the parsed data for debugging as well
				importedData.parsed = players;
				importedData.save();

				// Now actually save the player list
				if (players && players.length) {
					Player.destroy().exec(function(err, playersDeleted) {
						if (err) {
							return res.serverError(err);
						}

						sails.log('Players deleted: ', importedData);

						Player.create(players).exec(function(err, savedPlayers) {
							if (err) {
								return res.serverError(err);
							}

							return res.json({ message: savedPlayers.length + ' new players created successfully!' });
						});
					});
				} else {
					return res.serverError({ message: 'Error parsing player data '});
				}
			});
		});
	}
};
