'use strict';

angular.module('clientApp')
  .factory('AuthService', function (ENV, $q, $firebaseSimpleLogin) {

    var auth = {};

    auth._client = $firebaseSimpleLogin(ENV.firebaseRef);

    auth._providers = {
      password: 'password'
    };

    auth.getCurrentUser = function() {
      return auth._client.$getCurrentUser();
    };

    auth.isLoggedIn = function() {
      var deferred = $q.defer();

      auth._client.$getCurrentUser().then(function(user) {
        if (!user) {
          deferred.reject();
        } else {
          deferred.resolve(user);
        }
      });

      return deferred.promise;
    };

    auth.login = function(email, password, rememberMe) {
      return auth._client.$login(auth._providers.password, {
        email: email,
        password: password,
        rememberMe: rememberMe
      });
    };

    auth.logout = function() {
      auth._client.$logout();
    };

    return auth;
  });
