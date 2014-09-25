angular
  .module('clientApp')
  .config(function ($routeProvider, $httpProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/pools/:poolId/draft', {
        templateUrl: 'views/draft.html',
        controller: 'DraftCtrl'
      })
      .when('/pools/:poolId/draft/board', {
        templateUrl: 'views/draft-board.html',
        controller: 'DraftBoardCtrl'
      })
      .when('/pools/:poolId/draft/:teamId', {
        templateUrl: 'views/draft.html',
        controller: 'DraftCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
