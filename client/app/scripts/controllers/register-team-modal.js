angular.module('clientApp').controller('RegisterTeamInstanceCtrl', function ($scope, $modalInstance, pool, team) {

  $scope.team = team;
  $scope.pool = pool;

  $scope.login = function () {
    $modalInstance.close($scope.team);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
