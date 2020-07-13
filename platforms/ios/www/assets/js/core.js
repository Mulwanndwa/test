function ResetPreloader()
{
    preloaderText = "Loading...";
}

function ShowNotification(message)
{
    myApp.alert(message);
}

function ClearLogin() {
    localStorage.removeItem("User");
    myApp.closePanel(true);
    User = {demo_user: false};
    mainView.router.loadPage('login.html');
}

function BackToLanding() {
    mainView.router.loadPage('landing.html');
}

function CheckIfLoggedIn() {
    if(localStorage.getItem("User") !== null) {
        LoadAllUserData();
        return true;
    }
    else { 
        return false;
    }
}


function CheckReturnMessage(message) {
    if(message.indexOf("session has timed out") > -1) {
        myApp.alert(message, 'insurapp', function () {
            ClearLogin();
        });
    }
    else {
        ShowNotification(message);
    }
}


function SetLocalAccount() {
    localStorage.setItem("User", JSON.stringify(User));
    LoadAllUserData();
}

function LoadAllUserData() {
    User = JSON.parse(localStorage.getItem("User"));
}

function OpenEmail(email) {
    window.open('mailto:' + email, '_system');   
}

function DoRegister() {
    var formData = myApp.formToData('#RegisterForm');
    var valid = true;
    
    if(formData.first_name == "") {
        valid = false;
        ShowNotification("Please fill in your first name");
    }
    if(formData.last_name == "") {
        valid = false;
        ShowNotification("Please fill in your surname");
    }
    else if(formData.cellphone == "") {
        valid = false;
        ShowNotification("Please fill in your cellphone number");
    }
    else if(formData.email == "") {
        valid = false;
        ShowNotification("Please fill in your email address");
    }
    else if(formData.email.indexOf("@") < 0 || formData.email.indexOf(".") < 0) {
        valid = false;
        ShowNotification("Please enter a valid email address");
    }
    else if(formData.id_number == "") {
        valid = false;
        ShowNotification("Please fill in your South African ID number");
    }
    else if(!ValidateIDNumber(formData.id_number)) {
        valid = false;
        ShowNotification("Please fill in a valid South African ID number");
    }
    else if(formData.password == "") {
        valid = false;
        ShowNotification("Please fill in your password");
    }
    else if(formData.password != formData.confirm_password) {
        valid = false;
        ShowNotification("Please make sure your passwords match");
    }
    //else if(formData.province_id == "") {
    //    valid = false;
    //    ShowNotification("Please select your province");
    //}
    else if(formData.agreetoterms != "true") {
        valid = false;
        ShowNotification("Please agree to the terms and conditions before continuing");        
    }
    
    
    if(valid) {
        
        preloaderText = "Registering...";
        
        $$.post(services + "/basic/register_insurapp", JSON.stringify(formData), function(response) {
            var result = JSON.parse(response);
            ResetPreloader();
            if(result.success) {
                myApp.modal({
                    title:  'Success',
                    text: result.message,
                    buttons: [
                        {
                            text: 'Go to Login',
                            onClick: function() {
                                mainView.router.loadPage('login.html');
                            }
                        }
                    ]
                });
            }
            else {
                CheckReturnMessage(result.message);
            }
        });
    }
} 

function ValidateLogin() {
    
    var formData = myApp.formToData('#LoginForm');
    var valid = true;
    
    if(formData.username == "") {
        valid = false;
        ShowNotification("Please fill in your cellphone number");
    }
    else if(formData.password == "") {
        valid = false; 
        ShowNotification("Please enter your password");
    }
    
    formData.imei = '';
    //UNCOMMENT
    //formData.imei = device.serial;
    
    if(valid) {
        $$.post(services + "/basic/login/", JSON.stringify(formData), function(response) {            
            var result = JSON.parse(response);
            if(result.success) {
                
                User = result.data;
                SetLocalAccount();
                localStorage.setItem("username", formData.username);
                localStorage.setItem("password", formData.password);

                $('.navbar, .toolbar, .subnavbar').css('background', '#'+User.app_design.colour1)
                $('.lightbluearea.purple').css('background', '#'+User.app_design.colour3)
                $('.input-dropdown-wrap:before, .input-dropdown:before').css('border-top-color', "#"+ User.app_design.colour3)

                mainView.router.loadPage('landing.html');
            }
            else {
                CheckReturnMessage(result.message);
            }
        });
    }
}
function get_product_types() {
    var html = '';
    var html2 = '';
    User = JSON.parse(localStorage.getItem("User"));
    var valid = false
    if(User != null){
        myApp.hidePreloader()
        valid = true
    }
    ShowLoader = false
    if(valid){
        
        var values = { token: User.token };
        $$.post(services + "/insurapp/get_product_types", JSON.stringify(values), function (response) {
            var result = JSON.parse(response);
            var types = result.data.product_types;
            myApp.hidePreloader()
            ShowLoader = true
            if (result.success) {
                for (var i = 0; i < types.length; i++) {
                    if (types[i].id == 1) {
                        html += '<li>';
                        html += '    <a href="funeral_cover.html?product_id=' + types[i].id + '" class="item-link close-panel">';
                        html += '        <div class="item-content">';
                        html += '            <div class="item-media"><i class="fa fa-coffin" style="color:#29788b;">F</i></div>';
                        html += '            <div class="item-inner">';
                        html += '                <div class="item-title">' + types[i].name + '</div>';
                        html += '            </div>';
                        html += '        </div>';
                        html += '    </a>';
                        html += '</li>';


                        html2 += '<div class="col-50 center menubutton">';
                        html2 += '    <a href="funeral_cover.html?product_id=' + types[i].id + '" style="color:#29788b;">';
                        html2 += '   <div class="card-content" style="color:#29788b;">';
                        html2 += '     <div class="card-content-inner" style="color:#29788b;">';
                        //html2 += '     <i class="fa fa-coffin fa-2x" style="color:#29788b;">F</i>';
                        //html2 += '       <p style="font-size:9px">Funeral Cover</span>';
                        html2 += '<div>' + types[i].name + "</div>";
                        html2 += '      </div>';
                        html2 += '   </div>';
                        
                        html2 += '    </a>';
                        html2 += '</div>';


                    }
                    if (types[i].id == 4) {
                        html += '<li>';
                        html += '    <a href="funeral_cover.html?product_id=' + types[i].id + '" class="item-link close-panel">';
                        html += '        <div class="item-content">';
                        html += '            <div class="item-media"><i class="fa fa-lis" style=" color: #29788b;">F</i></div>';
                        html += '            <div class="item-inner">';
                        html += '                <div class="item-title">' + types[i].name + '</div>';
                        html += '            </div>';
                        html += '        </div>';
                        html += '    </a>';
                        html += '</li>';

                        //html2 += '    <a href="funeral_cover.html?product_id=' + types[i].id + '" class="item-link close-panel">';
                        html2 += '<div class="col-50 center menubutton">';
                        html2 += '    <a href="funeral_cover.html?product_id=' + types[i].id + '" style="color:#29788b;">';
                        html2 += '   <div class="card-content" style="color:#29788b;">';
                        html2 += '     <div class="card-content-inner" style="color:#29788b;">';
                        //html2 += '<i style="color:#29788b;" class="fa fa-lis fa-2x">F</i>';
                        html2 += types[i].name;
                        html2 += '      </div>';
                        html2 += '   </div>';
                        html2 += '    </a>';
                        html2 += '</div>';
                        //html2 += '    </a>';
                    }

                    if (types[i].id == 3) {
                        html += '<li>';
                        html += '    <a href="credit_life.html?product_id=' + types[i].id + '" class="item-link close-panel">';
                        html += '        <div class="item-content">';
                        html += '            <div class="item-media"><i class="fa fa-lis" style="color: #29788b;">C</i></div>';
                        html += '            <div class="item-inner">';
                        html += '                <div class="item-title">' + types[i].name + '</div>';
                        html += '            </div>';
                        html += '        </div>';
                        html += '    </a>';
                        html += '</li>';

                        html2 += '<div class="col-50 center menubutton">';
                        html2 += '    <a href="credit_life.html?product_id=' + types[i].id + '" style="color:#29788b;">';
                        html2 += '   <div class="card-content"  style="color:#29788b;">';
                        html2 += '     <div class="card-content-inner">';
                        //html2 += '<i style="color:#29788b;" class="fa fa-lis fa-2x" style="color: #fff;">C</i>';
                        html2 += types[i].name
                        html2 += '      </div>';
                        html2 += '   </div>';
                        
                        html2 += '    </a>';
                        html2 += '</div>';
                    }

                    if (types[i].id == 2) {
                        html += '<li>';
                        html += '    <a href="life_insurance.html?product_id=' + types[i].id + '" class="item-link close-panel">';
                        html += '        <div class="item-content">';
                        html += '            <div class="item-media"><i class="fa fa-lis" style=" color: #29788b;">L</i></div>';
                        html += '            <div class="item-inner">';
                        html += '                <div class="item-title">' + types[i].name + '</div>';
                        html += '            </div>';
                        html += '        </div>';
                        html += '    </a>';
                        html += '</li>';

                        //html2 += '    <a href="life_insurance.html?product_id=' + types[i].id + '" class="item-link close-panel">';
                        html2 += '<div class="col-50 center menubutton">';
                        html2 += '    <a href="life_insurance.html?product_id=' + types[i].id + '" style="color:#29788b;">';
                        html2 += '   <div class="card-content" style="color:#29788b;">';
                        html2 += '     <div class="card-content-inner">';
                        //html2 +='<i style="color:#29788b;" class="fa fa-lis fa-2x">L</i>';
                        html2 += types[i].name;
                        html2 += '      </div>';
                        html2 += '   </div>';
                        
                        html2 += '    </a>';
                        html2 += '</div>';
                    }

                    if (types[i].id == 6) {
                        html += '<li>';
                        html += '    <a href="cellphone_insurance.html?product_id=' + types[i].id + '" class="item-link close-panel">';
                        html += '        <div class="item-content">';
                        html += '            <div class="item-media"><i class="fa fa-lis" style=" color: #29788b;">L</i></div>';
                        html += '            <div class="item-inner">';
                        html += '                <div class="item-title">' + types[i].name + '</div>';
                        html += '            </div>';
                        html += '        </div>';
                        html += '    </a>';
                        html += '</li>';

                        //html2 += '    <a href="life_insurance.html?product_id=' + types[i].id + '" class="item-link close-panel">';
                        html2 += '<div class="col-50 center menubutton">';
                        html2 += '    <a href="cellphone_insurance.html?product_id=' + types[i].id + '" style="color:#29788b;">';
                        html2 += '   <div class="card-content" style="color:#29788b;">';
                        html2 += '     <div class="card-content-inner">';
                        //html2 +='<i style="color:#29788b;" class="fa fa-lis fa-2x">L</i>';
                        html2 += types[i].name;
                        html2 += '      </div>';
                        html2 += '   </div>';
                        
                        html2 += '    </a>';
                        html2 += '</div>';
                    }
                }

                html2 += '<div class="col-50 center menubutton">';
                html2 += '    <a href="javascript:checkCards()" style="color:#29788b;">';
                html2 += '   <div class="card-content" style="color:#29788b;">';
                html2 += '     <div class="card-content-inner">';
                //html2 += '<i style="color:#29788b;" class="fa fa-credit-card fa-2x"></i>';
                html2 += "Manange Your Cards";
                html2 += '      </div>';
                html2 += '   </div>';
                
                html2 += '    </a>';
                html2 += '</div>';

                /*
                html2 += '<div class="col-50 center menubutton">';
                html2 += '    <a href="customer_manage_cards.html" style="color:#29788b;">';
                html2 += '   <div class="card-content" style="color:#29788b;">';
                html2 += '     <div class="card-content-inner">';
                html2 += '<i style="color:#29788b;" class="fa fa-credit-card fa-2x"></i>';
                html2 += "Manange Customer Cards";
                html2 += '      </div>';
                html2 += '   </div>';
                
                html2 += '    </a>';
                html2 += '</div>';
                */

                $(".product-cats").html(html);
                $(".product-list").html(html2);
            } else {
                ShowLoader = true
                myApp.alert(result.message, function () {
                    ClearLogin();
                });
                
            }
        });
    }else{
        ShowLoader = true
        myApp.hidePreloader()
        ClearLogin()
    }
}
function ValidateIDNumber(value) {
  var ex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/;

  var theIDnumber = value;
  return ex.test(theIDnumber);
}

function DoCellphoneNumber() {
    
    
    myApp.prompt('Please give us your cellphone number so we can send you a One-Time Pin.', 'insurapp', 'number', function (value) {
        //mainView.router.loadPage("register.html?number=" + value);
        var values = { cellphone: value, app: 'insurapp' }; 
        
        $$.post(services + "/basic/verify_cellphone", JSON.stringify(values), function(response) {
            var result = JSON.parse(response);
            
            if(result.success) {
                ShowNotification(result.message);
                
                PreRegisterValidateOTP(value);
            }
            else {
                CheckReturnMessage(result.message);
            }
        });
        
        //mainView.router.loadPage("register.html?number=" + value);
        
    });
}

function _policy_search(policy_number){
   
    postData = { policy_number:policy_number, token:User.token};
    var sa_id = '';
    var premium = '';
    $$.post(services + "/insurapp/policy_search/", JSON.stringify(postData), function(response) {
            var result = JSON.parse(response);
            var Policies = result.data.policies;
            if(result.success) {
                sa_id += Policies.sa_id;
                premium += Policies.premium;
                premium += Policies.premium;
            }

            PolicyApplicationObject = Policies;
           
            var settings = Policies.data;
            var term_min = Policies.data.loan_term;
            var term_max = Policies.data.term;
            var term_unit = "";
            var currency = "";
            
            for(var i = 0; i < settings.length; i++) {
                if(settings[i].name == 'term_min') {
                    term_min = settings[i].value;
                }
                if(settings[i].name == 'term_max') {
                    term_max = settings[i].value;
                }
                if(settings[i].name == 'term_unit') {
                    term_unit = settings[i].value;
                }
                if(settings[i].name == 'currency') {
                    currency = settings[i].value;
                }
            }


        $("#FuneralProduct_Name").html(CurrentProduct.name);
        $("#funeral_product_id_number").val(Policies.sa_id);
        $("#FuneralProduct_Slider1").val(Policies.data.loan_term);
        $("#FuneralProduct_Currency").val(Policies.data.loan_term);
        $("#loan_premium").val(Policies.data.premium);
        $("#cellphone_product_id_number").val(Policies.sa_id);
        

        CurrentPicture = Policies.picture;
        CurrentSignature = Policies.signature;

        PolicyApplicationObject = new Object();

        PolicyApplicationObject.policy_number = policy_number;
        PolicyApplicationObject.product_id = result.data.policies.ins_prod_id;
        PolicyApplicationObject.premium = result.data.policies.premium;
        PolicyApplicationObject.first_name = result.data.policies.first_name;
        PolicyApplicationObject.last_name = result.data.policies.last_name;
        PolicyApplicationObject.sa_id = result.data.policies.sa_id;
        PolicyApplicationObject.dob = result.data.policies.dob;
        PolicyApplicationObject.tel_cell = result.data.policies.tel_cell;
        PolicyApplicationObject.email_address = result.data.policies.email_address;
        PolicyApplicationObject.postal_code = result.data.policies.postal_code;
        PolicyApplicationObject.beneficiary_name = result.data.policies.beneficiary_name;
        PolicyApplicationObject.beneficiary_sa_id = result.data.policies.beneficiary_sa_id;
        PolicyApplicationObject.token = User.token;
        PolicyApplicationObject.product_data = new Object();
        PolicyApplicationObject.product_data.loan_term = result.data.policies.data.loan_term;
        PolicyApplicationObject.product_data.loan_amount = result.data.policies.data.loan_amount;
        PolicyApplicationObject.language = result.data.policies.language;
        PolicyApplicationObject.policy_wording_id = Policies.policy_wording_id;
        console.log("PolicyApplicationObject :" + JSON.stringify(PolicyApplicationObject));
        CurrentPolicyNumber = policy_number;
        CurrentProduct.name = result.data.policies.product_name;
        CurrentPicture = result.data.policies.picture;
        CurrentSignature = result.data.policies.signature;
        Renew_Policy = true;

    });
}

function policy_search(policy_number){
   
    postData = { policy_number:policy_number, token:User.token};
    
    var html = '';
    $$.post(services + "/insurapp/policy_search/", JSON.stringify(postData), function(response) {
            var result = JSON.parse(response);
            var Policies = result.data.policies;
            if(result.success) {
                
                //window.setTimeout(function() {
                    //for(var i = 0; i < Policies.length; i++) {
                        html += '<li class="card"> '+
                            '<div class="item-content">'+
                                '<div class="item-media"></div>'+
                                    '<div class="item-inner">'+
                                        '<div class="item-title">'+
                                        '<strong>'+Policies.type+'<strong>'+'<br/>'+
                                        Policies.sales_agent+'<br/>'+
                                        '<strong> Policy Number</strong> : '+Policies.policy_number+'<br/>'+
                                        '<strong> Term</strong> : '+Policies.data.loan_term+'<br/>'+
                                        '<strong> Quote</strong> : '+Policies.quote_number+'<br/>'+
                                        '<strong> Status</strong> : '+Policies.status_name+'<br/>'+
                                        '<strong> Expiry Date</strong> : '+Policies.expiry_date+'<br/>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</li>';
                        if(Policies.sale_complete == 0 || Policies.sale_complete ==99){
                            $("#complete").html('<a class="text-red text-1x" onclick="complete(' + Policies.ins_prod_id + ',' +"'"+ Policies.sa_id +"'"+ ')>Complete Application</a>');  
                        }
                        if(Policies.sale_complete == 1){
                            $("#sms").html('<a class="text-red text-1x" onclick="resend_policy_sms('+"'"+ Policies.policy_number +"'"+');">SMS details</a>');  
                        }
                        if (Policies.sale_complete == 1) {
                            $("#renew").html('<a class="text-red text-1x" onclick="renew_policy(' + Policies.ins_prod_id + ',' +"'"+ Policies.policy_number +"'"+ ')">Renew Policy</a>');  
                        }
                        if(Policies.sale_complete == 22 || Policies.sale_complete ==  44){
                            $("#atm").html('<a class="text-red text-1x">Please make a payment of R' + Policies.premium +'at your nearest ABSA atm.</a>');  
                        }
                
                        
                    //}
                //},80);
            }
            else {
                CheckReturnMessage(result.message);
            }
            $("#searchPolicies").html(html);
        });
    mainView.router.loadPage('policies.html');
}

function complete(ins_prod_id, idnumber, policy_number) {
    var html = '';
    var values_1 = {
        token: User.token,
        policy_number: policy_number
    };

    $$.post(services + "/insurapp/policy_search", JSON.stringify(values_1), function (response) {
        var policy = JSON.parse(response);
        var values = {
            token: User.token
        };

        PolicyApplicationObject = {};

        PolicyApplicationObject.policy_number =  policy_number;
        PolicyApplicationObject.product_id = policy.data.policies.ins_prod_id;
        PolicyApplicationObject.premium = policy.data.policies.premium;
        PolicyApplicationObject.first_name = policy.data.policies.first_name;
        PolicyApplicationObject.last_name = policy.data.policies.last_name;
        PolicyApplicationObject.sa_id = policy.data.policies.sa_id;
        PolicyApplicationObject.dob = policy.data.policies.dob;
        PolicyApplicationObject.tel_cell = policy.data.policies.tel_cell;
        PolicyApplicationObject.email_address = policy.data.policies.email_address;
        PolicyApplicationObject.postal_code = policy.data.policies.postal_code;
        PolicyApplicationObject.beneficiary_name = policy.data.policies.beneficiary_name;
        PolicyApplicationObject.beneficiary_sa_id = policy.data.policies.beneficiary_sa_id;
        PolicyApplicationObject.token = User.token;
        PolicyApplicationObject.product_data = new Object();
        PolicyApplicationObject.product_data.loan_term = policy.data.policies.data.loan_term;
        PolicyApplicationObject.product_data.loan_amount = policy.data.policies.data.loan_amount;
        PolicyApplicationObject.language = policy.data.policies.language;
        PolicyApplicationObject.token = User.token;

        CurrentProduct.name = policy.data.policies.product_name;
        CurrentPolicyNumber = policy_number;
        CurrentPolicyWordingId = policy.data.policies.policy_wording_id;
        console.log('policy_wording_id:' + policy.data.policies.policy_wording_id)
        
        $$.post(services + "/insurapp/get_product/" + policy.data.policies.ins_prod_id, JSON.stringify(values), function (response) {
            var result = JSON.parse(response);
            var product = result.data.product;
            CurrentProduct = product;
            if (result.success) {
                CurrentPolicyNumber = policy_number
                switch (parseInt(product.type_id)) {
                    case 1:
                        mainView.router.loadPage('funeral_product_sign.html');
                        break;
                    case 2:
                        mainView.router.loadPage('funeral_product_sign.html');
                        break;
                    case 3:
                        mainView.router.loadPage('funeral_product_sign.html?id=' + parseInt(product.id) + '&policy_number=' + policy_number);
                        break;
                    case 4:
                        mainView.router.loadPage('funeral_product_sign.html?id=' + parseInt(product.id) + '&policy_number=' + policy_number);
                        break;
                }
            }
        });
    });
}

function renew_policy(ins_prod_id, policy_number) {
    var html = '';
    var values_1 = {
        token: User.token,
        policy_number: policy_number
    };

    $$.post(services + "/insurapp/policy_search", JSON.stringify(values_1), function (response) {
        var policy = JSON.parse(response);
        var values = {
           token: User.token
        };
        console.log(policy.data.policies.ins_prod_id);
        console.log('policy_wording_id:' + policy.data.policies.policy_wording_id)
        CurrentPolicyWordingId = policy.data.policies.policy_wording_id;
        $$.post(services + "/insurapp/get_product/" + policy.data.policies.ins_prod_id, JSON.stringify(values), function (response) {
            var result = JSON.parse(response);
            var product = result.data.product;
            if (result.success) {
                CurrentPolicyNumber = policy_number
                switch (parseInt(product.type_id)) {
                    case 1:
                        mainView.router.loadPage('funeral_product.html?id=' + parseInt(product.id) +'&policy_number='+policy_number);
                        break;
                    case 2:
                        mainView.router.loadPage('life_insurance_product.html?id=' + parseInt(product.id)+'&policy_number='+policy_number);
                        break;
                    case 3:
                        mainView.router.loadPage('credit_life_product.html?id=' + parseInt(product.id)+'&policy_number='+policy_number);
                        break;
                    case 4:
                        mainView.router.loadPage('funeral_product.html?id=' + parseInt(product.id)+'&policy_number='+policy_number);
                    break;
                    case 6:
                        mainView.router.loadPage('cellphone_product.html?product_id=' + parseInt(product.id)+"&type_id=6&"+'&policy_number='+policy_number);
                    break;
                }
            }
        });
    });
}

function policies_search() {
   
    mainView.router.loadPage('policies.html');
    window.setTimeout(function () {
        //myApp.showPreloader("Searching policy....");
        var formData = myApp.formToData('#searchForm');
        var postData = {};
        quote_number = formData.quote_number.replace("QUOTE_", "");
        if (quote_number) {
            postData = { search_term: formData.quote_number, token: User.token };
        }

        if (formData.id_number) {
            postData = { search_term: formData.id_number, token: User.token };
        }

        if (formData.cellphone) {
            postData = { search_term: formData.cellphone, token: User.token };
        }

        if (formData.policy_number) {
            postData = { search_term: formData.policy_number, token: User.token };
        }
        var html = '';
        $$.post(services + "/insurapp/policies_search/", JSON.stringify(postData), function (response) {
            var result = JSON.parse(response);
            var Policies = result.data.policies;
            myApp.hidePreloader(); 
            if (result.error == false) {

                //window.setTimeout(function() {
                for (var i = 0; i < Policies.length; i++) {
                    //html += '<div class="card" onClick="policy_search(' + "'" + Policies[i].policy_number + "'" + ')"> ';
                    html += '<div class="card"> ';

                    html += '<table style="margin-left: 15px;">';
                    html += '<tr><td><strong>Customer</strong></td><td> : ' + Policies[i].type + '</td></tr>';
                    html += '<tr><td><strong>Agent</strong></td><td> : ' + Policies[i].sales_agent + '</td></tr>';
                    html += '<tr><td><strong>Policy Number</strong></td><td> : ' + Policies[i].policy_number + '</td></tr>';
                    html += '<tr><td><strong>Term</strong> </td><td> : ' + Policies[i].data.loan_term + '</td></tr>';
                    html += '<tr><td><strong>Quote</strong> </td><td> : ' + Policies[i].quote_number + '</td></tr>';
                    html += '<tr><td><strong>Status</strong> </td><td> : ' + Policies[i].status_name + '</td></tr>';
                    html += '<tr><td><strong>Expiry Date</strong> </td><td> : ' + Policies[i].expiry_date + '</td></tr>';
                    html += '</table>';


                    if (Policies[i].sale_complete == 99) {
                        html += '<div class="card-footer">';
                        html += '<a class="button button-big button-fill bg-pink uppercase" style="width:70%;margin: 0 auto;" onclick="complete(' + Policies[i].ins_prod_id + ',' + "'" + Policies[i].sa_id + "'" + ',' + "'" + Policies[i].policy_number + "'" + ')">Complete Application</a>';
                        html += '</div>';
                    }

                    if (Policies[i].sale_complete == 0) {
                        html += '<div class="card-footer">';
                        html += '<a class="button button-big button-fill bg-pink uppercase" style="width:70%;margin: 0 auto;" onclick="complete(' + Policies[i].ins_prod_id + ',' + "'" + Policies[i].sa_id + "'" + ',' + "'" + Policies[i].policy_number + "'" + ')">Complete Application</a>';
                        html += '</div>';
                    }

                    if (Policies[i].sale_complete == 1) {
                        html += '<div class="card-footer">';
                        html += '<table style="width:100%;">';
                        
                        html += '<tr>';
                        html += '<td><a class="button button-small button-fill bg-pink" style="margin: 0 auto;" onclick="resend_policy_sms(' + "'" + Policies[i].policy_number + "'" + ');">SMS details</a></td>';
                        html += '<td><a class="button button-small button-fill bg-pink" style="margin: 0 auto;" onclick="renew_policy(' + Policies[i].ins_prod_id + ',' + "'" + Policies[i].policy_number + "'" + ')">Renew Policy</a></td>';
                        html += '</tr></table>';
                        html += '</div>';
                    }
                    if (Policies[i].sale_complete == 22 || Policies[i].sale_complete == 44) {
                        html += '<div class="card-footer" style="; text-align:center;">';
                        html += '<span class="text-red text-1x">Please make a payment of R' + Policies[i].premium + ' at your nearest ABSA atm.</span>';
                        //html += '<a class="button button-small button-fill bg-pink" style="margin: 0 auto;" onclick="resend_policy_sms(' + "'" + Policies[i].policy_number + "'" + ');"></a>';
                        html += '</div>';
                    }

                    if (Policies[i].sale_complete == 25){
                        html += '<div class="card-footer" style="; text-align:center;">';
                        html += '<span class="text-red text-1x">' + Policies[i].status_name + '</span>';
                        html += '</div>';
                    }


                    html += '</div>';

                }
                //},80);

                $("#searchPolicies").html(html);

                if (Policies.length > 0) {

                } else {
                    myApp.alert(result.message, function () {
                        mainView.router.loadPage('search.html');
                    });
                }

            }
            else {
                CheckReturnMessage(result.message);
            }

        },
            function (response) {
                var result = JSON.parse(response.response);
                myApp.alert(result.message)
            }
        );
        
    }, 1000); 

   
   
}

function PreRegisterValidateOTP(cellphone) {
    myApp.prompt('Please enter your OTP (this was sent to your cellphone)', 'One Time Pin', 'number',
        function (value) {
            var values = {username: cellphone, otp: value};   
            $$.post(services + "/basic/verify_otp/", JSON.stringify(values), function(response) {
                var result = JSON.parse(response);
                
                if(result.success) {
                    window.setTimeout(function() {
                        mainView.router.loadPage("register.html?number="+cellphone);
                    }, 1000);                    
                }
                else {
                    CheckReturnMessage(result.message);
                }
            });
        },
        function (value) {
        
        }
    );
}

function LoadProvinces(selector) {
    var html = '';
    
    html += '<option value="">Select a province</option>';
    
    for(var i = 0; i < Provinces.length; i++) {
        html += '<option value="' + Provinces[i].id + '">' + Provinces[i].name + '</option>';
    }
    
    $(selector).html(html);
}

function DoGeoLocateOnRegistration() {
   
    preloaderText = "Locating you...";
    myApp.showPreloader(preloaderText);
    
    navigator.geolocation.getCurrentPosition(function(position) {
        ResetPreloader();
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        
        $("#RegisterForm [name='location_long']").val(lon);
        $("#RegisterForm [name='location_lat']").val(lat);
        
        $("#DoGeoLocateButton").hide();
        $("#DoRegisterButton").show();
        
        myApp.hidePreloader();   
        clearTimeout(timer);
        
    }, function(error) {
        alert(error.code + " - " + error.message);
        myApp.hidePreloader();
        $("#DoGeoLocateButton").show();
        //$("#DoRegisterButton").hide();
        }, { enableHighAccuracy: true });

      timer = window.setTimeout(function () {
        myApp.hidePreloader();
        myApp.alert('Location is required. Please check your location settings and try again.', function () {
            clearTimeout(timer);
            //DialogGps();
        });
    }, 18000);
}

function DialogGps() {
    cordova.dialogGPS("Your GPS is Disabled, GPS needs to be enable to works.",//message
        "Use GPS, with wifi or 3G.",//description
        function (buttonIndex) {//callback
            switch (buttonIndex) {
                case 0: break;//cancel
                case 1: break;//neutro option
                case 2: break;//user go to configuration
            }
        },
        "Please Turn on GPS",//title
        ["Cancel", "Later", "Go"]
    );//buttons
}


function OpenForgotPassword() {
    myApp.prompt("Type in your cell number and we will send you your password.", function(value) {
        
        $$.post(services + "/basic/password_reset", JSON.stringify({username: value, app: 'insurapp'}), function(response) {
        var result = JSON.parse(response);


            if(result.success) {

                ShowNotification("Your password has been sent to you.");

            }
            else {
                CheckReturnMessage(result.message);
            }
        });
    }, function() {  
    });
}

function OpenTermsAndConditions() {
    
    
    var target = "_blank";
    var options = "location=yes";
    var inAppBrowserRef = cordova.InAppBrowser.open('http://insurapp.co.za/terms/', target, options);  
    
    
    //var popupHTML = '<div class="popup bg-pink text-white">'+
    //                    '<div class="content-block text-white">'+
    //                      '<h2 class="text-center text-white">Terms and Conditions</h2>'+
    //                      '<div class="row" style="margin-bottom:10px;">'+
    //                        '<div class="col-100 text-center">' +
    //                        '<p>Life is about to get a little simpler...With insurapp app it means you can manage all your insurance policies straight off the app, No need for cash, no surprise debit orders and claims are easy to submit and track!!</p>'+
    //                        '</div>'+
    //                      '</div>'+
    //                      '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
    //                        '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup button button-fill bg-white text-purple uppercase">Close</a></div>'+
    //                      '</div>'+
    //                    '</div>'+
    //                  '</div>'
    //  myApp.popup(popupHTML); 
    //  myApp.popup(popupHTML); 
}

