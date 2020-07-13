
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

var appVersion = '2.3.0';
var baseUrl = "https://admin.insurapp.co.za";
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
var CurrenDevice = [];
var currentModelId = ''
var AvailableCards = [];
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

$(".download").click(function(event){
    event.preventDefault()
   alert('working')
   return false
})

// The function below is an example of the best way to "start" your app.
// This example is calling the standard Cordova "hide splashscreen" function. 
// You can add other code to it or add additional functions that are triggered
// by the same event or other events.

function onAppReady() {
    handleExternalURLs()
    myApp.showPreloader('Please wait...');
    myApp.hidePreloader();
    ClearLogin()
    mainView.router.loadPage('login.html')
}

function AppResumed(){
    console.log("App resume")
    myApp.showPreloader('Please wait...');
    myApp.hidePreloader();
    
    mainView.router.loadPage('login.html')
}

document.addEventListener("app.Ready", onAppReady, false);
//document.addEventListener("resume", AppResumed, false);


function handleExternalURLs() {
    // Handle click events for all external URLs
    if (device.platform.toUpperCase() === 'ANDROID') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            navigator.app.loadUrl(url, { openExternal: true });
            e.preventDefault();
            window.open(url,'_system');
            console.log(url);
        });
    }
    else if (device.platform.toUpperCase() === 'IOS') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            window.open(url, '_system');
            e.preventDefault();
        });

    }else if (device.platform.toUpperCase() === 'BROWSER') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            console.log(device.platform.toUpperCase() )
            var url = $(this).attr('href');
            window.open(url, '_system');
            e.preventDefault();
        });
    }
    else {
        // Leave standard behaviour
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            window.open(url, '_system');
            e.preventDefault();
        });
    }


    $(document).on('click','.home', function (e) {
 
        myApp.confirm('By clicking "Ok" all unsaved changes will be lost.',
            function () {
                goHome();
            },
            function () {

            }
        );
    });

    $(document).on('click','.back', function (e) {
        e.preventDefault();
       // window.history.back();
    })
    
}
