'use strict';

angular.module('clientApp').directive('draftOrder', function($rootScope) {
  return {
    templateUrl: 'views/directives/draft-order.html',
    scope: {
      poolTeams: '=',
      currentAuction: '='
    },
    link: function(scope) {
    }
  };
});
