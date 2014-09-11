'use strict';

angular.module('clientApp')
  .controller('PoolCtrl', function ($scope, pool, PoolService, $firebase, PoolTeamService, PlayerService, DraftService) {

    var ref = new Firebase('https://auction-draft.firebaseio.com');

    function init() {
      // getPoolTeams().then(function(poolTeams) {
      //   getPlayers();
      //   $scope.draft = DraftService;
      //   $scope.draft.poolTeams = angular.copy(poolTeams);
      //   $scope.draft.currentAuction.entry = $scope.draft.poolTeams[0];
      // });

      $scope.pool = pool;

      console.log('Pool loaded: ', pool);
    }

    function getPoolTeams() {
      return PoolTeamService.fetch().then(function(poolTeams) {
        $scope.poolTeams = poolTeams;

        var poolTeamsRef = ref.child('poolTeams');
        var poolTeamsSync = $firebase(poolTeamsRef);
        _.each($scope.poolTeams, function(entry) {
          poolTeamsSync.$set(entry.name, entry);
        });

        return poolTeams;
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
      var entry = $scope.poolTeams[0];

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

    $scope.randomizeOrder = function() {
      $scope.draft.randomizeOrder();
      $scope.draft.currentAuction.entry = $scope.draft.poolTeams[0];
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
      var entry = _.sample($scope.poolTeams);

      $scope.draft.currentAuction.addBid(entry, bid);
    };

    $scope.importPlayers = function() {
      PlayerService.import().then(function(resp) {
        getPlayers();
      });
    }

    init();

  });
