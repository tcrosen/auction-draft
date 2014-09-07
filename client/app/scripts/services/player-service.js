'use strict';

angular.module('clientApp').factory('PlayerService', function($http, API) {
  var playerService = {};

  playerService._api = new API('/players');

  playerService.fetch = function() {
    return playerService._api.get();
  };

  playerService.getByDrafted = function(isDrafted) {
    return playerService.fetch().then(function(players) {
      return playerService.filterByDrafted(players, isDrafted);
    });
  };

  playerService.getByPosition = function(position) {
    return playerService.fetch().then(function(players) {
      return playerService.filterByPosition(players, position);
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

  return playerService;
});
