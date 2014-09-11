'use strict';

angular.module('clientApp').factory('API', function($http, ENV) {
  function onSuccess(resp) {
    return resp.data;
  }

  function onError(data) {
    return data;
  }

  function API(path, methods, baseUrl) {
    this.path = path || '';
    this.baseUrl = baseUrl || ENV.apiRoot;
    this.url = this.baseUrl + this.path;

    if (methods) {
      var self = this;
      angular.forEach(methods, function(method) {
        self[method.name] = function() {
          return $http[method.verb](self.url + '/' + method.path).then(onSuccess, onError);
        };
      });
    }
  }

  API.prototype.get = function(id) {
    if (id) {
      return $http.get(this.url + '/' + id).then(onSuccess, onError);
    } else {
      return $http.get(this.url).then(onSuccess, onError);
    }
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
