'use strict';

angular.module('clientApp').directive('poolEditForm', function(PoolService) {
  return {
    templateUrl: 'views/directives/pool-edit-form.html',
    scope: {
      pool: '='
    },
    link: function(scope) {
      scope.poolForm.isSubmitted = false;
      scope.master = {};

      scope.reset = function() {
        scope.pool = angular.copy(scope.master);
        scope.poolForm.isSubmitted = false;
      };

      scope.submit = function(pool) {
        scope.poolForm.isSubmitted = true;

        if (scope.poolForm.$valid) {
          PoolService.save(pool).then(function(resp) {
            if (!scope.master.$id) {
              // If a new record was added, clear the form
              scope.cancel();
            } else {
              scope.master = angular.copy(pool);
            }
          });
        }
      };

      scope.cancel = function() {
        scope.poolForm.isSubmitted = false;
        scope.pool = {};
        scope.master = {};
      };

      scope.$watch('pool', function(newVal, oldVal) {
        var newForm = newVal && !oldVal,
            changedPool = newVal && oldVal && newVal.$id !== oldVal.$id;

        if (newForm || changedPool) {
          scope.master = angular.copy(newVal);
        }
      });
    }
  };
});
