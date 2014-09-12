'use strict';

angular.module('clientApp').directive('siteHeader', function(AuthService, PoolService) {
  return {
    templateUrl: 'views/directives/site-header.html',
    scope: true,
    link: function(scope, el) {

      // $(el).find('.dropdown-toggle').on('click', function(e) {
      //   e.preventDefault();
      //   $(el).show();
      // });

      scope.logout = function() {
        AuthService.logout();
      };

      scope.nav = {
        dropdowns: {
          pools: {
            items: PoolService.list,
            show: false
          }
        }
      };

      AuthService.getCurrentUser().then(function(user) {
        scope.user = user;
      });
    }
  };
});
