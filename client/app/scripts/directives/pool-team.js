'use strict';

angular.module('clientApp').directive('poolTeam', function() {
  return {
    templateUrl: 'views/directives/pool-team.html',
    scope: {
      pool: '=',
      team: '='
    },
    link: function(scope) {
    }
  };
});
