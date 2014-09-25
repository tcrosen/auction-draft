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
  .run(function(ENV, $firebase) {
    // $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
    //   console.log('User logged in: ', user);
    //   $rootScope.currentUser = user;
    // });
    //
    // $rootScope.$on('$firebaseSimpleLogin:logout', function(e) {
    //   console.log('User logged out');
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

    //
    // ENV.poolsRef = ENV.firebaseRef.child('pools');
    // ENV.usersRef = ENV.firebaseRef.child('users');
    // ENV.playersRef = ENV.firebaseRef.child('players');
    //
    // $rootScope.auth = loginService.init('/login');

    ENV.poolsRef = ENV.firebaseRef.child('pools');
    ENV.poolsSync = $firebase(ENV.poolsRef);
    ENV.poolRef = ENV.poolsRef.child('-JWfYHPR-7z28GrRKaRv');
    ENV.poolSync = $firebase(ENV.poolRef);
    ENV.poolTeamsRef = ENV.firebaseRef.child('poolTeams');
    ENV.poolTeamsSync = $firebase(ENV.poolTeamsRef);
    ENV.playersRef = ENV.firebaseRef.child('players');
    ENV.playersSync = $firebase(ENV.playersRef);
    ENV.usersRef = ENV.firebaseRef.child('users');
    ENV.usersSync = $firebase(ENV.usersRef);
    ENV.auctionsRef = ENV.firebaseRef.child('auctions');
    ENV.auctionsSync = $firebase(ENV.auctionsRef);
  });
