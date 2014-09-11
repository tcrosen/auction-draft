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
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
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
      .otherwise({
        redirectTo: '/'
      });
  })
  .constant('ENV', {
    apiRoot: 'http://localhost:1337',
    firebaseRef: new Firebase('https://auction-draft.firebaseio.com')
  });
