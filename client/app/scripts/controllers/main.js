'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, PoolService) {
    // On demand
    // PoolService.getList().then(function(pools) {
    //   $scope.pools = pools.val();
    // });

    $scope.pools = PoolService.list;

    $scope.$watch('pools', function() {
      console.log('Pools: ', $scope.pools);
    });

    $scope.createPool = function() {
      $scope.poolToEdit = null;
    };

    $scope.editPool = function(pool) {
      $scope.poolToEdit = angular.copy(pool);
    };
  });
