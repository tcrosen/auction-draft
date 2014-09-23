'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function($scope, ENV, $firebase, $location) {

    var baseRef = ENV.firebaseRef,
      poolsRef = baseRef.child('pools'),
      poolsSync = $firebase(poolsRef),
      poolRef = poolsRef.child('-JWfYHPR-7z28GrRKaRv'),
      poolSync = $firebase(poolRef),
      poolTeamsRef = baseRef.child('poolTeams'),
      poolTeamsSync = $firebase(poolTeamsRef);

    $scope.pool = poolSync.$asObject();
    $scope.poolTeams = poolTeamsSync.$asArray();

    $scope.claimTeam = function(team) {
      if (!team.isRegistered) {
        $location.path('/pools/' + $scope.pool.$id + '/draft/' + team.$id);
      }
    };

    $scope.poolTeams.$watch(function() {
      $scope.teams = _.sortBy($scope.poolTeams, 'lastYearRank');
    });
  });
