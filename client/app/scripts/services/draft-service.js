'use strict';

angular.module('clientApp').factory('DraftService', function(API) {
  var draftService = {};

  draftService._api = new API('/draft');

  draftService.currentAuction = {
    bids: [],

    highestBid: function() {
      return _.max(draftService.currentAuction.bids, 'amount');
    },

    addBid: function(entryId, amount) {
      draftService.currentAuction.bids.push({
        entry: entry,
        amount: amount
      });
    }
  };

  draftService.settings = {
    maxAuctionTime: 20000,
    startingBid: 1,
    minBid: 1
  };

  draftService.fetch = function() {
    return draftService._api.get();
  };

  draftService.save = function() {
    return draftService._api.post({
      settings: draftService.settings,
      currentAuction: draftService.currentAuction
    });
  };

  draftService.draftPlayer = function(entry, player) {
    draftService._api.post({ entry: entry, player: player });
  };

  draftService.nominatePlayer = function(entry, player, amount) {
    amount = amount || draftService.settings.startingBid;

    angular.extend(draftService.currentAuction, {
      entry: entry,
      player: player,
      bids: [],
      startTime: new Date()
    });

    draftService.currentAuction.addBid(entry.id, amount);
  };

  return draftService;
});
