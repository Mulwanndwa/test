angular.module('insuranceapp.factories', [])
.factory('salesFactory', ['$http', 'ApiEndpoint', function($http, ApiEndpoint) {

    var urlBase = ApiEndpoint.url + '/sales/';
    var salesFactory = {};

    var token = null;

    salesFactory.get_pinless_data_products_data = null;

    salesFactory.setToken = function(token) {
        salesFactory.token = token;
    }
    // define the getProfile method which will fetch data
    // from GH API and *returns* a promise
    salesFactory.get_pinless_data_products = function(token, callback) {

        // Generally, javascript callbacks, like here the $http.get callback,
        // change the value of the "this" variable inside it
        // so we need to keep a reference to the current instance "this" :
        var self = this;

        var request_url = urlBase + 'get_pinless_data_products';

        postRequest(request_url, {}, { 'Content-Type': 'application/json', 'Authorization': token }, callback);

        /*return $http({
                            cache: false,
                            withCredentials: true,
                            method: "post",
                            url: request_url,
                            headers: {
                                 'Content-Type': 'application/json' ,
                                 'Authorization': salesFactory.token 
                            },
                            data: {}
                        }

                        ).then(function(response) {

                            console.log('response');
                            console.log(response);

                        // when we get the results we store the data in user.profile
                        salesFactory.get_pinless_data_products_data = response;

                        // promises success should always return something in order to allow chaining
                        return response;

        }).then(function(result) {
            return result;
        });*/
    };


    salesFactory.get_pinless_airtime_products = function(token, callback) {

        // Generally, javascript callbacks, like here the $http.get callback,
        // change the value of the "this" variable inside it
        // so we need to keep a reference to the current instance "this" :
        var self = this;

        var request_url = urlBase + 'get_pinless_airtime_products';


        postRequest(request_url, {}, { 'Content-Type': 'application/json', 'Authorization': token }, callback);

        /*return $http({
                            cache: false,
                            withCredentials: true,
                            method: "post",
                            url: request_url,
                            headers: {
                                 'Content-Type': 'application/json' ,
                                 'Authorization': salesFactory.token 
                            },
                            data: {}
                        }

                        ).then(function(response) {

                            console.log('response');
                            console.log(response);

                        // when we get the results we store the data in user.profile
                        salesFactory.get_pinless_airtime_products_data = response;

                        // promises success should always return something in order to allow chaining
                        return response;

        }).then(function(result) {
            return result;
        });*/
    };

    function getRequest(url, params, callback){
         $http({
            method: "get",
            url: url,
            params: params
        }).then(function(success){
            callback(success, false);
        }, function(error){
            callback(false, error);
        });
    };

    function postRequest(url, data, headers, callback){
        console.log('post request');
         $http({
            cache: false,
            withCredentials: false,
            method: "post",
            url: url,
            headers,
            data: data
        }).then(function(success){
            console.log('post success');
            //console.log(success);
            callback(success, false);
        }, function(error){
            callback(false, error);
        });
    };


    return salesFactory;
}
]);