function LoadHomeScreenButtons() {
    $$.post(services + "/basic/home_screen_buttons", JSON.stringify({token: User.token, app: 'insurapp'}), function(response) {
        var result = JSON.parse(response);
    

        if(result.success) {
            
            WalletBalance = result.wallet_balance;
            
            $("#WalletBalance").html('<span>' + User.user.name + '</span><br />Amount: R' + parseFloat("0" + result.wallet_balance).toFixed(2));
            
            var html = '<div class="row mt10">';
            var counter = 0;
            for(var i = 0; i < result.data.length; i++) { 
                
                counter++;
                
                html += '<div class="col-50 mb20 text-center menubutton"><a href="' + result.data[i].href + '" class="text-pink text-center"><img src="' + iconLocation + result.data[i].icon + '" style="width: 65px;" class="rounded-corners" /><br />' + result.data[i].name + '</a></div>';
                
                if((i+1) % 2 == 0) {
                    html += '</div>';
                    html += '<div class="row mt10">';
                }
            }
            
            while(counter % 2 != 0)
            {
                html += '<div class="col-50 mb20 text-center">&nbsp;</div>';
                counter++;
            }
            
            html += '</div>';
            
            $("#HomeScreenButtons").html(html);
        }
        else {
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {

    });
}

function LoadTeamSales() {
    $$.post(services + "/insurapp/referral_tree", JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);
        
        if(result.success) {
            var MySales = result.data.user.sales;
            var MyTeam = result.data.user.kids;

            $("#YourTier_Name").html(result.data.user.name);
            $("#YourTier_Sales").html(MySales.sales);
            $("#YourTier_Total").html("R" + MySales.sales_total);
            $("#YourTier_Comm").html("R" + MySales.comm_total);
            
            $("#Tier1_Members").html(MyTeam.tier_1.member_count);
            $("#Tier1_Sales").html(MyTeam.tier_1.sales_count);
            $("#Tier1_Total").html("R" + MyTeam.tier_1.sales_total);
            $("#Tier1_Comm").html("R" + MyTeam.tier_1.commission_earned);
            
            $("#Tier2_Members").html(MyTeam.tier_2.member_count);
            $("#Tier2_Sales").html(MyTeam.tier_2.sales_count);
            $("#Tier2_Total").html("R" + MyTeam.tier_2.sales_total);
            $("#Tier2_Comm").html("R" + MyTeam.tier_2.commission_earned);
            
            $("#Tier3_Members").html(MyTeam.tier_3.member_count);
            $("#Tier3_Sales").html(MyTeam.tier_3.sales_count);
            $("#Tier3_Total").html("R" + MyTeam.tier_3.sales_total);
            $("#Tier3_Comm").html("R" + MyTeam.tier_3.commission_earned);
            
            $("#Tier4_Members").html(MyTeam.tier_4.member_count);
            $("#Tier4_Sales").html(MyTeam.tier_4.sales_count);
            $("#Tier4_Total").html("R" + MyTeam.tier_4.sales_total);
            $("#Tier4_Comm").html("R" + MyTeam.tier_4.commission_earned);
        }
        else {
            CheckReturnMessage(result.message);
        } 
    });
}

function LoadAirtimeData() {
    $$.post(services + "/sales/get_pinless_airtime_products", JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);
        
        if(result.success) {
            //product_id
            var html = '';
            var items = result.products.pinless_airtime;
            html += '<option value="">Choose one</option>';
            
            
            for(var i = 0; i < items.length; i++) {
                html += '<option value="' + items[i].id + '">' + items[i].network.replace(/p-/g, '') + '</option>';
            }
            
            $("#AirtimeForm #product_id").html(html);
        }
        else {
            CheckReturnMessage(result.message);
        }   
    });
    $$.post(services + "/sales/get_pinless_data_products", JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);
        
        if(result.success) {
            //product_id
            var html = '';
            var items = result.products.pinless_data;
            html += '<option value="">Choose one</option>';
            
            
            for(var i = 0; i < items.length; i++) {
                html += '<option value="' + items[i].id + '">(' + items[i].network.replace(/pd-/g, '') + ') ' + items[i].description.replace(/-/g, ' - ') + '</option>';
            }
            
            $("#DataForm #product_id").html(html);
        }
        else {
            CheckReturnMessage(result.message);
        }   
    });
}

function DoAirtime() {
    var formData = myApp.formToData('#AirtimeForm');
    var valid = true;
    
    if(formData.product_id == '') {
        valid = false;
        ShowNotification('Please select a network');
    }
    else if(formData.cell == '') {
        valid = false;
        ShowNotification('Please enter a cell number');
    }
    else if(formData.amount == '') {
        valid = false;
        ShowNotification('Please enter an amouint');
    }
    
    formData.token = User.token;
    
    if(valid) {
        $$.post(services + "/sales/purchase_airtime_product", JSON.stringify(formData), function(response) {
            var result = JSON.parse(response);
            
            if(result.success) {
                
                ShowNotification(result.message);
                
                $("#AirtimeForm [name='cell']").val('');
                $("#AirtimeForm [name='amount']").val('');
            }
            else {
                CheckReturnMessage(result.message);
            }   
        });
    }
}

function DoData() {
    var formData = myApp.formToData('#DataForm');
    var valid = true;
    
    if(formData.product_id == '') {
        valid = false;
        ShowNotification('Please select a product');
    }
    
    formData.token = User.token;
    
    if(valid) {
        
        formData.amount = 0;
        
        $$.post(services + "/sales/purchase_airtime_product", JSON.stringify(formData), function(response) {
            var result = JSON.parse(response);
            
            if(result.success) {                
                ShowNotification(result.message);
                $("#DataForm [name='cell']").val('');
            }
            else {
                CheckReturnMessage(result.message);
            }   
        });
    }
}

function LoadLifeInsuranceProducts(id) {
     $$.post(services + "/insurapp/get_products/"+id, JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);
    

        if(result.success) {
            
            if(result.message.indexOf("not have permission") > -1) {
                myApp.alert(result.message, 'insurapp', function () {
                    mainView.router.loadPage('landing.html');
                });
            }
            else {                
                var html = '<div class="row mt10">';
                var counter = 0;
                for(var i = 0; i < result.data.products.length; i++) {

                    counter++;

                    //html += '<div class="col-50 mb20 text-center menubutton"><a href="life_insurance_product.html?id=' + result.data.products[i].id + '" class="text-pink text-center">' + result.data.products[i].name + '<br />Premium: R' + result.data.products[i].premium + '</a></div>'; //<img src="' + iconLocation + result.data.products[i].image + '" style="width: 65px;" class="rounded-corners" /><br />
                    html += '<div class="col-45 menubutton"  style="color:#29788b;">\
                                <a href="life_insurance_product.html?id=' + result.data.products[i].id + '" >\
                                      <div class="text-center " style="color:#29788b;">\
                                          ' + result.data.products[i].name + '<br/>\
                                        Premium :' + result.data.products[i].premium + '\
                                      </div>\
                                </a>\
                             </div>'
                    /*if((i+1) % 2 == 0) {
                        html += '</div>';
                        html += '<div class="row mt10">';
                    }*/
                }

                /*while(counter % 2 != 0)
                {
                    html += '<div class="col-50 mb20 text-center">&nbsp;</div>';
                    counter++;
                }

                html += '</div>';*/


                $("#FuneralProductOptions").html(html);
            }
            
        }
        else {
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {

    });
}

function LoadCrediProducts(id) {
     $$.post(services + "/insurapp/get_products/"+id, JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);
    

        if(result.success) {
            
            if(result.message.indexOf("not have permission") > -1) {
                myApp.alert(result.message, 'insurapp', function () {
                    mainView.router.loadPage('landing.html');
                });
            }
            else {                
                var html = '<div class="row mt10">';
                var counter = 0;
                for(var i = 0; i < result.data.products.length; i++) {

                    //counter++;

                   // html += '<div class="col-50 mb20 text-center menubutton"><a href="credit_life_product.html?id=' + result.data.products[i].id + '" class="text-pink text-center">' + result.data.products[i].name + '<br />Premium: R' + result.data.products[i].premium + '</a></div>'; //<img src="' + iconLocation + result.data.products[i].image + '" style="width: 65px;" class="rounded-corners" /><br />
                    html += '<div class="col-45 menubutton" style="color:#29788b; ">\
                                <a href="credit_life_product.html?id=' + result.data.products[i].id + '" >\
                                      <div class="text-center " style="color:#29788b; ">\
                                        ' + result.data.products[i].name + '<br/>\
                                        Premium :' + result.data.products[i].premium + '\
                                      </div>\
                                </a>\
                             </div>'; 
                    /*if((i+1) % 2 == 0) {
                        html += '</div>';
                        html += '<div class="row mt10">';
                    }*/
                }

                /*while(counter % 2 != 0)
                {
                    html += '<div class="col-50 mb20 text-center">&nbsp;</div>';
                    counter++;
                }

                html += '</div>';*/


                $("#FuneralProductOptions").html(html);
            }
            
        }
        else {
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {

    });
}

function LoadFuneralProducts(id) {
     $$.post(services + "/insurapp/get_products/"+id, JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);
    

        if(result.success) {
            
            if(result.message.indexOf("not have permission") > -1) {
                myApp.alert(result.message, 'Insurapp', function () {
                    mainView.router.loadPage('landing.html');
                });
            }
            else {                
                var html = '<div class="row mt10">';
                var counter = 0;
                var _counter = "A";
                for(var i = 0; i < result.data.products.length; i++) {

                    counter++;
                    _counter++;
                    if(result.data.products[i].premium > 1){
                        html += '<div class="col-50 menubutton center"  style="color:#29788b; padding-bottom:-10px; margin-bottom: 10px;">';
                        html += '<a href="funeral_product.html?id=' + result.data.products[i].id + '">';
                        html += '      <div class="text-center " style="color:#29788b; ">' + result.data.products[i].name + '<br/>Premium :R' + result.data.products[i].premium + '</div>';
                        html += ' </a>';
                        html += ' </div>'; 
                    }

                }

                $("#FuneralProductOptions").html(html);
            }
            
        }
        else {
            myApp.alert(result.message, function () {
                ClearLogin();
            });
        }   
    },function (value) {
             ClearLogin();
    });
}
function LoadCreditProducts(id) {
     $$.post(services + "/insurapp/get_products/"+id, JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);
    

        if(result.success) {
            
            if(result.message.indexOf("not have permission") > -1) {
                myApp.alert(result.message, 'insurapp', function () {
                    mainView.router.loadPage('landing.html');
                });
            }
            else {                
                var html = '<div class="row mt10">';
                var counter = 0;
                for(var i = 0; i < result.data.products.length; i++) {

                    counter++;

                    //html += '<div class="col-50 mb20 text-center menubutton"><a href="credit_life_product.html?id=' + result.data.products[i].id + '" class="text-pink text-center">' + result.data.products[i].name + '<br />Premium: R' + result.data.products[i].premium + '</a></div>'; //<img src="' + iconLocation + result.data.products[i].image + '" style="width: 65px;" class="rounded-corners" /><br />
                    html += '<div class="col-50 menubutton">\
                                <a href="credit_life_product.html?id=' + result.data.products[i].id + '" >\
                                      <div class="text-center ">\
                                          <i class="fa fa-lis fa-4x" style="color: #29788b;"></i> <br/><br/>' + result.data.products[i].name + '<br/>\
                                        Premium :' + result.data.products[i].premium + '\
                                      </div>\
                                </a>\
                             </div>'; 
                    if((i+1) % 2 == 0) {
                        html += '</div>';
                        html += '<div class="row mt10">';
                    }
                }

                while(counter % 2 != 0)
                {
                    html += '<div class="col-50 mb20 text-center">&nbsp;</div>';
                    counter++;
                }

                html += '</div>';


                $("#FuneralProductOptions").html(html);
            }
            
        }
        else {
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {

    });
}

function LoadFuneralProduct(id) {
    $$.post(services + "/insurapp/get_product/" + id, JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);
    

        if(result.success) {
            
            CurrentProduct = result.data.product;
            
            $("#FuneralProduct_Name").html(CurrentProduct.name);
            $("#FuneralProduct_Description").html(CurrentProduct.description);
            
            if(CurrentProduct.description == '') {
                $("#FuneralProduct_Description").hide();
            }
            
            var settings = CurrentProduct.settings;
            
            var term_min = 0;
            var term_max = 0;
            var term_unit = "";
            var currency = "";
            
            for(var i = 0; i < settings.length; i++) {
                if(settings[i].name == 'term_min') {
                    term_min = settings[i].value;
                }
                if(settings[i].name == 'term_max') {
                    term_max = settings[i].value;
                }
                if(settings[i].name == 'term_unit') {
                    term_unit = settings[i].value;
                }
                if(settings[i].name == 'currency') {
                    currency = settings[i].value;
                }
            }
            
            //<input type="number" class="text-center text-pink" />
            //$("#FuneralProduct_Slider").html('<input type="number" class="text-center text-pink" id="FuneralProduct_CoverPeriod" unit="' + term_unit + '" currency="' + currency + '" premium="' + CurrentProduct.premium + '" min="' + term_min + '" max="' + term_max + '" value="' + term_min + '" step="1" />');
            $("#FuneralProduct_Slider").html('<input type="number" class="text-center text-pink" id="FuneralProduct_CoverPeriod" unit="" currency="' + currency + '" premium="' + CurrentProduct.premium + '" min="' + term_min + '" max="' + term_max + '" value="' + term_min + '" step="1" readonly/>');
            //$("#FuneralProduct_Slider").html('<input type="range" id="FuneralProduct_CoverPeriod" min="' + term_min + '" max="' + term_max + '" value="' + term_min + '" step="1" oninput="ShowFuneralProductValue(this.value, \'' + term_unit + '\')" onchange="ShowFuneralProductValue(this.value, \'' + term_unit + '\')" />');
            $("#FuneralProduct_CoverPeriod_Result").html(currency + parseFloat(CurrentProduct.premium).toFixed(2));// + " " + term_unit
            
            $("#FuneralProduct_Currency").val(currency);
            $("#FuneralProduct_Units").val(term_unit);
            $("#cover_amount").val(result.data.product.cover);
        }
        else {
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {

    });
}

function LoadCreditLifeProduct(id) {
    console.log("working----")
    $$.post(services + "/insurapp/get_product/" + id, JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);
    

        if(result.success) {
            
            CurrentProduct = result.data.product;
            
            $("#FuneralProduct_Name").html(CurrentProduct.name);
            $("#FuneralProduct_Description").html(CurrentProduct.description);
            
            if(CurrentProduct.description == '') {
                $("#FuneralProduct_Description").hide();
            }
            
            var settings = CurrentProduct.settings;
            
            var term_min = 0;
            var term_max = 0;
            var term_unit = "";
            var currency = "";
            
            for(var i = 0; i < settings.length; i++) {
                if(settings[i].name == 'term_min') {
                    term_min = settings[i].value;
                }
                if(settings[i].name == 'term_max') {
                    term_max = settings[i].value;
                } 
                if(settings[i].name == 'loan_min') {
                    loan_min = settings[i].value;
                }
                if(settings[i].name == 'loan_max') {
                    loan_max = settings[i].value;
                }
                if(settings[i].name == 'term_unit') {
                    term_unit = settings[i].value;
                }
                if(settings[i].name == 'currency') {
                    currency = settings[i].value;
                }
            }

            if(loan_min == 1 || loan_min < 1){
                loan_min = 1250
            }

            console.log("loan_min "+loan_min+", "+"loan_max "+loan_max);
            
            //<input type="number" class="text-center text-pink" />
            //$("#FuneralProduct_Slider").html('<input type="number" class="text-center text-pink" id="FuneralProduct_CoverPeriod" unit="' + term_unit + '" currency="' + currency + '" premium="' + CurrentProduct.premium + '" min="' + term_min + '" max="' + term_max + '" value="' + term_min + '" step="1" />');
            $("#CreditProduct_Slider").html('<input type="number" class="text-center text-pink" id="CreditProduct_CoverLoan" unit="" currency="' + currency + '" premium="' + CurrentProduct.premium + '" min="' + loan_min + '" max="' + loan_max + '" value="' + loan_min + '" step="1250" />');
            $("#FuneralProduct_Slider").html('<input type="number" class="text-center text-pink" id="FuneralProduct_CoverPeriod" unit="" currency="' + currency + '" premium="' + CurrentProduct.premium + '" min="' + term_min + '" max="' + term_max + '" value="' + term_min + '" step="1" />');
            //$("#FuneralProduct_Slider").html('<input type="range" id="FuneralProduct_CoverPeriod" min="' + term_min + '" max="' + term_max + '" value="' + term_min + '" step="1" oninput="ShowFuneralProductValue(this.value, \'' + term_unit + '\')" onchange="ShowFuneralProductValue(this.value, \'' + term_unit + '\')" />');
            $("#FuneralProduct_CoverPeriod_Result").html(currency + parseFloat(CurrentProduct.premium).toFixed(2));// + " " + term_unit
            $("#FuneralProduct_CoverPeriod1_Result").html(currency + parseFloat(CurrentProduct.premium).toFixed(2));// + " " + term_unit
            
            $("#FuneralProduct_Currency").val(currency);
            $("#FuneralProduct_Units").val(term_unit);
        }
        else {
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {

    });
}

function LoadLifeInsuranceProduct(id) {
    $$.post(services + "/insurapp/get_product/" + id, JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);
    

        if(result.success) {
            
            CurrentProduct = result.data.product;
            
            $("#FuneralProduct_Name").html(CurrentProduct.name);
            $("#FuneralProduct_Description").html(CurrentProduct.description);
            
            if(CurrentProduct.description == '') {
                $("#FuneralProduct_Description").hide();
            }
            
            var settings = CurrentProduct.settings;
            
            var term_min = 0;
            var term_max = 0;
            var term_unit = "";
            var currency = "";
            
            for(var i = 0; i < settings.length; i++) {
                if(settings[i].name == 'term_min') {
                    term_min = settings[i].value;
                }
                if(settings[i].name == 'term_max') {
                    term_max = settings[i].value;
                } 
                if(settings[i].name == 'loan_min') {
                    loan_min = settings[i].value;
                }
                if(settings[i].name == 'loan_max') {
                    loan_max = settings[i].value;
                }
                if(settings[i].name == 'term_unit') {
                    term_unit = settings[i].value;
                }
                if(settings[i].name == 'currency') {
                    currency = settings[i].value;
                }
            }
            if(loan_min==1 || loan_min<1){
                loan_min = 1250;
            }
            console.log("loan_min: "+loan_min);
            //<input type="number" class="text-center text-pink" />
            //$("#FuneralProduct_Slider").html('<input type="number" class="text-center text-pink" id="FuneralProduct_CoverPeriod" unit="' + term_unit + '" currency="' + currency + '" premium="' + CurrentProduct.premium + '" min="' + term_min + '" max="' + term_max + '" value="' + term_min + '" step="1" />');
            $("#FuneralProduct_Slider1").html('<input type="number" class="text-center text-pink" id="FuneralProduct_LoanAmount" unit="" currency="' + currency + '" premium="' + CurrentProduct.premium + '" min="' + loan_min + '" max="' + loan_max + '" value="' + loan_min + '" step="'+loan_min+'" readonly/>');
            $("#FuneralProduct_Slider").html('<input type="number" class="text-center text-pink" id="FuneralProduct_CoverPeriod" unit="" currency="' + currency + '" premium="' + CurrentProduct.premium + '" min="' + term_min + '" max="' + term_max + '" value="' + term_min + '" step="1" readonly/>');
            //$("#FuneralProduct_Slider").html('<input type="range" id="FuneralProduct_CoverPeriod" min="' + term_min + '" max="' + term_max + '" value="' + term_min + '" step="1" oninput="ShowFuneralProductValue(this.value, \'' + term_unit + '\')" onchange="ShowFuneralProductValue(this.value, \'' + term_unit + '\')" />');
            $("#FuneralProduct_CoverPeriod_Result").html(currency + parseFloat(CurrentProduct.premium).toFixed(2));// + " " + term_unit
            $("#FuneralProduct_CoverPeriod1_Result").html(currency + parseFloat(CurrentProduct.premium).toFixed(2));// + " " + term_unit
            
            $("#FuneralProduct_Currency").val(currency);
            $("#FuneralProduct_Units").val(term_unit);
        }
        else {
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {

    });
}

function calculatePolicy(loan_amount, loan_term, id_number, id, amount_des = '', type="") {
    var valid = true;
    if (loan_amount < 1250) {
        valid = false;
        ShowNotification(amount_des+' is required');
    } else if (loan_term < 1) {
        valid = false;
        ShowNotification('Term is required.');
    } else if (!ValidateIDNumber(id_number)) {
        valid = false;
        ShowNotification('Please supply a valid ID number');
    } else if (id_number.length > 13) {
        valid = false;
        ShowNotification('Please supply a valid ID number');
    }
  
    if (valid) {
        if (typeof loan_amount == 'undefined' || typeof loan_term == 'unedfined') {
            return;
        }
        var tempDate = new Date(id_number.substring(0, 2), id_number.substring(2, 4) - 1, id_number.substring(4, 6));
        var id_year = tempDate.getFullYear();
        var dob_year = id_number.substr(0, 2);
        var dob_month = id_number.substr(2, 2);
        var dob_day = id_number.substr(4, 2);

        var current_year = (new Date()).getFullYear();

        if (id_year <= (current_year - 98)) {
            dob_year = "20" + dob_year;
        } else {
            dob_year = "19" + dob_year;
        }

        console.log(dob_year + '-' + dob_month + '-' + dob_day);


        var dob = dob_year + '-' + dob_month + '-' + dob_day;
        $("#dateOfBirth").val(dob);

        console.log(loan_amount + ' / ' + loan_term + ' / ' + dob_year);

        User = JSON.parse(localStorage.getItem("User"));
        var values = {
            token: User.token,
            term: loan_term,
            amount: loan_amount,
            dob: dob
        };
        $$.post(services + "/insurapp/get_product_premium/" + id, JSON.stringify(values), function (response) {
            var result = JSON.parse(response);
            if (result.success) {
                if (result.data.premium > 0) {
                    
                    $("#FuneralProduct_CoverPeriod_Result").html("R" + Number(result.data.premium).toFixed(2));
                    $("#loan_premium").val(result.data.premium);
                    $("#proceed").show();
                    $("#applyBtn").hide();
                    $("#applyBtnCredit").hide();

                } else {

                    myApp.alert(result.message);
                    $("#applyBtn").hide();
                    $("#applyBtnCredit").hide();
                }
            } else {
                $("#applyBtn").hide();
                $("#applyBtnCredit").hide();
                myApp.alert(result.message);
            }

            console.log(result.data.premium);
        });
    }
}


function Increment(minusPlus, selector) {
    var val = parseInt("0" + $(selector).val());
    var min = $(selector).attr('min');
    var max = $(selector).attr('max');   
    var premium = $(selector).attr('premium');
    var currency = $(selector).attr('currency');
    var unit = $(selector).attr('unit');

    
    if(minusPlus == 'minus' && val > min) {
        $(selector).val(val-1);
    }
    if(minusPlus == 'plus' && val < max) {
        $(selector).val(val+1);
    }
    console.log(val+1)
    console.log(selector)
    //$(selector + "_Result").html("R" + (parseFloat($(selector).val()) * parseFloat(premium)).toFixed(2) + " " + unit);
}

function IncrementCredit(minusPlus, selector) {
    var val = parseInt("0" + $(selector).val());
    var min = $(selector).attr('min');
    var max = $(selector).attr('max');   
    var premium = $(selector).attr('premium');
    var currency = $(selector).attr('currency');
    var unit = $(selector).attr('unit');

    
    if(minusPlus == 'minus' && val > min) {
        $(selector).val(val-1250);
    }
    if(minusPlus == 'plus' && val < max) {
        $(selector).val(val+1250);
    }
    console.log(val+1)
    console.log(selector)
    //$(selector + "_Result").html("R" + (parseFloat($(selector).val()) * parseFloat(premium)).toFixed(2) + " " + unit);
}

function ShowFuneralProductValue(value, unit) {
    $("#FuneralProduct_Value").html(value + " " + unit);
}

function GetFuneralProductQuote() {
    $("#applyBtn").hide();
    var term = $("#FuneralProduct_CoverPeriod").val();
    var sa_id = $("#funeral_product_id_number").val();
    var valid = true;
    if (term < 1) {
        valid = false;
        ShowNotification('Term is required');
    } else if (!ValidateIDNumber(sa_id)) {
        valid = false;
        ShowNotification('Please supply a valid ID number');
    }
    else if (sa_id.length > 13) {
        valid = false;
        ShowNotification('Please supply a valid ID number');
    }
   
    if (valid) {
        CurrentPolicyTerm = term;

        //var dateOfBirth = moment($("#funeral_product_id_number").val().substr(0, 6), "YYMMDD");
        var id_number = $("#funeral_product_id_number").val();
        var tempDate = new Date(id_number.substring(0, 2), id_number.substring(2, 4) - 1, id_number.substring(4, 6));
        var id_year = tempDate.getFullYear();
        var dob_year = id_number.substr(0, 2);
        var dob_month = id_number.substr(2, 2);
        var dob_day = id_number.substr(4, 2);

        var current_year = (new Date()).getFullYear();

        if (id_year <= (current_year - 98)) {
            dob_year = "20" + dob_year;
        } else {
            dob_year = "19" + dob_year;
        }

        console.log(dob_year + '-' + dob_month + '-' + dob_day);


        var dateOfBirth = dob_year + '-' + dob_month + '-' + dob_day;
     

        var values = { token: User.token, term: term, dob: dateOfBirth };

        $$.post(services + "/insurapp/get_product_premium/" + CurrentProduct.id, JSON.stringify(values), function (response) {
            var result = JSON.parse(response);

            if (result.success && !result.error) {
                var term_unit = $("#FuneralProduct_Units").val();
                if (term < 2) {
                    term_unit = 'month';
                }
                $(".modal-overlay").show();
                myApp.confirm('Your premium will be R' + parseFloat(result.data.premium).toFixed(2) + ' for ' + term + ' ' + term_unit + '. Would you like to buy this?',
                    function() {
                        CurrentPolicyPremium = result.data.premium;
                        mainView.router.loadPage('funeral_product_confirm.html?premium=' + result.data.premium + '&idnumber=' + $("#funeral_product_id_number").val());
                    },
                    function () {

                    }
                  );

            }
            else {
                CheckReturnMessage(result.message);
            }
        },
            function (value) {

            });
    }
}

function GetLifeInsuranceProductQuote(amount) {
    console.log('amount :' + amount)
    var term = $("#FuneralProduct_CoverPeriod").val();
    CurrentPolicyTerm = term;
    CurrentPolicyLoanAmount = amount;

   // var dateOfBirth = moment($("#funeral_product_id_number").val().substr(0, 6), "YYMMDD");
    var dateOfBirth = $("#dateOfBirth").val();
    console.log(dateOfBirth);
    var values = {
        token: User.token,
        term: term,
        amount: amount,
        dob: dateOfBirth
    };

    $$.post(services + "/insurapp/get_product_premium/" + CurrentProduct.id, JSON.stringify(values), function (response) {
        var result = JSON.parse(response);

        if (result.success && !result.error) {
            $(".modal-overlay").show();
            myApp.confirm('Your premium will be R' + parseFloat(result.data.premium).toFixed(2) + ' for ' + term + ' ' + $("#FuneralProduct_Units").val() + '. Would you like to buy this?',
                function() {
                    CurrentPolicyPremium = result.data.premium;
                    mainView.router.loadPage('life_insurance_product_confirm.html?premium=' + result.data.premium + '&idnumber=' + $("#funeral_product_id_number").val());
                },
                function() {

                }
            );

        }
        else {
            CheckReturnMessage(result.message);
        }
    },
        function (value) {

        });
}


