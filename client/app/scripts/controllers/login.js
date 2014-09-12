'use strict';

angular.module('clientApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $location, AuthService) {
    $scope.flash = {};

    $scope.login = function() {
      $scope.flash = {};
      $scope.loginForm.isSubmitted = true;

      if ($scope.loginForm.$valid) {
        AuthService.login($scope.user.email, $scope.user.password, $scope.user.rememberMe).then(function(user) {
          $rootScope.user = user;
          $location.path('/');
        }, function(error) {
          $scope.flash.error = error.message;
        });
      }
    };
  });
