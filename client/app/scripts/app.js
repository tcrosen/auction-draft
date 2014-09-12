'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider, $httpProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/pools/:id', {
        templateUrl: 'views/pool.html',
        controller: 'PoolCtrl',
        resolve: {
          pool: function($route, PoolService) {
            return PoolService.fetch($route.current.params.id);
          }
        }
      })
      .when('/pools/:id/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope, $location, AuthService) {
    $rootScope.$on('$firebaseSimpleLogin:logout', function(e) {
      $location.path('/login');
    });
  })
  .constant('ENV', {
    apiRoot: 'http://localhost:1337',
    firebaseRef: new Firebase('https://auction-draft.firebaseio.com')
  });