function GetCreditProductQuote(amount) {
    $("#applyBtn").hide();
    var term = $("#FuneralProduct_CoverPeriod").val();
    CurrentPolicyTerm = term;
    CurrentPolicyLoanAmount = amount;

    var dateOfBirth = moment($("#funeral_product_id_number").val().substr(0, 6), "YYMMDD");

    var values = {
        token: User.token,
        term: term,
        amount: amount,
        dob: dateOfBirth.format('YYYY-MM-DD')
    };

    $$.post(services + "/insurapp/get_product_premium/" + CurrentProduct.id, JSON.stringify(values), function (response) {
        var result = JSON.parse(response);

        if (result.success && !result.error) {
            $(".modal-overlay").show();
            myApp.confirm('Your premium will be R' + parseFloat(result.data.premium).toFixed(2) + ' for ' + term + ' ' + $("#FuneralProduct_Units").val() + '. Would you like to buy this?',
                function() {
                    CurrentPolicyPremium = result.data.premium;
                    mainView.router.loadPage('life_insurance_product_confirm.html?premium=' + result.data.premium + '&idnumber=' + $("#funeral_product_id_number").val());
                },
                function() {

                }
             );

        }
        else {
            CheckReturnMessage(result.message);
        }
    },
        function (value) {

        });
}
function GetCreditInsuranceProductQuote(amount) {
    $("#applyBtn").hide();
    var term = $("#FuneralProduct_CoverPeriod").val();
    
    CurrentPolicyTerm = term;
    
    var dateOfBirth = moment($("#funeral_product_id_number").val().substr(0, 6), "YYMMDD");
    
    var values = {
        token: User.token, 
        term: term, 
        amount: amount, 
        dob: dateOfBirth.format('YYYY-MM-DD')
    };
    
    $$.post(services + "/insurapp/get_product_premium/" + CurrentProduct.id, JSON.stringify(values), function(response) {
        var result = JSON.parse(response);
    
        if(result.success && !result.error) {
            $(".modal-overlay").show();
            myApp.modal({
                title: 'insurapp',
                text: 'Your premium will be R' + parseFloat(result.data.premium).toFixed(2) + ' for ' + term + ' ' + $("#FuneralProduct_Units").val() + '. Would you like to buy this?',
                buttons: [
                {
                    text: 'Yes',
                    onClick: function() {
                        CurrentPolicyPremium = result.data.premium;
                        mainView.router.loadPage('credit_life_product_confirm.html?premium=' + result.data.premium + '&idnumber=' + $("#funeral_product_id_number").val());
                    }
                },
                {
                    text: 'No',
                    onClick: function() {
                    }
                }]
            });
            
        }
        else {
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {

    });
}

/*function customerSearch(premium, type="picture") {
    var currPageName = mainView.activePage.name;
    $("#FuneralProductConfirm_Name").html(CurrentProduct.name);
    $("#FuneralProductConfirm_Back").attr('href', 'funeral_product.html?id=' + CurrentProduct.id);

    $("#FuneralCoverStep1Form [name='product_id']").val(CurrentProduct.id);
    $("#FuneralCoverStep1Form [name='premium']").val(premium);
    $("#FuneralCoverStep1Form [name='loan_term']").val(CurrentPolicyTerm);

    var values = { token: User.token, customer_idcell: idnumber };

    $$.post(services + "/insurapp/customer_search/" + CurrentProduct.id, JSON.stringify(values), function (response) {
        var result = JSON.parse(response);
        if (result.success) {
            if (type == 'picture') {
                document.getElementById("FuneralProductPhoto_PhotoDisplay").src = photoUrl + result.data.customer[0].picture
            } else if (type == 'signature') {
                document.getElementById("FuneralProductPhoto_PhotoDisplay").src = photoUrl + result.data.customer[0].picture
            }
            
        }
    });

}*/

function LoadFuneralProductConfirmation(premium, idnumber) {
    var currPageName = mainView.activePage.name;
    $("#FuneralProductConfirm_Name").html(CurrentProduct.name);
    $("#FuneralProductConfirm_Back").attr('href', 'funeral_product.html?id=' + CurrentProduct.id);
    
    $("#FuneralCoverStep1Form [name='product_id']").val(CurrentProduct.id);
    $("#FuneralCoverStep1Form [name='premium']").val(premium);
    $("#FuneralCoverStep1Form [name='loan_term']").val(CurrentPolicyTerm);
    
    var values = { token: User.token, product_id: CurrentProduct.id, customer_idcell: idnumber};
    
    $$.post(services + "/insurapp/customer_search/" + CurrentProduct.id, JSON.stringify(values), function(response) {
        var result = JSON.parse(response);
    
        if(result.success) {
            $("#FuneralCoverStep1Form [name='first_name']").val(result.data.customer[0].first_name);
            $("#FuneralCoverStep1Form [name='last_name']").val(result.data.customer[0].last_name);
            $("#FuneralCoverStep1Form [name='sa_id']").val(result.data.customer[0].sa_id);
            $("#FuneralCoverStep1Form [name='dob']").val(result.data.customer[0].dob);
            $("#FuneralCoverStep1Form [name='tel_cell']").val(result.data.customer[0].tel_cell);
            $("#FuneralCoverStep1Form [name='email_address']").val(result.data.customer[0].email_address);
            $("#FuneralCoverStep1Form [name='postal_code']").val(result.data.customer[0].postal_code);
            if (result.data.customer[0].beneficiary_sa_id !== '') {
                $("#FuneralCoverStep1Form [name='beneficiary_name']").val(result.data.customer[0].beneficiary_name);
            }
            
            $("#FuneralCoverStep1Form [name='beneficiary_sa_id']").val(result.data.customer[0].beneficiary_sa_id);
            $("#FuneralCoverStep1Form [name='beneficiary_sa_id']").val(result.data.customer[0].beneficiary_sa_id);

            localStorage.setItem("signature", result.data.customer[0].signature);
            localStorage.setItem("picture", result.data.customer[0].picture);
            if (CurrentPicture == '' || CurrentPicture == null) {
                CurrentPicture = result.data.customer[0].picture;
            }
            if (CurrentSignature == '' || CurrentPicture == null) {
                CurrentSignature = result.data.customer[0].signature;
            }
            console.log("CurrentSignature :" + CurrentSignature);
            console.log("CurrentPicture :" + CurrentPicture);
            CurrentPolicyWordingId = result.data.customer[0].policy_wording_id;
            
        }
        else {
            myApp.alert(result.message, function () {
                ClearLogin();
            });
        }   
    },
        function (value) {
            ClearLogin();
    });
}

function LoadCreditProductConfirmation(premium, idnumber) {
    $("#FuneralProductConfirm_Name").html(CurrentProduct.name);
    $("#FuneralProductConfirm_Back").attr('href', 'credit_life_product.html?id=' + CurrentProduct.id);
    
    $("#FuneralCoverStep1Form [name='product_id']").val(CurrentProduct.id);
    $("#FuneralCoverStep1Form [name='premium']").val(premium);
    $("#FuneralCoverStep1Form [name='loan_term']").val(CurrentPolicyTerm);
    
    var values = {token: User.token, customer_idcell: idnumber};
    
    $$.post(services + "/insurapp/customer_search/" + CurrentProduct.id, JSON.stringify(values), function(response) {
        var result = JSON.parse(response);
    
        if(result.success) {
            $("#FuneralCoverStep1Form [name='first_name']").val(result.data.customer[0].first_name);
            $("#FuneralCoverStep1Form [name='last_name']").val(result.data.customer[0].last_name);
            $("#FuneralCoverStep1Form [name='sa_id']").val(result.data.customer[0].sa_id);
            $("#FuneralCoverStep1Form [name='dob']").val(result.data.customer[0].dob);
            $("#FuneralCoverStep1Form [name='tel_cell']").val(result.data.customer[0].tel_cell);
            $("#FuneralCoverStep1Form [name='email_address']").val(result.data.customer[0].email_address);
            $("#FuneralCoverStep1Form [name='postal_code']").val(result.data.customer[0].postal_code);
            if (result.data.customer[0].beneficiary_sa_id !== '') {
                $("#FuneralCoverStep1Form [name='beneficiary_name']").val(result.data.customer[0].beneficiary_name);
            }
            
            $("#FuneralCoverStep1Form [name='beneficiary_sa_id']").val(result.data.customer[0].beneficiary_sa_id);

            localStorage.setItem("signature", result.data.customer[0].signature);
            localStorage.setItem("picture", result.data.customer[0].picture);
            if (result.data.customer[0].picture !== null) {
                CurrentPicture = result.data.customer[0].picture;
            }
            if (result.data.customer[0].signature !== null) {
                CurrentSignature = result.data.customer[0].signature;
            }
            CurrentPolicyWordingId = result.data.customer[0].policy_wording_id;

            console.log(result.data.customer[0].picture)
        }
        else {
            myApp.alert(result.message, function () {
                ClearLogin();
            });
        }   
    },
        function (value) {
            ClearLogin();
    });
}

function FuneralProductStep1Save() {
    var formData = myApp.formToData('#FuneralCoverStep1Form');
    var valid = true;
   
    if (formData.first_name == '') {
        valid = false;
        myApp.alert('Please enter the first name', function () {
            document.getElementById("first_name").focus();
        });

    }
    else if (formData.last_name == '') {
        valid = false;
        myApp.alert('Please enter the last name', function () {
            document.getElementById("last_name").focus();
        });

    }
    else if (formData.tel_cell == '' || formData.tel_cell.length < 10 || formData.tel_cell.length > 10) {
        valid = false;
        myApp.alert('Please enter the customer cellphone number, 10 digits required.', function () {
            document.getElementById("tel_cell").focus();
        });

    }
    else if (formData.postal_code == '') {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });

    }
    else if (formData.postal_code.length > 4) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });

    }
    else if (formData.postal_code.length < 4) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });

    }
    else if (formData.postal_code == 0000) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });
    }
    else if (formData.postal_code == 9999) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });
    }
  
    else if (formData.beneficiary_name == '') {
        valid = false;
        myApp.alert('Please enter the beneficiary name', function () {
            document.getElementById("beneficiary_name").focus();
        });

    }
    else if (formData.beneficiary_sa_id == '') {
        valid = false;
        myApp.alert('Please enter the beneficiaries cellphone number', function () {
            document.getElementById("beneficiary_sa_id").focus();
        });

    }
    else if (formData.beneficiary_sa_id.length > 10 || formData.beneficiary_sa_id.length < 10) {
        valid = false;
        myApp.alert('Please enter the beneficiaries cellphone number', function () {
            document.getElementById("beneficiary_sa_id").focus();
        });

    }
    
   
    var dateOfBirth = moment($("#funeral_product_id_number").val().substr(0, 6), "YYMMDD");
    
    formData.dob = dateOfBirth.format("YYYY/MM/DD");

    PolicyApplicationObject = formData;
    var product_data = {
        loan_term: CurrentPolicyTerm,
        loan_amount: CurrentPolicyLoanAmount
    };
    PolicyApplicationObject.token = User.token;
    PolicyApplicationObject.product_data = product_data;

    console.log("PolicyApplicationObject :" + JSON.stringify(PolicyApplicationObject));
    if (valid) {
        var values = { identifier: formData.sa_id, token: User.token }; 
        if (Renew_Policy){
            console.log("Renew Policy :" + Renew_Policy);
            console.log(JSON.stringify(CurrentProduct))
            
            if (parseInt(CurrentProduct.dependants) > 0) {
                mainView.router.loadPage('funeral_product_dependants.html');
            }
            else {
                mainView.router.loadPage('funeral_product_terms.html');
            }    
        } else {
            $$.post(services + "/insurapp/get_policy_number/" + CurrentProduct.id, JSON.stringify(values), function (response) {
                var result = JSON.parse(response);

                if (result.success) {
                    
                    formData.token = User.token;
                    CurrentPolicyNumber = result.data.policy_number;
                    if (CurrentPicture == null) {
                        CurrentPicture = result.data.application_data.picture;
                    }
                    if (CurrentSignature == null){
                        CurrentSignature = result.data.application_data.signature;
                    }
                    
                    window.setTimeout(function () {
                        if (parseInt(CurrentProduct.dependants) > 0) {
                            mainView.router.loadPage('funeral_product_dependants.html');
                        }
                        else {
                            mainView.router.loadPage('funeral_product_terms.html');
                        }
                    }, 800);
                }
                else {
                    myApp.alert(result.message, function () {
                        ClearLogin();
                    });
                }
            },
            function (value) {
                ClearLogin();
            });

        }
       
    }
}

function updateApplication() {
    PolicyApplicationObject = submitValues;

    var product_data = {
        loan_term: CurrentPolicyTerm
    };

    PolicyApplicationObject.product_data = product_data;

    $$.post(services + "/insurapp/update_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function (response1) {
        var result1 = JSON.parse(response1);
        ResetPreloader();

        if (result1.success) {
            if (parseInt(CurrentProduct.dependants) > 0) {
                mainView.router.loadPage('funeral_product_dependants.html');
            }
            else {
                mainView.router.loadPage('funeral_product_terms.html');
            }
        }
        else {
            ShowNotification(result1.message);
        }
    },
    function (value1) {

    }); 
}

function CreditProductStep1Save() {
    var formData = myApp.formToData('#FuneralCoverStep1Form');
    var valid = true;
    
    if (formData.first_name == '') {
        valid = false;
        myApp.alert('Please enter the first name', function () {
            document.getElementById("first_name").focus();
        });

    }
    else if (formData.last_name == '') {
        valid = false;
        myApp.alert('Please enter the last name', function () {
            document.getElementById("last_name").focus();
        });

    }
    else if (formData.tel_cell == '' || formData.tel_cell.length < 10 || formData.tel_cell.length > 10) {
        valid = false;
        myApp.alert('Please enter the customer cellphone number, 10 digits required.', function () {
            document.getElementById("tel_cell").focus();
        });

    }
    else if (formData.postal_code == '') {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });

    }
    else if (formData.postal_code.length > 4) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });

    }
    else if (formData.postal_code.length < 4) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });

    }
    else if (formData.postal_code == 0000) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });
    }
    else if (formData.postal_code == 9999) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });
    }

    else if (formData.beneficiary_name == '') {
        valid = false;
        myApp.alert('Please enter the beneficiary name', function () {
            document.getElementById("beneficiary_name").focus();
        });
        console.log("beneficiary_name : "+formData.beneficiary_name)
    }
    else if (formData.beneficiary_sa_id == '') {
        valid = false;
        myApp.alert('Please enter the beneficiaries cellphone number', function () {
            document.getElementById("beneficiary_sa_id").focus();
        });

    }
    else if (formData.beneficiary_sa_id.length > 10 || formData.beneficiary_sa_id.length < 10) {
        valid = false;
        myApp.alert('Please enter the beneficiaries cellphone number', function () {
            document.getElementById("beneficiary_sa_id").focus();
        });

    }

    
    var dateOfBirth = moment($("#funeral_product_id_number").val().substr(0, 6), "YYMMDD");
    
    formData.dob = dateOfBirth.format("YYYY/MM/DD");

    PolicyApplicationObject.first_name = formData.first_name;
    PolicyApplicationObject.last_name = formData.last_name;
    PolicyApplicationObject.tel_cell = formData.tel_cell;
    PolicyApplicationObject.postal_code = formData.postal_code;
    PolicyApplicationObject.beneficiary_name = formData.beneficiary_name;
    PolicyApplicationObject.beneficiary_sa_id = formData.beneficiary_sa_id;
    PolicyApplicationObject.dob = formData.dob;
    PolicyApplicationObject.token = User.token;

    console.log("PolicyApplicationObject :" + JSON.stringify(PolicyApplicationObject));
    
    if(valid) {
        var values = {identifier: formData.sa_id, token: User.token};    
    
        $$.post(services + "/insurapp/get_policy_number/" + CurrentProduct.id, JSON.stringify(values), function(response) {
            var result = JSON.parse(response);

            if(result.success) { 

                preloaderText = "Updating policy...";

                formData.token = User.token;
                var submitValues = formData;

                CurrentPolicyNumber = result.data.policy_number;

                window.setTimeout(function() {
                    PolicyApplicationObject = submitValues;
                    
                    var product_data = {
                        loan_term: CurrentPolicyTerm,
                        loan_amount: CurrentPolicyLoanAmount
                    };
                    
                    PolicyApplicationObject.product_data = product_data;
                    
                    $$.post(services + "/insurapp/update_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
                        var result1 = JSON.parse(response1);
                        ResetPreloader();

                        if(result1.success) {
                            if(parseInt(CurrentProduct.dependants) > 0) {
                                mainView.router.loadPage('credit_life_product_dependants.html');
                            }
                            else {
                                mainView.router.loadPage('credit_life_product_terms.html');
                            }
                        }
                        else {
                            ShowNotification(result1.message);
                        }   
                    },
                    function (value1) {

                    });                
                }, 800);
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
            function (value) {
                ClearLogin();
        });
    }
}

function isValidPostalCode(postalCode) {
  
    return (/(^\d{5}$)|(^\d{5}-\d{4}$)/).test(value);
}

function LifeInsuranceProductStep1Save() {
    var formData = myApp.formToData('#FuneralCoverStep1Form');
    var valid = true;
   
    if (formData.first_name == '') {
        valid = false;
        myApp.alert('Please enter the first name', function () {
            document.getElementById("first_name").focus();
        });
        
    }
    else if (formData.last_name == '') {
        valid = false;
        myApp.alert('Please enter the last name', function () {
            document.getElementById("last_name").focus();
        });
        
    }
    else if (formData.tel_cell == '' || formData.tel_cell.length < 10 || formData.tel_cell.length > 10) {
        valid = false;
        myApp.alert('Please enter the customer cellphone number, 10 digits required.', function () {
            document.getElementById("tel_cell").focus();
        });
        
    }
    else if(formData.postal_code == '' ) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });
        
    }
    else if (formData.postal_code.length > 4) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });
        
    }
    else if (formData.postal_code.length < 4) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });
        
    }
    else if (formData.postal_code == 0000) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });
    }
    else if (formData.postal_code == 9999) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code").focus();
        });
    }
    else if (formData.beneficiary_name == '') {
        valid = false;
        myApp.alert('Please enter the beneficiary name', function () {
            document.getElementById("beneficiary_name").focus();
        });
       
    }
    else if ($("#beneficiary_name").val() == '') {
        valid = false;
        myApp.alert('Please enter the beneficiary name', function () {
            document.getElementById("beneficiary_name").focus();
        });
        console.log("beneficiary_name val works!!!")
    }
    else if(formData.beneficiary_sa_id == '') {
        valid = false;
        myApp.alert('Please enter the beneficiaries cellphone number', function () {
            document.getElementById("beneficiary_sa_id").focus();
        });
        
    }
    else if (formData.beneficiary_sa_id.length > 10 || formData.beneficiary_sa_id.length < 10 ) {
        valid = false;
        myApp.alert('Please enter the beneficiaries cellphone number', function () {
            document.getElementById("beneficiary_sa_id").focus();
        });
    }
   
    var dateOfBirth = moment($("#funeral_product_id_number").val().substr(0, 6), "YYMMDD");
    
    formData.dob = dateOfBirth.format("YYYY/MM/DD");
    
    if(valid) {
        var values = {identifier: formData.sa_id, token: User.token};    
    
        $$.post(services + "/insurapp/get_policy_number/" + CurrentProduct.id, JSON.stringify(values), function(response) {
            var result = JSON.parse(response);

            if(result.success) { 

                preloaderText = "Updating policy...";

                formData.token = User.token;
                var submitValues = formData;

                CurrentPolicyNumber = result.data.policy_number;

                window.setTimeout(function() {
                    PolicyApplicationObject = submitValues;
                    
                    var product_data = {
                        loan_term: CurrentPolicyTerm
                    };
                    
                    PolicyApplicationObject.product_data = product_data;
                    
                    $$.post(services + "/insurapp/update_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
                        var result1 = JSON.parse(response1);
                        ResetPreloader();

                        if(result1.success) {
                            if(parseInt(CurrentProduct.dependants) > 0) {
                                mainView.router.loadPage('life_insurance_product_dependants.html');
                            }
                            else {
                                mainView.router.loadPage('life_insurance_product_terms.html');
                            }
                        }
                        else {
                            ShowNotification(result1.message);
                        }   
                    },
                    function (value1) {

                    });                
                }, 800);
            }
            else {
                myApp.alert(result.message, function () {
                    ClearLogin();
                });
            }   
        },
            function (value) {
                ClearLogin();
        });
    }
}

function LoadFuneralProductDependants() {
    $("#FuneralProductDependant_Name").html(CurrentProduct.name);
    $("#FuneralProductDependant_PolicyNumber").html(CurrentPolicyNumber);
    $("#FuneralProductDependant_Back").attr('href', 'funeral_product_confirm.html?premium=' + CurrentPolicyPremium);
    
    $("#FuneralProductDependant_Counter").html('0 / ' + CurrentProduct.dependants);
    
    var values = {token: User.token};
    
    window.setTimeout(function() {
        $$.post(services + "/insurapp/get_dependants/" + CurrentPolicyNumber, JSON.stringify(values), function(response) {
            var result = JSON.parse(response);

            if(result.success) {
                CurrentProductDependants = result.data.dependants;
                $("#FuneralProductDependant_Counter").html(CurrentProductDependants.length + ' / ' + CurrentProduct.dependants);

                //POPULATE LIST HERE
                var html = '';

                for(var i = 0; i < CurrentProductDependants.length; i++) {
                    html += '<li>';
                    html += '  <a href="javascript:DependantActionSheet('+ CurrentProductDependants[i].id +');" class="item-link item-content">';
                    html += '    <div class="item-inner">';
                    html += '      <div class="item-title">' + CurrentProductDependants[i].first_name + ' ' + CurrentProductDependants[i].last_name + '</div>';
                    html += '      <div class="item-after"><span class="badge bg-blue">' + CurrentProductDependants[i].type + '</span></div>';
                    html += '    </div>';
                    html += '  </a>';
                    html += '</li>';
                }

                if(parseInt(result.data.available_slots) > 0) {
                    html += '<li>';
                    html += '  <a href="javascript:AddNewDependantPopup();" class="item-link item-content">';
                    html += '    <div class="item-inner">';
                    html += '      <div class="item-title Montserrat-Bold text-blue">+ Add new Dependant</div>';
                    html += '    </div>';
                    html += '  </a>';
                    html += '</li>';
                }

                $("#FuneralProductDependants_Existing").html(html);
            }
            else {
                myApp.alert(result.message, function () {
                    ClearLogin();
                });
            }   
        },
            function (value) {
                ClearLogin();
        });
    }, 300);
    
    
}

function AddNewDependantPopup() {   
    
    var options = "";
    
    for(var i = 0; i < DependantTypes.length; i++) {
        options += '<option value="' + DependantTypes[i].toLocaleLowerCase() + '">' + DependantTypes[i] + '</option>';
    }        
    
    var popupHTML = '<div class="popup">'+
                        '<div class="text-black">'+
                          '<h2 class="text-center">Add new Dependant</h2>'+
                          '<p class="text-center">' + CurrentPolicyNumber + '</p>'+
                          
                          '<form id="AddDependantForm">' +
                          ' <div class="list-block">' +
                          ' <ul>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">First name</div>' +
                          '           <div class="item-input">' +
                          '              <input style="border:solid thin #ddd" type="text" placeholder="" name="first_name">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Last name</div>' +
                          '           <div class="item-input">' +
                          '              <input style="border:solid thin #ddd"  type="text" placeholder="" name="last_name">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Date of Birth</div>' +
                          '           <div class="item-input">' +
                          '              <input style="border:solid thin #ddd"  type="text" placeholder="" name="dob"  readonly>' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Relationship</div>' +
                          '           <div class="item-input">' +
                          '              <select style="border:solid thin #ddd;" name="type">' + options + '</select>' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          ' </ul>' +
                          ' </div>' +
                          '</form>' +
                            '<div class="content-block">' + 
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100"><a href="javascript:SaveDependant();" class="button button-big button-fill bg-pink uppercase">Save &amp; Close</a></div>'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup text-red text-1x uppercase">Close</a></div>'+
                          '</div>'+        
                            '</div>' + 
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
    
    
    var currYear = moment().year();
    
    var DayNumbers = [];
    var YearNumbers = [];
    
    for(var i = 1; i <= 31; i++) {
        DayNumbers.push(i);
    }
    for(var i = currYear; i >= (currYear - 74); i--) {
        YearNumbers.push(i);
    }

    var pickerDates = myApp.picker({
        input: '#AddDependantForm [name="dob"]',
        rotateEffect: true,
        cols: [
            {
                textAlign: 'left',
                values: DayNumbers
            },
            {
                values: ('January February March April May June July August September October November December').split(' ')
            },
            {
                textAlign: 'left',
                values: YearNumbers
            }
        ],
        formatValue: function (p, values, displayValues) {
            return values[0] + ' ' + values[1] + ' ' + values[2];
        },
    });      
}

function DependantActionSheet(id) {
    var buttons = [
        {
            text: 'Remove Dependant',
            onClick: function () {
                
                var vals = {token: User.token, dependant_id: id};
                
                $$.post(services + "/insurapp/remove_dependant/" + CurrentPolicyNumber, JSON.stringify(vals), function(response) {
                    var result = JSON.parse(response);

                    if(result.success && !result.error) { 
                        window.setTimeout(function() {
                            LoadFuneralProductDependants();
                        }, 300);
                    }
                    else {
                        CheckReturnMessage(result.message);
                    }   
                },
                function (value) {

                });
            }
        },
        {
            text: 'Cancel',
            color: 'red'
        },
    ];
    myApp.actions(buttons);
}

function SaveDependant() {
    var formData = myApp.formToData('#AddDependantForm');
    var valid = true;
    
    if(formData.first_name == '') {
        valid = false;
        ShowNotification('Please enter a first name');
    }
    else if(formData.last_name == '') {
        valid = false;
        ShowNotification('Please enter a last name');
    }
    else if(formData.dob == '') {
        valid = false;
        ShowNotification('Please enter a date of birth');
    }
    else if(formData.type == '') {
        valid = false;
        ShowNotification('Please select a type of dependant');
    }
    
    if(valid) {
        formData.token = User.token;
    
        $$.post(services + "/insurapp/add_dependant/" + CurrentPolicyNumber, JSON.stringify(formData), function(response) {
            var result = JSON.parse(response);

            if(result.success && !result.error) { 
                window.setTimeout(function() {
                    LoadFuneralProductDependants();
                    myApp.closeModal();
                }, 800);
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {

        });
    }
}

function LoadFuneralProductTerms() {
    $("#FuneralProductTerms_Name").html(CurrentProduct.name);
    $("#FuneralProductTerms_PolicyNumber").html(CurrentPolicyNumber);
    console.log("CurrentProduct :" + CurrentProduct.terms_audio);
    if (CurrentProduct.terms_audio != undefined) {
        var html = '';

        for (var i = 0; i < CurrentProduct.terms_audio.length; i++) {
            html += ' <li style="border-bottom:solid thin #ddd">\
                      <label class="label-radio item-content" onclick="SelectLanguage(\'' + audioLocation + CurrentProduct.terms_audio[i].file + '\', \'funeral\', \'' + CurrentProduct.terms_audio[i].language + '\')">\
                            <input type="radio" name="my-radio" value="">\
                            <div class="item-inner">\
                                <div class="item-title">\
                                ' + CurrentProduct.terms_audio[i].language +
                            '</div>\
                            </div>\
                      </label>\
                </li>';

            /* html += '<li>';
             html += '  <a href="javascript:StreamAudioFromUrl(\'' + audioLocation + CurrentProduct.terms_audio[i].file +'\', \'funeral\', \'' + CurrentProduct.terms_audio[i].language + '\');" class="item-link item-content">';
             html += '    <div class="item-inner">';
             html += '      <div class="item-title" style="margin: 0 auto;">' + CurrentProduct.terms_audio[i].language + '</div>';
             html += '    </div>';
             html += '  </a>';
             html += '</li>';*/
        }
        console.log("CurrentPolicyWordingId :" + CurrentPolicyWordingId);
        if (CurrentPolicyWordingId != null) {
            $("#policy_wording_id").val(CurrentPolicyWordingId);
        }
       
        $("#FuneralProductTerms_Buttons").html(html);
    } else {
        ClearLogin();
    }
    
}

function SelectLanguage(url, type, language) {
    console.log("language :" + language);
    PolicyApplicationObject.language = language;
    $(".play_selected").html('<span class="fa fa-play-circle fa-4x" style="color:#'+ User.app_design.colour1+'" onclick= "StreamAudioFromUrl(\'' + url + '\', \'' + type+'\', \'' + language + '\');"></span>')
}
function PauseAudio(url, type, language) {
    //myApp.showPreloader("Playing audio...");
    var my_media = new Media(url,
        // success callback
        function () {
            myApp.hidePreloader();
            console.log("StreamAudioFromUrl():Audio Success");
        },
        // error callback
        function (err) {
            myApp.hidePreloader();
            console.log("StreamAudioFromUrl():Error " + err);
            ShowNotification(err);
        }
    );

    // Play audio
    my_media.pause();
}
function StreamAudioFromUrl(url, type, language) {
    $(".play_selected").html('<span class="fa fa-pause-circle fa-4x" style="color:#' + User.app_design.colour1 + '" onclick= "PauseAudio(\'' + url + '\', \'' + type + '\', \'' + language + '\');"></span>')

    PolicyApplicationObject.language = language;
    $(".modal-overlay").show();
    myApp.showPreloader("Playing audio...");
    var my_media = new Media(url,
        // success callback
        function () {
            myApp.hidePreloader();
            $(".modal-overlay").hide();
            $(".play_selected").html('<span class="fa fa-play-circle fa-4x" style="color:#' + User.app_design.colour1 + '" onclick= "StreamAudioFromUrl(\'' + url + '\', \'' + type + '\', \'' + language + '\');"></span>')
            console.log("StreamAudioFromUrl():Audio Success");
        },
        // error callback
        function (err) {
            myApp.hidePreloader();
            $(".modal-overlay").hide();
            $(".play_selected").html('<span class="fa fa-play-circle fa-4x" style="color:#' + User.app_design.colour1 + '" onclick= "StreamAudioFromUrl(\'' + url + '\', \'' + type + '\', \'' + language + '\');"></span>')
            console.log("StreamAudioFromUrl():Error " + err);
            ShowNotification(err);
        }
    );
   
    // Play audio
    my_media.play();
}

function AcceptTermsFuneral() {
    var formData = myApp.formToData('#FuneralCoverStep3Form');
    var valid = true;
    
    
    
    if(PolicyApplicationObject.language == undefined) {
        valid = false;
        ShowNotification('Please chooose a language before continuing');
    }
    else if(formData.agreetoterms == "") {
        valid = false;
        ShowNotification('Please accept the terms and conditions to continue');
    }
   
    
    if(valid) {
        
        //preloaderText = "Updating policy...";
        CurrentPolicyWordingId = $("#policy_wording_id").val();

        values = {
            policy_number: CurrentPolicyNumber,
            policy_wording_id: $("#policy_wording_id").val(),
            token: User.token
        };

        $$.post(services + "/insurapp/policy_wording_validation/", JSON.stringify(values), function (resp) {
            var res = JSON.parse(resp);
            if (res.error) {
                myApp.alert(res.message);
             
            } else {
                CurrentPolicyWordingId = $("#policy_wording_id").val();
                mainView.router.loadPage('funeral_product_photo.html');
               /* PolicyApplicationObject.policy_wording_id = $("#policy_wording_id").val();
                PolicyApplicationObject.token = User.token;
                $$.post(services + "/insurapp/update_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function (response1) {
                    var result1 = JSON.parse(response1);
                    ResetPreloader();

                    if (result1.success) {
                        //mainView.router.loadPage('funeral_product_sign.html');
                        
                    }
                    else {
                        CheckReturnMessage(result1.message);
                    }
                },
                function (value1) {

                });*/
               
            }
            
        });
    }
}
function AcceptTermsLifeInsurance() {
    var formData = myApp.formToData('#LifeCoverStep3Form');
    var valid = true;
    var policy_wording_id = $("#policy_wording_id").val();
    CurrentPolicyWordingId = policy_wording_id;
    if (PolicyApplicationObject.language == undefined) {
        valid = false;
        ShowNotification('Please chooose a language before continuing');
    }
    else if (formData.agreetoterms == "") {
        valid = false;
        ShowNotification('Please accept the terms and conditions to continue');
    } else if (policy_wording_id == "") {
        valid = false;
        ShowNotification('Please enter the serial number on the policy wording being given to you');
    }
   

    if (valid) {

        preloaderText = "Updating policy...";

        values = {
            policy_number: CurrentPolicyNumber,
            policy_wording_id: policy_wording_id,
            token: User.token
        };

        $$.post(services + "/insurapp/policy_wording_validation/", JSON.stringify(values), function (resp) {
            var res = JSON.parse(resp);
            if (res.error == false) {
                var product_data = {
                    loan_term: CurrentPolicyTerm,
                    loan_amount: CurrentPolicyLoanAmount
                }
                PolicyApplicationObject.product_data = product_data
                console.log(JSON.stringify(PolicyApplicationObject.product_data));
                $$.post(services + "/insurapp/update_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function (response1) {
                    var result1 = JSON.parse(response1);
                    ResetPreloader();

                    if (result1.success) {
                        //mainView.router.loadPage('funeral_product_sign.html');
                        mainView.router.loadPage('funeral_product_photo.html');
                    }
                    else {
                        CheckReturnMessage(result1.message);
                    }
                },
                    function (value1) {

                    });
            } else {
                myApp.alert(res.message);
            }

        });
    }
   
}

function LoadFuneralPhotoScreen() {
    var picture = localStorage.getItem("picture");
    $("#FuneralProductPhoto_Name").html(CurrentProduct.name);
    $("#FuneralProductPhoto_PolicyNumber").html(CurrentPolicyNumber);
}

function TakePhoto(resultSelector) {
    var srcType = Camera.PictureSourceType.CAMERA;
    var options = SetCameraOptions(srcType);
    
    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        Base64ImgTmp = imageUri;
        $(resultSelector).attr('src', "data:image/jpeg;base64," + Base64ImgTmp);
        $(resultSelector).slideDown();
        if(resultSelector == "#FuneralProductPhoto_PhotoDisplay") {
            $("#FuneralProductPhoto_NextButton").show();
            $("#FuneralProductPhoto_NextButton2").hide();
        }
        if(resultSelector == "#TravelProductPhoto_PhotoDisplay") {
            $("#TravelProductPhoto_NextButton").show();
            $("#FuneralProductPhoto_NextButton2").hide();
        }
        if(resultSelector == "#CellphoneProductPhoto_PhotoDisplay") {
            $("#CellphoneProductPhoto_NextButton").show();
            $("#FuneralProductPhoto_NextButton2").hide();
        }
        if(resultSelector == "#ClaimPhoto_PhotoDisplay") {
            $("#ClaimPhoto_NextButton").show();
            $("#FuneralProductPhoto_NextButton2").hide();
        }
    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");
    //});
    }, options);
}

function SetCameraOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }; 
    return options;
}

function compress(quality, maxWidth, output_format) {

    var mime_type = "image/jpeg";
    if (typeof output_format !== "undefined" && output_format == "png") {
        mime_type = "image/png";
    }

    var img = document.getElementById('FuneralProductPhoto_PhotoDisplay');
    var canvas = document.createElement("canvas");

    maxWidth = maxWidth || 1000;
    var natW = img.naturalWidth;
    var natH = img.naturalHeight;
    var ratio = natH / natW;
    if (natW > maxWidth) {
        natW = maxWidth;
        natH = ratio * maxWidth;
    }
    
    canvas.width = natW;
    canvas.height = natH;

    var ctx = canvas.getContext("2d").drawImage(img, 0, 0, natW, natH);
    var newImageData = canvas.toDataURL(mime_type, quality / 100);
    var result_image_obj = new Image();
    result_image_obj.src = newImageData;
    console.log(img.src);
    return result_image_obj.src;
}

