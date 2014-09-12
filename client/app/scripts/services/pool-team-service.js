'use strict';

angular.module('clientApp').factory('PoolTeamService', function(ENV, $firebase) {
  var poolTeamService = {};

  poolTeamService._teamsRef = function(poolId) {
    return ENV.poolsRef.child(poolId).child('teams');
  };

  poolTeamService.addToPool = function(poolId, team) {
    var teamsRef = poolTeamService._teamsRef(poolId).$asArray();
    return teamsRef.$add(team);
  };

  return poolTeamService;
});
