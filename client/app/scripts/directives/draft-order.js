'use strict';

angular.module('clientApp').directive('draftOrder', function($rootScope) {
  return {
    templateUrl: 'views/directives/draft-order.html',
    scope: {
      poolTeams: '=',
      currentAuction: '=',
      showRosters: '=',
      pool: '='
    },
    link: function(scope) {
      var sortTeams = function() {
        function compare(a, b) {
          return a.draftOrder - b.draftOrder;
        }

        scope.poolTeams.sort(compare);
      };

      scope.poolTeams.$watch(function(event) {
        var startingCash = parseInt(scope.pool.settings.startingCash, 10);
        _.map(scope.poolTeams, function(team) {
          team.cash = startingCash;
          team.drafted = 0;

          _.each(team.roster, function(player) {
            if (player.cost) {
              team.drafted++;
              team.cash -= parseInt(player.cost, 10);
            }
          });


          team.maxBid = team.cash - (team.roster.length - team.drafted - 1);

          // console.log('Cash: ', team.cash);
          // console.log('Roster size: ', team.roster.length);
          // console.log('Drafted: ', team.drafted);
          // console.log('Remaining: ', team.roster.length - team.drafted);
          // console.log('Max bid: ', team.maxBid);
        });

        sortTeams();
      });
    }
  };
});
