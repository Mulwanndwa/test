angular.module('insuranceapp.factories', [])
.factory ('StorageService', function ($localStorage) {

    $localStorage = $localStorage.$default({
        collection: []
    });

    var _getAll = function () {
      return $localStorage.collection;
    };
    var _add = function (thing) {
      $localStorage.collection.push(thing);
    }
    var _remove = function (thing) {
      $localStorage.collection.splice($localStorage.collection.indexOf(thing), 1);
    }
    return {
        getAll: _getAll,
        add: _add,
        remove: _remove
      };
})