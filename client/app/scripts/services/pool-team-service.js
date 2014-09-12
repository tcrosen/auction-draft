'use strict';

angular.module('clientApp').factory('PoolTeamService', function(ENV, $firebase) {
  var poolTeamService = {};

  poolTeamService._ref = function(poolId) {
    return ENV.poolsRef.child(poolId).child('teams');
  };

  poolTeamService._listRef = function(poolId) {
    return $firebase(poolTeamService._ref(poolId)).$asArray();
  };

  poolTeamService.create = function(poolId, team) {
    return poolTeamService._listRef(poolId).$add(team);
  };

  return poolTeamService;
});
