'use strict';

angular.module('clientApp').factory('PoolTeamService', function(API) {
  var poolTeamService = {};

  poolTeamService._api = new API('/poolteams', [{
    name: 'findWithOwners',
    path: 'findWithOwners',
    verb: 'get'
  }]);

  poolTeamService.fetch = function() {
    return poolTeamService._api.findWithOwners();
  };

  poolTeamService.getById = function(id) {
    return poolTeamService._api.getById(id);
  };



  return poolTeamService;
});
