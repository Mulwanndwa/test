angular.module('insuranceapp.factories', [])
.factory('api', function ($http, $cookies) {
  return {
      setToken: function (token) {
          $http.defaults.headers.common['Authentication'] = token || $cookies.token;
      }
  };
});