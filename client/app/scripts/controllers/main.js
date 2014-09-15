'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $rootScope, pool, PoolService, PoolTeamService) {

    $scope.pool = pool;

    $scope.pool.teams = [];
    $scope.pool.$save();

    PoolTeamService.create($scope.pool.$id, {
      owner: 102,
      name: 'Navid',
      lastYearRank: 1,
      seasons: 6,
      isActive: true,
      isRegistered: false
    });

    PoolTeamService.create($scope.pool.$id, {
      owner: 103,
      name: 'Loreto',
      lastYearRank: 2,
      seasons: 6,
      isActive: true,
      isRegistered: false
    });

    PoolTeamService.create($scope.pool.$id, {
      owner: 105,
      name: 'Mike P.',
      lastYearRank: 3,
      seasons: 6,
      isActive: true,
      isRegistered: false
    });

    PoolTeamService.create($scope.pool.$id, {
      owner: 101,
      name: 'Bobby',
      lastYearRank: 4,
      seasons: 6,
      isActive: true,
      isRegistered: false
    });

    PoolTeamService.create($scope.pool.$id, {
      owner: 106,
      name: 'Kyle',
      lastYearRank: 5,
      seasons: 3,
      isActive: true,
      isRegistered: false
    });

    PoolTeamService.create($scope.pool.$id, {
      owner: 107,
      name: 'Dan',
      lastYearRank: 6,
      seasons: 5,
      isActive: true,
      isRegistered: false
    });

    PoolTeamService.create($scope.pool.$id, {
      owner: 108,
      name: 'Warren',
      lastYearRank: 7,
      seasons: 6,
      isActive: true,
      isRegistered: false
    });

    PoolTeamService.create($scope.pool.$id, {
      owner: 109,
      name: 'Ryan',
      lastYearRank: 8,
      seasons: 2,
      isActive: false,
      isRegistered: false
    });

    PoolTeamService.create($scope.pool.$id, {
      owner: 110,
      name: 'George',
      lastYearRank: 9,
      seasons: 6,
      isActive: true,
      isRegistered: false
    });

    PoolTeamService.create($scope.pool.$id, {
      owner: 111,
      name: 'Dave',
      lastYearRank: 10,
      seasons: 6,
      isActive: true,
      isRegistered: false
    });

    PoolTeamService.create($scope.pool.$id, {
      owner: 100,
      name: 'Terry',
      lastYearRank: 11,
      seasons: 6,
      isActive: true,
      isRegistered: true
    });

    PoolTeamService.create($scope.pool.$id, {
      owner: 112,
      name: 'Reg',
      lastYearRank: 12,
      seasons: 2,
      isActive: false,
      isRegistered: false
    });

    PoolTeamService.create($scope.pool.$id, {
      owner: 113,
      name: 'Mike M.',
      lastYearRank: 0,
      seasons: 0,
      isActive: true,
      isRegistered: false
    });

    // $scope.pool.$save();

    console.log($scope.pool);
  });
