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

      $scope.selectedPoolTeam = pool.teams[0];

      console.log('Pool loaded: ', pool);

      getPlayers();

      $scope.auction = {};
    }

    function getPoolTeams() {
      return PoolTeamService.fetch().then(function(poolTeams) {
        $scope.poolTeams = poolTeams;
        $scope.selectedPoolTeam = poolTeams[0];

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
        $scope.players = {
          all: players,
          filtered: players,
          filter: null,
          hideDrafted: false,
          sort: 'rank',
          reverse: false
        };

        $scope.draftStats = function() {
          var players = $scope.players.all,
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

    $scope.draftPlayer = function(entry, player) {
      $scope.draft.draftPlayer(entry, player).then(function(resp) {
        console.log(resp);
        getPlayers();
      });
    };

    $scope.hideDrafted = function() {
      $scope.players.hideDrafted = !$scope.players.hideDrafted;

      console.log($scope.players.hideDrafted);
    };

    $scope.filterPlayers = function(position) {
      $scope.players.filter = position;

      if (position) {
        $scope.players.filtered = PlayerService.filterByPosition($scope.players.all, position);
      } else {
        $scope.players.filtered = $scope.players.all;
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
