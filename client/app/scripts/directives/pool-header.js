'use strict';

angular.module('clientApp').directive('poolHeader', function(AuthService) {
  return {
    templateUrl: 'views/directives/pool-header.html',
    scope: {
      pool: '='
    },
    link: function(scope) {
      scope.logout = function() {
        AuthService.logout();
      };

      AuthService.getCurrentUser().then(function(user) {
        scope.user = user;
      });
    }
  };
});
