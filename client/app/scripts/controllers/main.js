'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function($scope, ENV, $firebase) {

    var baseRef = ENV.firebaseRef,
      poolsRef = baseRef.child('pools'),
      poolsSync = $firebase(poolsRef),
      poolRef = poolsRef.child('-JWfYHPR-7z28GrRKaRv'),
      poolSync = $firebase(poolRef),
      poolTeamsRef = baseRef.child('poolTeams'),
      poolTeamsSync = $firebase(poolTeamsRef);

    $scope.pool = poolSync.$asObject();
    $scope.teams = poolTeamsSync.$asArray();
  });
