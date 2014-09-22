'use strict';

angular.module('clientApp')
  .controller('DraftCtrl', function($scope, $rootScope, $location, $routeParams, ENV, $firebase) {

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
          bid.team = $scope.poolTeams.$getRecord(bid.teamId);
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
    $scope.bidForm = {
      team: $routeParams.teamId
    };

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
      console.log('Adding bid: ', {
        teamId: teamId,
        amount: amount,
        time: now()
      });

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

          if ($routeParams.teamId) {
            // If they are routed here as a team, the ID will no longer work.
            // Redirect back to original draft page
            $location.path('/pools/' + $scope.pool.$id + '/draft');
          }
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
      var quickBids = [], i, bidAmount;

      if ($scope.maxBid) {
        bidAmount = parseInt($scope.maxBid.amount, 10);

        if ($scope.maxBid.amount < 50) {
          for (i = 1; i <= 9; i++) {
            quickBids.push($scope.maxBid.amount + i);
          }
        } else if ($scope.maxBid.amount >= 50) {
          for (i = 1; i <= 9; i++) {
            quickBids.push($scope.maxBid.amount + i * 5);
          }
        }
      }

      return quickBids;
    };

    $scope.showNominate = function(player) {
      return $scope.draft && !$scope.draft.currentAuction.player && !player.owner;
    };

    $scope.submitBid = function(amount) {
      if (!amount && !$scope.bidForm.amount) {
        alert('You must enter an amount to bid or click one of the "Quick Bid" buttons');
        return;
      }

      var bidAmount = parseInt(amount || $scope.bidForm.amount, 10);
      var bidTeamId = $scope.bidForm.team;

      if (bidAmount <= $scope.maxBid.amount) {
        alert('Bid must be greater than ' + $scope.maxBid.amount);
        $scope.bidForm.amount = $scope.maxBid.amount + 1;
      } else {
        $scope.addBid(bidTeamId, bidAmount);
        $scope.bidForm.amount = '';
      }

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

    $scope.setMyTeam = function() {
      $location.path($location.path() + '/' + $scope.myTeam.$id);
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

      if ($routeParams.teamId) {
        $scope.myTeam = $scope.poolTeams.$getRecord($routeParams.teamId);
      }
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

            if ($routeParams.teamId) {
              // If they are routed here as a team, the ID will no longer work.
              // Redirect back to original draft page
              $location.path('/pools/' + $scope.pool.$id + '/draft');
            }
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
