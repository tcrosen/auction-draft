'use strict';

angular.module('clientApp')
  .controller('DraftCtrl', function($scope, $rootScope, $location, $routeParams, $timeout, ENV, $firebase) {

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

    var parseAuction = function(auction) {
      console.log('Parsing auction ', auction);

      auction.$team = $scope.poolTeams.$getRecord(auction.teamId);
      auction.$player = auction.playerId ? $scope.playersList.$getRecord(auction.playerId) : null;
      auction.$bids = parseBids(auction.bids);
      auction.$maxBid = (auction.$bids && auction.$bids.length) ? _.max(auction.$bids, 'amount') : null;

      return auction;
    };

    var parseBid = function(bid) {
      bid.$team = $scope.poolTeams.$getRecord(bid.teamId);
      return bid;
    };

    var parseBids = function(bids) {
      console.log('Parsing bids ', bids);
      return _.map(bids, parseBid);
    };

    var setCurrentAuction = function(auctionId) {
      auctionRef = auctionsRef.child(auctionId);
      auctionSync = $firebase(auctionRef);
      bidsRef = auctionRef.child('bids');
      bidsSync = $firebase(bidsRef);

      $scope.currentAuction = auctionSync.$asObject();
      $scope.currentBids = bidsSync.$asArray();

      unwatchCurrentAuction = $scope.currentAuction.$watch(function(event) {
        parseAuction($scope.currentAuction);
      });

      unwatchCurrentBids = $scope.currentBids.$watch(function(event) {
        parseBids($scope.currentBids);
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

    $scope.getAuctionWithBids = function(auctionId) {
      var thisAuctionRef = auctionsRef.child(auctionId),
          thisAuction = $firebase(thisAuctionRef).$asObject(),
          thisBidsRef = thisAuctionRef.child('bids'),
          thisBids = $firebase(thisBidsRef).$asArray();

      thisAuction.$loaded().then(function() {
        parseAuction(thisAuction);
      });

      return thisAuction;
    };

    $scope.getBid = function(auctionId, bidId) {
      var thisAuctionRef = auctionsRef.child(auctionId),
          thisAuction = $firebase(thisAuctionRef).$asObject(),
          thisBidRef = thisAuctionRef.child('bids').child(bidId),
          thisBid = $firebase(thisBidRef).$asObject();

      thisBid.$loaded().then(function() {
        parseBid(thisBid);
      });

      return thisBid;
    };

    // Draft in progress methods
    $scope.startAuction = function(draftOrderIndex) {
      var teamToNominate = $scope.poolTeams.$keyAt(draftOrderIndex);

      $scope.currentAuction = null;
      $scope.currentBids = null;

      $scope.auctions.$add({
        teamId: teamToNominate,
        startTime: now()
      }).then(function(ref) {
        console.log('Auction created: ', ref.name());
        setCurrentAuction(ref.name());
      });
    };

    $scope.cancelAuction = function() {
      $scope.currentAuction.playerId = null;
      $scope.currentAuction.$save();

      if (bidsSync) {
        bidsSync.$remove().then(function() {
          console.log('Auction cancelled');
        });
      }
    };

    $scope.finishAuction = function() {
      $scope.currentAuction.endTime = now();

      var winningTeam = $scope.poolTeams.$getRecord($scope.currentAuction.$maxBid.teamId);
      var nominatingTeam = $scope.currentAuction.$team;
      var player = $scope.currentAuction.$player;
      var winningBid = $scope.currentAuction.$maxBid;

      var availableRosterSpots = _.filter(winningTeam.roster, function(rosterSpot) {
        var isActive = rosterSpot.isActive,
            isFilled = !!rosterSpot.player,
            isPositionMatch = _.contains(player.positions, rosterSpot.position),
            isPlayerGoalie = _.contains(player.positions, 'G'),
            isValidForGoalie = rosterSpot.position === 'B',
            isValidForSkater = rosterSpot.position === 'Util' || rosterSpot.position === 'B';

        return isActive && !isFilled && (isPositionMatch || (isPlayerGoalie && isValidForGoalie) || (!isPlayerGoalie && isValidForSkater));
      });

      console.log('Available roster spots:', availableRosterSpots);

      if (availableRosterSpots.length) {
        availableRosterSpots[0].player = $scope.currentAuction.$player;
        availableRosterSpots[0].cost = winningBid.amount;
      } else {
        // The standard roster positions are full but they are adding a redundant position.
        // Remove the first available D spot and add an extra bench
        // Otherwise remove the first availabe spot and add an extra bench
        var firstAvailableSpot = _.findLast(winningTeam.roster, function(rosterSpot) {
          return rosterSpot.isActive && !rosterSpot.player && rosterSpot.position === 'D';
        });

        if (!firstAvailableSpot) {
          firstAvailableSpot = _.findLast(winningTeam.roster, function(rosterSpot) {
            return rosterSpot.isActive && !rosterSpot.player;
          });
        }

        console.log('Removing roster spot ', firstAvailableSpot);
        firstAvailableSpot.isActive = false;

        winningTeam.roster.push({
          position: 'B',
          playerId: $scope.currentAuction.playerId,
          cost: winningBid.amount,
          isActive: true
        });
      }

      $scope.poolTeams.$save(winningTeam).then(function() {
        unwatchCurrentBids();
        unwatchCurrentAuction();

        $timeout(function() {
          // Draft order is 1 ahead of the auction index so we just pass the current team's order value
          // to move to the next person

          // If we've reached the end, go back to the start
          if (nominatingTeam.draftOrder === $scope.poolTeams.length) {
            $scope.startAuction(0);
          } else {
            $scope.startAuction(nominatingTeam.draftOrder);
          }
        });
      });
    };

    $scope.nominatePlayer = function(player) {
      $scope.currentAuction.playerId = player.$id;
      $scope.currentAuction.$save().then(function() {
        $scope.addBid($scope.currentAuction.teamId, $scope.pool.settings.minBid);
      });
    };

    $scope.addBid = function(teamId, amount) {
      var bid = {
        teamId: teamId,
        amount: amount,
        time: now()
      };

      console.log('Adding bid: ', bid);
      $scope.currentBids.$add(bid);
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
        $scope.pool.isDraftEnded = false;
        $scope.pool.draftEndTime = null;
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

    $scope.filterPlayers = function(position) {
      $scope.players.filter = position;

      if (position) {
        $scope.players.filtered = $scope.filterPlayersByPosition($scope.players.all, position);
      } else {
        $scope.players.filtered = $scope.players.all;
      }
    };

    $scope.quickBids = function() {
      var maxBid = $scope.currentAuction.$maxBid,
          quickBids = [],
          i, bidAmount;

      if (maxBid) {
        bidAmount = parseInt(maxBid.amount, 10);

        if (maxBid.amount < 50) {
          for (i = 1; i <= 9; i++) {
            quickBids.push(maxBid.amount + i);
          }
        } else if (maxBid.amount >= 50) {
          for (i = 1; i <= 9; i++) {
            quickBids.push(maxBid.amount + i * 5);
          }
        }
      }

      return quickBids;
    };

    $scope.submitBid = function(amount) {
      if (!amount && !$scope.bidForm.amount) {
        alert('You must enter an amount to bid or click one of the "Quick Bid" buttons');
        return;
      }

      var bidAmount = parseInt(amount || $scope.bidForm.amount, 10);
      var bidTeamId = $scope.bidForm.team;

      if (bidAmount <= $scope.currentAuction.$maxBid.amount) {
        alert('Bid must be greater than ' + $scope.currentAuction.$maxBid.amount);
        $scope.bidForm.amount = $scope.currentAuction.$maxBid.amount + 1;
      } else {
        $scope.addBid(bidTeamId, bidAmount);
        $scope.bidForm.amount = '';
      }

    };

    $scope.importPlayers = function() {};

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
      $location.path('/pools/' + $scope.pool.$id + '/draft/' + $scope.myTeam.$id);
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

    $scope.auctions.$watch(function(event) {
      _.map($scope.auctions, parseAuction);
    });

    $scope.poolTeams.$loaded().then(function(poolTeams) {
      console.log('Teams loaded: ', poolTeams);
      //sortTeams();

      if ($routeParams.teamId) {
        $scope.myTeam = $scope.poolTeams.$getRecord($routeParams.teamId);
        console.log('My team: ', $scope.myTeam);
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
        isRegistered: false,
        isAdmin: true
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
        isRegistered: false,
        isAdmin: true
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
        isRegistered: false,
        isAdmin: true
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
        var draftIndex = 1;
        _.each(_.shuffle(teams), function(team) {
          if (team.isActive) {
            team.poolId = $scope.pool.$id;
            team.roster = [];
            team.draftOrder = draftIndex;

            _.each($scope.pool.settings.roster.split(','), function(position) {
              team.roster.push({
                position: position,
                player: null,
                cost: null,
                isActive: true
              });
            });

            poolTeamsSync.$push(team);
            draftIndex++;

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