function compress(quality, maxWidth, output_format) {

    var mime_type = "image/jpeg";
    if (typeof output_format !== "undefined" && output_format == "png") {
        mime_type = "image/png";
    }

    var img = document.getElementById('FuneralProductPhoto_PhotoDisplay');
    var canvas = document.createElement("canvas");

    maxWidth = maxWidth || 1000;
    var natW = img.naturalWidth;
    var natH = img.naturalHeight;
    var ratio = natH / natW;
    if (natW > maxWidth) {
        natW = maxWidth;
        natH = ratio * maxWidth;
    }

    var cvs = document.createElement('canvas');
    cvs.width = natW;
    cvs.height = natH;

    var ctx = cvs.getContext("2d").drawImage(img, 0, 0, natW, natH);
    var newImageData = cvs.toDataURL(mime_type, quality / 100);
    var result_image_obj = new Image();
    result_image_obj.src = newImageData;
    console.log(img.src);
    return result_image_obj.src;
}

function UploadPhoto(type) {
    update_application();

    preloaderText = "Uploading, please wait...";

    
    if (type == "FuneralProductPhoto") {
        var dataURL = compress(65, 400, 'image/png');

        Base64ImgTmp = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

        //console.log(Base64ImgTmp);
        $$.post(services + "/insurapp/save_picture/" + CurrentPolicyNumber, JSON.stringify({ token: User.token, type: "picture", picture: Base64ImgTmp}), function(response) {
            var result = JSON.parse(response);
            
            ResetPreloader();
            myApp.hidePreloader();
            
            if(result.success) { 
                mainView.router.loadPage('funeral_product_sign.html');
            }
            else {
                myApp.alert(result.message);
            }   
        },
        function (value) {
        
        });
    }
    if(type == "FuneralProductSign") {
        
        var wrapper = document.getElementById("signature-pad");
        var canvas = wrapper.querySelector("canvas");  
        var jpegUrl = canvas.toDataURL("image/jpeg");
        
        Base64ImgTmp = jpegUrl.split(',')[1];
        
        $$.post(services + "/insurapp/save_picture/" + CurrentPolicyNumber, JSON.stringify({token: User.token, type: "signature", picture: Base64ImgTmp}), function(response) {
            var result = JSON.parse(response);

            ResetPreloader();
            myApp.hidePreloader();
            
            if(result.success) { 
                mainView.router.loadPage('funeral_product_pay.html');
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {
        
        });
    }
    if (type == "FuneralProductSign2") {
       
        var can = document.getElementById("canvasSignature2");
        var img = document.getElementById("FuneralProductSign_SignDisplay");
        var ctx = can.getContext("2d");
        ctx.drawImage(img, 10, 10);
        var jpegUrl = can.toDataURL()

        Base64ImgTmp = jpegUrl.split(',')[1];
        console.log(Base64ImgTmp);

        $$.post(services + "/insurapp/save_picture/" + CurrentPolicyNumber, JSON.stringify({ token: User.token, type: "signature", picture: Base64ImgTmp }), function (response) {
            var result = JSON.parse(response);

            ResetPreloader();
            myApp.hidePreloader();

            if (result.success) {
                mainView.router.loadPage('funeral_product_pay.html');
            }
            else {
                CheckReturnMessage(result.message);
            }
        },
            function (value) {

            });
    }
    if(type == "LifeInsuranceProductSign") {
        
        var wrapper = document.getElementById("signature-pad");
        var canvas = wrapper.querySelector("canvas");  
        var jpegUrl = canvas.toDataURL("image/jpeg");
        
        Base64ImgTmp = jpegUrl.split(',')[1];
        
        $$.post(services + "/insurapp/save_picture/" + CurrentPolicyNumber, JSON.stringify({token: User.token, type: "signature", picture: Base64ImgTmp}), function(response) {
            var result = JSON.parse(response);

            ResetPreloader();
            myApp.hidePreloader();
            
            if(result.success) { 
                mainView.router.loadPage('life_insurance_product_pay.html');
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {
        
        });
    }
    if(type == "TravelProductPhoto") {
        $$.post(services + "/insurapp/save_picture/" + CurrentPolicyNumber, JSON.stringify({token: User.token, type: "photo", picture: Base64ImgTmp}), function(response) {
            var result = JSON.parse(response);
            
            ResetPreloader();
            myApp.hidePreloader();
            
            if(result.success) { 
                mainView.router.loadPage('travel_product_sign.html');
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {
        
        });
    }
    if(type == "TravelProductSign") {
        var wrapper = document.getElementById("signature-pad");
        var canvas = wrapper.querySelector("canvas");  
        var jpegUrl = canvas.toDataURL("image/jpeg");
        
        Base64ImgTmp = jpegUrl.split(',')[1];
        
        $$.post(services + "/insurapp/save_picture/" + CurrentPolicyNumber, JSON.stringify({token: User.token, type: "signature", picture: Base64ImgTmp}), function(response) {
            var result = JSON.parse(response);

            ResetPreloader();
            myApp.hidePreloader();
            
            if(result.success) { 
                mainView.router.loadPage('travel_product_pay.html');
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {
        
        });
    }
    if(type == "CellphoneProductPhoto") {
        $$.post(services + "/insurapp/save_picture/" + CurrentPolicyNumber, JSON.stringify({token: User.token, type: "photo", picture: Base64ImgTmp}), function(response) {
            var result = JSON.parse(response);
            
            ResetPreloader();
            myApp.hidePreloader();
            
            if(result.success) { 
                mainView.router.loadPage('cellphone_product_sign.html');
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {
        
        });
    }
    if(type == "CellphoneProductSign") {
        var wrapper = document.getElementById("signature-pad");
        var canvas = wrapper.querySelector("canvas");  
        var jpegUrl = canvas.toDataURL("image/jpeg");
        
        Base64ImgTmp = jpegUrl.split(',')[1];
        
        $$.post(services + "/insurapp/save_picture/" + CurrentPolicyNumber, JSON.stringify({token: User.token, type: "signature", picture: Base64ImgTmp}), function(response) {
            var result = JSON.parse(response);

            ResetPreloader();
            myApp.hidePreloader();
            
            if(result.success) { 
                mainView.router.loadPage('cellphone_product_pay.html');
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {
        
        });
    }
    if(type == "ClaimPhoto") {
        
        //alert("Policy Number: " + CurrentPolicyNumber);
        //alert("Claim ID: " + CurrentClaimID);
        //alert("Photo Type: " + CurrentClaimPhotoType);
        
        $$.post(services + "/insurapp/save_picture/" + CurrentPolicyNumber, JSON.stringify({token: User.token, claim_id: CurrentClaimID, type: CurrentClaimPhotoType, picture: Base64ImgTmp}), function(response) {
            var result = JSON.parse(response);
            
            //alert(response);
            
            myApp.hidePreloader();
            ResetPreloader();
            
            if(result.success) { 
                CurrentClaimDocumentsRequired.splice(0, 1);
                LoadClaimPhotoScreen();
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {
            //myApp.hidePreloader();
            //ResetPreloader();
            
            //alert(value);
            //alert(JSON.stringify(value));
        });
    }
}

function LoadFuneralSignScreen() {
    $("#FuneralProductSign_Name").html(CurrentProduct.name);
    $("#FuneralProductSign_Name_1").html(CurrentProduct.name);
    $("#FuneralProductSign_PolicyNumber").html(CurrentPolicyNumber);
    $("#FuneralProductSign_PolicyNumber_1").html("Policy #: " + CurrentPolicyNumber);
    console.log(CurrentProduct.length)

    if (CurrentProduct.length>0) {
        var settings = CurrentProduct.settings;

        var currency = "";
        var term_unit = "";

        for (var i = 0; i < settings.length; i++) {
            if (settings[i].name == 'currency') {
                currency = settings[i].value;
            }
            if (settings[i].name == 'term_unit') {
                term_unit = settings[i].value;
            }
        }
        if (CurrentPolicyTerm == 1) {
            term_unit = 'month';
        }


        $("#FuneralProductSign_Period").html("Term: " + CurrentPolicyTerm + " " + term_unit);
        $("#FuneralProductSign_Premium").html("Premium: R" + CurrentPolicyPremium);

        window.setTimeout(function () {
            var wrapper = document.getElementById("signature-pad");
            var canvas = wrapper.querySelector("canvas");
            SigningCanvas = new SignaturePad(canvas, {
                backgroundColor: 'rgb(255, 255, 255)'
            });
        }, 800);
    } else {
        console.log("Go to landing page");
        mainView.router.loadPage('landing.html');
    }
   
    
}

function LoadLifeInsuranceSignScreen() {
    $("#LifeInsuranceProductSign_Name").html(CurrentProduct.name);
    $("#LifeInsuranceProductSign_Name_1").html(CurrentProduct.name);
    $("#LifeInsuranceProductSign_PolicyNumber").html(CurrentPolicyNumber);
    $("#LifeInsuranceProductSign_PolicyNumber_1").html("Policy #: " + CurrentPolicyNumber);
    
    var settings = CurrentProduct.settings;
            
    var currency = "";
    var term_unit = "";

    for(var i = 0; i < settings.length; i++) {
        if(settings[i].name == 'currency') {
            currency = settings[i].value;
        } 
        if(settings[i].name == 'term_unit') {
            term_unit = settings[i].value;
        }
    }
    
    
    $("#LifeInsuranceProductSign_Period").html("Term: " + CurrentPolicyTerm + " " + term_unit);
    $("#LifeInsuranceProductSign_Premium").html("Premium: R" + CurrentPolicyPremium);
    
    window.setTimeout(function() {
        var wrapper = document.getElementById("life-Insurance-signature-pad");
        var canvas = wrapper.querySelector("canvas");    
        SigningCanvas = new SignaturePad(canvas, {
            backgroundColor: 'rgb(255, 255, 255)'
        }); 
    }, 800);
}

function LoadMessages() {
    var html = '';
    
    var values = {push_token: User.user.pushtoken};
    
    $$.post(services + "/basic/get_messages", JSON.stringify(values), function(response) {

        var result = JSON.parse(response);

        if(result.success) {

            InboxMessages = result.data.messages;
            var html = '';
            
            for(var i = 0; i < InboxMessages.length; i++) {
                
        
                html += '<li>';
                html += '    <a href="javascript:ViewMessage(' + InboxMessages[i].id + ');" class="item-link item-content">';
                html += '        <div class="item-inner">';
                html += '            <div class="item-title-row">';
                html += '                 <div class="item-title">' + InboxMessages[i].title + '</div>';
                html += '            </div>';
                html += '        </div>';
                html += '    </a>';
                html += '</li>';
                     
            }
            
            $("#MessageList").html(html);
        }
        else {
            CheckReturnMessage(result.message);

        }
    });
}

function ViewMessage(id) {
    for(var i = 0; i < InboxMessages.length; i++) {    
        if(InboxMessages[i].id == id) {
            
            var popupHTML = '<div class="popup">'+
                                '<div class="content-block text-black">'+
                                  '<h2 class="text-center">' + InboxMessages[i].title + '</h2>'+
                                  '<p class="text-center"><strong>' + InboxMessages[i].createdate + '</strong></p>'+
                                  '<p>' + InboxMessages[i].copy + '</p>'+
                                  '<div class="row" style="margin-bottom:10px;">'+
                                    '<div class="col-100"><a href="#" class="close-popup button button-fill button-big bg-pink text-white">Close</a></div>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'
              myApp.popup(popupHTML);         
            
            
            break;
        }
    }
}

function ClearCanvas() {
    SigningCanvas.clear(); 
    // $('.signoptions').hide();
    // $('.signoptions2').hide();
    StartSign();
}

function LoadFuneralPayScreen() {
    
    
    $("#FuneralProductPay_Name").html(CurrentProduct.name);
    $("#FuneralProductPay_PolicyNumber").html(CurrentPolicyNumber);
    $("#FuneralProductPay_BackLink").attr('href', 'funeral_product_confirm.html?premium=' + PolicyApplicationObject.premium);
    
    var html = '';
    
    $$.post(services + "/insurapp/get_payment_options_new/" + PolicyApplicationObject.product_id, JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);

        if(result.success) {             
            
            Wallet = result.data.wallets;
            if(result.data != null){
                for(var i = 0; i < result.data.payment_options.length; i++) {
                    html += '<li style="border-bottom:solid thin #ddd; padding-bottom: 5px;" class="condensed-form">';
                    html += '  <a href="javascript:SelectPaymentMethod(\'' + result.data.payment_options[i].key + '\', \'funeral\');" class="item-link item-content">';
                    html += '    <div class="item-inner">';
                    html += '      <div class="item-title" style="margin: 0 auto;">' + result.data.payment_options[i].name + '</div>';
                    html += '    </div>';
                    html += '  </a>';
                    html += '</li>';
                }
                $("#FuneralProductPay_Existing").html(html);
            }else{
                myApp.alert(result.message)
            }
           
            
        }
        else {
            $(".modal-overlay").hide();
            myApp.hidePreloader();
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {
        myApp.alert("This user does not have permission to sell insurance.")
        $(".modal-overlay").hide();
        myApp.hidePreloader();
    });
    
}

function SelectPaymentMethod(method, section) {
    console.log("Wallet Balance :" + User.wallets.wallet_balance);
    //User.wallets.wallet_balance = 200;
    var valid = false;

    if (method == "pay_now") {
        mainView.router.loadPage('support_manage_cards.html');
    }
    
    if(method == "wallet") {
        if (User.wallets.wallet_balance >= PolicyApplicationObject.premium) {
            valid = true;
        }
        else {
            ShowNotification("You do not have enough credit in your wallet for this transaction.");
        }
    }
    if(method == "atm") {
        valid = true; 
    }
    if (method == "card_machine") {
        valid = true;
    }
    if (method == "card") {
        valid = true;  
    }
    if(method == "myinsurapp") {
        valid = true;  
    }
    if (method == "credit") {
        valid = true;
    }
    if (method == "customer_card") {
        valid = true;
    }

    if (method == "payat") {
        valid = true;
    }
    if (valid) {
        $(".modal-overlay").show();
        myApp.confirm('You have selected <strong>' + method + '</strong> as your payment method. Are you sure?',
           function() {
                        
                        if (method == "card") {
                            mainView.router.loadPage('support_manage_cards.html');
                           /* $$.ajax({
                                url: services + "/cards/cards",
                                method: 'GET',
                                cache: false,
                                dataType: 'json',
                                headers: {
                                    "Authorization": User.token
                                },
                                success: function(result) {
                                    if(result.success) {

                                        AvailableCards = result.data;

                                        CardSelectionActionSheet();
                                    }
                                    else { 
                                        CheckReturnMessage(result.message);
                                    }
                                },
                                error: function(error) {
                                    ShowNotification("There has been an error, please try again.");
                                }

                            });*/
                        }
                        if (method == "customer_card") {
                            checkCustomerCards('', true)
                            //mainView.router.loadPage('customer_manage_cards.html');
                        }
                        if(method == "wallet") {
                            MakeWalletPayment(CurrentPolicyPremium);
                        }
                        if(method == "credit") {
                            MakeCreditPayment(CurrentPolicyPremium);
                        }
                        if(method == "atm") {
                            //OpenATMDepositPayment(CurrentPolicyPremium); //CurrentPolicyPremium     
                            MakeAtmPayment(CurrentPolicyPremium, 'atm');
                        }
                        if (method == "card_machine") {
                            //OpenATMDepositPayment(CurrentPolicyPremium); //CurrentPolicyPremium     
                            MakeCardMachinePayment(CurrentPolicyPremium, 'card_machine');
                        }
                        if (method == "payat") {
                            MakePayatPayment(CurrentPolicyPremium,"payat"); //CurrentPolicyPremium                            
                        }
                        if(method == "myinsurapp") {
                            OpenMyInsurAppPayment(CurrentPolicyPremium); //CurrentPolicyPremium                            
                        }
            },
            function() {
                        
            }
         );
    }
}

function OpenCashout() {
    var popupHTML = '<div class="popup">'+
                        '<div class="text-black">'+
                          '<h2 class="text-center">Cashout</h2>'+
                          '<p class="text-center">You currently have R' + parseFloat(WalletBalance).toFixed(2) + ' in your wallet. How much would you like to cash out?</p>'+
                          
                          '<form id="CashoutForm">' +
                          ' <div class="list-block">' +
                          ' <ul>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Bank</div>' +
                          '           <div class="item-input">' +
                          '              <select name="bank_name"><option value="FNB">FNB</option><option value="Capitec">Capitec</option><option value="Standard Bank">Standard Bank</option><option value="ABSA">ABSA</option><option value="Investec">Investec</option><option value="Nedbank">Nedbank</option></select>' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Acc. Type</div>' +
                          '           <div class="item-input">' +
                          '              <select name="bank_account_type"><option value="Cheque">Cheque</option><option value="Savings">Savings</option></select>' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Branch</div>' +
                          '           <div class="item-input">' +
                          '              <input type="text" placeholder="" name="bank_branch" value="">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Acc. No.</div>' +
                          '           <div class="item-input">' +
                          '              <input type="number" placeholder="" name="bank_account_number" value="" step="1">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Amount</div>' +
                          '           <div class="item-input">' +
                          '              <input type="number" placeholder="" name="amount" value="0" step="0.01">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          ' </ul>' +
                          ' </div>' +
                          '</form>' +
                            '<div class="content-block">' + 
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100"><a href="javascript:DoCashout();" class="button button-big button-fill bg-pink uppercase">Cashout</a></div>'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup text-red text-1x uppercase">Close</a></div>'+
                          '</div>'+        
                            '</div>' + 
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML);   
}

function DoCashout() {
    var formData = myApp.formToData('#CashoutForm');
    var valid = true;
    
    
    if(formData.bank_name == '') {
        valid = false;
        ShowNotification('Please select a bank');
    }
    else if(formData.bank_account_type == '') {
        valid = false;
        ShowNotification('Please select your account type');
    }
    else if(formData.bank_branch == '') {
        valid = false;
        ShowNotification('Please provide your branch');
    }
    else if(formData.bank_account_number == '') {
        valid = false;
        ShowNotification('Please provide your account number');
    }
    else if(WalletBalance < parseFloat(formData.amount)) {
        valid = false;
        ShowNotification('You cannot draw more than you have in your wallet!');
    }
    
    if(valid) {
        
        formData.token = User.token;        
        
        $$.post(services + "/insurapp/cashout", JSON.stringify(formData), function(response) {
            var result = JSON.parse(response);
            
            if(result.success) {
                WalletBalance = result.data[0].info.balance;
                myApp.modal({
                    title:  'insurapp',
                    text: result.message,
                    buttons: [
                      {
                        text: 'Done',
                        onClick: function() {
                          myApp.closeModal();
                        }
                      }
                    ]
                  })
            }
            else {
                CheckReturnMessage(result.message);
            }
        });
    }
}

function Cashout() {
    $("#Cashout").hide();
    var formData = myApp.formToData('#CashoutForm');
    var valid = true;


    if (formData.amount == '') {
        valid = false;
        ShowNotification('Please provide the amount');
    }

    if (valid) {

        formData.token = User.token;

        $$.post(services + "/insurapp/cashout", JSON.stringify(formData), function (cashoutResponse) {
            console.log(cashoutResponse)
            var result = JSON.parse(cashoutResponse);
        
            if (result.success) {
                myApp.alert(result.message, function () {
                    WalletBalance = result.data[0].info.balance;
                    mainView.router.loadPage('landing.html');
                });
            }
            else {
                myApp.alert(result.message);
                $("#Cashout").show();
            }
            
        }, function (res) {
            console.log(res);
            var result = JSON.parse(res.response);
            myApp.alert(result.message);
            $("#Cashout").show();
        });
    }
}

function AddNewCard() {
    var popupHTML = '<div class="popup">'+
                        '<div class="text-black">'+
                          '<h2 class="text-center">Add new Card</h2>'+
                          '<p class="text-center">Please fill in all the details below:</p>'+
                          
                          '<form id="AddCardForm">' +
                          ' <div class="list-block">' +
                          ' <ul>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Name</div>' +
                          '           <div class="item-input">' +
                          '              <input type="text" style="border: solid thin #ddd;" placeholder="As it appears on the card" name="card_name">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Card #</div>' +
                          '           <div class="item-input">' +
                          '              <input style="border: solid thin #ddd;" type="number" placeholder="e.g. 1111111111111111" name="card_number">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Expiry</div>' +
                          '           <div class="item-input">' +
                          '              <input style="border: solid thin #ddd;" type="text" placeholder="xx-xxxx" name="expiry" readonly>' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">CVV</div>' +
                          '           <div class="item-input">' +
                          '              <input style="border: solid thin #ddd;" type="number" placeholder="e.g. 123" name="cvv">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          ' </ul>' +
                          ' </div>' +
                          '</form>' +
                            '<div class="content-block">' + 
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100"><a href="javascript:SaveCard();" class="button button-big button-fill bg-pink uppercase">Save &amp; Close</a></div>'+
        '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" style="background:red" class="close-popup button button-big button-fill bg-pink uppercase">Close</a></div>' +
                          '</div>'+        
                            '</div>' + 
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
    
    
    var currYear = moment().year();
    
    var MonthNumbers = [];
    var YearNumbers = [];
    
    for(var i = 1; i <= 12; i++) {
        MonthNumbers.push((i < 10 ? "0" + i : i));
    }
    for(var i = currYear; i <= (currYear + 10); i++) {
        YearNumbers.push(i);
    }

    var pickerDates = myApp.picker({
        input: '#AddCardForm [name="expiry"]',
        rotateEffect: true,
        cols: [
            {
                textAlign: 'left',
                values: MonthNumbers
            },
            {
                textAlign: 'right',
                values: YearNumbers
            }
        ],
        formatValue: function (p, values, displayValues) {
            
            return values[0] + '-' + values[1];
        },
    });      
}

function AddCustomerNewCard(currentCustomerID) {
    console.log("currentCustomerID :"+currentCustomerID);
    var popupHTML = '<div class="popup">'+
                        '<div class="text-black">'+
                          '<h2 class="text-center">Add new Card</h2>'+
                          '<p class="text-center">Please fill in all the details below:</p>'+
                          
                          '<form id="AddCardForm">' +
                          ' <div class="list-block">' +
                          ' <ul>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Name</div>' +
                          '           <div class="item-input">' +
                          '              <input type="text" style="border: solid thin #ddd;" placeholder="As it appears on the card" name="card_name">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Card #</div>' +
                          '           <div class="item-input">' +
                          '              <input type="number" style="border: solid thin #ddd;" placeholder="e.g. 1111111111111111" name="card_number">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Expiry</div>' +
                          '           <div class="item-input">' +
                          '              <input type="text" style="border: solid thin #ddd;" placeholder="xx-xxxx" name="expiry" readonly>' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">CVV</div>' +
                          '           <div class="item-input">' +
                          '              <input type="number" style="border: solid thin #ddd;" placeholder="e.g. 123" name="cvv">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          ' </ul>' +
                          ' </div>' +
                          '</form>' +
                            '<div class="content-block">' + 
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100"><a href="javascript:SaveCustomerCard('+currentCustomerID+');" class="button button-big button-fill bg-pink uppercase">Save &amp; Close</a></div>'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" style="background:red" class="close-popup button button-big button-fill bg-pink uppercase">Close</a></div>'+
                          '</div>'+        
                            '</div>' + 
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
    
    
    var currYear = moment().year();
    
    var MonthNumbers = [];
    var YearNumbers = [];
    
    for(var i = 1; i <= 12; i++) {
        MonthNumbers.push((i < 10 ? "0" + i : i));
    }
    for(var i = currYear; i <= (currYear + 10); i++) {
        YearNumbers.push(i);
    }

    var pickerDates = myApp.picker({
        input: '#AddCardForm [name="expiry"]',
        rotateEffect: true,
        cols: [
            {
                textAlign: 'left',
                values: MonthNumbers
            },
            {
                textAlign: 'right',
                values: YearNumbers
            }
        ],
        formatValue: function (p, values, displayValues) {
            
            return values[0] + '-' + values[1];
        },
    });      
}

function AddNewCard2() {
    var popupHTML = '<div class="popup">'+
                        '<div class="text-black">'+
                          '<h2 class="text-center">Add new Card</h2>'+
                          '<p class="text-center">Please fill in all the details below:</p>'+
                          
                          '<form id="AddCardForm">' +
                          ' <div class="list-block">' +
                          ' <ul>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Name</div>' +
                          '           <div class="item-input">' +
                          '              <input type="text" placeholder="As it appears on the card" name="card_name">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Card #</div>' +
                          '           <div class="item-input">' +
                          '              <input type="number" placeholder="e.g. 1111111111111111" name="card_number">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Expiry</div>' +
                          '           <div class="item-input">' +
                          '              <input type="text" placeholder="xx-xxxx" name="expiry" readonly>' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">CVV</div>' +
                          '           <div class="item-input">' +
                          '              <input type="number" placeholder="e.g. 123" name="cvv">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          ' </ul>' +
                          ' </div>' +
                          '</form>' +
                            '<div class="content-block">' + 
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100"><a href="javascript:SaveMyCard();" class="button button-big button-fill bg-pink uppercase">Save &amp; Close</a></div>'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup text-red text-1x uppercase">Close</a></div>'+
                          '</div>'+        
                            '</div>' + 
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
    
    
    var currYear = moment().year();
    
    var MonthNumbers = [];
    var YearNumbers = [];
    
    for(var i = 1; i <= 12; i++) {
        MonthNumbers.push((i < 10 ? "0" + i : i));
    }
    for(var i = currYear; i <= (currYear + 10); i++) {
        YearNumbers.push(i);
    }

    var pickerDates = myApp.picker({
        input: '#AddCardForm [name="expiry"]',
        rotateEffect: true,
        cols: [
            {
                textAlign: 'left',
                values: MonthNumbers
            },
            {
                textAlign: 'right',
                values: YearNumbers
            }
        ],
        formatValue: function (p, values, displayValues) {
            
            return values[0] + '-' + values[1];
        },
    });      
}

function SaveCustomerCard(customer_user_id, scanned = false) {
    $(".modal-overlay").show();

    var formData = myApp.formToData('#AddCardForm2');
    var valid = true;
    formData.card_number = formData.card_number.replace(/\s/g, '') 
    if(formData.card_name == "") {
        valid = false;
        ShowNotification('Please enter the name as it appears on the card');
    }
    else if(formData.card_number == "") {
        valid = false;
        ShowNotification('Please enter the card number');
    }
    else if(formData.expiry == "") {
        valid = false;
        ShowNotification('Please enter the expiry date');
    }
    else if(formData.cvv == "") {
        valid = false;
        ShowNotification('Please enter the CVV number on the back of the card');
    }
    
    var currPageName = mainView.activePage.name;
    
    if(valid) {
        
        var exp_month = formData.expiry.split('-')[0];
        var exp_year = formData.expiry.split('-')[1];
        
        formData.exp_month = exp_month;
        formData.exp_year = exp_year.substr(2, 2);
        
        delete formData.expiry;
        
        formData.token = User.token;
        formData.customer_user_id = customer_user_id;
        
        $$.post(services + "/customer_cards/card_3d", JSON.stringify(formData), function (response) {
            var result = JSON.parse(response);
            console.log(result.message);
            if (result.success) {

                myApp.closeModal();

                var params = result.data.UrlParams;

                var prid = params.PAY_REQUEST_ID.xval.replace(/"/g, '');
                var pgid = params.PAYGATE_ID.xval.replace(/"/g, '');
                var chk = params.CHECKSUM.xval.replace(/"/g, '');
                var url = result.data.RedirectUrl;
                
                myApp.modal({
                    title: 'insurapp',
                    text: 'To complete adding your card, we need to authenticate you using 3D secure. R2 will be deducted from your account and added to your wallet.',
                    buttons: [
                        {
                            text: 'Continue',
                            onClick: function () {

                                var target = "_blank";
                                var options = "location=yes";
                                //var inAppBrowserRef = cordova.InAppBrowser.open('post.htm?url=' + url + '&PAY_REQUEST_ID=' + prid + '&PAYGATE_ID=' + pgid + '&CHECKSUM=' + chk, target, options);
                                mainView.router.loadPage('post.html?url=' + url + '&PAY_REQUEST_ID=' + prid + '&PAYGATE_ID=' + pgid + '&CHECKSUM=' + chk);
                                ShowLoader = false;
                                var timeout = window.setInterval(function () {
                                    ShowLoader = false;
                                    $(".modal-overlay").hide();
                                    $$.post(services + "/cards/payment_ping", JSON.stringify({ PAY_REQUEST_ID: prid, token: User.token }), function (response) {
                                        var res = JSON.parse(response);

                                        if (res.success) {
                                            console.log(res.data.TransactionStatusCode);
                                            if (res.data.TransactionStatusCode == "1") {
                                                ShowLoader = true;
                                                //inAppBrowserRef.close();
                                                clearInterval(timeout);
                                                setTimeout(timeout);
                                                checkCustomerCards('success', customer_user_id)
                                              
                                            }
                                            else if (res.data.TransactionStatusCode == "2") {
                                                ShowLoader = true;
                                                //inAppBrowserRef.close();
                                                clearInterval(timeout);
                                                setTimeout(timeout);
                                                checkCustomerCards('declined', customer_user_id)
                                               
                                            }
                                        }

                                        myApp.hideIndicator();
                                    });
                                }, 3000);
                                setTimeout(function(){ 
                                    clearInterval(timeout);
                                }, 30000);

                                // inAppBrowserRef.addEventListener('exit', function (params) {
                                //     clearInterval(timeout);
                                // });
                            }
                        },
                        {
                            text: 'Cancel'
                        }
                    ]
                });
                var timeout = window.setInterval(function () {
                    $(".modal-overlay").show();
                }, 300);
            }
            else {
                myApp.hidePreloader();
                myApp.alert(result.message);
            }
        }, function (res) {
            console.log(res);
            myApp.hidePreloader();
            var result = JSON.parse(res.response);
            myApp.alert(result.message);
        });
    }
}

function SaveCard() {
    
    var formData = myApp.formToData('#AddCardForm');
    var valid = true;
    
    if(formData.card_name == "") {
        valid = false;
        ShowNotification('Please enter the name as it appears on the card');
    }
    else if(formData.card_number == "") {
        valid = false;
        ShowNotification('Please enter the card number');
    }
    else if(formData.expiry == "") {
        valid = false;
        ShowNotification('Please enter the expiry date');
    }
    else if(formData.cvv == "") {
        valid = false;
        ShowNotification('Please enter the CVV number on the back of the card');
    }
    
    var currPageName = mainView.activePage.name;
    
    if(valid) {
        
        var exp_month = formData.expiry.split('-')[0];
        var exp_year = formData.expiry.split('-')[1];
        
        formData.exp_month = exp_month;
        formData.exp_year = exp_year.substr(2, 2);
        
        delete formData.expiry;
        
        formData.token = User.token;
        
        $$.post(services + "/cards/card_3d", JSON.stringify(formData), function(response) {
            var result = JSON.parse(response);
            console.log(result.message);
            if(result.success) {
                
                myApp.closeModal();
                
                var params = result.data.UrlParams;
                
                var prid = params.PAY_REQUEST_ID.xval.replace(/"/g, '');
                var pgid = params.PAYGATE_ID.xval.replace(/"/g, '');
                var chk = params.CHECKSUM.xval.replace(/"/g, '');      
                var url = result.data.RedirectUrl;
                
                myApp.modal({
                    title:  'insurapp',
                    text: 'To complete adding your card, we need to authenticate you using 3D secure. R2 will be deducted from your account and added to your wallet.',
                    buttons: [
                      {
                        text: 'Continue',
                        onClick: function() {
                                
                            var target = "_blank";
                            var options = "location=yes";
                            var inAppBrowserRef = cordova.InAppBrowser.open('post.htm?url=' + url + '&PAY_REQUEST_ID=' + prid + '&PAYGATE_ID=' + pgid + '&CHECKSUM=' + chk, target, options);  
                            
                            ShowLoader = false;
                
                            var timeout = window.setInterval(function() {    
                                myApp.hideIndicator();                
                                $$.post(services + "/cards/payment_ping", JSON.stringify({PAY_REQUEST_ID: prid, token: User.token}), function(response) {
                                    var res = JSON.parse(response);
                                    
                                    if(res.success) {
                                        if(res.data.TransactionStatusCode == "1") {
                                            clearInterval(timeout);
                                            inAppBrowserRef.close();
                                            $('.page a, .page button').fadeIn();
                                            
                                            if(currPageName == 'support_manage_cards') {
                                                LoadCreditDebitCardScreen();
                                            }
                                            else {
                                                CardSelectionActionSheet();
                                            }
                                        }
                                        else if(res.data.TransactionStatusCode == "2") {
                                            clearInterval(timeout);
                                            inAppBrowserRef.close();
                                            $('.page a, .page button').fadeIn();
                                            
                                            ShowNotification("Your card was declined by your bank. Please contact your bank to correct this and try again.");
                                        }
                                    }
                                    
                                    myApp.hideIndicator();
                                });                    
                            }, 1000);
                            
                            inAppBrowserRef.addEventListener('exit', function(params) {
                                clearInterval(timeout);
                            });
                        }
                      },
                      {
                        text: 'Cancel'
                      }
                    ]
                  });
            }
            else {
                myApp.alert(result.message);
            }
        }, function (res) {
            console.log(res);
            var result = JSON.parse(res.response);
            myApp.alert(result.message);
        });
    }
    
    
}

function SaveMyCard() {

    ShowLoader = true;
    var formData = myApp.formToData('#AddCardForm');
    var valid = true;
    formData.card_number = formData.card_number.replace(/\s/g, '') 
    if(formData.card_name == "") {
        valid = false;
        ShowNotification('Please enter the name as it appears on the card');
    }
    else if(formData.card_number == "") {
        valid = false;
        ShowNotification('Please enter the card number');
    }
    else if(formData.expiry == "") {
        valid = false;
        ShowNotification('Please enter the expiry date');
    }
    else if(formData.cvv == "") {
        valid = false;
        ShowNotification('Please enter the CVV number on the back of the card');
    }
    
    var currPageName = mainView.activePage.name;
    
    if(valid) {
        
        var exp_month = formData.expiry.split('-')[0];
        var exp_year = formData.expiry.split('-')[1];
        
        formData.exp_month = exp_month;
        formData.exp_year = exp_year.substr(2, 2);
        
        delete formData.expiry;
        
        formData.token = User.token;
        
        $$.post(services + "/cards/card_3d", JSON.stringify(formData), function(response) {
            var result = JSON.parse(response);
            

            if(result.success) {
                
                myApp.closeModal();
                
                var params = result.data.UrlParams;
                
                var prid = params.PAY_REQUEST_ID.xval.replace(/"/g, '');
                var pgid = params.PAYGATE_ID.xval.replace(/"/g, '');
                var chk = params.CHECKSUM.xval.replace(/"/g, '');      
                var url = result.data.RedirectUrl;
                
                myApp.modal({
                    title:  'insurapp',
                    text: 'To complete adding your card, we need to authenticate you using 3D secure. R2 will be deducted from your account and added to your wallet.',
                    buttons: [
                      {
                        text: 'Continue',
                        onClick: function() {
                                
                            var target = "_blank";
                            var options = "location=yes";
                            //var inAppBrowserRef = cordova.InAppBrowser.open('post.htm?url=' + url + '&PAY_REQUEST_ID=' + prid + '&PAYGATE_ID=' + pgid + '&CHECKSUM=' + chk, target, options);  
                            
                            mainView.router.loadPage('post.html?url=' + url + '&PAY_REQUEST_ID=' + prid + '&PAYGATE_ID=' + pgid + '&CHECKSUM=' + chk);
                            
                            ShowLoader = false;

                            paymenTimer = setInterval(function () {    
                                             
                                $$.post(services + "/cards/payment_ping", JSON.stringify({PAY_REQUEST_ID: prid, token: User.token}), function(response) {
                                    var res = JSON.parse(response);
                                    
                                    if (res.success) {
                                        //inAppBrowserRef.close();
                                        if (res.data.TransactionStatusCode == "0") {
                                            console.log("timeout :" + paymenTimer)
                                        } else if (res.data.TransactionStatusDescription === "Approved") {
                                            ShowLoader = true;
                                            myApp.hideIndicator();
                                            clearInterval(paymenTimer);
                                            //inAppBrowserRef.close();
                                            checkCards('success');
                                        } else if (res.data.TransactionStatusDescription === "Declined") {
                                            ShowLoader = true;
                                            myApp.hideIndicator();
                                            clearInterval(paymenTimer);
                                            //inAppBrowserRef.close();
                                            checkCards('declined');
                                        }
                                       
                                    }
                                    
                                    myApp.hideIndicator();
                                });                    
                            }, 5000);
                            
                        }
                      },
                      {
                        text: 'Cancel'
                      }
                    ]
                  });
            }
            else {
                myApp.alert(result.message);
            }
        },
        function (response) {
            console.log(response);
            myApp.alert("Could not add new card. Please try again.");
        });
    }
    
    
}

function SaveMyCustomerCard() {
    var formData = myApp.formToData('#AddCardForm');
    var valid = true;
    if(formData.card_name == "") {
        valid = false;
        ShowNotification('Please enter the name as it appears on the card');
    }
    else if(formData.card_number == "") {
        valid = false;
        ShowNotification('Please enter the card number');
    }
    else if(formData.expiry == "") {
        valid = false;
        ShowNotification('Please enter the expiry date');
    }
    else if(formData.cvv == "") {
        valid = false;
        ShowNotification('Please enter the CVV number on the back of the card');
    }
    
    var currPageName = mainView.activePage.name;
    
    if(valid) {
        
        var exp_month = formData.expiry.split('-')[0];
        var exp_year = formData.expiry.split('-')[1];
        
        formData.exp_month = exp_month;
        formData.exp_year = exp_year.substr(2, 2);
        
        delete formData.expiry;
        
        formData.token = User.token;
        console.log(JSON.stringify(formData));
        $$.post(services + "/customer_cards/card_3d", JSON.stringify(formData), function (response) {
            console.log(response)
            var result = JSON.parse(response);
            if(result.success) {
                
                myApp.closeModal();
                
                var params = result.data.UrlParams;
                
                var prid = params.PAY_REQUEST_ID.xval.replace(/"/g, '');
                var pgid = params.PAYGATE_ID.xval.replace(/"/g, '');
                var chk = params.CHECKSUM.xval.replace(/"/g, '');      
                var url = result.data.RedirectUrl;
                
                myApp.modal({
                    title:  'insurapp',
                    text: 'To complete adding your card, we need to authenticate you using 3D secure. R2 will be deducted from your account and added to your wallet.',
                    buttons: [
                      {
                        text: 'Continue',
                        onClick: function() {
                                
                            var target = "_blank";
                            var options = "location=yes";
                            var inAppBrowserRef = cordova.InAppBrowser.open('post.htm?url=' + url + '&PAY_REQUEST_ID=' + prid + '&PAYGATE_ID=' + pgid + '&CHECKSUM=' + chk, target, options);  
                            
                            ShowLoader = false;
                
                            var timeout = window.setInterval(function() {    
                                myApp.hideIndicator();                
                                $$.post(services + "/cards/payment_ping", JSON.stringify({PAY_REQUEST_ID: prid, token: User.token}), function(response) {
                                    var res = JSON.parse(response);
                                    
                                    if(res.success) {
                                        if(res.data.TransactionStatusCode == "1") {
                                            clearInterval(timeout);
                                            inAppBrowserRef.close();
                                            $('.page a, .page button').fadeIn();

                                            mainView.router.loadPage('support_manage_cards.html');
                                            
                                        }
                                        else if(res.data.TransactionStatusCode == "2") {
                                            clearInterval(timeout);
                                            inAppBrowserRef.close();
                                            $('.page a, .page button').fadeIn();
                                            
                                            ShowNotification("Your card was declined by your bank. Please contact your bank to correct this and try again.");
                                        }
                                    }
                                    
                                    myApp.hideIndicator();
                                });                    
                            }, 1000);
                            
                            inAppBrowserRef.addEventListener('exit', function(params) {
                                clearInterval(timeout);
                            });
                        }
                      },
                      {
                        text: 'Cancel'
                      }
                    ]
                  });
            }
            else {
                console.log("reason :"+result.reason)
                myApp.alert(result.reason);
            }
        });
    }
    
    
}

function OLDSAVECARD() {
    var formData = myApp.formToData('#AddCardForm');
    var valid = true;
    
    
    
    if(formData.card_name == "") {
        valid = false;
        ShowNotification('Please enter the name as it appears on the card');
    }
    else if(formData.card_number == "") {
        valid = false;
        ShowNotification('Please enter the card number');
    }
    else if(formData.expiry == "") {
        valid = false;
        ShowNotification('Please enter the expiry date');
    }
    else if(formData.cvv == "") {
        valid = false;
        ShowNotification('Please enter the CVV number on the back of the card');
    }
    
    var currPageName = mainView.activePage.name;
    
    if(valid) {
        var exp_month = formData.expiry.split('-')[0];
        var exp_year = formData.expiry.split('-')[1];
        
        formData.exp_month = exp_month;
        formData.exp_year = exp_year.substr(2, 2);
        
        delete formData.expiry;
        
        preloaderText = "Saving, please wait...";
        
        $$.ajax({
            url: services + "/cards/card",
            method: 'POST',
            cache: false,
            dataType: 'json',
            data: JSON.stringify(formData),
            headers: {
                "Authorization": User.token
            },
            success: function(result) {
                
                ResetPreloader();
                
                if(result.success) {
                                    
                    $$.ajax({
                        url: services + "/cards/cards",
                        method: 'GET',
                        cache: false,
                        dataType: 'json',
                        headers: {
                            "Authorization": User.token
                        },
                        success: function(result1) {
                            if(result1.success) {

                                AvailableCards = result1.data;
                                
                                window.setTimeout(function() {
                                    myApp.closeModal();                        
                                    window.setTimeout(function() {
                                        if(currPageName == 'support_manage_cards') {
                                            LoadCreditDebitCardScreen();
                                        }
                                        else {
                                            CardSelectionActionSheet();
                                        }
                                    }, 500);
                                }, 500);
                            }
                            else { 
                                CheckReturnMessage(result1.message);
                            }
                        },
                        error: function(error) {
                            ShowNotification("There has been an error, please try again.");
                        }

                    });                    
                }
                else { 
                    CheckReturnMessage(result.message);
                }
            },
            error: function(error) {
                ResetPreloader();
                ShowNotification("There has been an error, please try again.");
            }

        });
    }
}

function CardSelectionActionSheet(id) {
    
    var buttons = [];
        
    buttons.push({
        text: 'Add new Card',
        onClick: function () {
            AddNewCard();
        }
    });
    
    if(AvailableCards.length > 0) {
        for(var i = 0; i < AvailableCards.length; i++) {
            buttons.push({
                text: AvailableCards[i].name,
                token: AvailableCards[i].token,
                onClick: function() {
                    MakePayment(this.token, CurrentPolicyPremium, 'card'); //CurrentPolicyPremium
                }
            });
        }
    }
    
    buttons.push({
        text: 'Cancel',
        color: 'red'
    });
    
    
    myApp.actions(buttons);
}

function PromptPayLicenseFee() {
    myApp.modal({
        title:  'insurapp',
        text: 'Your license fee of R300 is due for payment. You cannot sell products unless your license is paid up. Please choose your payment option below.',
        buttons: [
          {
            text: 'Wallet',
            onClick: function() {
                DoWalletLicensePayment();
            }
          },
          {
            text: 'Card',
            onClick: function() {
                DoCardLicensePayment();
            }
          },
          {
            text: 'Cancel',
            onClick: function() {
              mainView.router.loadPage('landing.html');
            }
          }
        ]
    });
}

function DoWalletLicensePayment() {
    $$.post(services + "/insurapp/purchase_annual_license", JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);

        if(result.success) {
            User.user.license_fee_due = false;
            
            SetLocalAccount();
            LoadHomeScreenButtons();
            
            ShowNotification("Thank you for paying your insurapp annual license fee.");
        }
        else {
            myApp.modal({
                title:  'insurapp',
                text: result.message,
                buttons: [
                  {
                    text: 'Try Again',
                    onClick: function() {
                        PromptPayLicenseFee();
                    }
                  },
                  {
                    text: 'Cancel',
                    onClick: function() {
                        mainView.router.loadPage('landing.html');
                    }
                  }
                ]
            });
        }
    });
}

function DoCardLicensePayment() {
    $$.ajax({
        url: services + "/cards/cards",
        method: 'GET',
        cache: false,
        dataType: 'json',
        headers: {
            "Authorization": User.token
        },
        success: function(result) {
            if(result.success) {

                AvailableCards = result.data;
                
                LicenseCardSelectionActionSheet();          
            }
            else { 
                CheckReturnMessage(result.message);
            }
        },
        error: function(error) {
            ShowNotification("There has been an error, please try again.");
        }

    });
}

function LicenseCardSelectionActionSheet(id) {
    
    var buttons = [];
        
    buttons.push({
        text: 'Add new Card',
        onClick: function () {
            AddNewCard();
        }
    });
    
    if(AvailableCards.length > 0) {
        for(var i = 0; i < AvailableCards.length; i++) {
            buttons.push({
                text: AvailableCards[i].name,
                token: AvailableCards[i].token,
                onClick: function() {
                    MakeLicensePayment(this.token, 300, 'card'); //LICENSE FEE R300
                }
            });
        }
    }
    
    buttons.push({
        text: 'Cancel',
        color: 'red',
        onClick: function() {
            PromptPayLicenseFee();
        }
    });
    
    
    myApp.actions(buttons);
}

function MakeLicensePayment(token, amount, type) {
    myApp.prompt('Please enter this cards CVV number.', 'insurapp', 'number', function (value) {
        
            var values = {"card_token":token,"amount":amount,"cvv":value}

            preloaderText = "Processing payment...";

            $$.ajax({
                url: services + "/cards/payment",
                method: 'POST',
                cache: false,
                dataType: 'json',
                data: JSON.stringify(values),
                headers: {
                    "Authorization": User.token
                }, 
                success: function(result) {
                    ResetPreloader();
                    if(result.success) {
                        DoWalletLicensePayment();
                    }
                    else { 
                        CheckReturnMessage(result.message);
                    }
                },
                error: function(error) {
                    ResetPreloader();
                    ShowNotification("There has been an error processing your payment, please try again.");
                }

            });
        }, function(value) { 
            PromptPayLicenseFee();
        });
}
function CustomerPayNow(token, amount, customerID) {
    var formData = myApp.formToData('#customerPayForm');
    var valid = true;

    if (formData.otp == "") {
        valid = false;
        ShowNotification('Please enter the otp');
    }
    else if (formData.cvv == "") {
        valid = false;
        ShowNotification('Please enter card cvv');
    } else if (customerID == "" || customerID == undefined) {
        valid = false;
        ShowNotification('Oops something went wrong');
    }

    var values = {
        token: User.token,
        card_token: token,
        amount: formData.premium,
        cvv: formData.cvv,
        otp: formData.otp,
        customer_user_id: customerID
    }

    if (valid) {
        ShowLoader = true;
        $(".custom-preloader").show();
        
        $$.ajax({
            url: services + "/customer_cards/payment",
            method: 'POST',
            cache: false,
            dataType: 'json',
            data: JSON.stringify(values),
            headers: {
                "Authorization": User.token
            }, 
            success: function(result) {
                ResetPreloader();
                if(result.success) {

                    $$.post(services + "/insurapp/policy_search", JSON.stringify({token: User.token, policy_number: formData.policy_number}), function(response) {
                        var result2 = JSON.parse(response);

                        myApp.hidePreloader();

                        if(result2.success) { 
                            console.log("PolicyApplicationObject working...");
                            PolicyApplicationObject = new Object(); 

                            PolicyApplicationObject.policy_number = formData.policy_number;
                            PolicyApplicationObject.product_id = result2.data.policies.ins_prod_id;
                            PolicyApplicationObject.premium = result2.data.policies.premium;
                            PolicyApplicationObject.first_name = result2.data.policies.first_name;
                            PolicyApplicationObject.last_name = result2.data.policies.last_name;
                            PolicyApplicationObject.sa_id = result2.data.policies.sa_id;
                            PolicyApplicationObject.dob = result2.data.policies.dob;
                            PolicyApplicationObject.tel_cell = result2.data.policies.tel_cell;
                            PolicyApplicationObject.email_address = result2.data.policies.email_address;
                            PolicyApplicationObject.postal_code = result2.data.policies.postal_code;
                            PolicyApplicationObject.beneficiary_name = result2.data.policies.beneficiary_name;
                            PolicyApplicationObject.beneficiary_sa_id = result2.data.policies.beneficiary_sa_id;
                            PolicyApplicationObject.token = User.token;
                            PolicyApplicationObject.product_data = new Object();
                            PolicyApplicationObject.product_data.loan_term = result2.data.policies.data.loan_term;
                            PolicyApplicationObject.product_data.loan_amount = result2.data.policies.data.loan_amount;
                            PolicyApplicationObject.language = result2.data.policies.language;

                            CurrentProduct.name = result2.data.policies.product_name;
                       
                            PolicyApplicationObject.payment_method = 'customer_card';
                    
                            $$.post(services + "/insurapp/complete_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
                                var result1 = JSON.parse(response1);
                                ResetPreloader();
                            
                                if (result1.error) {
                                    myApp.alert(result1.message); 
                                } if (result1.success)  {
                                    $(".payat_policy_number").html(CurrentPolicyNumber);
                                    mainView.router.loadPage('card-complete.html');
                                 
                                }   
                            });  
                        } else{
                            myApp.alert(result2.message)
                        }    
                    })



                }
                else { 
                    ShowNotification(result.message);
                }
            },
            error: function(error) {
                ResetPreloader();
                ShowNotification("There has been an error processing your payment, please try again.");
            }

        });
    }
}
function CustomerPayment(token, amount, policy_number, customer_user_id){
   
    mainView.router.loadPage('customer-pay.html?customer_user_id=' + customer_user_id);
    myApp.showPreloader("Please wait...");
    window.setTimeout(function () {
        console.log("amount :"+amount);
        console.log("Premium :" + amount);

        myApp.hidePreloader();
        $(".modal-overlay").hide();

        $(".policy_number").val(policy_number);
        $(".premium").val(CurrentPolicyPremium);
        $("#CustomerPayNow").html('<a href="javascript:CustomerPayNow(' + "'" + token + "'," + amount + "," + customer_user_id+');" class="button button-big button-fill bg-pink uppercase" style="width: 60%; margin: 0 auto;">Proceed <i class="fa fa-arrow-right"></i></a>');
        
    },3000);
}
function MakePayment(token, amount, type) {
    console.log(CurrentPolicyNumber);
    myApp.closeModal();
   
    console.log(PolicyApplicationObject)
    var currPageName = mainView.activePage.name;

    if (type == "card" || type=="pay_now") {
        myApp.prompt('Please enter this cards CVV number.', 'insurapp', 'number', function (value) {
        
            var values = {"card_token":token,"amount":amount,"cvv":value}

            preloaderText = "Processing payment...";

            $$.ajax({
                url: services + "/cards/payment",
                method: 'POST',
                cache: false,
                dataType: 'json',
                data: JSON.stringify(values),
                headers: {
                    "Authorization": User.token
                }, 
                success: function(result) {
                    ResetPreloader();
                    if(result.success) {

                        PolicyApplicationObject.payment_method = 'card';
                        PolicyApplicationObject.policy_wording_id = CurrentPolicyWordingId;
                        PolicyApplicationObject.product_data.loan_amount = CurrentPolicyLoanAmount
                        $$.post(services + "/insurapp/complete_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
                            var result1 = JSON.parse(response1);
                            ResetPreloader();

                            if (result1.error) {
                               

                                myApp.alert(result1.message); 
                                
                                //if(currPageName.toLowerCase().indexOf("funeral_product_")) {
                                //    mainView.router.loadPage('funeral_product_success.html');
                                //}
                                //else if (currPageName.toLowerCase().indexOf("funeral_product")) {
                                //    DoWalletLicensePayment();
                                //}
                                //if(currPageName.toLowerCase().indexOf("travel")) {
                                //    mainView.router.loadPage('travel_product_success.html');
                                //}
                                //if(currPageName.toLowerCase().indexOf("cellphone")) {
                                //    mainView.router.loadPage('cellphone_product_success.html');
                                //}
                            }
                            else {
                                $(".payat_policy_number").html(CurrentPolicyNumber);
                                mainView.router.loadPage('card-complete.html');
                            }   
                        },
                        function (value1) {

                        });       



                    }
                    else { 
                        ShowNotification(result.message);
                    }
                },
                error: function(error) {
                    ResetPreloader();
                    ShowNotification("There has been an error processing your payment, please try again.");
                }

            });
        });
    }
    if(type == "atm") {
        PolicyApplicationObject.payment_method = 'atm';
        PolicyApplicationObject.policy_wording_id = CurrentPolicyWordingId;
        console.log("PolicyApplicationObject :" + PolicyApplicationObject);
        $$.post(services + "/insurapp/complete_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
            var result1 = JSON.parse(response1);
            ResetPreloader();

            if (result1.error) {
                myApp.alert(result1.message);
            }
            else {
                myApp.alert(result1.message, function () {
                    mainView.router.loadPage('landing.html');
                });
            }   
        },
        function (value1) {

        });    
    }
    if (type == "credit") {
        PolicyApplicationObject.payment_method = 'credit';
        PolicyApplicationObject.policy_wording_id = CurrentPolicyWordingId;
        $$.post(services + "/insurapp/complete_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
            var result1 = JSON.parse(response1);
            ResetPreloader();

            if (result1.error) {
                myApp.alert(result1.message);
            }
            else {
                myApp.alert(result1, message, function () {
                    mainView.router.loadPage('landing.html');
                })
            }   
        },
        function (value1) {

        });    
    }
    if(type == "myinsurapp") {
        PolicyApplicationObject.payment_method = 'myinsurapp';

        $$.post(services + "/insurapp/complete_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
            var result1 = JSON.parse(response1);
            ResetPreloader();

            if (result1.error) {
                myApp.alert(result1.message);
            }
            else {
                window.setTimeout(function () {
                    myApp.closeModal();
                    mainView.router.loadPage('funeral_product_success.html?type=myinsurapp');
                }, 800);
            }   
        },
        function (value1) {

        });    
    }
    
}

function MakeCreditPayment(token, amount, type) {
    
    var currPageName = mainView.activePage.name;
    
    PolicyApplicationObject.payment_method = 'credit';
    PolicyApplicationObject.policy_wording_id = CurrentPolicyWordingId;

    $$.post(services + "/insurapp/complete_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
        var result1 = JSON.parse(response1);
        ResetPreloader();

        if (result1.error) {
            myApp.alert(result1.message); 
        }
        else {
           mainView.router.loadPage('credit-complete.html');
        }   
    },
    function (value1) {

    });       
}

function MakeWalletPayment(token, amount, type) {
    
    var currPageName = mainView.activePage.name;
    
    PolicyApplicationObject.payment_method = 'wallet';
    PolicyApplicationObject.policy_wording_id = CurrentPolicyWordingId;
    $$.post(services + "/insurapp/complete_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
        var result1 = JSON.parse(response1);
        pending_balance = result1.data.wallets.pending_balance
        wallet_balance = result1.data.wallets.wallet_balance

        ResetPreloader();

        if (result1.error) {
             myApp.alert(result1.message);
        }else {
            $(".payat_policy_number").html(CurrentPolicyNumber);
            mainView.router.loadPage('wallet-complete.html');
            
        }   
    },
    function (value1) {

    });       
}

function MakeAtmPayment(value, type) {
    if (type == "atm") {
        PolicyApplicationObject.payment_method = 'atm';
        PolicyApplicationObject.policy_wording_id = CurrentPolicyWordingId;
        console.log(PolicyApplicationObject);
        $$.post(services + "/insurapp/complete_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function (response1) {
            var result1 = JSON.parse(response1);
            ResetPreloader();

            if (result1.error) {

                myApp.alert(result1.message);
                
            }
            else {
                mainView.router.loadPage('atm_confirm.html'); 
            }
        },
        function (value1) {

        });
    }
}

function update_application() {
    PolicyApplicationObject.policy_wording_id = CurrentPolicyWordingId;
    console.log(PolicyApplicationObject);
    $$.post(services + "/insurapp/update_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function (response1) {
        var result1 = JSON.parse(response1);
        ResetPreloader();

        if (result1.success) {
          
        }
        else {
            ShowNotification(result1.message);
        }
    },
    function (value1) {

    }); 
}

function MakeCardMachinePayment(value, type) {
  
    PolicyApplicationObject.payment_method = type;
    PolicyApplicationObject.policy_wording_id = CurrentPolicyWordingId;
    console.log(PolicyApplicationObject);
    $$.post(services + "/insurapp/complete_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function (response1) {
        var result1 = JSON.parse(response1);
        ResetPreloader();

        if (result1.error) {

            myApp.alert(result1.message);

        }
        else {
            mainView.router.loadPage('card-machine-complete.html');
         
        }
    },
    function (value1) {

    });
    
}

function saveQuote() {
    PolicyApplicationObject.is_quote = 1;
    PolicyApplicationObject.policy_wording_id = CurrentPolicyWordingId;
    console.log(PolicyApplicationObject);
    $$.post(services + "/insurapp/complete_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function (response1) {
        var result = JSON.parse(response1);
        if (result.error) {
           myApp.alert(result.message);
        } else {
            myApp.alert('Thank you for completing this quote. <br/> Quote Number:' + result.data.quote_id, function () {
                mainView.router.loadPage('landing.html');
            });
        }
    });
}
function MakePayatPayment(value, type) {
    PolicyApplicationObject.payment_method = type;
    PolicyApplicationObject.policy_wording_id = CurrentPolicyWordingId;
    console.log(PolicyApplicationObject);
    $$.post(services + "/insurapp/complete_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function (response1) {
        var result = JSON.parse(response1);
        ResetPreloader();

        if (result.error) {

            myApp.alert(result.message);
         
        }
        else {
            mainView.router.loadPage('payat_confirm.html');
        }
        console.log("policy_number :" + result.data.policy_number);
        
        window.setTimeout(function () {
            $(".CurrentPayat").html(result.data.payat_account_number);
            $(".payat_policy_number").html(result.data.policy_number);
        }, 500);
    },
    function (value1) {

    });
}
function LoadFuneralPaySuccess(type) {
    $("#FuneralProductSuccess_Name").html(CurrentProduct.name);
    $("#FuneralProductSuccess_PolicyNumber").html(CurrentPolicyNumber);
    
    if(type != "") {
        $("#Funeral_SuccessContent").html("Waiting on payment.");
    }
    else {
        $("#Funeral_SuccessContent").html("Your policy is now active!");
    }
}

function set_premium(policy_number){
    var postData = { policy_number:policy_number, token:User.token};
    var sa_id = '';
    var premium = '';
    $$.post(services + "/insurapp/policy_search/", JSON.stringify(postData), function(response) {
            var result = JSON.parse(response);
            if(result.success){
                var Policies = result.data.policies;
                CurrentPolicyPremium = Policies.premium;
                
            }else{
                result.message;
            }
            
    });
}

function LoadCustomerCreditDebitCardScreen(customer_user_id) {
    myApp.showPreloader("Loading cards...");
    var valid  =  true
   /* if (CurrentPolicyNumber == "" || CurrentPolicyNumber == undefined || CurrentPolicyNumber == null) {
        myApp.hidePreloader();
        $(".modal-overlay").show();
        valid = false
        myApp.prompt('Please enter policy number', function (value) {
            valid = true
            CurrentPolicyNumber = value
            LoadCustomerCreditDebitCardScreen();
            $(".modal-overlay").show();
           
        });
    }
  */
    console.log('CurrentPolicyNumber :'+CurrentPolicyNumber);

    if(valid){
        var postData = { policy_number:CurrentPolicyNumber, token:User.token};
        var sa_id = '';
        var premium = '';
        $$.post(services + "/insurapp/policy_search/", JSON.stringify(postData), function (response) {
            myApp.hidePreloader();
            $(".loader-overlay").hide();
                var result = JSON.parse(response);
                if(result.success){
                    var Policies = result.data.policies;
                    if(CurrentPolicyPremium == 0){
                        CurrentPolicyPremium = Policies.premium;
                    }
                    

                    $$.ajax({
                        url: services + "/customer_cards/cards?policy_number="+CurrentPolicyNumber,
                        method: 'GET',
                        cache: false,
                        dataType: 'json',
                        headers: {
                            "Authorization": User.token
                        },
                        success: function(result) {
                            if(result.success) {
                                $(".loader-overlay").hide();
                                AvailableCards = result.data;

                                currentCustomerID = result.customer_user_id;
                                console.log("currentCustomerID :"+currentCustomerID);
                                var html = '';
                
                                if (AvailableCards.length > 0) {
                                    html += '<li class="card">';
                                    html += '<table style="witdh:100%">';
                                    for (var i = 0; i < AvailableCards.length; i++) {
                                        html += '<tr style="border-bottom: solid thin #ddd;">';
                                        html += '<td>' + 'Card Number: <br>' + '<h2>' + AvailableCards[i].name + '</h2>' + '</td>';
                                        html += '<td>';
                                        html += '<a href="javascript:CustomerPayment(' + "'" + AvailableCards[i].token + "'" + ',' + CurrentPolicyPremium + ',' + "'" + CurrentPolicyNumber + "'" + "," + currentCustomerID + ')" class="button button-big button-fill bg-pink" style="width: 100%;margin: 0 auto;">Pay with card</a>';
                                        html += '</td>';
                                        html += '<td>';
                                        html += '<a style="background:red; border:none" class="button button-big  bg-pink" href="javascript:RemoveCustomerCard(' + AvailableCards[i].id + ');"><i  class="fa fa-trash fa-2x"></i></a>';
                                        html += '</td>';
                                        html += '</tr>';
                                    
                                    }
                                    html += '</table>';

                                    html += '</li>';

                                    
                                } else {
                                    //mainView.router.reloadPage("scanned-customer-card.html?customer_user_id=" + currentCustomerID );
                                }

                                html += '<li>'
                                html += '<a id="add-new-card" href="scanned-customer-card.html?customer_user_id=' + currentCustomerID + '" class="button button-big button-fill bg-pink"> Add a new Card</a>';
                                html += '</li>';
                                
                                $("#YourCreditDebitCards").html(html);
                
                               
                            }
                            else { 
                                CheckReturnMessage(result.message);
                            }
                        },
                        error: function(error) {
                            ShowNotification("There has been an error, please try again.");
                        }
                
                    });
            }else{
                myApp.alert(result.message)
            }
        });
    }
   
}


function checkCustomerCards(type, customer_user_id) {
  
   
    $$.ajax({
        url: services + "/customer_cards/cards?policy_number=" + CurrentPolicyNumber,
        method: 'GET',
        cache: false,
        dataType: 'json',
        headers: {
            "Authorization": User.token
        },
        success: function (result) {
            if (result.success) {
                AvailableCards = result.data;
                currentCustomerID = result.customer_user_id;
                console.log("currentCustomerID :" + currentCustomerID);
                //if (AvailableCards.length > 0) {
                    mainView.router.loadPage('customer_manage_cards.html?customer_user_id=' + currentCustomerID);
                // } else {
                //     setTimeout(function () {
                //         mainView.router.loadPage("scanned-card.html");
                //     },300)
                   
                // }

                if (type == 'success') {
                    //clearInterval(paymenTimer);
                    myApp.addNotification({
                        title: 'InsurApp',
                        message: 'Your card has been successfully added.',
                        subtitle: '<i class="fa fa-check-circle-o fa-4x" style="color:green"></i>'
                    });
                }
                if (type == 'declined') {
                    //clearInterval(paymenTimer);
                    myApp.addNotification({
                        title: 'InsurApp',
                        message: 'Your card was declined by your bank. Please contact your bank to correct this and try again.',
                        subtitle: '<i class="fa fa-exclamation-triangle fa-4x" style="color:red"></i>'
                    });
                }

            } else {
                myApp.alert('Oops something went wrong. Please try again.');
            }
        }
    });
}

function checkCards(type) {
    console.log("paymenTimer :"+paymenTimer)
    clearInterval(paymenTimer);
    if (type == 'success') {
        myApp.addNotification({
            title: 'InsurApp',
            message: 'Your card has been successfully added.',
        });
    }
    if (type == 'declined') {
        myApp.addNotification({
            title: 'InsurApp',
            message: 'Your card was declined by your bank. Please contact your bank to correct this and try again.',
        });
    }

    $$.ajax({
        url: services + "/cards/cards/",
        method: 'GET',
        cache: false,
        dataType: 'json',
        headers: {
            "Authorization": User.token
        },
        success: function (result) {
            if (result.success) {
                AvailableCards = result.data;
                if (AvailableCards.length > 0) {
                    mainView.router.loadPage("support_manage_cards.html");
                } else {
                    mainView.router.loadPage("scanned-card.html");
                }
            } else {
                mainView.router.loadPage("scanned-card.html");
            }
        }
      });
}
function LoadCreditDebitCardScreen() {
    $$.ajax({
        url: services + "/cards/cards",
        method: 'GET',
        cache: false,
        dataType: 'json',
        headers: {
            "Authorization": User.token
        },
        success: function(result) {
            if(result.success) {

                AvailableCards = result.data;

                var html = '';
                console.log(AvailableCards.length)
                if (AvailableCards.length > 0) {
                    html += '<li class="card">';
                    html += '<table>';
                    for (var i = 0; i < AvailableCards.length; i++) {
                      
                        html += '<tr>';
                        html += '<td width="180px;">' + 'Card Number: <br>' +'<h2>' +  AvailableCards[i].name + '</h2>' + '</td>';
                        html += '<td width="100px;">';
                        ///if (CurrentPolicyPremium > 0) {
                        html += '<a href="javascript:MakePayment(' + "'" + AvailableCards[i].token + "'" + ',' + CurrentPolicyPremium + ',' + "'" + 'pay_now' + "'" + ')" class="button button-big button-fill bg-pink" style="width: 100%;margin: 0 auto;">Pay with card</a>';
                        //}
                        html += '</td>';
                        html += '<td width="100px;">';
                        html += '<a style="background:red; width: 80%;margin: 0 auto; border:none" class="button button-big  bg-pink" href="javascript:RemoveCard(' + AvailableCards[i].id + ');"><i  class="fa fa-trash fa-2x"></i></a>';
                        html += '</td>';
                        html += '</tr>';
                       
                    }
                    html += '</table>';

                    html += '</li>';
                    
                } else {
                    console.log('No card...')
                    setTimeout(function () {
                        mainView.router.loadPage("scanned-card.html");
                    },300)
                }

                html += '<div style="text-align:center">';
                html += '<br/>';
                html += '  <a style="width: 70%;margin: 0 auto;" href="scanned-card.html" class="button button-big button-fill bg-pink uppercase">';
                html += '   Add a new card';
                html += '  </a>';
               /*html += '<h3>Or</h3>';
                html += '  <a style="width: 70%;margin: 0 auto;" onclick="ScanCard()" href="scanned-card.html" class="scan button button-big button-fill bg-pink uppercase">';
                html += '   Scan Card';
                html += '  </a>';*/
                html += '</div>';
                
                $("#YourCreditDebitCards").html(html);
            }
          
        },
        error: function(error) {
            ShowNotification("There has been an error, please try again.");
        }

    });
}

function ScanCard() {
    

    var onCardIOComplete = function (response) {
        var cardIOResponseFields = [
            "cardType",
            "redactedCardNumber",
            "cardNumber",
            "expiryMonth",
            "expiryYear",
            "cvv",
            "postalCode"
        ];

        var len = cardIOResponseFields.length;
        for (var i = 0; i < len; i++) {
            var field = cardIOResponseFields[i];

            $(".card_number").val(response['cardNumber']);
            $(".expiry").val(response['expiryMonth'] + "-" + response['expiryYear']);

        }
        $(".card_number").focus()
    };

    var onCardIOCancel = function () {
        myApp.alert("Card scan cancelled", "<i class='fa fa-info'></i>");
    };

    var onCardIOCheck = function (canScan) {
        if (canScan == false) {
            myApp.alert("Unable to scan.", "Error");
        } else {
            //myApp.alert("Able to scan.", "Success");
        }

        
        CardIO.scan({
            "requireExpiry": true,
            "scanExpiry": true,
            "requirePostalCode": false,
            "requireCvv": true,
            "restrictPostalCodeToNumericOnly": true,
            "hideCardIOLogo": true,
            "suppressScan": false,
            "keepApplicationTheme": true
        }, onCardIOComplete, onCardIOCancel);
    };

    CardIO.canScan(onCardIOCheck);
}

function LoadCreditDebitCardScreen2() {
    $$.ajax({
        url: services + "/cards/cards",
        method: 'GET',
        cache: false,
        dataType: 'json',
        headers: {
            "Authorization": User.token
        },
        success: function (result) {
            if (result.success) {

                AvailableCards = result.data;

                var html = '';

                if (AvailableCards.length > 0) {
                    for (var i = 0; i < AvailableCards.length; i++) {
                        html += '<li style="border-bottom:solid thin #eee">';
                        html += '  <a href="javascript:RemoveCard(' + AvailableCards[i].id + ');" class="item-link item-content">';
                        html += '    <div class="item-inner">';
                        html += '      <div class="item-title">' + AvailableCards[i].name + '</div>';//<br /><small>' + AvailableCards[i].name + '</small>
                        //html += '      <div class="item-after"><span class="badge">Exp: ' + AvailableCards[i].exp_month + '-' + AvailableCards[i].exp_year + '</span></div>';
                        html += '    </div>';
                        html += '  </a>';
                        html += '</li>';
                    }
                }

                html += '<li>';
                html += '  <a href="javascript:AddNewCard2();" class="item-link item-content">';
                html += '    <div class="item-inner">';
                html += '      <div class="item-title Montserrat-Bold text-blue">+ Add a new Card</div>';
                html += '    </div>';
                html += '  </a>';
                html += '</li>';


                $("#YourCreditDebitCards").html(html);
            }
            else {
                CheckReturnMessage(result.message);
            }
        },
        error: function (error) {
            ShowNotification("There has been an error, please try again.");
        }

    });
}

function RemoveCard(card_id) {
    
    myApp.modal({
        title:  'insurapp',
        text: 'Are you sure you want to remove this card from your profile?',
        buttons: [
            {
                text: 'Yes',
                onClick: function() {
                    
                    preloaderText = "Removing...";
                    
                    $$.ajax({
                        url: services + "/cards/card/" + card_id,
                        method: 'DELETE',
                        cache: false,
                        dataType: 'json',
                        headers: {
                            "Authorization": User.token
                        },
                        success: function(result) {
                            ResetPreloader();
                            
                            if(result.success) {

                                window.setTimeout(LoadCreditDebitCardScreen, 1000);
                            }
                            else { 
                                CheckReturnMessage(result.message);
                            }
                        },
                        error: function(error) {
                            ShowNotification("There has been an error, please try again.");
                        }

                    });
                }
            },
            {
                text: 'Cancel'
            }
        ]
    });
    
    
}

function RemoveCustomerCard(card_id) {

    myApp.modal({
        title: 'insurapp',
        text: 'Are you sure you want to remove this card from your profile?',
        buttons: [
            {
                text: 'Yes',
                onClick: function () {

                    preloaderText = "Removing...";

                    $$.ajax({
                        url: services + "/cards/card/" + card_id,
                        method: 'DELETE',
                        cache: false,
                        dataType: 'json',
                        headers: {
                            "Authorization": User.token
                        },
                        success: function (result) {
                            ResetPreloader();

                            if (result.success) {

                                window.setTimeout(LoadCustomerCreditDebitCardScreen, 1000);
                            }
                            else {
                                CheckReturnMessage(result.message);
                            }
                        },
                        error: function (error) {
                            ShowNotification("There has been an error, please try again.");
                        }

                    });
                }
            },
            {
                text: 'Cancel'
            }
        ]
    });


}

function LoadFaqScreen() {
    
    var values = {token: User.token, app: 'insurapp'};
    
    $$.post(services + "/content/faqs", JSON.stringify(values), function(response) {

        var result = JSON.parse(response);

        if(result.success) { 

            FAQs = result.data;
            var html = '';
            
            for(var i = 0; i < FAQs.length; i++) {
        
                html += '<li>';
                html += '    <a href="javascript:ViewFAQ(' + i + ');" class="item-link item-content">';
                html += '        <div class="item-inner">';
                html += '            <div class="item-title-row">';
                html += '                 <div class="item-title wrap">' + FAQs[i].title + '</div>';
                html += '            </div>';
                html += '        </div>';
                html += '    </a>';
                html += '</li>';
                
                $("#FAQHtml").html(html);

                //total += (parseFloat(ActiveShopCartItems[i].price) * parseFloat(ActiveShopCartItems[i].quantity));       
            }
        }
        else {
            
            CheckMessageForTokenIssue(result.message, function() {
                mainView.router.reloadPage("support_faq.html");
            });

        }
    });
}

function ViewFAQ(index) {
    for(var i = 0; i < FAQs.length; i++) {    
        if(i == index) {
            
            var popupHTML = '<div class="popup">'+
                                '<div class="content-block text-black">'+
                                  '<h2 class="text-center">' + FAQs[index].title + '</h2>'+
                                  '<p>' + FAQs[index].body + '</p>'+
                                  '<div class="row" style="margin-bottom:10px;">'+
                                    '<div class="col-100"><a href="#" class="close-popup button button-fill button-big bg-pink text-white">Close</a></div>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'
              myApp.popup(popupHTML);         
            
            
            break;
        }
    }
}

function OpenContactDetails() {
    var popupHTML = '<div class="popup  bg-pink">'+
                        '<div class="content-block ">'+
                          '<h2 class="text-center">Contact Us</h2>'+
                          '<div class="row" style="margin-bottom:10px;">'+
                            '<div class="row">' + 
                            '<form id="ContactUsForm">' + 
                            '   <p class="text-center">Enter your message below</p>' + 
                            '   <p><textarea style="border:solid thin #ddd;" class="contact_message textbox" name="body" rows="8"></textarea></p>' + 
                            '   <p><a href="javascript:SendContactMessage();" class="button button-big button-fill bg-pink uppercase" style="width: 70%;margin: 0 auto;">Send</a></p>' + 
                            '   <p class="text-center">or feel free to send us an email at <strong><a href="javascript:window.open(\'mailto:support@insurapp.co.za\', \'_system\', \'location=yes\');" class="">support@insurapp.co.za</a></strong>.</p>' + 
                            '</form>' + 
                            '</div>' + 
                          '</div>'+
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" style="width: 70%;margin: 0 auto;" class="close-popup button button-big button-fill bg-pink uppercase ">Close</a></div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
}

function SendContactMessage() {
    var formData = myApp.formToData('#ContactUsForm');
    var valid = true;
    
    if(formData.message == '') {
        valid = false;
        ShowNotification("Please fill in a message");
    }
    
    formData.subject = 'My InsurApp - Contact from ' + User.user_link.first_name + ' ' + User.user_link.last_name;
    formData.token = User.token;
    
    if(valid) {
        $$.post(services + "/basic/support", JSON.stringify(formData), function(response) {
            var result = JSON.parse(response);
            
            if(result.success) {
                myApp.modal({
                    title: 'insurapp',
                    text: 'Your message has been sent successfully.',
                    buttons: [
                    {
                        text: 'Close',
                        onClick: function() {
                            myApp.closeModal();
                        }
                    }]
                });
                //
            }
            else {
                CheckReturnMessage(result.message);    
            }
            
        }, function(error) {
            
        });
    }
}

function OpenAboutUs() {
    
    $$.post(services + "/content/content", JSON.stringify({token: User.token, content: 'about', app: 'insurapp'}), function(response) {
        var result = JSON.parse(response);
        
        
        var innerHtml = result.data.copy;
        var popupHTML = '<div class="popup bg-pink text-white">'+
                        '<div class="content-block text-white">'+
                          '<h2 class="text-center text-white">About Us</h2>'+
                          '<div class="row" style="margin-bottom:10px;">'+
                            '<div class="col-100 text-center">' + innerHtml +
                            '</div>'+
                          '</div>'+
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup button button-fill bg-white text-purple uppercase">Close</a></div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
    });
    
}

function OpenATMDepositPayment(value) {
    /*
    
    $$.post(services + "/content/content", JSON.stringify({token: User.token, content: 'atm_popup', app: 'insurapp'}), function(response) {
        var result = JSON.parse(response);
        
        
        var innerHtml = result.data.copy.replace('[policy_number]', CurrentPolicyNumber).replace('[policy_number]', CurrentPolicyNumber).replace('[premium]', CurrentPolicyPremium);
        var popupHTML = '<div class="popup bg-pink text-white">'+
                        '<div class="content-block text-white">'+
                          '<h2 class="text-center text-white">ATM Deposits</h2>'+
                          '<div class="row" style="margin-bottom:10px;">'+
                            '<div class="col-100 text-center">' + innerHtml +
                            '</div>'+
                          '</div>'+
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="javascript:MakePayment(\'\', ' + CurrentPolicyPremium + ', \'atm\');" class="close-popup button button-fill bg-white text-purple uppercase">Proceed</a></div>'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup button button-fill bg-white text-purple uppercase">Close</a></div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
    });
    
     */
      var popupHTML = '';

    if (value > 0) {
        popupHTML = '<div class="popup bg-purple">' +
            '<div class="content-block text-white">' +
            '<h2 class="text-center text-white">ATM Deposits</h2>' +
            '<div class="row" style="margin-bottom:10px;">' +
            '<div class="col-100">' +
            '<p>Please deposit</p>' +
            '<h3 class="text-center text-white">R' + value + '</p>' +
            '<p>Please deposit the amount above at any ABSA cash accepting ATM, ABSA branch or via online payment</p>' +
            '<ol>' +
            '<li>Account number: 4088992530</li>' +
            '<li>Branch: 632005</li>' +
            '<li>Use <strong>' + User.user_link.cellphone + '</strong> as reference</li>' +
            '</ol>' +
            '<p>Once your money has cleared you will be notified via SMS that your policy is active!</p>' +
            '</div>' +
            '</div>' +
            '<div class="row" style="margin-bottom:10px;">' +
            '<div class="col-100"><a href="javascript:MakePayment(\'\', ' + value + ', \'atm\');" class="button button-fill bg-white text-purple uppercase">Proceed</a></div>' +
            '</div>' +
            '<div class="row" style="margin-bottom:10px;">' +
            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup button button-fill bg-white text-purple uppercase">Cancel</a></div>' +
            '</div>' +
            '</div>' +
            '</div>'
    }
    else {
        popupHTML = '<div class="popup bg-purple">' +
            '<div class="content-block text-white">' +
            '<h2 class="text-center text-white">ATM Deposits</h2>' +
            '<div class="row" style="margin-bottom:10px;">' +
            '<div class="col-100">' +
            '<p>Please deposit an amount at any ABSA cash accepting ATM, ABSA branch or via online payment</p>' +
            '<ol>' +
            '<li>Account number: 4088992530</li>' +
            '<li>Branch: 632005</li>' +
            '<li>Use <strong>' + User.user_link.cellphone + '</strong> as reference</li>' +
            '</ol>' +
            '<p>Once your money has cleared you will be notified by SMS after which your wallet will be topped up!</p>' +
            '</div>' +
            '</div>' +
            '<div class="row" style="margin-bottom:10px;">' +
            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup button button-fill bg-white text-purple uppercase">Close</a></div>' +
            '</div>' +
            '</div>' +
            '</div>'
    }

    myApp.popup(popupHTML);
}

function OpenMyInsurAppPayment(value) {
    
    
    $$.post(services + "/content/content", JSON.stringify({token: User.token, content: 'myinsurapp_popup', app: 'insurapp'}), function(response) {
        var result = JSON.parse(response);
        
        
        var innerHtml = result.data.copy.replace('[policy_number]', CurrentPolicyNumber).replace('[policy_number]', CurrentPolicyNumber).replace('[premium]', CurrentPolicyPremium);
        var popupHTML = '<div class="popup bg-pink text-white">'+
                        '<div class="content-block text-white">'+
                          '<h2 class="text-center text-white"><img src="assets/img/logo-top.png" style="width: 70%;" /></h2>'+
                          '<div class="row" style="margin-bottom:10px;">'+
                            '<div class="col-100 text-center">' + innerHtml +
                            '</div>'+
                          '</div>'+
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="javascript:MakePayment(\'\', ' + CurrentPolicyPremium + ', \'myinsurapp\');" class="close-popup button button-fill bg-white text-purple uppercase">Proceed</a></div>'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup button button-fill bg-white text-purple uppercase">Close</a></div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
    });
    
     
}

function OpenATMDeposit() {
    var popupHTML = '<div class="popup">'+
                        '<div class="content-block text-black">'+
                          '<h2 class="text-center">ATM Deposits</h2>'+
                          '<div class="row" style="margin-bottom:10px;">'+
                            '<div class="col-100">' +
                            '<p>In registering your account, your cell number acts as an eWallet. Alternatively, you can pay for orders by cash on delivery.</p>'+
                            '<p>To deposit:</p>'+
                            '<ol>'+
                            '<li>Go to an ABSA ATM, ABSA Branch Teller or use EFT. Note deposits via a Teller are charged at R20, whilst all other deposits are charged at R5.</li>'+
                            '<li>Input your cell number as a reference and use account number 4088992530</li>'+
                            '<li>Your account will reflect the deposit within 15 minutes.</li>'+
                            '<li>Once the funds have reflected into your  account, you can begin trading.</li>'+
                            '</ol>'+
                            '</div>'+
                          '</div>'+
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup text-red text-1x uppercase">Close</a></div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
}

function OpenMasterPass() {
    var popupHTML = '<div class="popup">'+
                        '<div class="content-block text-black">'+
                          '<h2 class="text-center">Masterpass</h2>'+
                          '<div class="row" style="margin-bottom:10px;">'+
                            '<div class="col-100 text-center">' +
                            '<p>Coming Soon</p>'+
                            '</div>'+
                          '</div>'+
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup text-red text-1x uppercase">Close</a></div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
}

function LoadMyPolicies() {
    //do nothing
}

function LoadClaimConfirmationPage(policyNumber, skip) {
        
    skip = (skip == "true");
    
    $$.post(services + "/insurapp/policy_search", JSON.stringify({token: User.token, policy_number: policyNumber}), function(response) {
        var result = JSON.parse(response);

        myApp.hidePreloader();

        if(result.success) { 
            PolicyApplicationObject = []; 

            PolicyApplicationObject.policy_number = policyNumber;
            PolicyApplicationObject.product_id = result.data.policies.ins_prod_id;
            PolicyApplicationObject.premium = result.data.policies.premium;
            PolicyApplicationObject.first_name = result.data.policies.first_name;
            PolicyApplicationObject.last_name = result.data.policies.last_name;
            PolicyApplicationObject.sa_id = result.data.policies.sa_id;
            PolicyApplicationObject.dob = result.data.policies.dob;
            PolicyApplicationObject.tel_cell = result.data.policies.tel_cell;
            PolicyApplicationObject.email_address = result.data.policies.email_address;
            PolicyApplicationObject.postal_code = result.data.policies.postal_code;
            PolicyApplicationObject.beneficiary_name = result.data.policies.beneficiary_name;
            PolicyApplicationObject.beneficiary_sa_id = result.data.policies.beneficiary_sa_id;
            PolicyApplicationObject.token = User.token;
            PolicyApplicationObject.product_data = new Object();
            PolicyApplicationObject.product_data.loan_term = result.data.policies.data.loan_term;            
            PolicyApplicationObject.language = result.data.policies.language;
            
            CurrentClaimDocumentsRequired = result.data.policies.required_documents;
            CurrentClaimDocumentsCompleted = result.data.policies.claim_documents;

            CurrentProduct.name = result.data.policies.product_name;
            CurrentPolicyNumber = policyNumber;

            CurrentClaimID = 0;

            $("#ClaimProduct_Name").html(result.data.policies.product_name);
            $("#ClaimProduct_PolicyNumber").html(policyNumber);

            $("#ClaimForm [name='policy_number']").val(policyNumber);
            $("#ClaimForm [name='product']").val(result.data.policies.ins_prod_id);
            
            if(skip) {
                window.setTimeout(function() {
                    mainView.router.loadPage("claim_photo.html");
                }, 500);
            }
        }
        else {
            CheckReturnMessage(result.message);
        }

    }, function(error) {
        ShowNotification("There has been an error, please try again.");
    });
}

function ClaimStep1Save() {
    var formData = myApp.formToData('#ClaimForm');
    var valid = true;
    
    if(formData.first_name == '') {
        valid = false;
        ShowNotification('Please enter your first name');
    }
    else if(formData.last_name == '') {
        valid = false;
        ShowNotification('Please enter your last name');
    }
    else if(formData.id_number == '') {
        valid = false;
        ShowNotification('Please enter your ID number');
    }
    else if(!ValidateIDNumber(formData.id_number)) {
        valid = false;
        ShowNotification("Please fill in a valid South African ID number");
    }
    else if(formData.cellphone == '') {
        valid = false;
        ShowNotification('Please enter cellphone number');
    }
    else if(formData.email == "") {
        valid = false;
        ShowNotification("Please fill in your email address");
    }
    else if(formData.email.indexOf("@") < 0 || formData.email.indexOf(".") < 0) {
        valid = false;
        ShowNotification("Please enter a valid email address");
    }
    
    if(valid) {

        formData.token = User.token;


        $$.post(services + "/insurapp/submit_claim", JSON.stringify(formData), function(response2) {
            var result2 = JSON.parse(response2);


            if(result2.success) {

                CurrentClaimID = result2.data.claim_id;

                //PerformClaim(policyNumber);
                mainView.router.loadPage("claim_photo.html");
            }
            else {
                CheckReturnMessage(result2.message);
            }   
        },
        function (value) {
            ShowNotification("There has been an error, please try again.");
        });
    }
}

function LoadClaimPhotoScreen() {
    
    var removed = false;
    
    $("#ClaimPhoto_PhotoDisplay").hide();
    $("#ClaimPhoto_NextButton").hide();
    $("#ClaimPhoto_NextButton").hide(); 
    
    if(CurrentClaimDocumentsRequired.length > 0) {
        
        if(CurrentClaimDocumentsCompleted.length > 0) {
            for(var i = 0; i < CurrentClaimDocumentsCompleted.length; i++) {
                if(CurrentClaimDocumentsRequired.length > 0) {
                    
                    if(CurrentClaimDocumentsCompleted[i].type == CurrentClaimDocumentsRequired[0].type) {
                        CurrentClaimDocumentsRequired.splice(0, 1);
                        removed = true;
                        break;
                    }
                }
            }
        }
        
        if(removed) {
            LoadClaimPhotoScreen();
        }
        else {
            var curr = CurrentClaimDocumentsRequired[0]; 

            CurrentClaimPhotoType = CurrentClaimDocumentsRequired[0].type;

            $("#ClaimPhoto_Title").html(CurrentClaimDocumentsRequired[0].name);
            $("#ClaimPhoto_Description").html(CurrentClaimDocumentsRequired[0].description);
            $("#ClaimPhoto_Name").html(CurrentProduct.name);
            $("#ClaimPhoto_PolicyNumber").html(PolicyApplicationObject.policy_number);
        }
        
    }
    else {
        window.setTimeout(function() {
            mainView.router.loadPage('claim_success.html');
        }, 500);
    }
}

function LoadClaimSuccess() {
    $("#ClaimSuccess_Name").html(CurrentProduct.name);
    $("#ClaimSuccess_PolicyNumber").html(PolicyApplicationObject.policy_number);
}

function ClaimOnPolicy(policyNumber) {
    myApp.modal({
        title:  'insurapp',
        text: "Are you sure you wish to claim on this policy '" + policyNumber + "'?",
        buttons: [
            {
                text: 'Yes',
                onClick: function() {

                    mainView.router.loadPage('claim.html?policyNumber=' + policyNumber + '&skip=false');
                }
            },{ 
                color: 'red',
                text: 'No'
            }
        ]
    });
}

function LoadMyClaims() {
    $$.post(services + "/insurapp/get_claims", JSON.stringify({token: User.token}), function(response3) {

        var result3 = JSON.parse(response3);

        if(result3.success) {

            var html = '';
            
            CurrentClaims = result3.data.claims;
 
            if(CurrentClaims.length > 0) {
                for(var i = 0; i < CurrentClaims.length; i++) {
                    html += '<li>';
                    html += '  <a href="javascript:OpenClaimDetail('+i+');" class="item-link item-content">';
                    html += '    <div class="item-inner">';
                    html += '      <div class="item-title">' + CurrentClaims[i].policy_number + '</div>';
                    html += '      <div class="item-after"><span class="badge bg-blue">'+CurrentClaims[i].status_name+'</span></div>';
                    html += '    </div>';
                    html += '  </a>';
                    html += '</li>';
                }
            }
            else {            
                html += '<li>';
                html += '  <div class="item-content">';
                html += '    <div class="item-inner">';
                html += '      <div class="item-title">You have not made any claims</div>';
                html += '    </div>';
                html += '  </div>';
                html += '</li>';
            }
            
            $("#MyClaimsHTML").html(html);
        }
        else {
            CheckReturnMessage(result3.message);
        }

    }, function(error1) {
        ShowNotification("There has been an error, please try again.");
    });
}

function OpenClaimDetail(index) {
    
    $$.post(services + "/insurapp/get_product/" + CurrentClaims[index].product_id, JSON.stringify({token: User.token}), function(response1) {
        var result1 = JSON.parse(response1);

        if(result1.success) {
            
            var documents = '';
    
            for(var i = 0; i < CurrentClaims[index].required_documents.length; i++) {
                documents += '<li><div class="item-content"><div class="item-inner"><div class="item-title">' + CurrentClaims[index].required_documents[i].name + '</div></div></div></li>';
            }        

            var popupHTML = '<div class="popup">'+
                        '<div class="text-black">'+
                          '<h2 class="text-center text-purple">'+result1.data.product.name+'</h2>'+
                          '<p class="text-center">'+CurrentClaims[index].policy_number+'</p>'+
                          
                          ' <div class="list-block">' +
                          ' <ul>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">First name</div>' +
                          '           <div class="item-input">' +
                          '              ' + CurrentClaims[index].first_name + '' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Last name</div>' +
                          '           <div class="item-input">' +
                          '              ' + CurrentClaims[index].last_name + '' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">ID Number</div>' +
                          '           <div class="item-input">' +
                          '              ' + CurrentClaims[index].id_number + '' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Claim date</div>' +
                          '           <div class="item-input">' +
                          '              ' + CurrentClaims[index].createdate + '' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          ' </ul>' +
                          ' </div>' +
                          '<h3 class="text-center text-blue">Documents required</h3>'+
                          ' <div class="list-block">' +
                          ' <ul>' + documents + ' </ul>' +
                          ' </div>' +
                            '<div class="content-block">' + 
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+  
                            '<div class="col-100"><a href="claim.html?policyNumber=' + CurrentClaims[index].policy_number + '&skip=true" class="close-popup button button-big button-fill bg-pink uppercase">Continue claim</a></div>'+                          
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup text-red text-1x uppercase">Close</a></div>'+
                          '</div>'+        
                            '</div>' + 
                        '</div>'+
                      '</div>'
            myApp.popup(popupHTML); 
            
            //claim.html?policyNumber=' + policyNumber + '&skip=false
            
        }
        else {
            CheckReturnMessage(result1.message);
        }   
    },
    function (value) {
        ShowNotification("There has been an error, please try again.");
    });

}

function PerformClaim(policyNumber) {
    $$.post(services + "/insurapp/policy_search", JSON.stringify({token: User.token, policy_number: policyNumber}), function(response) {
        var result = JSON.parse(response);

        myApp.hidePreloader();

        if(result.success) { 
            PolicyApplicationObject = []; 

            PolicyApplicationObject.policy_number = policyNumber;
            PolicyApplicationObject.product_id = result.data.policies.ins_prod_id;
            PolicyApplicationObject.premium = result.data.policies.premium;
            PolicyApplicationObject.first_name = result.data.policies.first_name;
            PolicyApplicationObject.last_name = result.data.policies.last_name;
            PolicyApplicationObject.sa_id = result.data.policies.sa_id;
            PolicyApplicationObject.dob = result.data.policies.dob;
            PolicyApplicationObject.tel_cell = result.data.policies.tel_cell;
            PolicyApplicationObject.email_address = result.data.policies.email_address;
            PolicyApplicationObject.postal_code = result.data.policies.postal_code;
            PolicyApplicationObject.beneficiary_name = result.data.policies.beneficiary_name;
            PolicyApplicationObject.beneficiary_sa_id = result.data.policies.beneficiary_sa_id;
            PolicyApplicationObject.token = User.token;
            PolicyApplicationObject.product_data = new Object();
            PolicyApplicationObject.product_data.loan_term = result.data.policies.data.loan_term;            
            PolicyApplicationObject.language = result.data.policies.language;

            CurrentProduct.name = result.data.policies.product_name;
            CurrentPolicyNumber = policyNumber;

            CurrentClaimID = 0;

            $$.post(services + "/insurapp/get_product/" + result.data.policies.ins_prod_id, JSON.stringify({token: User.token}), function(response1) {
                var result1 = JSON.parse(response1);

                if(result1.success) {


                    $$.post(services + "/insurapp/get_claims", JSON.stringify({token: User.token}), function(response3) {

                        var result3 = JSON.parse(response3);

                        if(result3.success) {

                            CurrentClaims = result3.data.claims;
                            CurrentClaims = result3.data.claims;

                            for(var i = 0; i < CurrentClaims.length; i++) {
                                if(CurrentClaims[i].policy_number == policyNumber && CurrentClaims[i].status_id == 1) {

                                    CurrentClaimID = CurrentClaims[i].id;
                                    CurrentClaim = CurrentClaims[i];
                                    break;
                                }
                            }

                            if(CurrentClaimID > 0) {
                                //Redirect to claim page
                                alert('FOund claim == ' + CurrentClaimID);
                            }
                            else {
                                CurrentProduct = result1.data.product;

                                //mainView.router.loadPage('product_renew.html');

                                var theValues = {
                                    token: User.token,
                                    policy_number: policyNumber,
                                    id_number: result1.data.user.customer.id_number,
                                    cellphone: result1.data.user.customer.cellphone,
                                    email: result1.data.user.customer.email,
                                    product: result1.data.product.name,
                                    first_name: result1.data.user.customer.first_name,
                                    last_name: result1.data.user.customer.last_name
                                }


                                $$.post(services + "/insurapp/submit_claim", JSON.stringify(theValues), function(response2) {
                                    var result2 = JSON.parse(response2);


                                    if(result2.success) {

                                        CurrentClaimID = result2.data.claim_id;

                                        PerformClaim(policyNumber);

                                    }
                                    else {
                                        ShowNotification(result2.message);
                                    }   
                                },
                                function (value) {
                                    ShowNotification("There has been an error, please try again.");
                                });
                            }

                        }
                        else {
                            CheckReturnMessage(result3.message);
                        }

                    }, function(error1) {
                        ShowNotification("There has been an error, please try again.");
                    });


                }
                else {
                    CheckReturnMessage(result1.message);
                }   
            },
            function (value) {
                ShowNotification("There has been an error, please try again.");
            });


        }
        else {
            CheckReturnMessage(result.message);
        }

    }, function(error) {
        ShowNotification("There has been an error, please try again.");
    });
}

function CancelPolicy(policyNumber) {
    myApp.modal({
        title:  'insurapp',
        text: "Are you sure you wish to cancel your policy '" + policyNumber + "'?",
        buttons: [
            {
                text: 'Yes',
                onClick: function() {
                    $$.post(services + "/insurapp/cancel_policy", JSON.stringify({token: User.token, policy_number: policyNumber}), function(response) {
                        var result = JSON.parse(response);

                        myApp.hidePreloader();

                        if(result.success) {
                            LoadMyPolicies();
                        }
                        else {
                            CheckReturnMessage(result.message);
                        }

                    }, function(error) {
                        ShowNotification("There has been an error, please try again.");
                    });
                }
            },{
                color: 'red',
                text: 'No'
            }
        ]
    });
}

function RenewPolicy(policyNumber) {
    
    myApp.modal({
        title:  'insurapp',
        text: "You are about to renew policy '" + policyNumber + "'. Are you sure you wish to continue?",
        buttons: [
            {
                text: 'Yes',
                onClick: function() {
                    window.setTimeout(function() {
                        
                        $$.post(services + "/insurapp/policy_search", JSON.stringify({token: User.token, policy_number: policyNumber}), function(response) {
                            var result = JSON.parse(response);

                            myApp.hidePreloader();

                            if(result.success) { 
                                PolicyApplicationObject = new Object(); 

                                PolicyApplicationObject.policy_number = policyNumber;
                                PolicyApplicationObject.product_id = result.data.policies.ins_prod_id;
                                PolicyApplicationObject.premium = result.data.policies.premium;
                                PolicyApplicationObject.first_name = result.data.policies.first_name;
                                PolicyApplicationObject.last_name = result.data.policies.last_name;
                                PolicyApplicationObject.sa_id = result.data.policies.sa_id;
                                PolicyApplicationObject.dob = result.data.policies.dob;
                                PolicyApplicationObject.tel_cell = result.data.policies.tel_cell;
                                PolicyApplicationObject.email_address = result.data.policies.email_address;
                                PolicyApplicationObject.postal_code = result.data.policies.postal_code;
                                PolicyApplicationObject.beneficiary_name = result.data.policies.beneficiary_name;
                                PolicyApplicationObject.beneficiary_sa_id = result.data.policies.beneficiary_sa_id;
                                PolicyApplicationObject.token = User.token;
                                PolicyApplicationObject.product_data = new Object();
                                PolicyApplicationObject.product_data.loan_term = result.data.policies.data.loan_term;            
                                PolicyApplicationObject.language = result.data.policies.language;

                                CurrentProduct.name = result.data.policies.product_name;
                                CurrentPolicyNumber = policyNumber;

                                CurrentSignature = result.data.policies.product_name.picture;
                                CurrentPicture = result.data.policies.product_name.signature;

                                $$.post(services + "/insurapp/get_product/" + result.data.policies.ins_prod_id, JSON.stringify({token: User.token}), function(response1) {
                                    var result1 = JSON.parse(response1);


                                    if(result1.success) {

                                        CurrentProduct = result1.data.product;
                                        
                                        mainView.router.loadPage('product_renew.html');
                                    }
                                    else {
                                        CheckReturnMessage(result1.message);
                                    }   
                                },
                                function (value) {
                                    ShowNotification("There has been an error, please try again.");
                                });
                                
                                
                            }
                            else {
                                CheckReturnMessage(result.message);
                            }

                        }, function(error) {
                            ShowNotification("There has been an error, please try again.");
                        });
                        
                    }, 600);
                }
            }, 
            {
                text: 'No'
            }
        ]
    }); 
}

function LoadProductRenewPage() {
    
    $("#ProductRenew_Name").html(CurrentProduct.name);
    $("#ProductRenew_Description").html(CurrentProduct.description);
    $("#ProductRenew_Premium").html("<strong>Premium:</strong> R" + CurrentProduct.premium);
    $("#ProductRenew_Term").html("<strong>Term:</strong> " + CurrentProduct.terms + " months");
    
    
    var link = '';
    
    if(CurrentProduct.type.toLowerCase().indexOf("cellphone") > -1) {
        link = 'cellphone_product_pay.html';
    }
    else if(CurrentProduct.type.toLowerCase().indexOf("travel") > -1) {
        link = 'travel_product_pay.html';
    }
    else if(CurrentProduct.type.toLowerCase().indexOf("funeral") > -1) {
        link = 'funeral_product_pay.html';
    }
    
    $("#PolicyRenew_RenewButton").attr('href', link);
    
}

function ViewPolicy(policyNumber) {
    $$.post(services + "/insurapp/policy_search", JSON.stringify({token: User.token, policy_number: policyNumber}), function(response) {
        var result = JSON.parse(response);
        
        if(result.success) {
            var popupHTML = '<div class="popup">'+
                        '<div class="content-block text-black">'+
                          '<h2 class="text-center">' + policyNumber + '</h2>'+
                          '<small class="text-center">' + policyNumber + '</small>'+
                          ' <div class="list-block">' +
                          ' <ul>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Name</div>' +
                          '           <div class="item-input">' +
                          '              <input type="text" placeholder="As it appears on the card" name="card_name">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Card #</div>' +
                          '           <div class="item-input">' +
                          '              <input type="number" placeholder="e.g. 1111111111111111" name="card_number">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Expiry</div>' +
                          '           <div class="item-input">' +
                          '              <input type="text" placeholder="xx-xxxx" name="expiry" readonly>' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">CVV</div>' +
                          '           <div class="item-input">' +
                          '              <input type="number" placeholder="e.g. 123" name="cvv">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          ' </ul>' +
                          ' </div>' +
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup text-red text-1x uppercase">Close</a></div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
        }
        else {
            CheckReturnMessage(result.message);
        }
        
    }, function(error) {
        ShowNotification("There has been an error, please try again.");
    });
}

function StartBuyFuneralCover() {
    $("#FuneralProduct_Meta").slideUp();
    $("#FuneralProduct_Form").slideDown();
}

function LoadTravelProducts() {
    $$.post(services + "/insurapp/get_products/5", JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);    

        if(result.success) {
            
            if(result.message.indexOf("not have permission") > -1) {
                myApp.alert(result.message, 'insurapp', function () {
                    mainView.router.loadPage('landing.html');
                });
            }
            else {
                var html = '';
            
                for(var i = 0; i < result.data.products.length; i++) {
                    html += '<li>';
                    html += '  <a href="travel_product.html?id=' + result.data.products[i].id + '" class="item-link item-content">';
                    html += '    <div class="item-inner">';
                    html += '      <div class="item-title">' + result.data.products[i].name + '</div>';
                    //html += '      <div class="item-after"><span class="badge bg-blue">R29.99+</span></div>';
                    html += '    </div>';
                    html += '  </a>';
                    html += '</li>';
                }

                $("#TravelProductOptions").html(html);
            }
            
        }
        else {
            CheckReturnMessage(result.message);
        }
    }, function(error) {
        
    });
}

function LoadTravelProduct(id) {
    $$.post(services + "/insurapp/get_product/" + id, JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);
    

        if(result.success) {
            
            CurrentProduct = result.data.product;
            
            $("#TravelProduct_Name").html(CurrentProduct.name);
            $("#TravelProduct_Description").html(CurrentProduct.description);
            
            var settings = CurrentProduct.settings;
            
            var term_min = 0;
            var term_max = 0;
            var term_unit = "";
            var currency = "";
            
            for(var i = 0; i < settings.length; i++) {
                if(settings[i].name == 'term_min') {
                    term_min = settings[i].value;
                }
                if(settings[i].name == 'term_max') {
                    term_max = settings[i].value;
                }
                if(settings[i].name == 'term_unit') {
                    term_unit = settings[i].value;
                }
                if(settings[i].name == 'currency') {
                    currency = settings[i].value;
                }
            }
                        
            $("#TravelProduct_Currency").val(currency);
            $("#TravelProduct_Units").val(term_unit);
            
            var myCalendar = myApp.calendar({
                input: '#TravelProduct_Dates',
                rangePicker: true,
                minDate: new Date(),
                closeOnSelect: true,
                onClose: function(p) {
                    
                    var dates = $("#TravelProduct_Dates").val().split(' - ');
                    var start = moment(dates[0], "YYYY-MM-DD");
                    var end = moment(dates[1], "YYYY-MM-DD");
                    var days = end.diff(start, 'days');
                    
                    $("#TravelProduct_Form [name='start']").val(dates[0]);
                    $("#TravelProduct_Form [name='end']").val(dates[1]);                    
                    $("#TravelProduct_Form [name='term']").val(days);
                    
                }
            });
            
        }
        else {
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {

    });
}

function GetTravelProductQuote() {
    var start = $("#TravelProduct_Form [name='start']").val();
    var end = $("#TravelProduct_Form [name='end']").val();
    var term = $("#TravelProduct_Form [name='term']").val();
    var valid = true;
    
    if(term == "" || term < 1) {
        valid = false;
    }
    
    if(valid)
    {
        CurrentPolicyTerm = term;
    
        var dateOfBirth = moment(User.user_link.id_number.substr(0, 6), "YYMMDD");

        var values = {token: User.token, term: term, start: start, end: end, dob: dateOfBirth.format('YYYY-MM-DD')};

        $$.post(services + "/insurapp/get_product_premium/" + CurrentProduct.id, JSON.stringify(values), function(response) {
            var result = JSON.parse(response);
 
            if(result.success) {
                $(".modal-overlay").show();
                myApp.modal({
                    title: 'insurapp',
                    text: 'Your premium will be ' + $("#TravelProduct_Currency").val() + '' + parseFloat(result.data.premium).toFixed(2) + ' for ' + term + ' ' + $("#TravelProduct_Units").val() + '. Would you like to buy this?',
                    buttons: [
                    {
                        text: 'Yes',
                        onClick: function() {
                            CurrentPolicyPremium = result.data.premium;
                            mainView.router.loadPage('travel_product_confirm.html?premium=' + result.data.premium);
                        }
                    },
                    {
                        text: 'No',
                        onClick: function() {
                        }
                    }]
                });

            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {

        });
    }
    else {
        ShowNotification("Please select your cover period");
    }
    
}

function LoadTravelProductConfirmation(premium) {
    $("#TravelProductConfirm_Name").html(CurrentProduct.name);
    $("#TravelProductConfirm_Back").attr('href', 'travel_product.html?id=' + CurrentProduct.id);
    
    $("#TravelCoverStep1Form [name='product_id']").val(CurrentProduct.id);
    $("#TravelTravelCoverStep1Form [name='premium']").val(premium);
    
    var values = {token: User.token, customer_idcell: User.user_link.id_number};
    
    $$.post(services + "/insurapp/customer_search/" + CurrentProduct.id, JSON.stringify(values), function(response) {
        var result = JSON.parse(response);
    
        if(result.success) {
            if(result.data.status == 0) { //NEW CUSTOMER
                $("#TravelCoverStep1Form [name='first_name']").val(User.user_link.first_name);
                $("#TravelCoverStep1Form [name='last_name']").val(User.user_link.last_name);
                $("#TravelCoverStep1Form [name='sa_id']").val(User.user_link.id_number);
                $("#TravelCoverStep1Form [name='dob']").val(moment(User.user_link.id_number.substr(0, 6), "YYMMDD").format("YYYY-MM-DD"));
                $("#TravelCoverStep1Form [name='tel_cell']").val(User.user_link.cellphone);
                $("#TravelCoverStep1Form [name='email_address']").val(User.user_link.email);
            }
            else {
                $("#TravelCoverStep1Form [name='first_name']").val(result.data.customer[0].first_name);
                $("#TravelCoverStep1Form [name='last_name']").val(result.data.customer[0].last_name);
                $("#TravelCoverStep1Form [name='sa_id']").val(result.data.customer[0].sa_id);
                $("#TravelCoverStep1Form [name='dob']").val(result.data.customer[0].dob);
                $("#TravelCoverStep1Form [name='tel_cell']").val(result.data.customer[0].tel_cell);
                $("#TravelCoverStep1Form [name='email_address']").val(result.data.customer[0].email_address);
                $("#TravelCoverStep1Form [name='postal_code']").val(result.data.customer[0].postal_code);
                $("#TravelCoverStep1Form [name='beneficiary_name']").val(result.data.customer[0].beneficiary_name);
                $("#TravelCoverStep1Form [name='beneficiary_sa_id']").val(result.data.customer[0].beneficiary_sa_id);
            }
        }
        else {
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {

    });
}

function TravelProductStep1Save() {
    var formData = myApp.formToData('#TravelCoverStep1Form');
    var valid = true;
    
    if(formData.postal_code == '') {
        valid = false;
        ShowNotification('Please enter your postal code');
    }
    else if(formData.beneficiary_name == '') {
        valid = false;
        ShowNotification('Please enter the beneficiary name');
    }
    else if(formData.beneficiary_sa_id == '') {
        valid = false;
        ShowNotification('Please enter the beneficiaries cellphone number');
    }
    
    if(valid) {
        var values = {identifier: formData.sa_id, token: User.token};    
    
        $$.post(services + "/insurapp/get_policy_number/" + CurrentProduct.id, JSON.stringify(values), function(response) {
            var result = JSON.parse(response);

            if(result.success) { 

                preloaderText = "Updating policy...";

                formData.token = User.token;
                var submitValues = formData;

                CurrentPolicyNumber = result.data.policy_number;

                window.setTimeout(function() {
                    PolicyApplicationObject = submitValues;
                    
                    var product_data = {
                        term: CurrentPolicyTerm
                    };
                    
                    PolicyApplicationObject.product_data = product_data;
                    
                    $$.post(services + "/insurapp/update_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
                        var result1 = JSON.parse(response1);
                        ResetPreloader();

                        if(result1.success) {
                            if(parseInt(CurrentProduct.dependants) > 0) {
                                mainView.router.loadPage('travel_product_dependants.html');
                            }
                            else {
                                mainView.router.loadPage('travel_product_terms.html');
                            }
                        }
                        else {
                            CheckReturnMessage(result1.message);
                        }   
                    },
                    function (value1) {

                    });                
                }, 800);
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {

        });
    }
}

function LoadTravelProductDependants() {
    $("#TravelProductDependant_Name").html(CurrentProduct.name);
    $("#TravelProductDependant_PolicyNumber").html(CurrentPolicyNumber);
    $("#TravelProductDependant_Back").attr('href', 'travel_product_confirm.html?premium=' + CurrentPolicyPremium);
    
    $("#TravelProductDependant_Counter").html('0 / ' + CurrentProduct.dependants);
    
    var values = {token: User.token};
    
    window.setTimeout(function() {
        $$.post(services + "/insurapp/get_dependants/" + CurrentPolicyNumber, JSON.stringify(values), function(response) {
            var result = JSON.parse(response);

            if(result.success) {
                CurrentProductDependants = result.data.dependants;
                $("#TravelProductDependant_Counter").html(CurrentProductDependants.length + ' / ' + CurrentProduct.dependants);

                //POPULATE LIST HERE
                var html = '';

                for(var i = 0; i < CurrentProductDependants.length; i++) {
                    html += '<li>';
                    html += '  <a href="javascript:TravelDependantActionSheet('+ CurrentProductDependants[i].id +');" class="item-link item-content">';
                    html += '    <div class="item-inner">';
                    html += '      <div class="item-title">' + CurrentProductDependants[i].first_name + ' ' + CurrentProductDependants[i].last_name + '</div>';
                    html += '      <div class="item-after"><span class="badge bg-blue">' + CurrentProductDependants[i].type + '</span></div>';
                    html += '    </div>';
                    html += '  </a>';
                    html += '</li>';
                }

                if(parseInt(result.data.available_slots) > 0) {
                    html += '<li>';
                    html += '  <a href="javascript:AddNewTravelDependantPopup();" class="item-link item-content">';
                    html += '    <div class="item-inner">';
                    html += '      <div class="item-title Montserrat-Bold text-blue">+ Add new Dependant</div>';
                    html += '    </div>';
                    html += '  </a>';
                    html += '</li>';
                }

                $("#TravelProductDependants_Existing").html(html);
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {

        });
    }, 300);
    
    
}

function AddNewTravelDependantPopup() {   
    
    var options = "";
    
    for(var i = 0; i < DependantTypes.length; i++) {
        options += '<option value="' + DependantTypes[i].toLocaleLowerCase() + '">' + DependantTypes[i] + '</option>';
    }        
    
    var popupHTML = '<div class="popup">'+
                        '<div class="text-black">'+
                          '<h2 class="text-center">Add new Dependant</h2>'+
                          '<p class="text-center">' + CurrentPolicyNumber + '</p>'+
                          
                          '<form id="AddDependantForm">' +
                          ' <div class="list-block">' +
                          ' <ul>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">First name</div>' +
                          '           <div class="item-input">' +
                          '              <input type="text" placeholder="" name="first_name">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Last name</div>' +
                          '           <div class="item-input">' +
                          '              <input type="text" placeholder="" name="last_name">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Date of Birth</div>' +
                          '           <div class="item-input">' +
                          '              <input type="text" placeholder="" name="dob"  readonly>' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li>' +
                          '       <div class="item-content">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-title label Montserrat-Bold">Relationship</div>' +
                          '           <div class="item-input">' +
                          '              <select name="type">' + options + '</select>' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          ' </ul>' +
                          ' </div>' +
                          '</form>' +
                            '<div class="content-block">' + 
                          '<div class="row" style="margin-top:30px; margin-bottom:10px;">'+
                            '<div class="col-100"><a href="javascript:SaveTravelDependant();" class="button button-big button-fill bg-pink uppercase">Save &amp; Close</a></div>'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup text-red text-1x uppercase">Close</a></div>'+
                          '</div>'+        
                            '</div>' + 
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
    
    
    var currYear = moment().year();
    
    var DayNumbers = [];
    var YearNumbers = [];
    
    for(var i = 1; i <= 31; i++) {
        DayNumbers.push(i);
    }
    for(var i = currYear; i >= (currYear - 74); i--) {
        YearNumbers.push(i);
    }

    var pickerDates = myApp.picker({
        input: '#AddDependantForm [name="dob"]',
        rotateEffect: true,
        cols: [
            {
                textAlign: 'left',
                values: DayNumbers
            },
            {
                values: ('January February March April May June July August September October November December').split(' ')
            },
            {
                textAlign: 'left',
                values: YearNumbers
            }
        ],
        formatValue: function (p, values, displayValues) {
            return values[0] + ' ' + values[1] + ' ' + values[2];
        },
    });      
}

function TravelDependantActionSheet(id) {
    var buttons = [
        {
            text: 'Remove Dependant',
            onClick: function () {
                
                var vals = {token: User.token, dependant_id: id}
                
                $$.post(services + "/insurapp/remove_dependant/" + CurrentPolicyNumber, JSON.stringify(vals), function(response) {
                    var result = JSON.parse(response);

                    if(result.success && !result.error) { 
                        window.setTimeout(function() {
                            LoadTravelProductDependants();
                        }, 300);
                    }
                    else {
                        CheckReturnMessage(result.message);
                    }   
                },
                function (value) {

                });
            }
        },
        {
            text: 'Cancel',
            color: 'red'
        },
    ];
    myApp.actions(buttons);
}

function SaveTravelDependant() {
    var formData = myApp.formToData('#AddDependantForm');
    var valid = true;
    
    if(formData.first_name == '') {
        valid = false;
        ShowNotification('Please enter a first name');
    }
    else if(formData.last_name == '') {
        valid = false;
        ShowNotification('Please enter a last name');
    }
    else if(formData.dob == '') {
        valid = false;
        ShowNotification('Please enter a date of birth');
    }
    else if(formData.type == '') {
        valid = false;
        ShowNotification('Please select a type of dependant');
    }
    
    if(valid) {
        formData.token = User.token;
    
        $$.post(services + "/insurapp/add_dependant/" + CurrentPolicyNumber, JSON.stringify(formData), function(response) {
            var result = JSON.parse(response);

            if(result.success && !result.error) { 
                window.setTimeout(function() {
                    LoadTravelProductDependants();
                    myApp.closeModal();
                }, 800);
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {

        });
    }
}

function LoadTravelProductTerms() {
    $("#TravelProductTerms_Name").html(CurrentProduct.name);
    $("#TravelProductTerms_PolicyNumber").html(CurrentPolicyNumber);
    
    var html = '';
    
    for(var i = 0; i < CurrentProduct.terms_audio.length; i++) {
        html += '<li>';
        html += '  <a href="javascript:StreamAudioFromUrl(\'' + audioLocation + CurrentProduct.terms_audio[i].file +'\', \'travel\', \'' + CurrentProduct.terms_audio[i].language + '\');" class="item-link item-content">';
        html += '    <div class="item-inner">';
        html += '      <div class="item-title">' + CurrentProduct.terms_audio[i].language + '</div>';
        html += '    </div>';
        html += '  </a>';
        html += '</li>';
    }
    
    $("#TravelProductTerms_Buttons").html(html);
}

function AcceptTermsTravel() {
    var formData = myApp.formToData('#TravelCoverStep3Form');
    var valid = true;
    
    
    
    if(PolicyApplicationObject.language == undefined) {
        valid = false;
        ShowNotification('Please chooose a language before continuing');
    }
    else if(formData.agreetoterms == "") {
        valid = false;
        ShowNotification('Please accept the terms and conditions to continue');
    }
    
    if(valid) {
        
        preloaderText = "Updating policy...";
        
        $$.post(services + "/insurapp/update_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
            var result1 = JSON.parse(response1);
            ResetPreloader();

            if(result1.success) {
                mainView.router.loadPage('travel_product_photo.html');
            }
            else {
                CheckReturnMessage(result1.message);
            } 
        },
        function (value1) {

        });  
    }
}

function LoadTravelPhotoScreen() {
    $("#TravelProductPhoto_Name").html(CurrentProduct.name);
    $("#TravelProductPhoto_PolicyNumber").html(CurrentPolicyNumber);
}

function LoadTravelSignScreen() {
    $("#TravelProductSign_Name").html(CurrentProduct.name);
    $("#TravelProductSign_PolicyNumber").html(CurrentPolicyNumber);
    
    var settings = CurrentProduct.settings;
            
    var currency = "";
    var term_unit = "";

    for(var i = 0; i < settings.length; i++) {
        if(settings[i].name == 'currency') {
            currency = settings[i].value;
        }
        if(settings[i].name == 'term_unit') {
            term_unit = settings[i].value;
        }
    }
    
    
    $("#TravelProductSign_Period").html(CurrentPolicyTerm + (term_unit != "" ? " (" + term_unit + ")" : ""));
    $("#TravelProductSign_Premium").html(currency + CurrentPolicyPremium);
    
    window.setTimeout(function() {
        var wrapper = document.getElementById("signature-pad");
        var canvas = wrapper.querySelector("canvas");    
        SigningCanvas = new SignaturePad(canvas, {
            backgroundColor: 'rgb(255, 255, 255)'
        });
    }, 800);
}

function LoadTravelPayScreen() {

    $("#TravelProductPay_Name").html(CurrentProduct.name);
    $("#TravelProductPay_PolicyNumber").html(CurrentPolicyNumber);
    $("#TravelProductPay_BackLink").attr('href', 'travel_product_confirm.html?premium=' + PolicyApplicationObject.premium);
    
    var html = '';
    
    $$.post(services + "/insurapp/get_payment_options/" + PolicyApplicationObject.product_id, JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);

        if(result.success) {             
            
            Wallet = result.data.wallets;
            
            for(var i = 0; i < result.data.payment_options.length; i++) {
                html += '<li>';
                html += '  <a href="javascript:SelectPaymentMethod(\'' + result.data.payment_options[i] + '\', \'travel\');" class="item-link item-content">';
                html += '    <div class="item-inner">';
                html += '      <div class="item-title">' + result.data.payment_options[i] + '</div>';
                html += '    </div>';
                html += '  </a>';
                html += '</li>';
            }

            $("#TravelProductPay_Existing").html(html);
            
        }
        else {
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {

    });
    
}

function LoadTravelPaySuccess() {
    $("#TravelProductSuccess_Name").html(CurrentProduct.name);
    $("#TravelProductSuccess_PolicyNumber").html(CurrentPolicyNumber);
}


function StartBuyTravelCover() {
    $("#TravelProduct_Meta").slideUp();
    $("#TravelProduct_Form").slideDown();
}

function LoadCellphoneInsuranceProducts(id) {
    $('#customer_idnumber').hide()
    $("#proceed").hide()
    var html = ''
    html += '<option value="">---Select a cellphone make---</option>'
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', User.token)
        },
        complete: function () {
           myApp.hidePreloader()
        },
        url: services+'/insurapp/get_products/6', 
        type: 'post',
        data:{'id':id},
        success: function (result) {
            if(result.success) {
        
                var device = result.data.products
                for(var i = 0; i < device.length; i++) {
                    html += '<option value="'+ device[i].id +'">'+ device[i].name +"</option>"
                }

                $("#CellphoneProductInsuranceOptions").html(html);

            }

        },
        error: function (data) {
      
        }
    });

}

function LoadCellphoneProducts() {
    $("#proceed").hide()
    $('#customer_idnumber').hide()
    myApp.showPreloader("Loading cellphone products....");
    var html = ''
    html += '<option value="">---Select a cellphone make---</option>'
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', User.token)
        },
        complete: function () {
           myApp.hidePreloader()
        },
        url: services+'/insurapp/get_ins_device_makes', 
        type: 'get',
        success: function (result) {
            if(result.success) {
                var device = result.data.device_makes
                for(var i = 0; i < device.length; i++) {
                    html += '<option value="'+ device[i].id +'">'+ device[i].make_name +"</option>"
                }

                $("#CellProductOptions").html(html);
                

            }

        },
        error: function (data) {
      
        }
    });

}
function calculateCellphonePremium(){
    var valid = true
    if($("#CellphoneModelProductOptions").val() == ''){
        valid = false
        myApp.alert("Cellphone make and model is required")
        return false
    }

    if(valid){
        myApp.showPreloader("Calculating premium...")
        User = JSON.parse(localStorage.getItem("User"));
    
        var date = new Date();
        var year = date.getFullYear() + 39
        var dob = year+"-02-02";
        var values = {
            token: User.token,
            term: $("#CellphoneProduct_CoverPeriod").val(),
            amount: $("#CellphoneProduct_CoverPeriodAmount").val(),
            dob: dob,
            model_id: $("#CellphoneModelProductOptions").val()
        };
        currentModelId = $("#CellphoneModelProductOptions").val()
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', User.token)
            },
            complete: function () {
                $(".loader-overlay").hide();
                $(".modal-overlay").hide();
                $('.premium-value').show();
            myApp.hidePreloader()
            },
            url: services+'/insurapp/get_product_premium/'+CurrentProduct.id, 
            type: 'post',
            data:JSON.stringify(values),
            success: function (result) {
                if(result.success) {
                    console.log("premium - "+result.data.premium)
                    if (result.data.premium > 0) {
                       var product_data = {
                            loan_amount: $("#CellphoneProduct_CoverPeriodAmount").val(),
                            loan_term: $("#CellphoneProduct_CoverPeriod").val(),
                            model_id: $("#CellphoneModelProductOptions").val()
                        }
                        
                        CurrentPolicyPremium = result.data.premium

                        PolicyApplicationObject.product_data = product_data
                        $("#CellphoneProductPremium").html("R" + Number(result.data.premium).toFixed(2));
                        $("#cellphone_loan_premium").val(result.data.premium);
                        $('#customer_idnumber').show()
                        $("#proceed").show()
                    }
                }
            },
            error: function (data) {
                myApp.alert("Oops something went wrong, Please try again later.")
            }
        })
    }
      

}

function cellphonePremium(id){
    console.log("model id ",id)
    var CurrenDevice = JSON.parse(window.localStorage.getItem('model_'+id))
    var term_min = 1
    var term_max = 72
    var currency = CurrentProduct.loan_amount

    $("#device_id").val(id)
    $("#CellphoneProduct_CoverPeriodAmount").val(CurrenDevice.sum_insured)
    $("#CellphoneProduct_Slider").html('<input type="number" class="text-center text-pink" id="CellphoneProduct_CoverPeriod" unit="" currency="' + currency + '" premium="' + CurrenDevice.premium_per_month + '" min="' + term_min + '" max="' + term_max + '" value="' + term_min + '" step="1" readonly/>');

    // LoadCellphoneProduct(id)
   
}
function LoadCellphoneModels(id){
    $('#customer_idnumber').hide()
    $("#proceed").hide()
    //myApp.showPreloader("Loading device models...")
    var html = ''
    html += '<option value="">---Select a cellphone model---</option>'
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', User.token)
        },
        complete: function () {
           myApp.hidePreloader()
           $("#CellphoneModelProductOptions").html(html);
        },
        url: services+'/insurapp/get_ins_device_models/'+id, 
        type: 'get',
        success: function (result) {
            if(result.success) {
                var device = result.data.device_makes
                for(var i = 0; i < device.length; i++) {
                    window.localStorage.setItem('model_'+device[i].id, JSON.stringify(device[i]))
                    html += '<option value="'+ device[i].id +'">'+ device[i].model_name +"</option>"
                }

            }else{
                myApp.alert("Device could not be found", function(){
                    mainView.router.loadPage('landing.html');
                })
            }

        },
        error: function (data) {
            myApp.alert("Device could not be found", function(){
                mainView.router.loadPage('landing.html');
            })
        }
    });
}
function LoadCellphoneInsProducts(id) {
    
    $$.post(services + "/insurapp/get_products/" + id, JSON.stringify({token: User.token, type_id:id}), function(response) {
        var result = JSON.parse(response);
        
        if(result.success) {
            var html = '<div class="row mt10">';
           
            for(var i = 0; i < result.data.products.length; i++) {

                html += '<div class="col-100 menubutton"  style="color:#29788b; margin-bottom: 20px;">\
                            <a href="cellphone_product.html?product_id=' + result.data.products[i].id + '&type_id=' + id + '">\
                                  <div class="text-center " style="color:#29788b; ">\
                                      ' + result.data.products[i].name + '<br/>\
                                    Premium :R' + result.data.products[i].premium + '\
                                  </div>\
                            </a>\
                         </div>'; 

            }

            $("#CellphoneProductOptions").html(html);

            //LoadCellphoneProduct(result.data.products[0].id);
        }
        else {
            myApp.alert(result.message);
        }   
    },
    function (value) {

    });
}

function LoadCellphoneProduct(id, type_id){
 
    $$.post(services + "/insurapp/get_product/" + id, JSON.stringify({token: User.token, type_id:type_id}), function(response) {
        var result = JSON.parse(response);
        if(result.success) {
            CurrentProduct = result.data.product;
            $("#CellphoneProduct_Description").html(CurrentProduct.description);
            LoadCellphoneProducts();
        }
        else {
            myApp.alert(result.message);
        }   
    },
    function (value) {

    });
}

function GetCellphoneProductQuote() {
    myApp.showPreloader("Getting quote...")
    ShowLoader = false
    var valid = true;
    var id_number = $("#cellphone_product_id_number").val()
    var term = 1
    var theimei = '357503050371469'; //device.uuid
    var tempDate = new Date(id_number.substring(0, 2), id_number.substring(2, 4) - 1, id_number.substring(4, 6));
    var id_year = tempDate.getFullYear();
    var dob_year = id_number.substr(0, 2);
    var dob_month = id_number.substr(2, 2);
    var dob_day = id_number.substr(4, 2);

    var current_year = (new Date()).getFullYear();

    if(id_number == '' || id_number == undefined){
        valid = false
        myApp.hidePreloader()
        myApp.alert("ID Number is required.", function(){
            $("#cellphone_product_id_number").focus()
        })
    }

    if (id_year <= (current_year - 98)) {
        dob_year = "20" + dob_year;
    } else {
        dob_year = "19" + dob_year;
    }

    var dob = dob_year + '-' + dob_month + '-' + dob_day;
    
    if(valid) {
        CurrentPolicyTerm = term;
        var values = {
            token: User.token, 
            imei: theimei, 
            term: term, 
            dob: dob, 
            model_id: $("#CellphoneModelProductOptions").val()
        };

        $$.post(services + "/insurapp/get_product_premium/" + CurrentProduct.id, JSON.stringify(values), function(response) {
            var result = JSON.parse(response);
            myApp.hidePreloader()
            if(result.success && !result.error) {

                PolicyApplicationHandsetObject = result.data;
                $(".modal-overlay").show();
                myApp.confirm('Your premium will be R'+Number(result.data.premium).toFixed(2)+'. Would you like to buy this?',function() {
                    //CurrentPolicyPremium = result.data.premium;
                    CurrentIdNumber = id_number
                    CurrentDob = dob
                    mainView.router.loadPage('cellphone_product_confirm.html');
                    myApp.showPreloader("Please wait...")
                    setTimeout(function(){ 
                        $("#sa_id").val(id_number)
                        $("#dob").val(dob)
                    },2000)
                });

            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {
            myApp.hidePreloader()
        });
    }
    else {
        cordova.plugins.IMEI(function (err, imei) {
        
            theimei = imei;

            if(err == null)
            {
                CurrentPolicyTerm = term;

                var dateOfBirth = moment(User.user_link.id_number.substr(0, 6), "YYMMDD");

                var values = {token: User.token, imei: theimei, term: term, dob: dateOfBirth.format('YYYY-MM-DD')};

                $$.post(services + "/insurapp/get_product_premium/" + CurrentProduct.id, JSON.stringify(values), function(response) {
                    var result = JSON.parse(response);

                    if(result.success && !result.error) {

                        PolicyApplicationHandsetObject = result.data.handset;
                        $(".modal-overlay").show();
                        myApp.modal({
                            title: 'insurapp',
                            text: 'Your premium will be ' + $("#CellphoneProduct_Currency").val() + '' + parseFloat(result.data.premium).toFixed(2) + ' per month to insure your ' + result.data.handset.MakeDesc + ' ' + result.data.handset.ModelDesc + ' (Replacement value: R' + parseFloat(result.data.handset.value).toFixed(2) + '). Would you like to buy this?',
                            buttons: [
                            {
                                text: 'Yes',
                                onClick: function() {
                                    CurrentPolicyPremium = result.data.premium;
                                    mainView.router.loadPage('cellphone_product_confirm.html?premium=' + result.data.premium + '&imei=' + theimei);
                                }
                            },
                            {
                                text: 'No',
                                onClick: function() {
                                }
                            }]
                        });

                    }
                    else {
                        CheckReturnMessage(result.message);
                    }   
                },
                function (value) {

                });
            }
            else {
                ShowNotification("Something went wrong, please try again.");
            }
        });
    }
    
}

function getDobFromId(id_number){
    var id_number = $("#cellphone_product_id_number").val()
    var term = 1
    var theimei = '357503050371469'; //device.uuid
    var tempDate = new Date(id_number.substring(0, 2), id_number.substring(2, 4) - 1, id_number.substring(4, 6));
    var id_year = tempDate.getFullYear();
    var dob_year = id_number.substr(0, 2);
    var dob_month = id_number.substr(2, 2);
    var dob_day = id_number.substr(4, 2);

    var current_year = (new Date()).getFullYear();
    var valid = true
    if(id_number == '' || id_number == undefined){
        valid = false
        myApp.hidePreloader()
        // myApp.alert("ID Number is required.", function(){
        //     $("#cellphone_product_id_number").focus()
        // })
    }

    if (id_year <= (current_year - 98)) {
        dob_year = "20" + dob_year;
    } else {
        dob_year = "19" + dob_year;
    }

    var values = {
        dob_year:dob_year,
        dob_day:dob_day,
        dob: dob_year + '-' + dob_month + '-' + dob_day,
        valid: valid
    };

    return values;
}

function allow_numeric(evt) {
    var theEvent = evt || window.event;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
  }

function LoadCellphoneProductConfirmation(premium, imei) {
    var valid = true
    var dob = getDobFromId($("#cellphone_product_id_number").val())
    var current_year = (new Date()).getFullYear();
    var dob_year = dob.dob_year;
    var age = current_year - dob_year;
    var dateOfBirth = dob.dob
    console.log("age",age)
    if(ValidateID($("#cellphone_product_id_number").val()) == false){
        valid = false
        myApp.alert("ID number does not appear to be valid")
    }else if(dob.valid == false){
        valid = false
        
    }else if(age < 18){
        valid = false
        myApp.alert("Customers under the age of 18 not allowed", "Error")
    }
   

    if(valid){
        ShowLoader = true
        $("#CellphoneProductConfirm_Name").html(CurrentProduct.name);
        $("#CellphoneProductConfirm_Back").attr('href', 'cellphone_product.html?id=' + CurrentProduct.id);
        
        $("#CellphoneCoverStep1Form [name='product_id']").val(CurrentProduct.id);
        $("#CellphoneCoverStep1Form [name='premium']").val(premium);
        $("#CellphoneCoverStep1Form [name='imei']").val(imei);
        $("#CellphoneCoverStep1Form [name='sa_id']").val($("#cellphone_product_id_number").val());
        $("#CellphoneCoverStep1Form [name='dob']").val(dateOfBirth);
        
        var values = {token: User.token, customer_idcell: $("#cellphone_product_id_number").val()};
        
        $$.post(services + "/insurapp/customer_search/" + CurrentProduct.id, JSON.stringify(values), function(response) {
            var result = JSON.parse(response);
            ShowLoader = true
            if(result.success) {
                
                myApp.hidePreloader()
                if(result.data.status == 0) { //NEW CUSTOMER
                        mainView.router.loadPage('cellphone_product_confirm.html');
                }
                else {
                    mainView.router.loadPage('cellphone_product_confirm.html');
                    
                    $("#CellphoneCoverStep1Form [name='first_name']").val(result.data.customer[0].first_name);
                    $("#CellphoneCoverStep1Form [name='last_name']").val(result.data.customer[0].last_name);
                    $("#CellphoneCoverStep1Form [name='sa_id']").val(result.data.customer[0].sa_id);
                    $("#CellphoneCoverStep1Form [name='dob']").val(dateOfBirth);
                    $("#CellphoneCoverStep1Form [name='tel_cell']").val(result.data.customer[0].tel_cell);
                    $("#CellphoneCoverStep1Form [name='email_address']").val(result.data.customer[0].email_address);
                    $("#CellphoneCoverStep1Form [name='postal_code']").val(result.data.customer[0].postal_code);
                    $("#CellphoneCoverStep1Form [name='beneficiary_name']").val(result.data.customer[0].beneficiary_name);
                    $("#CellphoneCoverStep1Form [name='beneficiary_sa_id']").val(result.data.customer[0].beneficiary_sa_id);
                    localStorage.setItem("signature", result.data.customer[0].signature);
                    localStorage.setItem("picture", result.data.customer[0].picture);
                    if (CurrentPicture == '' || CurrentPicture == null) {
                        CurrentPicture = result.data.customer[0].picture;
                    }
                    if (CurrentSignature == '' || CurrentPicture == null) {
                        CurrentSignature = result.data.customer[0].signature;
                    }
                   
                    CurrentPolicyWordingId = result.data.customer[0].policy_wording_id;
                }
              
            }
            else {
                ShowLoader = true
                myApp.hidePreloader()
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {
            ShowLoader = true
            myApp.hidePreloader()
        });
    }
  
}


function ValidateID(id_number) {
    // first clear any left over error messages
    $('#error p').remove();

    // store the error div, to save typing
    var error = $('#error');

    var idNumber = id_number;


    // assume everything is correct and if it later turns out not to be, just set this to false
    var correct = true;

    //Ref: http://www.sadev.co.za/content/what-south-african-id-number-made
    // SA ID Number have to be 13 digits, so check the length
    if (idNumber.length != 13 || !isNumber(idNumber)) {
        error.append('<p>ID number does not appear to be authentic - input not a valid number</p>');
        correct = false;
    }

    // get first 6 digits as a valid date
    var tempDate = new Date(idNumber.substring(0, 2), idNumber.substring(2, 4) - 1, idNumber.substring(4, 6));

    var id_date = tempDate.getDate();
    var id_month = tempDate.getMonth();
    var id_year = tempDate.getFullYear();

    var fullDate = id_date + "-" + id_month + 1 + "-" + id_year;

    if (!((tempDate.getYear() == idNumber.substring(0, 2)) && (id_month == idNumber.substring(2, 4) - 1) && (id_date == idNumber.substring(4, 6)))) {
        error.append('<p>ID number does not appear to be authentic - date part not valid</p>');
        correct = false;
    }

    // get the gender
    var genderCode = idNumber.substring(6, 10);
    var gender = parseInt(genderCode) < 5000 ? "Female" : "Male";

    // get country ID for citzenship
    var citzenship = parseInt(idNumber.substring(10, 11)) == 0 ? "Yes" : "No";

    // apply Luhn formula for check-digits
    var tempTotal = 0;
    var checkSum = 0;
    var multiplier = 1;
    for (var i = 0; i < 13; ++i) {
        tempTotal = parseInt(idNumber.charAt(i)) * multiplier;
        if (tempTotal > 9) {
            tempTotal = parseInt(tempTotal.toString().charAt(0)) + parseInt(tempTotal.toString().charAt(1));
        }
        checkSum = checkSum + tempTotal;
        multiplier = (multiplier % 2 == 0) ? 1 : 2;
    }
    if ((checkSum % 10) != 0) {
        error.append('<p>ID number does not appear to be authentic - check digit is not valid</p>');
        correct = false;
    };


    // if no error found, hide the error message
    if (correct) {
        error.css('display', 'none');
        $("#CellphoneCoverStep1Form [name='dob']").val(fullDate);
        //myApp.alert('<p>South African ID Number:   ' + idNumber + '</p><p>Birth Date:   ' + fullDate + '</p><p>Gender:  ' + gender + '</p><p>SA Citizen:  ' + citzenship + '</p>');
    }
    // otherwise, show the error
    else {
        error.css('display', 'block');
    }

    return correct;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


function CellphoneProductStep1Save() {
    
    var formData = myApp.formToData('#CellphoneCoverStep1Form');
    var valid = true;
    if(formData.first_name == '') {
        valid = false;
        ShowNotification('Please enter customers first name');
        return false
    }else if(formData.last_name == '') {
        valid = false;
        ShowNotification('Please enter customers last name');
        return false
    }else if(formData.tel_cell == '') {
        valid = false;
        ShowNotification('Please enter customers cellphone');
        return false
    }else if(formData.postal_code == '') {
        valid = false;
        ShowNotification('Please enter customers postal code');
        return false
    } else if (formData.postal_code.length > 4) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code2").focus();
        });

    }
    else if (formData.postal_code.length < 4) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code2").focus();
        });

    }
    else if (formData.postal_code == 0000) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code2").focus();
        });
    }
    else if (formData.postal_code == 9999) {
        valid = false;
        myApp.alert('Please enter a valid postal code, 4 digits is required, 0000 and 9999 not accepted', function () {
            document.getElementById("postal_code2").focus();
        });
    }
    else if(formData.beneficiary_sa_id == '') {
        valid = false;
        ShowNotification('Please enter the alternative cellphone number');
        return false
    }
    
    if(valid) {
        //myApp.showPreloader('Updating policy...')
        var values = {identifier: formData.sa_id, token: User.token};    
    
        $$.post(services + "/insurapp/get_policy_number/" + CurrentProduct.id, JSON.stringify(values), function(response) {
            var result = JSON.parse(response);

            if(result.success) { 

                formData.token = User.token;
                var submitValues = formData;

                CurrentPolicyNumber = result.data.policy_number;
                //myApp.showPreloader('Updating policy...')
                window.setTimeout(function() {
                    PolicyApplicationObject = submitValues;
                
                    PolicyApplicationObject.handset_id = PolicyApplicationHandsetObject.id;
                    PolicyApplicationObject.MakeID = PolicyApplicationHandsetObject.MakeID;
                    PolicyApplicationObject.ModelID = PolicyApplicationHandsetObject.ModelID;
                    PolicyApplicationObject.MakeDesc = PolicyApplicationHandsetObject.MakeDesc;
                    PolicyApplicationObject.ModelDesc = PolicyApplicationHandsetObject.ModelDesc;
                    PolicyApplicationObject.TAC = PolicyApplicationHandsetObject.TAC;
                    PolicyApplicationObject.Counted = PolicyApplicationHandsetObject.Counted;
                    PolicyApplicationObject.Createdate = PolicyApplicationHandsetObject.Createdate;
                    PolicyApplicationObject.value = PolicyApplicationHandsetObject.value;
                    
                    var product_data = {
                        term: CurrentPolicyTerm,
                        model_id: currentModelId
                    };
                    
                    PolicyApplicationObject.product_data = product_data;
                    
                    $$.post(services + "/insurapp/update_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
                        var result1 = JSON.parse(response1);
                        ResetPreloader();

                        if(result1.success) {
                            mainView.router.loadPage('cellphone_product_terms.html');
                        }
                        else {
                            CheckReturnMessage(result1.message);
                        }   
                    },
                    function (value1) {

                    });                
                }, 800);
            }
            else {
                CheckReturnMessage(result.message);
            }   
        },
        function (value) {

        });
    }
}

