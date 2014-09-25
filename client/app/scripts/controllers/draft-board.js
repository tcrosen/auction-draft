'use strict';

angular.module('clientApp')
  .controller('DraftBoardCtrl', function($scope, $rootScope, $location, $routeParams, $timeout, ENV, $firebase) {
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
      //auctionRef = auctionsRef.child(getLatestAuctionKey()),
      //auctionSync = $firebase(auctionRef),
      bidsRef,
      bidsSync,
      unwatchCurrentBids,
      unwatchCurrentAuction;

    $scope.pool = poolSync.$asObject();
    $scope.playersList = playersSync.$asArray();
    $scope.poolTeams = poolTeamsSync.$asArray();
    $scope.auctions = auctionsSync.$asArray();
    $scope.moment = moment;

    var getLatestAuctionKey = function() {
      return $scope.auctions.$keyAt($scope.auctions.length - 1);
    };

    $scope.auctions.$watch(function() {
      $scope.currentAuction = $firebase(auctionsRef.child(getLatestAuctionKey())).$asObject();
    });    
  });
