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

    var api = {
      entries: 'http://localhost:1337/v1/entries',
      draft: 'http://localhost:1337/v1/draft',
      players: 'http://localhost:1337/v1/players'
    };

    function getEntries() {
      $http.get(api.entries).then(function(resp) {
        $scope.entries = resp.data;
        $scope.currentEntry = resp.data[0];
      });
    }

    function getPlayers() {
      $http.get(api.players).then(function(resp) {
        $scope.grid = {
          data: resp.data,
          sort: 'rank',
          reverse: false
        };

        $scope.draftStats = function() {
          var players = $scope.grid.data,
            undrafted = getUndrafted(players);

          return {
            remaining: {
              total: undrafted.length,
              c: playersByPosition(undrafted, 'C').length,
              lw: playersByPosition(undrafted, 'LW').length,
              rw: playersByPosition(undrafted, 'RW').length,
              d: playersByPosition(undrafted, 'D').length,
              g: playersByPosition(undrafted, 'G').length
            }
          };
        };
      });
    }

    function getUndrafted(players) {
      return _.filter(players, function(player) {
        return !player.owner;
      });
    }

    function playersByPosition(players, position) {
      return _.where(players, function(player) {
        return player.positions.indexOf(position) >= 0;
      });
    }

    $scope.sortPlayers = function(col) {
      if (col === $scope.grid.sort) {
        $scope.grid.reverse = !$scope.grid.reverse;
      } else {
        $scope.grid.sort = col;
        $scope.grid.reverse = false;
      }
    };

    $scope.draftPlayer = function(entry, player) {
      $http.post(api.draft, { entry: entry, player: player }).then(function(resp) {
        console.log(resp);
        getPlayers();
      });
    };

    getEntries();
    getPlayers();
  });
