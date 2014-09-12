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
      .when('/pools/new', {
        templateUrl: 'views/pool.html',
        controller: 'PoolCtrl',
        resolve: {
          pool: function(Pool) {
            return new Pool();
          }
        }
      })
      .when('/pools/:id', {
        templateUrl: 'views/pool.html',
        controller: 'PoolCtrl',
        resolve: {
          pool: function($route, PoolService) {
            return PoolService.single($route.current.params.id);
          }
        }
      })
      .when('/draft/:id', {
        templateUrl: 'views/draft.html',
        controller: 'DraftCtrl',
        resolve: {
          pool: function($route, PoolService) {
            return PoolService.single($route.current.params.id);
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
  .run(function($rootScope, $location, AuthService, ENV) {
    $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
      console.log('User logged in: ', user);
      $rootScope.currentUser = user;
    });

    $rootScope.$on('$firebaseSimpleLogin:logout', function(e) {
      $rootScope.currentUser = null;
      $location.path('/login');
    });
  })
  .constant('ENV', {
    apiRoot: 'http://localhost:1337',
    firebaseRef: new Firebase('https://auction-draft.firebaseio.com'),
    positions: [{
      label: 'C',
      name: 'Center'
    }, {
      label: 'RW',
      name: 'Right Wing'
    }, {
      label: 'LW',
      name: 'Left Wing'
    }, {
      label: 'D',
      name: 'Defense'
    }, {
      label: 'G',
      name: 'Goalie'
    }, {
      label: 'B',
      name: 'Bench'
    }, {
      label: 'Util',
      name: 'Utility'
    }]
  });
