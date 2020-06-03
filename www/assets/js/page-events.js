$$(document).on('pageInit', function (e) {
    var page = e.detail;
    User = JSON.parse(localStorage.getItem("User"));
    if(User != null && User != undefined){
        $(".User_FullName").html(User.user.name);
        $('.button').css('background', "#"+ User.app_design.colour1)
        $('.button .bg-blue').css('background', "#"+ User.app_design.colour1)
        $('.button .bg-pink').css('background', "#"+ User.app_design.colour3)
        $('.navbar, .toolbar, .subnavbar').css('background', '#'+User.app_design.colour1)
        $('.lightbluearea.purple').css('background', '#'+User.app_design.colour3)
        $('.input-dropdown-wrap:before, .input-dropdown:before').css('border-top-color', "#"+ User.app_design.colour3)
    }else{
        //ClearLogin()
    }
    
}); 

myApp.onPageInit('register', function(page) {
    
    LoadProvinces("#RegisterForm [name='region_id']");
    
    var number = page.query.number; 
    
    $("#RegisterForm [name='cellphone']").val(number);
    
});

myApp.onPageInit('profile', function(page) {
   LoadProfileScreen(); 
});

myApp.onPageInit('landing', function (page) {
    //BasicLogin();    
    User = JSON.parse(localStorage.getItem("User"));
    if(User != null && User != undefined){
        Renew_Policy = false;
        //window.setTimeout(function () {
            get_product_types();
       // },3000)
    
        var  pending_balance = User.wallets.pending_balance;
    
        var  wallet_balance = User.wallets.wallet_balance;
        
        $(".logo").html('<div class="card" ><br/><img src="' + imageUrl + User.app_design.logo + '"  width="100">\
        <h3><table  style="width:100%; font-size:16px">\
        <tr><td colspan="2" style="border-bottom:solid thin #ddd; color:#000">' + User.user.name + '</td></tr> \
        <tr><td> <span style="color:red" id="pending_balance">R' + Number(pending_balance).toFixed(2) + '</span></td>\
        <td><span style="color:green" id="wallet_balance">R' + Number(wallet_balance).toFixed(2)  + '</span></td></tr></table></h3></div>');
        $(".wallet").html('<h3><table  style="width:100%; font-size:16px"><tr><td>' + User.user.name + "</td> <td> <span style='color:red'>R" + Number(User.wallets.pending_balance).toFixed(2) + "</span></td><td><span style='color:green'>R" + Number(User.wallets.wallet_balance).toFixed(2)  + "</span></td></tr></table></h3>");
       
    }else{
        myApp.hidePreloader()
        mainView.router.loadPage('login.html')
    }
  
});

myApp.onPageInit('messages', function(page) {
    LoadMessages();
});

myApp.onPageInit('airtime_data', function(page) {
    LoadAirtimeData();
});

myApp.onPageInit('team_sales', function(page) {
    LoadTeamSales();
});

myApp.onPageInit('funeral_cover', function(page) {
    var id = page.query.product_id; 
    
    LoadFuneralProducts(id);
});

myApp.onPageInit('funeral_product', function(page) {
    
    var id = page.query.id; 
    var policy_number = page.query.policy_number;
    
    if (policy_number != "" && policy_number != undefined) {
        _policy_search(policy_number);
    }
    LoadFuneralProduct(id);
    console.log("renew " + Renew_Policy);
});

myApp.onPageInit('funeral_product_confirm', function(page) {
    var premium = page.query.premium; 
    var idnumber = page.query.idnumber; 
    
    LoadFuneralProductConfirmation(premium, idnumber);
});

myApp.onPageInit('funeral_product_dependants', function(page) {
    LoadFuneralProductDependants();
});

myApp.onPageInit('funeral_product_terms', function(page) {
    LoadFuneralProductTerms();
});

