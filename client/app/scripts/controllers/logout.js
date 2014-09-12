angular.module('clientApp').controller('LogoutCtrl', function(AuthService) {
  AuthService.logout();
});