function LoadCellphoneProductTerms() {
    $("#CellphoneProductTerms_Name").html(CurrentProduct.name);
    $("#CellphoneProductTerms_PolicyNumber").html(CurrentPolicyNumber);
    
    var html = '';
    if(CurrentProduct){
         for(var i = 0; i < CurrentProduct.terms_audio.length; i++) {

            html += ' <li style="border-bottom:solid thin #ddd">'
            html += '   <label class="label-radio item-content" onclick="SelectLanguage(\'' + audioLocation + CurrentProduct.terms_audio[i].file + '\', \'funeral\', \'' + CurrentProduct.terms_audio[i].language + '\')">'
            html += '      <input type="radio" name="my-radio" value="">'
            html += '      <div class="item-inner">'
            html += '          <div class="item-title">  ' + CurrentProduct.terms_audio[i].language +  '</div>';
            html += '      </div>'
            html += '   </label>'
            html += ' </li>';
        }
    
    }

    $("#CellphoneProductsTerms_Buttons").html(html);
}

function AcceptTermsCellphone() {
    var formData = myApp.formToData('#CellphoneCoverStep3Form');
    var valid = true;
    
    if(PolicyApplicationObject.language == undefined) {
        valid = false;
        ShowNotification('Please chooose a language before continuing');
    }
    else if(formData.agreetoterms == "") {
        valid = false;
        ShowNotification('Please accept the terms and conditions to continue');
    }else if(formData.policy_wording_id == ""){
        valid = false
        ShowNotification('Please enter invoice number to continue');
    }
    
    if(valid) {
        
        preloaderText = "Updating policy...";
        PolicyApplicationObject.policy_wording_id = formData.policy_wording_id
        $$.post(services + "/insurapp/update_application/" + CurrentPolicyNumber, JSON.stringify(PolicyApplicationObject), function(response1) {
            var result1 = JSON.parse(response1);
            ResetPreloader();

            if(result1.success) {
                mainView.router.loadPage('cellphone_product_photo.html');
                //mainView.router.loadPage('funeral_product_photo.html');
            }
            else {
                CheckReturnMessage(result1.message);
            } 
        },
        function (value1) {

        });  
    }
}

