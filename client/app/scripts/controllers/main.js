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
    $http.get('http://localhost:1337/v1/players').then(function(players) {
      $scope.players = players.data;
    });
  });
