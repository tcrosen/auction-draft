'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $rootScope, PoolService) {
    if ($rootScope.user) {

    }
    $scope.pools = PoolService.list;
  });