function LoadCellphonePhotoScreen() {
    $("#CellphoneProductPhoto_Name").html(CurrentProduct.name);
    $("#CellphoneProductPhoto_PolicyNumber").html(CurrentPolicyNumber);
}

function LoadCellphoneSignScreen() {
    $("#CellphoneProductSign_Name").html(CurrentProduct.name);
    $("#CellphoneProductSign_PolicyNumber").html(CurrentPolicyNumber);
    
    var settings = CurrentProduct.settings;
            
    var currency = "";
    var term_unit = "";

    for(var i = 0; i < settings.length; i++) {
        if(settings[i].name == 'currency') {
            currency = settings[i].value;
        }
        if(settings[i].name == 'term_unit') {
            term_unit = settings[i].value;
        }
    }
    
    
    $("#CellphoneProductSign_Period").html("monthly");
    $("#CellphoneProductSign_Premium").html(currency + CurrentPolicyPremium);
    
    window.setTimeout(function() {
        var wrapper = document.getElementById("signature-pad");
        var canvas = wrapper.querySelector("canvas");    
        SigningCanvas = new SignaturePad(canvas, {
            backgroundColor: 'rgb(255, 255, 255)'
        });
    }, 800);
}

function LoadCellphonePayScreen() {
    
    
    $("#CellphoneProductPay_Name").html(CurrentProduct.name);
    $("#CellphoneProductPay_PolicyNumber").html(CurrentPolicyNumber);
    $("#CellphoneProductPay_BackLink").attr('href', 'cellphone_product_confirm.html?premium=' + PolicyApplicationObject.premium + '&imei=' + PolicyApplicationObject.imei);
    
    var html = '';
    
    $$.post(services + "/insurapp/get_payment_options/" + PolicyApplicationObject.product_id, JSON.stringify({token: User.token}), function(response) {
        var result = JSON.parse(response);

        if(result.success) {             
            
            Wallet = result.data.wallets;
            
            for(var i = 0; i < result.data.payment_options.length; i++) {
                html += '<li>';
                html += '  <a href="javascript:SelectPaymentMethod(\'' + result.data.payment_options[i] + '\', \'cellphone\');" class="item-link item-content">';
                html += '    <div class="item-inner">';
                html += '      <div class="item-title">' + result.data.payment_options[i] + '</div>';
                html += '    </div>';
                html += '  </a>';
                html += '</li>';
            }

            $("#CellphoneProductPay_Existing").html(html);
            
        }
        else {
            CheckReturnMessage(result.message);
        }   
    },
    function (value) {

    });
    
}

