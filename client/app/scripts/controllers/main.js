'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('http://localhost:1337/v1/players?limit=0').then(function(players) {
      $scope.grid = {
        data: players.data,
        sort: 'rank',
        reverse: false
      };
    });

    $scope.sortPlayers = function(col) {
      if (col === $scope.grid.sort) {
        $scope.grid.reverse = !$scope.grid.reverse;
      } else {
        $scope.grid.sort = col;
        $scope.grid.reverse = false;
      }

      console.log($scope.grid);
    };
  });
