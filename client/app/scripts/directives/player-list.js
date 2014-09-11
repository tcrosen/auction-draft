'use strict';

angular.module('clientApp').directive('playerList', function() {
  return {
    templateUrl: 'views/directives/player-list.html',
    scope: {
      players: '=',
      sort: '=',
      reverse: '='
    },
    link: function(scope) {
      scope.sortPlayers = function(col) {
        if (col === scope.sort) {
          scope.reverse = !scope.reverse;
        } else {
          scope.sort = col;
          scope.reverse = false;
        }
      };
    }
  };
});