function LoadCellphonePaySuccess() {
    $("#CellphoneProductSuccess_Name").html(CurrentProduct.name);
    $("#CellphoneProductSuccess_PolicyNumber").html(CurrentPolicyNumber);
}


function StartBuyCellphoneCover() {
    $("#CellphoneProduct_Meta").slideUp();
    $("#CellphoneProduct_Form").slideDown();
}

function LoadProfileScreen() {
    $("#ProfileForm [name='first_name']").val(User.user_link.first_name);
    $("#ProfileForm [name='last_name']").val(User.user_link.last_name);
    $("#ProfileForm [name='email']").val(User.user_link.email);
    
    $("#Profile_ReferralCode").html(User.user.referral_code);
}

function UpdateProfile() {
    var formData = myApp.formToData('#ProfileForm');
    var valid = true;
    
    if(formData.first_name == "") {
        valid = false;
        ShowNotification("Please fill in your first name");
    }
    if(formData.last_name == "") {
        valid = false;
        ShowNotification("Please fill in your surname");
    }
    else if(formData.email == "") {
        valid = false;
        ShowNotification("Please fill in your email address");
    }
    else if(formData.email.indexOf("@") < 0 || formData.email.indexOf(".") < 0) {
        valid = false;
        ShowNotification("Please enter a valid email address");
    }
    
    formData.token = User.token;
    
    if(valid) {
        
        preloaderText = "Updating...";
        
        $$.post(services + "/basic/profile_update", JSON.stringify(formData), function(response) {
            var result = JSON.parse(response);
            ResetPreloader();
            if(result.success) {
                
                User.user_link.first_name = formData.first_name;
                User.user_link.last_name = formData.last_name;
                User.user_link.email = formData.email;
                
                SetLocalAccount();
                
                myApp.modal({
                    title:  'Success',
                    text: result.message,
                    buttons: [
                        {
                            text: 'Done',
                            onClick: function() {
                                mainView.router.loadPage('support.html');
                            }
                        }
                    ]
                });
            }
            else {
                CheckReturnMessage(result.message);
            }
        });
    }
}

