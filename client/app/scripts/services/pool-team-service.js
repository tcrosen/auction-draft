'use strict';

angular.module('clientApp').factory('PoolTeamService', function(API) {
  var poolTeamService = {};

  poolTeamService._api = new API('/entries');

  poolTeamService.fetch = function() {
    return poolTeamService._api.get();
  };

  poolTeamService.getById = function(id) {
    return poolTeamService._api.getById(id);
  };

  return poolTeamService;
});
