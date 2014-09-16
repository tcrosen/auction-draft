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

    console.log($scope.pool);
  });