function ChangePassword() {
    var formData = myApp.formToData('#ChangePasswordForm');
    var valid = true;
    
    if(formData.username == "") {
        valid = false;
        ShowNotification("Please confirm your username");
    }
    else if(formData.password == "") {
        valid = false;
        ShowNotification("Please confirm your current password");
    }
    else if(formData.new_password == "") {
        valid = false;
        ShowNotification("Please fill in your password");
    }
    else if(formData.new_password != formData.confirm_new_password) {
        valid = false;
        ShowNotification("Please make sure your passwords match");
    }
    
    formData.token = User.token;
    delete formData.confirm_new_password;   
    
    
    if(valid) {
                
        preloaderText = "Updating password...";
        
        $$.post(services + "/basic/update_password", JSON.stringify(formData), function(response) {
            var result = JSON.parse(response);
            ResetPreloader();
            if(result.success) {
                myApp.modal({
                    title:  'Success',
                    text: result.message,
                    buttons: [
                        {
                            text: 'Done',
                            onClick: function() {
                                mainView.router.loadPage('support.html');
                            }
                        }
                    ]
                });
            }
            else {
                CheckReturnMessage(result.message);
            }
        });
    }
}

function LoadReferMembers() {
    
    
    $("#SMSRemaining").html("<br /><div style='background: #ee357e;color: #ffffff;padding: 5px;margin-top: 10px;border-radius: 10px;'>" + User.user.referral_smses_remaining + " SMS's remaining</div>");
    
    var html = '';
    
    for(var i = 0; i < ReferMembersArray.length; i++) {
        html += '<li>';
        html += '  <a href="javascript:ReferMemberActionSheet('+ i +');" class="item-link item-content">';
        html += '    <div class="item-inner">';
        html += '      <div class="item-title">' + ReferMembersArray[i].name + ' ' + ReferMembersArray[i].surname + '</div>';
        html += '      <div class="item-after"><span class="badge bg-blue">' + (ReferMembersArray[i].cellphone != null ? ReferMembersArray[i].cellphone : ReferMembersArray[i].email) + '</span></div>';
        html += '    </div>';
        html += '  </a>';
        html += '</li>';
    }
    
    if(User.user.referral_smses_remaining > ReferMembersArray.length) {
        html += '<li>';
        html += '  <a href="javascript:ReferFromDevice();" class="item-link item-content">';
        html += '    <div class="item-inner">';
        html += '      <div class="item-title Montserrat-Bold text-blue" style="margin: 0 auto;">+ Refer from contacts</div>';
        html += '    </div>';
        html += '  </a>';
        html += '</li>';
    }
        
    html += '<li>';
    html += '  <a href="javascript:OpenReferByEmailPopup();" class="item-link item-content">';
    html += '    <div class="item-inner">';
    html += '      <div class="item-title Montserrat-Bold text-blue" style="margin: 0 auto;">+ Refer by email</div>';
    html += '    </div>';
    html += '  </a>';
    html += '</li>';
    
    
    if(ReferMembersArray.length > 0) {
        $("#ReferButton").show();
    }
    else {
        $("#ReferButton").hide();
    }

    $("#ReferAMember_Existing").html(html);
}

function OpenReferByEmailPopup() {
    var options = "";    
    
    var popupHTML = '<div class="popup">'+
                        '<div class="text-black">'+
                          '<h2 class="text-center text-pink">Refer a member</h2>'+
                          '<p class="text-center">Refer by email</p>'+
                          
                          '<div class="p10">' +
                          '<form id="AddReferByEmailForm">' +
                          ' <div class="list-block">' +
                          ' <ul>' +
                          '     <li class="item-label text-pink">Name</li>' + 
                          '     <li>' +
                          '       <div class="item-content textbox no-margin-top">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-input">' +
                          '              <input type="text" placeholder="" name="name">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li class="item-label text-pink">Surname</li>' + 
                          '     <li>' +
                          '       <div class="item-content textbox no-margin-top">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-input">' +
                          '              <input type="text" placeholder="" name="surname">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          '     <li class="item-label text-pink">E-Mail</li>' + 
                          '     <li>' +
                          '       <div class="item-content textbox no-margin-top">' +
                          '         <div class="item-inner">' +
                          '           <div class="item-input">' +
                          '              <input type="text" placeholder="" name="email">' +
                          '           </div>' +
                          '         </div>' +
                          '       </div>' +
                          '     </li>' +
                          ' </ul>' +
                          ' </div>' +
                          '</form>' +
                          '</div>' +
                            '<div class="content-block" style="margin-top:0px;">' + 
                          '<div class="row" style=" margin-bottom:10px;">'+
                            '<div class="col-100"><a href="javascript:SaveReferByEmail();" class="button button-big button-fill bg-pink uppercase">Save &amp; Close</a></div>'+
                            '<div class="col-100 text-center" style="padding-top: 20px;"><a href="#" class="close-popup text-red text-1x uppercase">Close</a></div>'+
                          '</div>'+        
                            '</div>' + 
                        '</div>'+
                      '</div>'
      myApp.popup(popupHTML); 
}

function SaveReferByEmail() {
    var formData = myApp.formToData('#AddReferByEmailForm');
    var valid = true;
    
    if(formData.name == "") {
        valid = false;
        ShowNotification("Please fill in your name");
    }
    if(formData.surname == "") {
        valid = false;
        ShowNotification("Please fill in your surname");
    }
    else if(formData.email == "") {
        valid = false;
        ShowNotification("Please fill in your email address");
    }    
    else if(formData.email.indexOf("@") < 0 || formData.email.indexOf(".") < 0) {
        valid = false;
        ShowNotification("Please fill in a valid email address");
    }    
    
    if(valid) {
        ReferMembersArray.push({
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            type: 'email'
        });
        
        myApp.closeModal();

        LoadReferMembers();        
    } 
}

function ReferMemberActionSheet(index) {
    var buttons = [
        {
            text: 'Remove contact',
            onClick: function () {
                myApp.closePanel();
                
                myApp.modal({
                    title:  'Remove contact',
                    text: 'Are you sure you want to remove ' + ReferMembersArray[index].name + ' ' + ReferMembersArray[index].surname + '?',
                    buttons: [{
                        text: 'Yes',
                        onClick: function() {
                            ReferMembersArray.splice(index, 1);
                            LoadReferMembers();
                        }
                    },
                    {
                        text: 'Cancel'
                    }]
                });
            }
        },
        {
            text: 'Cancel',
            color: 'red'
        }
    ];
    myApp.actions(buttons);
}

function ReferFromDevice() {
    navigator.contacts.pickContact(function(contact){
                    
        ReferMembersArray.push({
            name: contact.name.givenName,
            surname: contact.name.familyName,
            cellphone: contact.phoneNumbers[0].value.replace(/ /g, '').replace(/-/g, ''),
            type: 'sms'
        });

        LoadReferMembers();

    },function(err){
        console.log('Error: ' + err);
        
    });
}

function SendReferContacts() {
    
    var formData = {token: User.token,referrals: ReferMembersArray};
    
    $$.post(services + "/insurapp/refer", JSON.stringify(formData), function(response) {
        var result = JSON.parse(response);
        
        if(result.success) {
            myApp.modal({
                title:  'insurapp',
                text: 'You have successfully referred ' + ReferMembersArray.length + ' contacts',
                buttons: [{
                    text: 'Done',
                    onClick: function() {
                        
                        ReferMembersArray = [];
                        $("#ReferAMember_Existing").html('');
                        
                        mainView.router.loadPage('landing.html');
                    }
                }]
            });
        }
    });
}

function resend_policy_sms(policy_number){
    var formData = {token: User.token,policy_number: policy_number};
    
    $$.post(services + "/insurapp/resend_policy_sms", JSON.stringify(formData), function(response) {
        var result = JSON.parse(response);
        if(result.success) {
            myApp.alert(result.message);
        }else{
            myApp.alert(result.message);
        }
    })
}

function createLead() {
    var formData = myApp.formToData('#saveLeadForm');
    var values = {
        token: User.token,
        first_name: formData.first_name,
        last_name: formData.last_name,
        cellphone: formData.cellphone
    };
    console.log(values);
    $$.post(services + "/insurapp/save_lead", JSON.stringify(values), function(response) {
        var result = JSON.parse(response);
        if (result.success) {
            myApp.alert(result.message, function () {
                mainView.router.loadPage('landing.html');
            });
            
        }else{
            myApp.alert(result.message);
        }
    })
}

function updatePassword() {
    var valid = true;
    var formData = myApp.formToData('#updatePasswordForm');
    var values = {
        token: User.token,
        password: formData.old_password,
        new_password: formData.new_password,
        username: localStorage.getItem("username")
    };

    if (formData.new_password != formData.confirm_new_password) {
        valid = false;
        myApp.alert("New password and confirm password do not match");
    }

    console.log(values);
    if (valid) {
        $$.post(services + "/basic/update_password", JSON.stringify(values), function (response) {
            var result = JSON.parse(response);
            if (result.success) {
                myApp.alert(result.message, function () {
                    mainView.router.loadPage('landing.html');
                });

            } else {
                myApp.alert(result.message);
            }
        });
    }
    
}

 function gotClaim(){
    window.open('https://admin.insurapp.co.za/form/claim_form.php?token=' + User.token, '_system');
    //window.open('https://admin.insurapp.co.za/form/claim_form.php?token=' + User.token, '_blank', 'location=yes');
}

 function ShowDetailsForm() {
     $("#MemberDetails").show();
     $("#FuneralProduct_Description").hide();
     $("#applyBtn").hide();
     $("#applyBtnCredit").hide();
     $("#CellphoneProduct_Description").hide();
     $(".applyBtn").hide();
     $(".MemberDetails").show();
     $(".lightbluearea").show();
     window.setTimeout(function () {
         console.log("scroll to top...");
         $(".page-content").animate({ scrollTop: 0 }, "fast");
     }, 300);
 }


function validateID(idnumber) {
    var cb = true;
    if (cb) {
        var ex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/;
    } else {
        // some other validation here
        var ex = /^[0-9]{1,}$/;
    }

    var theIDnumber = idnumber;
    if (ex.test(theIDnumber) == false) {
        // alert code goes here
        
        return false;
    }
    return true;
 }

function Resign() {
    $(".signoptions2").hide();
    $(".signoptions").show();
    $("#clearBtn").show();
    $("#canvasSignature").show();
    $("#FuneralProductSign_SignDisplay").hide();
    $("#SignLabel").show();
    
    window.setTimeout(function () {
        var wrapper = document.getElementById("signature-pad");
        var canvas = wrapper.querySelector("canvas");
        SigningCanvas = new SignaturePad(canvas, {
            backgroundColor: 'rgb(255, 255, 255)'
        });

    }, 800);
    StartSign();
}

function DoSendPaymentOtp(policy_number) {
    $(".modal-overlay").hide();
    var values = {
        policy_number: policy_number,
        token: User.token
    }
    ShowLoader = false
    $$.post(services + "/insurapp/send_customer_card_otp?policy_number=" + policy_number, JSON.stringify(values), function (response) {
        var result = JSON.parse(response);
        ShowLoader = true
        if (result.success) {
            $(".modal-overlay").hide();
            myApp.alert(result.message);
        } else {
            $(".modal-overlay").hide();
            myApp.alert(result.message);
        }
    });
}

function goHome() {
    mainView.router.loadPage('landing.html');
}

function BasicLogin() {
    var values = {
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password")
    }
    var valid = false;
    if (localStorage.getItem("username") != null && localStorage.getItem("password") != null) {
        valid = true;
    }

    if (valid) {
        $$.post(services + "/basic/login/", JSON.stringify(values), function (response) {
            var result = JSON.parse(response);
            if (result.success) {

                User = result.data;

                pending_balance = User.wallets.pending_balance;
                wallet_balance = User.wallets.wallet_balance;

                SetLocalAccount();
                localStorage.setItem("username", localStorage.getItem("username"));
                localStorage.setItem("password", localStorage.getItem("password"));
               
                mainView.router.loadPage('landing.html');
            }
            else {
                ClearLogin()
            }
        });
    }else{
        ClearLogin()
    }
    
}