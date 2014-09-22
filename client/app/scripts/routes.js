angular
  .module('clientApp')
  .config(function ($routeProvider, $httpProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          pool: function($route, PoolService) {
            return PoolService.single('-JWfYHPR-7z28GrRKaRv');
          }
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/pools/new', {
        templateUrl: 'views/pool.html',
        controller: 'PoolCtrl',
        resolve: {
          authRequired: true,
          pool: function(Pool) {
            return new Pool();
          }
        }
      })
      .when('/pools/:id/edit', {
        templateUrl: 'views/pool.html',
        controller: 'PoolCtrl',
        resolve: {
          authRequired: true,
          pool: function($route, PoolService) {
            return PoolService.single($route.current.params.id);
          }
        }
      })
      .when('/draft/landing', {
        templateUrl: 'views/draft-landing.html',
        controller: 'DraftLandingCtrl',
        resolve: {
          authRequired: true,
          pool: function($route, PoolService) {
            return PoolService.single('-JWfYHPR-7z28GrRKaRv');
          }
        }
      })
      .when('/pools/:poolId/draft', {
        templateUrl: 'views/draft.html',
        controller: 'DraftCtrl'
      })
      .when('/pools/:poolId/draft/:teamId', {
        templateUrl: 'views/draft.html',
        controller: 'DraftCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
