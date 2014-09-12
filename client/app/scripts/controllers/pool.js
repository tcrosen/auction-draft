'use strict';

angular.module('clientApp')
  .controller('PoolCtrl', function ($scope, pool, PoolService, $location) {
    $scope.pool = pool;

    console.log('Pool: ', pool);

    $scope.cancel = function() {
      $location.path('/pools');
    };
  });
