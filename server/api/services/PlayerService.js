module.exports = {
  parseYahooJson: function(data) {
    var players = JSON.parse(data).results.players;

    return _.map(players, function(player) {
      player.positions = player.position.split(',');
      return player;
    });
  }
};
