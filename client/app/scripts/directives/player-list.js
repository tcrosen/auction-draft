'use strict';

angular.module('clientApp').directive('playerList', function() {
  return {
    templateUrl: 'views/directives/player-list.html',
    scope: {
      players: '='
    }
  };
});
