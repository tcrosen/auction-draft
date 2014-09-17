'use strict';

angular.module('clientApp').directive('siteHeader', function($rootScope, loginService, syncData, PoolService) {
  return {
    templateUrl: 'views/directives/site-header.html',
    scope: true,
    link: function(scope, el) {

      // $(el).find('.dropdown-toggle').on('click', function(e) {
      //   e.preventDefault();
      //   $(el).show();
      // });

      scope.logout = function() {
        loginService.logout();
      };

      scope.nav = {
        dropdowns: {
          pools: {
            items: PoolService.list,
            show: false
          }
        }
      };

      // syncData(['users', $rootScope.auth.user.uid]).$bind(scope, 'user');
    }
  };
});
