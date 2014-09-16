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
  .run(function($rootScope, $location, loginService, ENV) {
    // $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
    //   console.log('User logged in: ', user);
    //   $rootScope.currentUser = user;
    // });
    //
    // $rootScope.$on('$firebaseSimpleLogin:logout', function(e) {
    //   console.log('User logged out');
    //   $rootScope.currentUser = null;
    //   $location.path('/login');
    // });

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

    $rootScope.auth = loginService.init('/login');
  });
