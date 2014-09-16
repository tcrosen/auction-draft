'use strict';

angular.module('clientApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $location, loginService) {
    $scope.flash = {};
    $scope.user = {
      rememberMe: true
    };

    $scope.login = function() {
      $scope.flash = {};
      $scope.loginForm.isSubmitted = true;

      if ($scope.loginForm.$valid) {
        loginService.login($scope.user.email, $scope.user.password, $scope.user.rememberMe).then(function(user) {
          $location.path('/');
        }, function(error) {
          var errorMessage = error.message ? error.message.replace('FirebaseSimpleLogin: ', '') : 'Login failed';
          $scope.flash.error = errorMessage;
        });
      }
    };
  });
