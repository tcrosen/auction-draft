'use strict';

angular.module('clientApp')
  .controller('PoolCtrl', function ($scope, pool, PoolService, PoolTeamService, $location) {
    $scope.pool = pool;

    $scope.users = [{
      id: 100,
      name: 'Terry'
    }, {
      id: 101,
      name: 'Bobby'
    }, {
      id: 102,
      name: 'Navid'
    }, {
      id: 103,
      name: 'Loreto'
    }, {
      id: 104,
      name: 'Dave'
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
