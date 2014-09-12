
// a factory to create a re-usable profile object
// we pass in a username and get back their synchronized data
angular.module('clientApp').factory('Pool', function(ENV, $firebase) {
  return function(poolName) {
    // create a reference to the entity
    var ref = ENV.firebaseRef.child('pools').child(poolName);

    return;
  };
});

// app.controller("ProfileCtrl", ["$scope", "Profile",
//   function($scope, Profile) {
//     // put our profile in the scope for use in DOM
//     $scope.profile = Profile("physicsmarie");
//   }
// });
