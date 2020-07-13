
angular.module('insuranceapp.services', [])
.service('apiService', ['$http', 'ApiEndpoint', '$ionicHistory', '$state', function($http, ApiEndpoint, $ionicHistory, $state){

    this.login = function(loginData, callback) {

        //var url = apiUrl + "api/" + type + "/" + search;
        //console.log(url);

        var authRequest = new Object();
        authRequest.username = loginData.username;
        authRequest.password = loginData.password;
        authRequest.imei = loginData.imei;
        // authRequest.app = 'insuranceapp';

        console.log(authRequest);

        console.log(ApiEndpoint.url);

        var url = ApiEndpoint.url + '/basic/login/';

        console.log('url: ' + url);
        console.log('test');

        postRequest(url, authRequest, { 'Content-Type': 'application/json' }, callback, true);

    };

    this.reset_password = function(cellnumber, callback){
        var url = ApiEndpoint.url + "/basic/password_reset/";

        var postData = new Object();
        postData.username = cellnumber;

        console.log('postData', postData);

        postRequest(url, postData, { 'Content-Type': 'application/json' }, callback, true);
    };

    this.logout = function(callback) {
        var url = ApiEndpoint.url + '/basic/logout/';
        params = {};
        getRequest(url, params, callback)
    }

    this.getThemeData = function() {

      console.log('getThemeData');

      themeData = {
        logo : 'img/InsurApp.png'
      };

      return themeData;
    }

    this.get_customer = function(product_id, customer_idcell, token, callback){
        var url = ApiEndpoint.url + "/insurapp/customer_search/";

        var postData = new Object();
        postData.product_id = product_id;
        postData.customer_idcell = customer_idcell;

        postRequest(url, postData, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.get_product_types = function(token, callback){
        var url = ApiEndpoint.url + "/insurapp/get_product_types";
        postRequest(url, {}, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.get_product = function(id, token, callback){
        var url = ApiEndpoint.url + "/insurapp/get_products/" + id;
        postRequest(url, {}, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.get_product_details = function(id, token, callback){
        var url = ApiEndpoint.url + "/insurapp/get_product/" + id;
        postRequest(url, {}, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.get_product_premium = function(id, amount, term, dob, token, callback){
        var url = ApiEndpoint.url + "/insurapp/get_product_premium/" + id;

        var postData = new Object();
        postData.term = term;
        postData.amount = amount;
        postData.dob = dob;

        console.log('postData', postData);

        postRequest(url, postData, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.get_policy_number = function(id, identifier, token, callback){
        var url = ApiEndpoint.url + "/insurapp/get_policy_number/" + id;

        var postData = new Object();
        postData.identifier = identifier;
        postData.token = token;

        console.log('get_policy_number - postData', postData);

        postRequest(url, postData, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.save_policy = function(policy_number, user_data, token, callback){
        var url = ApiEndpoint.url + "/insurapp/update_application/" + policy_number;

        //var postData = new Object();
        user_data.token = token;

        /*postData.product_id = user_data['product_id'];
        postData.premium = user_data['premium'];
        postData.product_data = user_data['product_data'];
        postData.first_name = user_data['first_name'];
        postData.last_name = user_data['last_name'];
        postData.sa_id = user_data['sa_id'];
        postData.dob = user_data['dob'];
        postData.passport_number = user_data['passport_number'];
        postData.tel_cell = user_data['tel_cell'];
        postData.email_address = user_data['email_address'];
        postData.postal_code = user_data['postal_code'];
        postData.beneficiary_name = user_data['beneficiary_name'];
        postData.beneficiary_sa_id = user_data['beneficiary_sa_id'];
        postData.language = user_data['language'];
        postData.policy_wording_id = user_data['policy_wording_id'];*/

        //console.log('save post sata: ', postData);

        postRequest(url, user_data, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.complete_policy = function(policy_number, user_data, payment_method, token, callback){
        var url = ApiEndpoint.url + "/insurapp/complete_application/" + policy_number;

        var postData = new Object();
        postData.token = token;

        postData.product_id = user_data['product_id'];
        postData.premium = user_data['premium'];
        postData.product_data = user_data['product_data'];
        postData.first_name = user_data['first_name'];
        postData.last_name = user_data['last_name'];
        postData.sa_id = user_data['sa_id'];
        postData.dob = user_data['dob'];
        postData.passport_number = user_data['passport_number'];
        postData.tel_cell = user_data['tel_cell'];
        postData.email_address = user_data['email_address'];
        postData.postal_code = user_data['postal_code'];
        postData.beneficiary_name = user_data['beneficiary_name'];
        postData.beneficiary_sa_id = user_data['beneficiary_sa_id'];
        postData.language = user_data['language'];
        postData.policy_wording_id = user_data['policy_wording_id'];
        postData.payment_method = payment_method;

        if(user_data['is_quote']){
            postData.is_quote = user_data['is_quote'];
        }

        postRequest(url, postData, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.validate_policy_wording = function(policy_number, policy_wording_id, token, callback){
        var url = ApiEndpoint.url + "/insurapp/policy_wording_validation/";

        var postData = new Object();
        postData.token = token;
        postData.policy_number = policy_number;
        postData.policy_wording_id = policy_wording_id;

        postRequest(url, postData, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.get_dependants = function(policy_number, token, callback){
        var url = ApiEndpoint.url + "/insurapp/get_dependants/" + policy_number;
        postRequest(url, {}, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.add_dependant = function(policy_number, first_name, last_name, type, dob, token, callback){
        var url = ApiEndpoint.url + "/insurapp/add_dependant/" + policy_number;

        var postData = new Object();
        postData.first_name = first_name;
        postData.last_name = last_name;
        postData.type = type;
        postData.dob = dob;

        postRequest(url, postData, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.remove_dependant = function(policy_number, dependant_id, token, callback){
        var url = ApiEndpoint.url + "/insurapp/remove_dependant/" + policy_number;

        var postData = new Object();
        postData.dependant_id = parseInt(dependant_id);

        postRequest(url, postData, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.get_payment_options = function(id, token, callback){
        var url = ApiEndpoint.url + "/insurapp/get_payment_options/" + id;
        postRequest(url, {}, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.upload_image = function(image_base, type, policy_number, token, callback){
        var url = ApiEndpoint.url + "/insurapp/save_picture/" + policy_number;
        console.log(url);

        var postData = new Object();
        postData.type = type;
        postData.picture = image_base;

        console.log(postData);

        postRequest(url, postData, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.search_policies = function(id_number, policy_number, cellphone, quote_number, token, callback){
        var url = ApiEndpoint.url + "/insurapp/policies_search/";

        var postData = new Object();

        quote_number = quote_number.replace("QUOTE_", "");
        if(quote_number){
            postData.search_term = quote_number;
        }

        if(id_number){
            postData.search_term = id_number;
        }

        if(cellphone){
            postData.search_term = cellphone;
        }

        if(policy_number){
            postData.search_term = policy_number;
        }

        postRequest(url, postData, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.get_policy_info = function(policy_number, token, callback){
        var url = ApiEndpoint.url + "/insurapp/policy_search/";

        var postData = new Object();    
        postData.policy_number = policy_number;

        postRequest(url, postData, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.resend_policy_sms = function(policy_number, token, callback){
        var url = ApiEndpoint.url + "/insurapp/resend_policy_sms/";

        var postData = new Object();    
        postData.policy_number = policy_number;

        postRequest(url, postData, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.purchase_airtime_product = function(product_id, amount, cell, token, callback){
        var url = ApiEndpoint.url + "/sales/purchase_airtime_product";
        console.log(url);

        var purchaseRequest = new Object();
        purchaseRequest.product_id = product_id;
        purchaseRequest.amount = amount;
        purchaseRequest.cell = cell;

        console.log(purchaseRequest);

        postRequest(url, purchaseRequest, { 'Content-Type': 'application/json', 'Authorization': token }, callback, false);
    };

    this.update_password = function(cell_number, old_password, new_password, callback){
        var url = ApiEndpoint.url + "/basic/update_password";
        console.log(url);

        var updateRequest = new Object();
        updateRequest.username = cell_number;
        updateRequest.password = old_password;
        updateRequest.new_password = new_password;

        console.log(updateRequest);

        postRequest(url, updateRequest, { 'Content-Type': 'application/json' }, callback, true);
    };


    this.cashout = function(amount, token, callback){
        var url = ApiEndpoint.url + "/insurapp/cashout";
        console.log(url);

        var cashoutRequest = new Object();
        cashoutRequest.amount = amount;

        console.log(cashoutRequest);

        postRequest(url, cashoutRequest, { 'Content-Type': 'application/json', 'Authorization': token }, callback, true);
    };

    this.expiring_policies = function(token, callback){
        var url = ApiEndpoint.url + "/insurapp/expiring_policies/";
        console.log(url);
        postRequest(url, {}, { 'Content-Type': 'application/json', 'Authorization': token }, callback, true);
    };


    this.create_lead = function(first_name, last_name, cell_number, token, callback){
        var url = ApiEndpoint.url + "/insurapp/save_lead";
        console.log(url);

        var createRequest = new Object();
        createRequest.first_name = first_name;
        createRequest.last_name = last_name;
        createRequest.cellphone = cell_number;

        console.log(createRequest);

        postRequest(url, createRequest, { 'Content-Type': 'application/json', 'Authorization': token  }, callback, true);
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

    function postRequest(url, data, headers, callback, login){
        console.log('post request');
         $http({
            cache: false,
            withCredentials: false,
            method: "post",
            url: url,
            headers,
            data: data
        }).then(function(success){
            console.log('post success', success);

            if(success.data.success == true){
                console.log('post success callback');
                callback(success, false);
            } else {
                if(login == false){
                    console.log('token expired');
                     $ionicHistory.nextViewOptions({
                       disableBack: true
                    });

                    //$location.path(goTo);
                    $state.go('login');
                } else {
                    callback(success, false);
                }
            }
        }, function(error){
            callback(error, error);
        });
    };


}]);

