'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $interval, $firebase, EntryService, PlayerService, DraftService) {

    var ref = new Firebase('https://auction-draft.firebaseio.com');

    function getEntries() {
      EntryService.fetch().then(function(entries) {
        $scope.entries = entries;

        var entriesRef = ref.child('entries');
        var entriesSync = $firebase(entriesRef);
        _.each($scope.entries, function(entry) {
          entriesSync.$set(entry.name, entry);
        });
      });
    }

    function getPlayers() {
      PlayerService.fetch().then(function(players) {
        $scope.players = players;

        $scope.grid = {
          data: players,
          sort: 'rank',
          reverse: false,
          hideDrafted: false
        };

        $scope.draftStats = function() {
          var players = $scope.grid.data,
            undrafted = PlayerService.filterByDrafted(players, false),
            byPosition = PlayerService.filterByPosition;

          return {
            remaining: {
              total: undrafted.length,
              c: byPosition(undrafted, 'C').length,
              lw: byPosition(undrafted, 'LW').length,
              rw: byPosition(undrafted, 'RW').length,
              d: byPosition(undrafted, 'D').length,
              g: byPosition(undrafted, 'G').length
            }
          };
        };
      });
    }

    $scope.nominatePlayer = function(player) {
      // TODO: Set based on logged in user
      var entry = $scope.entries[0];

      $scope.draft.nominatePlayer(entry, player);
    };

    $scope.sortPlayers = function(col) {
      if (col === $scope.grid.sort) {
        $scope.grid.reverse = !$scope.grid.reverse;
      } else {
        $scope.grid.sort = col;
        $scope.grid.reverse = false;
      }
    };

    $scope.draftPlayer = function(entry, player) {
      $scope.draft.draftPlayer(entry, player).then(function(resp) {
        console.log(resp);
        getPlayers();
      });
    };

    getEntries();
    getPlayers();

    $scope.startDraft = function() {
      $scope.draft = DraftService;
      $scope.draft.currentAuction.entry = $scope.entries[0];
    };

    $scope.showNominate = function(player) {
      return $scope.draft &&
            !$scope.draft.currentAuction.player &&
            !player.owner;
    };

  });
