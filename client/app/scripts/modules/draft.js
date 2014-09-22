(function($) {

  var extend = $.extend;

  angular.module('drafter', [])

  .factory('Auction', function() {

    var Auction = function(options, teamId, playerId, startingBid) {
      this.options = extend({
        startingBid: 1,
        minBid: 1
      }, options);

      this.playerId = playerId;
      this.teamId = teamId;
      this.bids = [];
      this.startTime = new Date();
      this.endTime = null;

      this.addBid(teamId, options.startingBid);

      // this.startTimer();
    };

    Auction.prototype.addBid = function(teamId, amount) {
      if (amount < this.options.minBid) {
        throw new Error('Minimum bid is ' + this.options.minBid);
      }

      this.bids.push({
        teamId: teamId,
        amount: amount,
        time: new Date()
      });
    };

    Auction.prototype.cancelBid = function(bidIndex) {
      this.bids.splice(bidIndex, 1);
    };

    Auction.prototype.winningBid = function() {
      return _.max(this.bids, 'amount');
    };

    return Auction;
  })

  .factory('Draft', function(Auction) {
    var defaults = {
      maxTeams: 0,
      // how much money teams start with
      cash: 500,
      minBid: 1,
      startingBid: 1,
      // how long teams have to bid on the current player
      maxAuctionTime: 0,

      roster: {},

      startTime: null
    };

    var Draft = function(settings) {
      this.defaults = defaults;
      this.settings = extend(this.defaults, settings);
      this.teams = [];
      this.pool = null;
      this.auctions = [];
      this.started = false;
      this.ended = false;
    };

    Draft.prototype.teams = function(teams) {
      if (teams) {
        this.teams = teams;
      }

      return this.teams;
    };

    Draft.prototype.randomizeOrder = function() {
      if (this.started && !this.ended) {
        throw new Error('You can not change the draft order after it has begun');
      }

      this.teams = _.shuffle(this.teams);
    };

    Draft.prototype.createAuction = function(teamId, playerId) {
      var auction = new Auction(teamId, playerId);
      this.auctions.push(auction);
      return auction;
    };

    Draft.prototype.endAuction = function(auctionIndex) {
      return this.auctions[auctionIndex];
    };

    Draft.prototype.currentAuction = function() {
      return _.last(this.auctions, function(auction) {
        return !auction.endTime;
      });
    };

    Draft.prototype.startAuction = function(teamId, playerId) {
      if (!this.started) {
        throw new Error('Draft has not been started');
      }

      if (!this.currentAuction()) {
        return this.createAuction(teamId, playerId);
      } else {
        throw new Error('Please finish the current auction before starting a new one');
      }
    };

    return Draft;
  });

})(window.jQuery);
