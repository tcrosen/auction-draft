'use strict';

angular.module('clientApp').factory('API', function($http, ENV) {
  function API(path, baseUrl) {
    this.path = path || '';
    this.baseUrl = baseUrl || ENV.apiRoot;
    this.url = this.baseUrl + this.path;
  }

  function onSuccess(resp) {
    return resp.data;
  }

  function onError(data) {
    return data;
  }

  API.prototype.get = function() {
    return $http.get(this.url).then(onSuccess, onError);
  };

  API.prototype.getById = function(id) {
    return $http.get(this.url + '/' + id).then(onSuccess, onError);
  };

  API.prototype.post = function(requestData) {
    return $http.post(this.url, requestData).then(onSuccess, onError);
  };

  API.prototype.put = function(resourcePath, requestData) {
    return $http.put(this.url, requestData).then(onSuccess, onError);
  };

  return API;
});
