'use strict';

angular.module('clientApp').factory('PoolService', function(ENV, $firebase) {
  var poolService = {};

  poolService._ref = ENV.firebaseRef.child('pools');
  poolService._listRef = $firebase(poolService._ref).$asArray();

  poolService._objRef = function(id) {
    return $firebase(poolService._ref.child(id)).$asObject();
  };

  poolService._listObjRef = function(id) {
    return poolService._listRef.$getRecord(id);
  };

  poolService.create = function(pool) {
    return poolService._listRef.$add(pool);
  };

  poolService.delete = function(pool) {
    pool = poolService._listObjRef(pool.$id);
    return poolService._listRef.$remove(pool);
  };

  poolService.update = function(pool) {
    var original = poolService._objRef(pool.$id);
    angular.extend(original, pool);
    return original.$save();
  };

  poolService.save = function(pool) {
    if (pool.$id) {
      return poolService.update(pool);
    } else {
      return poolService.create(pool);
    }
  };

  poolService.list = poolService._listRef;
  poolService.single = poolService._objRef;

  return poolService;
});
