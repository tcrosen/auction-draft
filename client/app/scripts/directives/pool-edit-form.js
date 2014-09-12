'use strict';

angular.module('clientApp').directive('poolEditForm', function(PoolService, ENV, $location) {
  return {
    templateUrl: 'views/directives/pool-edit-form.html',
    scope: {
      pool: '=',
      onCancel: '='
    },
    link: function(scope) {
      scope.poolForm.isSubmitted = false;
      scope.positions = ENV.positions;
      scope.flash = {
        class: 'success',
        message: null
      };

      scope.submit = function(pool) {
        var isNew = !pool.$id;

        scope.poolForm.isSubmitted = true;
        scope.flash.message = null;

        if (scope.poolForm.$valid) {
          PoolService.save(pool).then(function(newRef) {
            if (isNew) {
              $location.path('/pools/' + newRef.name());
            } else {
              scope.flash.message = 'Pool settings updated';
            }
          });
        }
      };

      scope.cancel = function() {
        scope.poolForm.isSubmitted = false;
        scope.onCancel();
      };

      scope.delete = function(pool) {
        PoolService.delete(pool).then(function(resp) {
          scope.onCancel();
        });
      };

      // scope.$watch('pool', function(newVal, oldVal) {
      //   var newForm = newVal && !oldVal,
      //       changedPool = newVal && oldVal && newVal.$id !== oldVal.$id;
      //
      //   if (newForm || changedPool) {
      //     scope.master = angular.copy(newVal);
      //   }
      // });
    }
  };
});
