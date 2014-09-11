'use strict';

angular.module('clientApp').factory('PoolService', function(API) {
  var poolService = {};

  poolService._api = new API('/pools');

  poolService.fetch = function(id) {
    return poolService._api.get(id);
  };

  return poolService;
});
