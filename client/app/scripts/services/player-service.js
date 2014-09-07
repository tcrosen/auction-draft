'use strict';

angular.module('clientApp').factory('PlayerService', function($http, API) {
  var playerService = {};

  playerService._api = new API('/players');

  playerService.getPlayers = function() {
    return playerService._api.get();
  };

  playerService.getUndrafted = function() {
    return playerService.getPlayers().then(function(players) {
      return _.filter(players, function(player) {
        return !player.owner;
      });
    });
  };

  playerService.getPlayersByPosition = function(position) {
    return playerService.getPlayers().then(function(players) {
      return _.where(players, function(player) {
        return player.positions.indexOf(position) >= 0;
      });
    });
  };

  return playerService;
});
