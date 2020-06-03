/*
 * Please see the included README.md file for license terms and conditions.
 */


// This file is a suggested starting place for your code.
// It is completely optional and not required.
// Note the reference that includes it in the index.html file.


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */


// For improved debugging and maintenance of your app, it is highly
// recommended that you separate your JavaScript from your HTML files.
// Use the addEventListener() method to associate events with DOM elements.

// For example:

// var el ;
// el = document.getElementById("id_myButton") ;
// el.addEventListener("click", myEventHandler, false) ;

var myApp = new Framework7({
    modalTitle: "InsurApp",
    swipePanel: false,
    pushState : true
});
var $$ = Dom7;

var LoadingScreenTime = 3000;
var preloaderText = "Loading...";
var ShowLoader = true;

var User;
var Vessels = [];
var Itinerary = [];
var Documents = [];
var UsefulLinks = [];
var CurrentVesselID = 0;
var timer;
var Provinces = [
    {
        id: 1,
        name: "Eastern Cape"
    },
    {
        id: 2,
        name: "Free State"
    },
    {
        id: 3,
        name: "Gauteng"
    },
    {
        id: 4,
        name: "KwaZulu-Natal"
    },
    {
        id: 5,
        name: "Limpopo"
    },
    {
        id: 6,
        name: "Mpumalanga"
    },
    {
        id: 7,
        name: "Northern Cape"
    },
    {
        id: 8,
        name: "North West"
    },
    {
        id: 9,
        name: "Western Cape"
    },
];

var DependantTypes = [
    "Spouse", "Child", "Relative"
];

var appVersion = '2.4.8';

var baseUrl = "https://admin.insurapp.co.za";
//var baseUrl = "http://demo.insurapp.co.za"; 
//var baseUrl = "http://insurapp.mr";
var services = baseUrl + "/api";
var iconLocation = baseUrl + "/assets/uploads/icons/";
var audioLocation = baseUrl + "/assets/uploads/insurance/terms_audio/";
var photoUrl = baseUrl + "/assets/uploads/insurance/pictures/";
var signatureUrl = baseUrl + "/assets/uploads/insurance/signatures/";
var imageUrl = 'https://admin.insurapp.co.za/assets/img/';
var urlPrefix = 'https://admin.insurapp.co.za/';
var CurrentProduct = {
    terms_audio:[]
};
var CurrentPolicyNumber = "";
var CurrentPolicyPremium = 0;
var CurrentPolicyTerm = 0;
var CurrentPolicyLoanAmount = 0;
var CurrentPolicyWordingId = '';
var CurrentProductDependants = [];
var PolicyApplicationObject = [];
var PolicyApplicationHandsetObject = [];
var currentCustomerID = 0;
var CurrentClaimID = 0;
var CurrentSignature = 0;
var CurrentPicture = 0;
var CurrentCustomer = [];
var CurrentClaims = [];
var CurrentClaim = [];
var CurrentClaimDocumentsRequired = [];
var CurrentClaimDocumentsCompleted = [];
var ReferMembersArray = [];
var InboxMessages = [];
var WalletBalance = 0;
var Renew_Policy = false;
var FAQs = [];
var MyPolicies = [];

var Wallet = [];
var SigningCanvas;

var pending_balance = 0;
var wallet_balance = 0;

var Base64ImgTmp = '';
var paymenTimer;
var CurrentIdNumber = "";
var CurrentDob = "";
var CurrenDevice = []


var mainView = myApp.addView('.view-main'); 
if(localStorage.getItem("User")!=null){
    User = JSON.parse(localStorage.getItem("User")); 
    pending_balance = User.wallets.pending_balance;
    wallet_balance = User.wallets.wallet_balance;
}

$(document).ajaxStart(function() {
    $(".loaderText").html('Please wait...')
    if(ShowLoader){
        $(".modal-overlay").show();
        myApp.showPreloader();
    }
    
});

$(document).ajaxComplete(function() {
    $(".loaderText").html('')
    $(".modal-overlay").hide();
    myApp.hidePreloader();
});

// The function below is an example of the best way to "start" your app.
// This example is calling the standard Cordova "hide splashscreen" function. 
// You can add other code to it or add additional functions that are triggered
// by the same event or other events.

function onAppReady() {
    myApp.showPreloader('Please wait...');
    window.setTimeout(function () {
        myApp.hidePreloader();
        mainView.router.loadPage('login.html')
    },300)
    //handleExternalURLs()
}

document.addEventListener("app.Ready", onAppReady, false);

// function handleExternalURLs() {
//     // Handle click events for all external URLs
//     if (device.platform.toUpperCase() === 'ANDROID') {
//         $(document).on('click', 'a[href^="http"]', function (e) {
//             var url = $(this).attr('href');
//             navigator.app.loadUrl(url, { openExternal: true });
//             e.preventDefault();
//             window.open(url,'_system');
//             console.log(url);
//         });
//     }
//     else if (device.platform.toUpperCase() === 'IOS') {
//         $(document).on('click', 'a[href^="http"]', function (e) {
//             var url = $(this).attr('href');
//             window.open(url, '_system');
//             e.preventDefault();
//         });
//     }
//     else {
//         // Leave standard behaviour
//     }


//     $(document).on('click','.home', function (e) {
 
//         myApp.confirm('By clicking "Ok" all unsaved changes will be lost.',
//             function () {
//                 goHome();
//             },
//             function () {

//             }
//         );
//     });

//     $(document).on('click','.back', function (e) {
//         e.preventDefault();
//        // window.history.back();

//     })
    
// }

// function checkRefresh(){

// }

// document.addEventListener("deviceready", onAppReady, false) ;
// document.addEventListener("onload", onAppReady, false) ;

// The app.Ready event shown above is generated by the init-dev.js file; it
// unifies a variety of common "ready" events. See the init-dev.js file for
// more details. You can use a different event to start your app, instead of
// this event. A few examples are shown in the sample code above. If you are
// using Cordova plugins you need to either use this app.Ready event or the
// standard Crordova deviceready event. Others will either not work or will
// work poorly.

// NOTE: change "dev.LOG" in "init-dev.js" to "true" to enable some console.log
// messages that can help you debug Cordova app initialization issues.
