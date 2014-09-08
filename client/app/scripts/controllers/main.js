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
      return EntryService.fetch().then(function(entries) {
        $scope.entries = entries;

        var entriesRef = ref.child('entries');
        var entriesSync = $firebase(entriesRef);
        _.each($scope.entries, function(entry) {
          entriesSync.$set(entry.name, entry);
        });

        return entries;
      });
    }

    function getPlayers() {
      return PlayerService.fetch().then(function(players) {
        $scope.players = players;

        $scope.grid = {
          data: players,
          sort: 'rank',
          reverse: false,
          hideDrafted: false,
          filter: null
        };

        $scope.draftStats = function() {
          var players = $scope.players,
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

    $scope.filterPlayers = function(position) {
      $scope.grid.filter = position;

      if (position) {
        $scope.grid.data = PlayerService.filterByPosition($scope.players, position);
      } else {
        $scope.grid.data = $scope.players;
      }
    };

    getEntries().then(function(entries) {
      getPlayers();
      $scope.draft = DraftService;
      $scope.draft.entries = angular.copy(entries);
      $scope.draft.currentAuction.entry = $scope.draft.entries[0];
    });

    $scope.randomizeOrder = function() {
      $scope.draft.randomizeOrder();
      $scope.draft.currentAuction.entry = $scope.draft.entries[0];
    };

    $scope.quickBids = function() {
      var quickBids = [],
          highestBid,
          nextTenth,
          i, j;

      if ($scope.draft && $scope.draft.currentAuction && $scope.draft.currentAuction.highestBid().amount) {
        highestBid = $scope.draft.currentAuction.highestBid().amount;

        if (highestBid < 50) {
          for (i = 1; i <= 9; i++) {
            quickBids.push(highestBid + i);
          }
        }

        nextTenth = (highestBid + i) - ((highestBid + i) % 10);

        console.log('next tenth: ', nextTenth);
        console.log('i: ', i);
        console.log('highest bid: ', highestBid);
        // if (nextTenth < highestBid + 15) {
        //   nextTenth = 20;
        // }

        for (j = nextTenth; j <= nextTenth + 30; j+=5) {
          //quickBids.push(j);
          console.log('j', j);
        }
      }

      return quickBids;
    };

    $scope.showNominate = function(player) {
      return $scope.draft &&
            !$scope.draft.currentAuction.player &&
            !player.owner;
    };

    $scope.submitBid = function(amount) {
      var bid = amount || $scope.user.bid;

      // TODO: associate current user and get entry
      var entry = _.sample($scope.entries);

      $scope.draft.currentAuction.addBid(entry, bid);
    };
  });
