'use strict';

angular.module('clientApp').factory('PoolTeamService', function(ENV, firebaseRef, syncData) {
  var poolTeamService = {};

  poolTeamService.ref = firebaseRef('poolTeams');
  poolTeamService.syncData = syncData('poolTeams').$asArray();

  poolTeamService.seed = function(poolId) {
    var teams = [{
      email: '',
      name: 'Navid',
      lastYearRank: 1,
      seasons: 8,
      isActive: true,
      isRegistered: false
    }, {
      email: '',
      name: 'Loreto',
      lastYearRank: 2,
      seasons: 7,
      isActive: true,
      isRegistered: false
    }, {
      email: '',
      name: 'Mike P.',
      lastYearRank: 3,
      seasons: 8,
      isActive: true,
      isRegistered: false
    }, {
      email: '',
      name: 'Bobby',
      lastYearRank: 4,
      seasons: 8,
      isActive: true,
      isRegistered: false
    }, {
      email: '',
      name: 'Kyle',
      lastYearRank: 5,
      seasons: 3,
      isActive: true,
      isRegistered: false
    }, {
      email: '',
      name: 'Dan',
      lastYearRank: 8,
      seasons: 8,
      isActive: true,
      isRegistered: false
    }, {
      email: '',
      name: 'Warren',
      lastYearRank: 7,
      seasons: 8,
      isActive: false,
      isRegistered: false
    }, {
      email: '',
      name: 'Ryan',
      lastYearRank: 8,
      seasons: 2,
      isActive: false,
      isRegistered: false
    }, {
      email: '',
      name: 'George',
      lastYearRank: 9,
      seasons: 8,
      isActive: true,
      isRegistered: false
    }, {
      email: '',
      name: 'Dave',
      lastYearRank: 10,
      seasons: 8,
      isActive: true,
      isRegistered: false
    }, {
      email: 'tcrosen@gmail.com',
      name: 'Terry',
      lastYearRank: 11,
      seasons: 8,
      isActive: true,
      isRegistered: false
    }, {
      email: '',
      name: 'Reg',
      lastYearRank: 12,
      seasons: 2,
      isActive: false,
      isRegistered: false
    }, {
      email: '',
      name: 'Mike M.',
      lastYearRank: 0,
      seasons: 0,
      isActive: true,
      isRegistered: false
    }, {
      email: '',
      name: 'Adrian',
      lastYearRank: 0,
      seasons: 1,
      isActive: true,
      isRegistered: false
    }];

    poolTeamService.ref.remove(function() {
      _.each(teams, function(team) {
        team.poolId = poolId;

        if (team.isActive) {
          poolTeamService.syncData.$add(team);
        }
      });
    });
  };

  return poolTeamService;
});
