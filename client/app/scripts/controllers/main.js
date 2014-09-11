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
    PoolService.fetch().then(function(pools) {
      $scope.pools = pools;
    });
  });
