'use strict';

angular.module('clientApp')
  .controller('PoolCtrl', function ($scope, pool, PoolService, PoolTeamService, $location) {
    $scope.pool = pool;
    
    $scope.users = [{
      id: 102,
      name: 'Navid',
      lastYearRank: 1,
      seasons: 6,
      isActive: true
    }, {
      id: 103,
      name: 'Loreto',
      lastYearRank: 2,
      seasons: 6,
      isActive: true
    }, , {
      id: 105,
      name: 'Mike P.',
      lastYearRank: 3,
      seasons: 6,
      isActive: true
    }, {
      id: 101,
      name: 'Bobby',
      lastYearRank: 4,
      seasons: 6,
      isActive: true
    }, {
      id: 106,
      name: 'Kyle',
      lastYearRank: 5,
      seasons: 3,
      isActive: true
    }, {
      id: 107,
      name: 'Dan',
      lastYearRank: 6,
      seasons: 5,
      isActive: true
    }, {
      id: 108,
      name: 'Warren',
      lastYearRank: 7,
      seasons: 6,
      isActive: true
    }, {
      id: 109,
      name: 'Ryan',
      lastYearRank: 8,
      seasons: 2,
      isActive: false
    }, {
      id: 110,
      name: 'George',
      lastYearRank: 9,
      seasons: 6,
      isActive: true
    }, {
      id: 111,
      name: 'Dave',
      lastYearRank: 10,
      seasons: 6,
      isActive: true
    }, {
      id: 100,
      name: 'Terry',
      lastYearRank: 11,
      seasons: 6,
      isActive: true
    }, {
      id: 112,
      name: 'Reg',
      lastYearRank: 12,
      seasons: 2,
      isActive: false
    }, {
      id: 113,
      name: 'Mike M.',
      lastYearRank: 0,
      seasons: 0,
      isActive: true
    }];

    console.log('Pool: ', $scope.pool);
    console.log('Users: ', $scope.users);

    $scope.cancel = function() {
      $location.path('/pools');
    };

    $scope.editTeamSubmit = function(team) {
      PoolTeamService.create($scope.pool.$id, team);
      $scope.editTeam = null;
    };

    $scope.editTeam = function(teamId) {
      $scope.editTeam = PoolTeamService.single($scope.pool.$id, teamId);
    };
  });
