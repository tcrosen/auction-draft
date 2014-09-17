angular.module('clientApp')

  .factory('loginService', function($rootScope, $firebaseSimpleLogin, firebaseRef, profileCreator, $timeout) {
    var auth = null;

    function assertAuth() {
      if (auth === null) {
        throw new Error('Must call loginService.init() before using its methods');
      }
    }

    return {
      init: function() {
        auth = $firebaseSimpleLogin(firebaseRef());
        return auth;
      },

      /**
       * @param {string} email
       * @param {string} pass
       * @param {Function} [callback]
       * @returns {*}
       */
      login: function(email, pass, rememberMe) {
        assertAuth();

        return auth.$login('password', {
          email: email,
          password: pass,
          rememberMe: rememberMe
        });
      },

      logout: function() {
        assertAuth();
        auth.$logout();
      },

      changePassword: function(email, oldPass, newPass) {
        assertAuth();
        return auth.$changePassword(email, oldPass, newPass);
      },

      createAccount: function(email, pass, callback) {
        assertAuth();
        return auth.$createUser(email, pass);
      },

      createProfile: profileCreator
    };
  })

  .factory('profileCreator', function(firebaseRef, $timeout) {
    function firstPartOfEmail(email) {
      return ucfirst(email.substr(0, email.indexOf('@')) || '');
    }

    function ucfirst(str) {
      // credits: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }

    return function(id, email, callback) {
      return firebaseRef('users/' + id).set({
        email: email,
        username: firstPartOfEmail(email)
      });
    };
  });
