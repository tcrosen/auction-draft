'use strict';

angular.module('clientApp').factory('EntryService', function(API) {
  var entryService = {};

  entryService._api = new API('/entries');

  entryService.fetch = function() {
    return entryService._api.get();
  };

  entryService.getById = function(id) {
    return entryService._api.getById(id);
  };

  return entryService;
});
