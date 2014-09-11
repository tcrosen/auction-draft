'use strict';

angular.module('clientApp').directive('auctionBlock', function() {
  return {
    templateUrl: 'views/directives/auction-block.html',
    scope: {
      auction: '='
    }
  };
});
