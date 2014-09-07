module.exports = {
  parseYahooJson: function(data) {
    var players = JSON.parse(data).results.players;

    var i = 1;
    return _.map(players, function(player) {
      player.positions = player.position.split(',');
      player.firstName = player.name.split(' ')[0].trim();
      player.lastName = player.name.replace(player.firstName, '').trim();
      player.averageDraftRank = parseFloat(player.rank);
      player.rank = i;
      i++;
      return player;
    });


  }
};
