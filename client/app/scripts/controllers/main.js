'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $http, $interval, $firebase, PlayerService) {

    var auctionTime;
    var ref = new Firebase('https://auction-draft.firebaseio.com');

    $scope.currentAuction = {};

    $scope.draftSettings = {
      maxAuctionTime: 20000,
      minBid: 1
    };

    var api = {
      base: 'http://localhost:1337',
      entries: 'http://localhost:1337/v1/entries',
      draft: 'http://localhost:1337/v1/draft',
      players: 'http://localhost:1337/v1/players'
    };

    function getEntries() {
      $http.get(api.entries).then(function(resp) {
        $scope.entries = resp.data;
        $scope.currentEntry = resp.data[0];

        var entriesRef = ref.child('entries');
        var entriesSync = $firebase(entriesRef);
        _.each($scope.entries, function(entry) {
          entriesSync.$set(entry.name, entry);
        });
      });
    }

    function getPlayers() {
      PlayerService.fetch().then(function(players) {
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

    $scope.nominatePlayer = function(entry, player, bid) {
      angular.extend($scope.currentAuction, {
        nominatedBy: entry,
        player: player,
        bids: [{
          amount: bid,
          entry: entry
        }]
      });

      $scope.currentAuction.highestBid =  $scope.currentAuction.bids[0];
      $scope.currentAuction.timeremaining = $scope.draftSettings.maxAuctionTime;

      auctionTime = $interval(function() {
        if ($scope.currentAuction.timeremaining > 0) {
          $scope.currentAuction.timeremaining -= 1000;
        } else {
          $scope.endAuction();
        }
      }, 1000);
    };

    $scope.endAuction = function() {
      if (angular.isDefined(auctionTime)) {
        $interval.cancel(auctionTime);
        auctionTime = undefined;
      }
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
      $http.post(api.draft, { entry: entry, player: player }).then(function(resp) {
        console.log(resp);
        getPlayers();
      });
    };

    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      $scope.endAuction();
    });

    getEntries();
    getPlayers();
  });
