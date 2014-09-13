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
      .when('/pools/:id/edit', {
        templateUrl: 'views/pool.html',
        controller: 'PoolCtrl',
        resolve: {
          pool: function($route, PoolService) {
            return PoolService.single($route.current.params.id);
          }
        }
      })
      .when('/draft/landing', {
        templateUrl: 'views/draft-landing.html',
        controller: 'DraftLandingCtrl',
        resolve: {
          pool: function($route, PoolService) {
            return PoolService.single('-JWfYHPR-7z28GrRKaRv');
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
      console.log('User logged out');
      $rootScope.currentUser = null;
      $location.path('/login');
    });

    // $rootScope.$on('$routeChangeStart', function(e, o) {
    //   console.log('routeChangeStart: ', e, o);
    // });

    // $rootScope.$on('$routeChangeSuccess', function(e, o) {
    //   console.log('routeChangeSuccess: ', e, o);
    // });
    //
    // $rootScope.$on('$routeChangeError', function(e, o, x) {
    //   console.error('routeChangeError: ', e, o, x);
    // });


    ENV.poolsRef = ENV.firebaseRef.child('pools');
    ENV.usersRef = ENV.firebaseRef.child('users');
    ENV.playersRef = ENV.firebaseRef.child('players');
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