myApp.onPageInit('funeral_product_photo', function (page) {
    console.log(CurrentPolicyLoanAmount);
    
    
    if (CurrentPicture != null && CurrentPicture != undefined && CurrentPicture != '') {
        $("#FuneralProductPhoto_NextButton2").show();
        $("#FuneralProductPhoto_NextButton").hide();
        $("#FuneralProductPhoto_PhotoDisplay").show();
       
        document.getElementById("FuneralProductPhoto_PhotoDisplay").src = photoUrl + CurrentPicture;
        $("#retakePhoto").show();
        $("#takeFirstPhoto").hide();

        
    } else {
        $("#retakePhoto").hide();
        $("#takeFirstPhoto").show();
    }

    console.log('CurrentPicture :' + CurrentPicture);

   //document.getElementById("FuneralProductPhoto_PhotoDisplay").src = photoUrl + result.data.customer[0].picture
  
    LoadFuneralPhotoScreen();
});

myApp.onPageInit('funeral_product_sign', function (page) {
    
    LoadFuneralSignScreen();
    //CurrentSignature = 'pic_ins_signature_IAVDC0ASP24114.jpg';
    console.log('CurrentSignature :' + CurrentSignature);
    window.setTimeout(function () {
        if (CurrentSignature != null && CurrentSignature != undefined && CurrentSignature != '') {
            $(".signoptions2").show();
            $("#clearBtn").hide();
            $("#canvasSignature").hide();
            $("#FuneralProductSign_SignDisplay").show();
            $("#SignLabel").hide();
            var myCanvas = document.getElementById('canvasSignature3');
            var ctx = myCanvas.getContext('2d');
            var img = new Image;
            img.onload = function () {
                ctx.drawImage(img, 0, 0); // Or at whatever offset you like
            };
            img.src = signatureUrl + CurrentSignature;

            //Base64ImgTmp = jpegUrl.split(',')[1];
            document.getElementById("FuneralProductSign_SignDisplay").src = signatureUrl + CurrentSignature;

            console.log(img.src);
        } else {
            $(".signoptions2").hide();
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

        ClearFormData();

    }, 850);


});

myApp.onPageInit('funeral_product_pay', function(page) {
    LoadFuneralPayScreen();
});

myApp.onPageInit('funeral_product_success', function(page) {
    var type = (page.query.type !== undefined ? page.query.type : ""); 
    
    LoadFuneralPaySuccess(type);
});

//Life insurance
myApp.onPageInit('life_insurance', function(page) {
    var id = page.query.product_id; 
    LoadLifeInsuranceProducts(id);
});

myApp.onPageInit('life_insurance_product', function(page) {
    
    var id = page.query.id; 
    $("#product_id").val(id);

    var policy_number = page.query.policy_number;
    console.log("policy_number :" + policy_number);
    if (policy_number != "" && policy_number != undefined) {
        _policy_search(policy_number);
    }

    LoadLifeInsuranceProduct(id);
    
    
});
myApp.onPageInit('life_insurance_product_confirm', function(page) {
    var premium = page.query.premium; 
    var idnumber = page.query.idnumber; 
    
    LoadFuneralProductConfirmation(premium, idnumber);
});

myApp.onPageInit('life_insurance_product_dependants', function(page) {
    LoadFuneralProductDependants();
});

myApp.onPageInit('life_insurance_product_terms', function(page) {
    LoadFuneralProductTerms();
});

myApp.onPageInit('life_insurance_product_photo', function(page) {
    LoadFuneralPhotoScreen();
});

myApp.onPageInit('life_insurance_product_sign', function(page) {
    //LoadLifeInsuranceSignScreen();
    LoadFuneralSignScreen();
});

myApp.onPageInit('life_insurance_product_pay', function(page) {
    LoadFuneralPayScreen();
});

myApp.onPageInit('life_insurance_product_success', function(page) {
    var type = (page.query.type !== undefined ? page.query.type : ""); 
    
    LoadFuneralPaySuccess(type);
});

//Life insurance


//Credit
myApp.onPageInit('credit_life', function (page) {
    var id = page.query.product_id;

    LoadCrediProducts(id);
});

myApp.onPageInit('credit_life_product', function (page) {

    var id = page.query.id;
    var policy_number = page.query.policy_number;
    
    if (policy_number != "" && policy_number != undefined) {
        _policy_search(policy_number);
    }

    $("#product_id").val(id);

    LoadCreditLifeProduct(id);


});

myApp.onPageInit('credit_life_product_confirm', function (page) {
    var premium = page.query.premium;
    var idnumber = page.query.idnumber;

    LoadCreditProductConfirmation(premium, idnumber);
});

myApp.onPageInit('credit_life_product_dependants', function (page) {
    LoadFuneralProductDependants();
});

myApp.onPageInit('credit_life_product_terms', function (page) {
    LoadFuneralProductTerms();
});

myApp.onPageInit('credit_life_product_photo', function (page) {
    LoadFuneralPhotoScreen();
});

myApp.onPageInit('credit_life_product_sign', function (page) {
    console.log(CurrentPolicyLoanAmount);
    
    LoadFuneralSignScreen();
});

myApp.onPageInit('credit_life_product_pay', function (page) {
    LoadFuneralPayScreen();
});

myApp.onPageInit('credit_life_product_success', function (page) {
    var type = (page.query.type !== undefined ? page.query.type : "");

    LoadFuneralPaySuccess(type);
});
//credif

myApp.onPageInit('support_manage_cards', function (page) {
 
    ShowLoader = true
    LoadCreditDebitCardScreen(CurrentPolicyNumber);
});

myApp.onPageInit('customer_manage_cards', function (page) {
    var customer_user_id = page.query.customer_user_id;
    ShowLoader = true
    LoadCustomerCreditDebitCardScreen(customer_user_id);
});

myApp.onPageInit('support_faq', function(page) {
    LoadFaqScreen();
});

myApp.onPageInit('my_policies', function(page) {
    LoadMyPolicies();
});

myApp.onPageInit('travel_insurance', function(page) {
    LoadTravelProducts();
});

myApp.onPageInit('travel_product', function(page) {
    var id = page.query.id; 
    
    LoadTravelProduct(id);
});

myApp.onPageInit('travel_product_confirm', function(page) {
    var premium = page.query.premium; 
    
    LoadTravelProductConfirmation(premium);
});

myApp.onPageInit('travel_product_dependants', function(page) {
    LoadTravelProductDependants();
});

myApp.onPageInit('travel_product_terms', function(page) {
    LoadTravelProductTerms();
});

myApp.onPageInit('travel_product_photo', function(page) {
    LoadTravelPhotoScreen();
});

myApp.onPageInit('travel_product_sign', function(page) {
    LoadTravelSignScreen();
});

myApp.onPageInit('travel_product_pay', function(page) {
    LoadTravelPayScreen();
});

myApp.onPageInit('travel_product_success', function(page) {
    LoadTravelPaySuccess();
});

myApp.onPageInit('cellphone_insurance', function(page) {
    
    LoadCellphoneProduct(6);
    
});

myApp.onPageInit('cellphone_device_model', function(page) {
    var id = page.query.id; 
    myApp.showPreloader("Loading device models....");
    setTimeout(function(){ 
        LoadCellphoneModels(id);
    }, 3000)
});

myApp.onPageInit('cellphone_product', function(page) {
    var id = page.query.id; 
    setTimeout(function(){ 
        LoadCellphoneProduct(id);
    },300)
});

myApp.onPageInit('cellphone_product_confirm', function(page) {
    // var premium = page.query.premium; 
    // var imei = page.query.imei; 
    setTimeout(function(){ 
        LoadCellphoneProductConfirmation()
    },300)
});

myApp.onPageInit('cellphone_product_terms', function(page) {
    $("#policy_wording_id").val(CurrentPolicyWordingId)
    setTimeout(function(){ 
        LoadCellphoneProductTerms();
    },300)
});

myApp.onPageInit('cellphone_product_photo', function(page) {
    setTimeout(function(){ 
        LoadCellphonePhotoScreen();
    },300)
});

myApp.onPageInit('cellphone_product_sign', function(page) {
    LoadCellphoneSignScreen();
});

myApp.onPageInit('cellphone_product_pay', function(page) {
    LoadCellphonePayScreen();
});

myApp.onPageInit('cellphone_product_success', function(page) {
    LoadCellphonePaySuccess();
});

myApp.onPageInit('product_renew', function(page) {
    LoadProductRenewPage();
});

myApp.onPageInit('claim', function(page) {
    var policyNumber = page.query.policyNumber; 
    var skip = page.query.skip; 
    
    CurrentPolicyNumber = policyNumber;    
    LoadClaimConfirmationPage(policyNumber, skip);
});

myApp.onPageInit('claim_photo', function(page) {
    LoadClaimPhotoScreen();
});

myApp.onPageInit('claim_success', function(page) {
    LoadClaimSuccess();
});

myApp.onPageInit('claims', function(page) {
    LoadMyClaims();
});

myApp.onPageInit('refer_a_member', function(page) {
    LoadReferMembers();
});

myApp.onPageInit('login', function (page) {
    $(".appVersion").html('v' + appVersion)
    if (localStorage.getItem("username") !== null) {
        $("#loginUsername").val(localStorage.getItem("username"));
    }
});
myApp.onPageInit('atm_confirm', function (page) {
    console.log("CurrentPolicyNumber :" + CurrentPolicyNumber)
    $("#FuneralProduct_Name").html(CurrentProduct.name)
    $(".CurrentPolicyNumber").html(CurrentPolicyNumber)
});
myApp.onPageInit('cards', function (page) {
    LoadCreditDebitCardScreen2();
});
myApp.onPageInit('scanned-card', function (page) {
    var currentCustomerID = page.query.customer_id;

    var currYear = moment().year();
    var MonthNumbers = [];
    var YearNumbers = [];
    for (var i = 1; i <= 12; i++) {
        MonthNumbers.push((i < 10 ? "0" + i : i));
    }
    for (var i = currYear; i <= (currYear + 10); i++) {
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
        }
    }); 

    $("#saveCustomerCard").html('<a href="javascript:SaveCustomerCard(' + currentCustomerID +');" class="button button-big button-fill bg-pink">Save &amp; Close</a>')
});

