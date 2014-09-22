'use strict';

angular.module('clientApp')
  .controller('DraftCtrl', function($scope, $rootScope, ENV, $firebase) {

    var baseRef = ENV.firebaseRef;
    var poolsRef = baseRef.child('pools');
    var poolsSync = $firebase(poolsRef);
    var poolRef = poolsRef.child('-JWfYHPR-7z28GrRKaRv');
    var poolSync = $firebase(poolRef);
    var poolTeamsRef = baseRef.child('poolTeams');
    var poolTeamsSync = $firebase(poolTeamsRef);
    var playersRef = baseRef.child('players');
    var playersSync = $firebase(playersRef);
    var usersRef = baseRef.child('users');
    var usersSync = $firebase(usersRef);
    var auctionsRef = baseRef.child('auctions');
    var auctionsSync = $firebase(auctionsRef);
    var unwatchCurrentAuction;

    var setCurrentAuction = function(auctionId) {
      var auctionRef = auctionsRef.child(auctionId);
      $scope.currentAuction = $firebase(auctionRef).$asObject();
      // console.log('Current auction set: ', $scope.currentAuction);

      unwatchCurrentAuction = $scope.currentAuction.$watch(function(event) {
        $scope.currentAuction.team = $scope.poolTeams.$getRecord($scope.currentAuction.teamId);
        console.log('Current auction set: ', $scope.currentAuction);
      });
    };

    // $scope bindings
    $scope.pool = poolSync.$asObject();
    $scope.playersList = playersSync.$asArray();
    $scope.poolTeams = poolTeamsSync.$asArray();
    $scope.auctions = auctionsSync.$asArray();
    $scope.moment = moment;

    $scope.seedTeams = function() {
      var teams = [{
        email: '',
        name: 'Navid',
        lastYearRank: 1,
        seasons: 8,
        isActive: true,
        isRegistered: false
      }, {
        email: '',
        name: 'Loreto',
        lastYearRank: 2,
        seasons: 7,
        isActive: true,
        isRegistered: false
      }, {
        email: '',
        name: 'Mike P.',
        lastYearRank: 3,
        seasons: 8,
        isActive: true,
        isRegistered: false
      }, {
        email: '',
        name: 'Bobby',
        lastYearRank: 4,
        seasons: 8,
        isActive: true,
        isRegistered: false
      }, {
        email: '',
        name: 'Kyle',
        lastYearRank: 5,
        seasons: 3,
        isActive: true,
        isRegistered: false
      }, {
        email: '',
        name: 'Dan',
        lastYearRank: 8,
        seasons: 8,
        isActive: true,
        isRegistered: false
      }, {
        email: '',
        name: 'Warren',
        lastYearRank: 7,
        seasons: 8,
        isActive: false,
        isRegistered: false
      }, {
        email: '',
        name: 'Ryan',
        lastYearRank: 8,
        seasons: 2,
        isActive: false,
        isRegistered: false
      }, {
        email: '',
        name: 'George',
        lastYearRank: 9,
        seasons: 8,
        isActive: true,
        isRegistered: false
      }, {
        email: '',
        name: 'Dave',
        lastYearRank: 10,
        seasons: 8,
        isActive: true,
        isRegistered: false
      }, {
        email: 'tcrosen@gmail.com',
        name: 'Terry',
        lastYearRank: 11,
        seasons: 8,
        isActive: true,
        isRegistered: false
      }, {
        email: '',
        name: 'Reg',
        lastYearRank: 12,
        seasons: 2,
        isActive: false,
        isRegistered: false
      }, {
        email: '',
        name: 'Mike M.',
        lastYearRank: 0,
        seasons: 0,
        isActive: true,
        isRegistered: false
      }, {
        email: '',
        name: 'Adrian',
        lastYearRank: 0,
        seasons: 1,
        isActive: true,
        isRegistered: false
      }];

      poolTeamsSync.$remove().then(function() {
        _.each(teams, function(team) {
          team.poolId = $scope.pool.$id;

          if (team.isActive) {
            poolTeamsSync.$push(team);
          }
        });
      });
    };

    // Pre draft methods
    $scope.randomizeOrder = function() {
      if (!$scope.pool.isDraftStarted) {
        var shuffled = _.shuffle($scope.poolTeams);
        var teamToUpdate;
        var order = 1;

        _.each(shuffled, function(team) {
          team.draftOrder = order;
          $scope.poolTeams.$save(team);
          order++;
        });
      }
    };

    $scope.startDraft = function() {
      if (!$scope.pool.isDraftStarted) {
        $scope.pool.isDraftStarted = true;
        $scope.pool.draftStartTime = new Date();
        $scope.pool.$save();

        $scope.startAuction($scope.poolTeams.$keyAt(0));
      }
    };

    $scope.startAuction = function(teamId) {
      $scope.auctions.$add({
        teamId: teamId,
        startTime: moment().format()
      }).then(function(ref) {
        console.log('Auction created: ', ref.name());
        setCurrentAuction(ref.name());
      });
    };

    $scope.endAuction = function() {
      unwatchCurrentAuction();
    };

    $scope.resetDraft = function() {
      if ($scope.pool.isDraftStarted) {
        $scope.pool.isDraftStarted = false;
        $scope.pool.draftStartTime = null;
        $scope.pool.$save();

        $scope.seedTeams();

        auctionsSync.$remove().then(function() {
          console.log('Auctions deleted');
        });
      }
    };

    $scope.endDraft = function() {
      if ($scope.pool.isDraftStarted) {
        $scope.pool.isDraftStarted = false;
        $scope.pool.isDraftEnded = true;
        $scope.pool.draftEndTime = new Date();
        $scope.pool.$save();
      }
    };

    // Draft in progress methods
    $scope.nominatePlayer = function(player) {
    };

    $scope.draftPlayer = function(entry, player) {
      $scope.draft.draftPlayer(entry, player).then(function(resp) {
        console.log(resp);
        //getPlayers();
      });
    };

    $scope.hideDrafted = function() {
      $scope.players.hideDrafted = !$scope.players.hideDrafted;
    };

    $scope.filterPlayers = function(position) {
      $scope.players.filter = position;

      if (position) {
        $scope.players.filtered = $scope.filterPlayersByPosition($scope.players.all, position);
      } else {
        $scope.players.filtered = $scope.players.all;
      }
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

        for (j = nextTenth; j <= nextTenth + 30; j += 5) {
          //quickBids.push(j);
          console.log('j', j);
        }
      }

      return quickBids;
    };

    $scope.showNominate = function(player) {
      return $scope.draft && !$scope.draft.currentAuction.player && !player.owner;
    };

    $scope.submitBid = function(amount) {
      var bid = amount || $scope.user.bid;

      // TODO: associate current user and get entry
      var entry = _.sample($scope.poolTeams);

      $scope.draft.currentAuction.addBid(entry, bid);
    };

    $scope.importPlayers = function() {
    };

    $scope.simulateDraft = function() {
      _.each($scope.poolTeams, function(poolTeam) {
        _.map(poolTeam.roster, function(rosterSpot) {
          var player = _.sample($scope.players.filtered);
          var cost = Math.floor(Math.random() * (300 - 1)) + 1;
          var nameSplit = player.name.split(' '),
            shortName;

          if (nameSplit.length > 2) {
            shortName = player.name.split(' ')[1] + ' ' + player.name.split(' ')[2] + ', ' + player.name.split(' ')[0].substr(0, 1);
          } else {
            shortName = player.name.split(' ')[1] + ', ' + player.name.split(' ')[0].substr(0, 1);
          }

          player.owner = poolTeam.owner;
          player.cost = cost;
          player.shortName = shortName;

          rosterSpot.player = player;
          rosterSpot.cost = cost;
        });
      });
    };

    $scope.filterPlayersByDrafted = function(players, isDrafted) {
      return _.filter(players, function(player) {
        return player;
      });
    };

    $scope.filterPlayersByPosition = function(players, position) {
      return _.filter(players, function(player) {
        return player.positions.indexOf(position) >= 0;
      });
    };

    $scope.pool.$loaded().then(function(pool) {
      console.log('Pool loaded: ', pool);
    });

    $scope.auctions.$loaded().then(function(auctions) {
      console.log('Auctions loaded: ', auctions);

      if ($scope.pool.isDraftStarted) {
        setCurrentAuction($scope.auctions.$keyAt($scope.auctions.length - 1));
      }
    });

    $scope.poolTeams.$loaded().then(function(poolTeams) {
      console.log('Teams loaded: ', poolTeams);
    });

    $scope.poolTeams.$watch(function(event) {
      function compare(a, b) {
        return a.draftOrder - b.draftOrder;
      }

      $scope.poolTeams.sort(compare);
    });

    $scope.playersList.$loaded().then(function(players) {
      console.log('Players loaded: ', players);

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
          undrafted = $scope.filterPlayersByDrafted(players, false),
          byPosition = $scope.filterPlayersByPosition;

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
  });
