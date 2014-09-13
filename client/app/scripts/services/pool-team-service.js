'use strict';

angular.module('clientApp').factory('PoolTeamService', function(ENV, $firebase) {
  var poolTeamService = {};

  poolTeamService._ref = function(poolId) {
    return ENV.poolsRef.child(poolId).child('teams');
  };

  poolTeamService._objRef = function(poolId, id) {
    return $firebase(poolTeamService._ref(poolId).child(id)).$asObject();
  };

  poolTeamService._listRef = function(poolId) {
    return $firebase(poolTeamService._ref(poolId)).$asArray();
  };

  poolTeamService._listObjRef = function(poolId, id) {
    return poolTeamService._listRef(poolId).$getRecord(id);
  };

  poolTeamService.create = function(poolId, team) {
    return poolTeamService._listRef(poolId).$add(team);
  };

  poolTeamService.list = poolTeamService._listRef;
  poolTeamService.single = poolTeamService._objRef;

  return poolTeamService;
});