myApp.onPageInit('scanned-customer-card', function (page) {
    var currentCustomerID = page.query.customer_user_id;
    console.log('currentCustomerID :' + page.query.customer_user_id)

    var currYear = moment().year();
    var MonthNumbers = [];
    var YearNumbers = [];
    for (var i = 1; i <= 12; i++) {
        MonthNumbers.push((i < 10 ? "0" + i : i));
    }
    for (var i = currYear; i <= (currYear + 10); i++) {
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
        }
    });

    $("#saveCustomerCard").html('<a href="javascript:SaveCustomerCard(' + page.query.customer_user_id + ');" class="button button-big button-fill bg-pink">Save &amp; Close</a>')
});
myApp.onPageInit('customer-pay', function (page) {
    var customer_user_id = page.query.customer_user_id;
    DoSendPaymentOtp(CurrentPolicyNumber);
    $(".resendOtp").html('<a href="javascript:DoSendPaymentOtp('+"'" + CurrentPolicyNumber+"'"+')">Resend OTP</a>')
});
myApp.onPageInit('wallet-complete', function (page) {
    $(".payat_policy_number").html(CurrentPolicyNumber);
});
myApp.onPageInit('credit-complete', function (page) {
    $(".payat_policy_number").html(CurrentPolicyNumber);
});
myApp.onPageInit('card-complete', function (page) {
    $(".payat_policy_number").html(CurrentPolicyNumber);
});

myApp.onPageInit('card-machine-complete', function (page) {
    $(".payat_policy_number").html(CurrentPolicyNumber);
});
myApp.onPageInit('post', function (page) {
    document.getElementById('3ds-form').action = getParameterByName("url");
    document.getElementById('PAY_REQUEST_ID').value = getParameterByName("PAY_REQUEST_ID");
    document.getElementById('PAYGATE_ID').value = getParameterByName("PAYGATE_ID");
    document.getElementById('CHECKSUM').value = getParameterByName("CHECKSUM");

    document.getElementById('3ds-form').submit();

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
});
