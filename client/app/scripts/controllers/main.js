'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function($scope, $rootScope, pool, loginService, PoolTeamService, $modal) {

    $scope.pool = pool;
    $scope.teams = PoolTeamService.syncData;
    $scope.isClaiming = false;

    console.log('Pool:', $scope.pool);
    console.log('Teams:', $scope.teams);

    if ($rootScope.auth && $rootScope.auth.user) {
      $scope.canUnclaim = true;
    }

    $scope.seedTeams = function() {
      PoolTeamService.seed($scope.pool.$id);
    };



    $scope.claimTeam = function(team) {
      var registerTeamModal = $modal.open({
        templateUrl: 'views/modals/register-team.html',
        controller: 'RegisterTeamInstanceCtrl',
        resolve: {
          team: function () {
            return team;
          },
          pool: function() {
            return $scope.pool
          }
        }
      });

      registerTeamModal.result.then(function (team) {
        console.log('Modal team: ', team);
      });

      if (team.isActive && !team.isRegistered) {
        $scope.isClaiming = team.$id;

        console.log('Team: ', team);
        console.log('Auth: ', $rootScope.auth);


        // loginService.createAccount(team.email, team.password).then(function(user) {
        //   console.log('User created: ', user);
        // });



      }

      // loginService.createAccount($scope.email, $scope.pass, function(err, user) {
      //   if (err) {
      //     $scope.err = err ? err + '' : null;
      //   } else {
      //     // must be logged in before I can write to my profile
      //     $scope.login(function() {
      //       loginService.createProfile(user.uid, user.email);
      //       $location.path('/account');
      //     });
      //   }
      // });
    };
  });
