'use strict';

angular.module('clientApp').factory('PlayerService', function($http, ENV) {
  var playerService = {};

  playerService.ref = ENV.playersRef;
  playerService.syncData = ENV.playersSync.$asArray();

  playerService.getSeedData = function() {
    // return $http.get('/data/players.json').then(function(resp) {
    //   console.log('Players data:', resp.data);
    //   return resp.data;
    // });

    return $http.jsonp('https://www.kimonolabs.com/api/24yxvxeo?apikey=abe6b22285a4d123b8d3ed875ac78331&callback=JSON_CALLBACK', {
      crossDomain: true
    }).then(function(resp) {
      console.log('Players data:', resp.data);
      return resp.data;
    });
  };

  playerService.seed = function() {
    return playerService.getSeedData().then(function(playerData) {
      var players = playerService.parseYahooJson(playerData);

      playerService.ref.remove(function() {
        _.each(players, function(player) {
          playerService.syncData.$add(player);
        });
      });
    });
  };

  playerService.parseYahooJson = function(data) {
    var players = data.results.players;
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
  };

  playerService.filterByPosition = function(players, position) {
    return _.where(players, function(player) {
      return player.positions.indexOf(position) >= 0;
    });
  };

  playerService.filterByDrafted = function(players, isDrafted) {
    return _.filter(players, function(player) {
      return isDrafted ? player.owner : !player.owner;
    });
  };

  playerService.players = {};

  playerService.syncData.$loaded().then(function(players) {
    console.log('Players loaded: ', players);

    angular.extend(playerService.players, {
      all: players,
      filtered: players,
      filter: null,
      hideDrafted: false,
      sort: 'rank',
      reverse: false
    });
  });

  return playerService;
});
