'use strict';

angular.module('clientApp')
  .controller('DraftCtrl', function($scope, $rootScope, ENV, $firebase) {

    var baseRef = ENV.firebaseRef,
      poolsRef = baseRef.child('pools'),
      poolsSync = $firebase(poolsRef),
      poolRef = poolsRef.child('-JWfYHPR-7z28GrRKaRv'),
      poolSync = $firebase(poolRef),
      poolTeamsRef = baseRef.child('poolTeams'),
      poolTeamsSync = $firebase(poolTeamsRef),
      playersRef = baseRef.child('players'),
      playersSync = $firebase(playersRef),
      usersRef = baseRef.child('users'),
      usersSync = $firebase(usersRef),
      auctionsRef = baseRef.child('auctions'),
      auctionsSync = $firebase(auctionsRef),
      auctionRef,
      auctionSync,
      bidsRef,
      bidsSync,
      unwatchCurrentBids,
      unwatchCurrentAuction;

    var now = function() {
      return moment().format();
    };

    var sortTeams = function() {
      function compare(a, b) {
        return a.draftOrder - b.draftOrder;
      }

      $scope.poolTeams.sort(compare);
    };

    var setCurrentAuction = function(auctionId) {
      auctionRef = auctionsRef.child(auctionId);
      auctionSync = $firebase(auctionRef);
      bidsRef = auctionRef.child('bids');
      bidsSync = $firebase(bidsRef);

      $scope.currentAuction = auctionSync.$asObject();
      $scope.currentBids = bidsSync.$asArray();

      unwatchCurrentAuction = $scope.currentAuction.$watch(function(event) {
        $scope.currentAuction.team = $scope.poolTeams.$getRecord($scope.currentAuction.teamId);
        console.log('Current auction set: ', $scope.currentAuction);
      });

      unwatchCurrentBids = $scope.currentBids.$watch(function(event) {
        console.log('Bids set: ', $scope.currentBids);
        _.map($scope.currentBids, function(bid) {
          bid.team = $scope.poolTeams.$getRecord($scope.currentAuction.teamId);
          return bid;
        });

        $scope.maxBid = _.max($scope.currentBids, 'amount');
        console.log('Max bid: ', $scope.maxBid);
      });
    };

    // $scope bindings
    $scope.pool = poolSync.$asObject();
    $scope.playersList = playersSync.$asArray();
    $scope.poolTeams = poolTeamsSync.$asArray();
    $scope.auctions = auctionsSync.$asArray();
    $scope.moment = moment;
    
    // Draft in progress methods
    $scope.startAuction = function(draftOrderIndex) {
      var teamToNominate = $scope.poolTeams.$keyAt(draftOrderIndex);

      $scope.auctions.$add({
        teamId: teamToNominate,
        startTime: now()
      }).then(function(ref) {
        console.log('Auction created: ', ref.name());
        setCurrentAuction(ref.name());
      });
    };

    $scope.cancelAuction = function() {
      unwatchCurrentAuction();
    };

    $scope.endAuction = function() {
      unwatchCurrentAuction();
    };

    $scope.nominatePlayer = function(player) {
      $scope.currentAuction.player = player;
      $scope.currentAuction.$save().then(function() {
        $scope.addBid($scope.currentAuction.teamId, $scope.pool.settings.minBid);
      });
    };

    $scope.addBid = function(teamId, amount) {
      $scope.currentBids.$add({
        teamId: teamId,
        amount: amount,
        time: now()
      });
    };

    $scope.resetDraft = function() {
      if ($scope.pool.isDraftStarted) {
        if (unwatchCurrentBids) {
          unwatchCurrentBids();
        }

        if (unwatchCurrentAuction) {
          unwatchCurrentAuction();
        }

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
        $scope.pool.draftEndTime = now();
        $scope.pool.$save();
      }
    };

    $scope.getMaxBid = function() {
      if ($scope.currentBids) {
        console.log('highest bid: ', _.max($scope.currentBids, 'amount'));
        return _.max($scope.currentBids, 'amount');
      }
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
        highestBidAmount,
        nextTenth,
        i, j;

      //highestBid = $scope.getHighestBid($scope.currentAuction);

      if (highestBid) {
        highestBidAmount = highestBid.amount;

        if (highestBidAmount < 50) {
          for (i = 1; i <= 9; i++) {
            quickBids.push(highestBidAmount + i);
          }
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

    $scope.importPlayers = function() {};

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

    $scope.getLatestAuctionKey = function() {
      return $scope.auctions.$keyAt($scope.auctions.length - 1);
    };

    $scope.pool.$loaded().then(function(pool) {
      console.log('Pool loaded: ', pool);
    });

    $scope.auctions.$loaded().then(function(auctions) {
      console.log('Auctions loaded: ', auctions);

      if ($scope.pool.isDraftStarted) {
        setCurrentAuction($scope.getLatestAuctionKey());
      }
    });

    $scope.poolTeams.$loaded().then(function(poolTeams) {
      console.log('Teams loaded: ', poolTeams);
      sortTeams();
    });

    $scope.poolTeams.$watch(function(event) {
      sortTeams();
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

    // Pre draft methods
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
          if (team.isActive) {
            team.poolId = $scope.pool.$id;
            team.roster = [];

            _.each($scope.pool.settings.roster.split(','), function(position) {
              team.roster.push({
                position: position,
                player: null,
                cost: null
              });
            });

            poolTeamsSync.$push(team);
          }
        });
      });
    };

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
        $scope.pool.draftStartTime = now();
        $scope.pool.$save();

        $scope.startAuction(0);
      }
    };
  });
