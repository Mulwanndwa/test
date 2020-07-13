

angular.module('insuranceapp.controllers', [])


.run(function($rootScope, apiService, $ionicPopup, $ionicLoading, $location, Config) {

    // disable Camera trigger for local dev.
    $rootScope.debug = false;

    $rootScope.currentLogin = '';
    $rootScope.session_data = {};

    $rootScope.currentLocation = {};

    $rootScope.ac_creditlife = '';
    $rootScope.ac_insurelife = '';
    $rootScope.ac_funeralcover = '';
    $rootScope.menu = {};
    $rootScope.menuLoaded = false;

    $rootScope.customer_idcell = '';

    $rootScope.loginToken = null;
    $rootScope.loginData = null;

    $rootScope.appDesign = { logo : 'img/InsurApp.png' };

    $rootScope.pageTitle = 'Loading...';

    $rootScope.currentAudio = null;
    $rootScope.currentAudioSrc = '';

    $rootScope.Config = Config;

    console.log('$rootScope.Config', $rootScope.Config);


   // Triggered on a button click, or some other target
    $rootScope.showPopup = function(title, template, callback) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: template
      });
      alertPopup.then(function(res) {
        console.log('Popup dismissed');
      });
    };


    $rootScope.getCacheItem = function(cacheKey) {
        cachePrefix = $rootScope.currentLogin;
        cacheKeyFull = cachePrefix + '_' + cacheKey;

        if (typeof $rootScope.session_data[cacheKeyFull] != 'undefined') {
          result = $rootScope.session_data[cacheKeyFull];
        } else {
          result = null;
        }

        // test for array.
        console.log('typeof JSON.stringify(result)', typeof JSON.stringify(result));

        if (typeof JSON.stringify(result) == 'Array') {
          result = JSON.stringify(result);
        }

        return result;
    }

    $rootScope.setCacheItem = function(cacheKey, itemData) {
        cachePrefix = $rootScope.currentLogin;
        cacheKeyFull = cachePrefix + '_' + cacheKey;
        $rootScope.session_data[cacheKeyFull] = itemData;
    }

    $rootScope.statusLoading = function(message) {
        $rootScope.isLoading = true;

        if (typeof message == 'undefined') {
            message = 'Loading...';
        }

        $ionicLoading.show({
           template: message
        });

        // auto hide after timeout.
        var loadingTimeout = setTimeout(function() {
          $ionicLoading.hide();
          $rootScope.isLoading = false;
        }, 5000);

    }

    $rootScope.statusLoadingDone = function() {

      $ionicLoading.hide();
      $rootScope.isLoading = false;

    }

    // Perform logout sequence
    $rootScope.doLogout = function() {

      $rootScope.statusLoading();

      apiService.logout(function(response, error) {
          console.log(response);
          $rootScope.loginData = null;
          $rootScope.loginToken = null;
          $rootScope.appDesign = null;
          $rootScope.menu = null;
          $rootScope.categories = [];
          $rootScope.categories.push({
            id: 12,
            name: 'Dashboard',
            items: [],
            url: 'app/home'
          });

          $rootScope.menuLoaded = false;

          $rootScope.statusLoadingDone();
          $location.path('/login');
      });
    }

    $rootScope.resetPanels = function() {

      $rootScope.loanchoose = true;
      $rootScope.loanreview = false;

      $rootScope.memberdetails = false;
      $rootScope.additionaldetails = false;
      $rootScope.preferredlang = false;
      $rootScope.memberphoto = false;
      $rootScope.membersignature = false;

      $rootScope.memberphoto = false;
      $rootScope.photosuccess = false;
      $rootScope.preview_photo = '';

      //10,11,13,14,15,16,17

      $rootScope.loancomplete = false;


    }


})

.controller('LogoutCtrl', ['$rootScope', '$scope', 'apiService', '$location', '$ionicHistory', function ($rootScope, $scope, apiService, $location, $ionicHistory) {
  $rootScope.statusLoading();

  $ionicHistory.nextViewOptions({
     disableBack: true
  });

  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();

  apiService.logout(function(response, error) {
      console.log(response);
      $rootScope.loginData = null;
      $rootScope.loginToken = null;
      $rootScope.appDesign = null;
      $rootScope.menu = null;
      $rootScope.categories = [];
      $rootScope.categories.push({
        id: 12,
        name: 'Dashboard',
        items: [],
        url: 'app/home'
      });

      $rootScope.statusLoadingDone();
      $location.path('/login');
  });

}])

.controller('AppCtrl', ['$rootScope', '$scope', 'apiService', function ($rootScope, $scope, apiService) {

$rootScope.categories = [];

$rootScope.categories.push({
  id: 12,
  name: 'Dashboard',
  items: [],
  url: 'app/home'
});

ionic.EventController.on('menu:changed', function(eventData) {

  if (!$rootScope.menuLoaded) {
      var menuTypes = eventData.detail.types;

      for(var i in menuTypes){
        var item = menuTypes[i];

        console.log("menuItem Data: ", item);

        var menuItem = {
          id: item.id,
          name: item.name,
          items: []
        }

        $rootScope.categories.push(menuItem);

        console.log('menu:get items ' +  item.name);

        apiService.get_product(item.id, $rootScope.loginToken, function(response, error){
            console.log("menu products data: ", response.data.data.products);
            var subProducts = response.data.data.products;

            if(subProducts.length > 0){
              for(var x in subProducts){
                var productItem = subProducts[x];
                var rootMenuKey = getRootMenuKey(productItem.type_id);

                  if($rootScope.categories[rootMenuKey].id == productItem.type_id){
                     var subMenuItem = {
                        id: parseInt(productItem.id),
                        name: productItem.name,
                        items: []/*,
                        url: 'app/insurance/' +  parseInt(productItem.id)*/
                    };

                    if(productItem.type_id == 1){
                      subMenuItem.url = 'app/funeral/' +  parseInt(productItem.id);
                    }
                    if(productItem.type_id == 4){
                      subMenuItem.url = 'app/funeral/' +  parseInt(productItem.id);
                    }

                    if(productItem.type_id == 3){
                      subMenuItem.url = 'app/credit-life/' +  parseInt(productItem.id);
                    }

                    if(productItem.type_id == 2){
                      subMenuItem.url = 'app/life-insurance/' +  parseInt(productItem.id);
                    }

                    $rootScope.categories[rootMenuKey].items.push(subMenuItem);

                    console.log("menu product item: ", subMenuItem);
                    console.log('menu:pushed ' +  productItem.name + ' to ' +  $rootScope.categories[rootMenuKey].name);
                  }
              }
            }
        });
      }

      $rootScope.categories.push({
        id: 13,
        name: 'Services',
        items: [],
        url: 'app/services'
      });

      $rootScope.categories.push({
        id: 14,
        name: 'Search',
        items: [],
        url: 'app/search'
      });

      $rootScope.categories.push({
        id: 15,
        name: 'Submit a Claim',
        items: [],
        url: 'app/claim'
      });

      $rootScope.categories.push({
        id: 16,
        name: 'Update details/Help',
        items: [],
        url: 'app/profile'
      });

      $rootScope.categories.push({
        id: 17,
        name: 'Cashout',
        items: [],
        url: 'app/cashout'
      });

      $rootScope.categories.push({
        id: 18,
        name: 'Expiry Report',
        items: [],
        url: 'app/expiryreport'
      });

      $rootScope.categories.push({
        id: 19,
        name: 'Save Lead',
        items: [],
        url: 'app/savelead'
      });

      $rootScope.categories.push({
        id: 20,
        name: 'Logout',
        items: [],
        url: 'logout'
      });


      console.log('menu:changed - triggered' );
      $rootScope.menuLoaded = true;
    }
  });


  function getRootMenuKey(id){
    for (var i = 0; i < $rootScope.categories.length; i++) {
        var level1 = $rootScope.categories[i];
        if (level1.id == id) {
          return i;
        }
    }
  }

}])



.controller('LoginCtrl', ['$rootScope', '$scope', 'apiService', '$state', '$ionicHistory', '$ionicPlatform', '$location', '$ionicModal', '$timeout', '$ionicPopup', '$ionicLoading', 'Config', function ($rootScope, $scope, apiService, $state, $ionicHistory, $ionicPlatform, $location, $ionicModal, $timeout, $ionicPopup, $ionicLoading, Config) {
  console.log('LoginCtrl loaded: ', $location.path());

  /*$ionicPlatform.registerBackButtonAction(function (event) {
    event.preventDefault();
    if ($location.path() == "/login") {
      navigator.app.exitApp();
    } else {
      $ionicHistory.goBack();
      //navigator.app.goBack();
    }
  }, 999);*/

  console.log('$rootScope', $rootScope);

  $scope.loading = false;

  var imei = $rootScope.imei;

  console.log('imei: ', imei);

  // Form data for the login modal
  $scope.loginData = {

    username: /*"0445566782"*/'',
    password: /*"tester"*/'',
    token: "",
    debug: "DEBUG MODE",
    imei: imei,
    session: {}

  };

  if (localStorage.username) {
      $scope.loginData.username = localStorage.username;
  }

  /*if (localStorage.password) {
      $scope.loginData.password = localStorage.password;
  }*/

    // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system

    localStorage.setItem("username", $scope.loginData.username);
    //localStorage.setItem("password", $scope.loginData.password);

    $rootScope.statusLoading();
    var formData = JSON.stringify($("#loginForm").serialize());
    apiService.login($scope.loginData, function(response, error){
    //apiService.login(formData, function (response, error) {
      console.log('callback in controllers.js - for auth');
      console.log('response');
      console.log(response);

      console.log('error');
      console.log(error);

      if(response.data.success == true){
        if (typeof response.data != 'undefined') {
          message = response.data.message;

          if (response.data.success == true) {
            $rootScope.loginToken = response.data.data.token;
            $rootScope.loginData = response.data.data.user;
            $rootScope.loginData.wallets = response.data.data.wallets;

            $rootScope.appDesign = response.data.data.app_design;

            if (typeof $rootScope.appDesign.logo != 'undefined') {
              $rootScope.appDesign.logo = Config.urlPrefix + 'assets/img/' + $rootScope.appDesign.logo;
            } else {
              $rootScope.appDesign.logo = 'img/InsurApp.png';
            }

            console.log('logo');
            console.log($rootScope.appDesign.logo);


            console.log('login_token', $rootScope.loginToken);
            console.log('login_data', $rootScope.loginData);

            // Load products.

           /* apiService.get_product('', $rootScope.loginToken, function(response, error){
              var products = response.data.data.products;

              ionic.EventController.trigger('menu:changed', {'products': products });
            });*/


            apiService.get_product_types($rootScope.loginToken, function(response, error){
              console.log('get_product_types:', response.data.data);

              var productTypes = response.data.data.product_types;

              if (typeof $scope.menu == 'undefined') {
                $scope.menu = {};
              }

              ionic.EventController.trigger('menu:changed', {'types': productTypes });
            });


            // ------------

            $rootScope.statusLoadingDone();
            $location.path('/app/home');
          } else {
            // Report Error
            $scope.showPopup('Please Note', message);
          }

          $ionicLoading.hide();
        } else {
          $scope.showPopup('Please Note', 'There was a temporary problem, please try again later.');
        }
      } else {
        $ionicLoading.hide();
        $scope.showPopup('Login Error', response.data.message);
      }
    });
  };

}])

.controller('HomeCtrl', ['$rootScope', '$scope', 'apiService', '$state', '$ionicHistory', '$ionicPlatform', '$location', '$ionicModal', '$timeout', '$ionicPopup', '$ionicLoading', '$ionicSideMenuDelegate', function ($rootScope, $scope, apiService, $state, $ionicHistory, $ionicPlatform, $location, $ionicModal, $timeout, $ionicPopup, $ionicLoading, $ionicSideMenuDelegate) {
    console.log('HomeCtrl loaded');

    console.log('$rootScope.loginToken', $rootScope.loginToken);
    console.log('$scope.loginData', $scope.loginData);

    //console.log('back shown: ', $ionicNavBarDelegate.showBackButton(false));
     //$ionicSideMenuDelegate.toggleLeft();

    /*$ionicPlatform.registerBackButtonAction(function (event) {
    event.preventDefault();
      if ($location.path() == "/home") {
        navigator.app.exitApp();
      } else {
        $ionicHistory.goBack();
        //navigator.app.goBack();
      }
    }, 999);*/

    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }
/*
    $scope.formModel = {};

    $scope.languageChanged = function(lan){
      console.log('selected: ', lan);
    }

    $scope.checkLanguage = function() {
      console.log('checkLanguage');
      console.log('formModel', $scope.formModel);
      console.log('member_language: ', $scope.language_audio);

      console.log('member_language: ', $scope.member_language);

    }
*/


 $scope.memberPhotoCapture = function() {
        //alert("its working")
        //if(isPhoneGap()){
           if ($rootScope.debug) {

              $scope.memberPhotoNext();
           } else {

          $ionicPlatform.ready(function() {
            console.log("its working");
            var options = {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 680,
              targetHeight: 400,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false,
              correctOrientation:true
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
              $scope.preview_photo = "data:image/jpeg;base64," + imageData;

              image_src = imageData;

              $scope.photoPreview = image_src;

              console.log('camera image');
              console.log(image_src);

              $ionicLoading.show({
                 template: 'Uploading...'
              });

              apiService.upload_image(image_src, 'picture', $scope.policy_number, $rootScope.loginToken, function(response, error){
                console.log('camera image upload: ', response);
                $ionicLoading.hide();

                if(response.data.error == false){
                  if(response.data.success == true){
                    // cont
                    $scope.photosuccess = true;
                  } else {
                    // err
                    $scope.photosuccess = false;

                    var alertPopup = $ionicPopup.alert({
                     title: 'Upload Error',
                     template: 'The photo could not be uploaded. Please take another one and try again.'
                    });
                  }
                } else {
                  $scope.showPopup('Error', response.data.message);
                }
              });

            }, function(err) {
              // error
              $scope.photosuccess = false;
              console.log(err);

              var alertPopup = $ionicPopup.alert({
               title: 'Photo Error',
               template: 'The photo could not be processed, please try again.'
              });
            });

          }, false);
          }
        // }else{
        //       console.log("Is not phoneGap");
        //      // create file input without appending to DOM
        //       var fileInput = document.createElement('input');
        //       fileInput.setAttribute('type', 'file');

        //       fileInput.onchange = function() {
        //         var file = fileInput.files[0];
        //         var reader = new FileReader();
        //         reader.readAsDataURL(file);
        //         var imageData = reader.result;
        //         reader.onloadend = function () {
        //         // strip beginning from string
        //           var imageData = reader.result.replace(/data:image\/jpeg;base64,/, '');
        //           //console.log(encodedData);
        //           console.log('Image Data : '+imageData);

        //             $scope.preview_photo = "data:image/jpeg;base64," + imageData;

        //             image_src = imageData;

        //             $scope.photoPreview = image_src;

        //             console.log('camera image');
        //             console.log(image_src);

        //             $ionicLoading.show({
        //                template: 'Uploading...'
        //             });

        //             apiService.upload_image(image_src, 'picture', $scope.policy_number, $rootScope.loginToken, function(response, error){
        //               console.log('camera image upload: ', response);
        //               $ionicLoading.hide();

        //               if(response.data.error == false){
        //                 if(response.data.success == true){
        //                   // cont
        //                   $scope.photosuccess = true;
        //                 } else {
        //                   // err
        //                   $scope.photosuccess = false;

        //                   var alertPopup = $ionicPopup.alert({
        //                    title: 'Upload Error',
        //                    template: 'The photo could not be uploaded. Please take another one and try again.'
        //                   });
        //                 }
        //               } else {
        //                 $scope.showPopup('Error', response.data.message);
        //               }
        //             });
        //         };
        //       };

        //       fileInput.click();
        // }
      
      }

      $scope.memberPhotoNext = function(){
        $scope.memberphoto = false;
        $scope.membersignature = true;
      }

      $scope.backMemberPhoto = function(){ // member language
        $scope.preferredlang = true;
        $scope.memberphoto = false;
      }

}])

.controller('ResetPasswordCtrl', ['$rootScope', '$scope', 'apiService', '$state', '$ionicHistory', '$location', '$ionicModal', '$timeout', '$ionicPopup', '$ionicLoading', function ($rootScope, $scope, apiService, $state, $ionicHistory, $location, $ionicModal, $timeout, $ionicPopup, $ionicLoading) {
    console.log('ResetPasswordCtrl loaded');

    $scope.resetData = { username: '' };

    $scope.doReset = function() {
      if($scope.resetData.username != ''){
        $rootScope.statusLoading();

        apiService.reset_password($scope.resetData.username, function(response, error){
          console.log('reset:', response.data);
          if(response.data.success == true){
            $scope.showPopup('Success', response.data.message);
          } else {
            $scope.showPopup('Reset Error', response.data.message);
          }

          $ionicLoading.hide();
        });
      } else {
        $scope.showPopup('Username Error', 'Username may not be empty');
      }
    }
}])

.controller('CreditLifeCtrl', ['$sce', '$rootScope', '$ionicModal', '$scope', 'apiService', '$state', '$location', '$ionicPopup', '$ionicLoading', '$ionicPlatform', '$cordovaCamera', '$cordovaMedia', '$ionicHistory', 'cacheSrcStorage', 'Config', function ($sce, $rootScope, $ionicModal, $scope, apiService, $state, $location, $ionicPopup, $ionicLoading, $ionicPlatform, $cordovaCamera, $cordovaMedia, $ionicHistory, cacheSrcStorage, Config) {
    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }
    /*$scope.prm_dob_month = '02';
    $scope.prm_dob_day = '15';
    $scope.customer_idcell = '1234567890';*/

    // status 99 = jump sig, no renewal or sms
    // status 0 = jump first page, no renewal or sms
    // status 1 = sms dets / renewal
    // status 44/22 = show status


      console.log('CreditLifeCtrl');

      //$rootScope.pageTitle = 'Credit Life';

      //console.log('$rootScope.pageTitle', $rootScope.pageTitle);
      if (isPhoneGap()) {
          $scope.isPhoneGap = true;
      } else {
          $scope.isPhoneGap = false;
      }
      $scope.member = {member_policy_number:''};

      var productID = $state.params.product_id;
      var policyNumber = $state.params.policy_number;
      $scope.policy_number = policyNumber;

      $scope.language_audio = {};
      $scope.member_language = 'english';

      // https://stackoverflow.com/a/36729110
      // ion-radio model usage.
      $scope.formModel = {};
      $scope.langAudioUrl = "";

      $sce.trustAsHtml($scope.langAudioUrl);

      $scope.languageTerms = function(member_language) {
        console.log('member_language_url: ', $scope.language_audio[member_language]);
        var url = $scope.language_audio[member_language];

        $scope.langAudioUrl = '<audio controls><source src="'+ url +'" type="audio/mpeg">Your browser does not support the audio element.</audio>';
      };

      $ionicPlatform.ready(function() {

        $scope.playTerms = function(member_language) {
           console.log('member_language: ', member_language);

          console.log('$scope.formModel.member_language: ', $scope.formModel.member_language);

          console.log('member_language_url: ', $scope.language_audio[member_language]);
          var track = '';
/*
          if($scope.language_audio[member_language]){
            var url = $scope.language_audio[member_language];

            if(url){
              track = 'http://demo.spazapp.co.za/assets/uploads/insurance/terms_audio/' + url;
            } else {
              track = 'http://demo.insurapp.co.za/assets/uploads/insurance/terms_audio/9322e-english----whatsapp-audio-2017-08-29-at-12.49.41.mp4';
            }
          } else {
            track = 'http://demo.insurapp.co.za/assets/uploads/insurance/terms_audio/9322e-english----whatsapp-audio-2017-08-29-at-12.49.41.mp4';
          }
*/

          if ($rootScope.currentAudio != null) {
            $rootScope.currentAudio.pause();
            $rootScope.currentAudio.currentTime = 0;
          }

          //track_file = cacheSrcStorage.get(track);

          $rootScope.currentAudio = document.getElementById('audio-' + member_language);
          audioSrc = $rootScope.currentAudio.getAttribute('src');
          console.log('audio src', audioSrc);

          $rootScope.currentAudio.play();



          //$scope.playAudio(audioSrc);


          //console.log('track_file: ', track_file);

          //$scope.playAudio(track_file);
        }

        $scope.playAudio = function(src) {
            console.log('play: ', src );
            $rootScope.currentAudio = $cordovaMedia.newMedia(src, null, null, mediaStatusCallback);
            $rootScope.currentAudio.play();
        }

        $scope.stopAudio = function() {
            $rootScope.currentAudio.stop();
        }

        var mediaStatusCallback = function(status) {
            if(status == 1) {
                $ionicLoading.show({template: 'Loading...'});
            } else {
                $ionicLoading.hide();
            }
        }


        function getMediaURL(s) {
            if(device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
            return s;
        }

      });

      var nowYear = new Date().getFullYear();
      var yearStart = (nowYear - 74);
      var yearEnd = (nowYear - 18);

      // -- -- -- -- -- --
      var dob_dep_years = new Array();
      for ( ccyy = yearStart; ccyy <= nowYear; ccyy++ ) {
        dob_dep_years.push(ccyy);
      }

      $scope.dob_dep_years = dob_dep_years;

      // -- -- -- -- -- --
      var dob_years = new Array();
      for ( ccyy = yearStart; ccyy <= yearEnd; ccyy++ ) {
        dob_years.push(ccyy);
      }

      $scope.dob_years = dob_years;

      var dob_months = new Array();
      for ( mm = 1; mm <= 12; mm++ ) {

        if (mm <= 9) {
          display_mm = '0' + mm;
        } else {
          display_mm = mm;
        }

        dob_months.push(display_mm);
      }

      $scope.dob_months = dob_months;


      var dob_days = new Array();
      for ( dd = 1; dd <= 31; dd++ ) {

        if (dd <= 9) {
          display_dd = '0' + dd;
        } else {
          display_dd = dd;
        }

        dob_days.push(display_dd);
      }

      $scope.dob_days = dob_days;

      // --- -- -- -- --

      console.log('CreditLifeCtrl');
      console.log($scope.appDesign);

      $scope.statusLoading();

      $scope.isFuneral = false;
      $scope.showDependants = false;
      $scope.noDependants = true;

      $scope.loan_amount = '0';
      $scope.loan_term = '0';
      $scope.dependantsMax = 5;
      $scope.dependantAvailSlots = 5;
      $scope.dob_year = "1970";
      $scope.dob_month = "01";
      $scope.dob_day = "01";
      $scope.Over65 = false;
      $scope.productDescription = '';


      apiService.get_product_details(productID, $rootScope.loginToken, function(response, error){
          console.log('get_product_details', response.data.data);

          if(response.data.error == false){
            $scope.product_detail = response.data.data.product;
            $rootScope.pageTitle = $scope.product_detail.name;

            var settings = $scope.product_detail.settings;

            console.log('product_detail', $scope.product_detail);

            $scope.productDescription = $scope.product_detail.description;

            if($scope.product_detail.type_id == 1 || $scope.product_detail.type_id == 4){
              $scope.isFuneral = true;

              if($scope.product_detail.dependants > 0){
                $scope.dependantsMax = $scope.product_detail.dependants;
                $scope.dependantAvailSlots = $scope.product_detail.dependants;
                $scope.noDependants = false;
              } else {
                $scope.noDependants = true;
              }
            }

            if($scope.product_detail.type_id == 4){
              $scope.Over65 = true;
            }

            for(var i in settings){
                var item = settings[i];

                if(item['name'] == "loan_min"){
                  $scope.loan_min = item['value'];
                  //$scope.loan_amount = item['value'];
                }
                if(item['name'] == "loan_max"){
                  $scope.loan_max = item['value'];
                }
                if(item['name'] == "term_min"){
                  $scope.term_min = item['value'];
                  $scope.loan_term = item['value'];
                }
                if(item['name'] == "term_max"){
                  $scope.term_max = item['value'];
                }
                if(item['name'] == "term_unit"){
                  $scope.term_unit = item['value'];
                }
            }

            $scope.terms_audio = $scope.product_detail.terms_audio;

            for(var i in $scope.product_detail.terms_audio){
                var termaudio = $scope.product_detail.terms_audio[i];

                if(!$scope.language_audio[termaudio.language]){
                  $scope.language_audio[termaudio.language] = termaudio.file;

                  console.log(termaudio);

                  console.log('cache: ', termaudio.file);
                  cacheSrcStorage.get(Config.audioUrlPrefix + termaudio.file);

                }
            }
          } else {

          }

          $scope.statusLoadingDone();

      });

      $scope.languageChanged = function(item) {
          console.log("Selected: ", item);
          $scope.member_language = item.language;
      };


      $scope.is_mobile = true;
      $scope.is_new = true;

      $scope.loanbirthselected = false;
      $scope.policycalculated = false;

      $scope.loaninfo = true;
      $scope.loanchoose = false;
      $scope.loanreview = false;

      $scope.memberdetails = false;
      $scope.additionaldetails = false;
      $scope.preferredlang = false;
      $scope.membersignature = false;

      $scope.member_sa_id = '';

      $scope.memberphoto = false;
      $scope.photosuccess = true;
      $scope.preview_photo = '';
      $scope.signsuccess = false;
      $scope.sign_photo = '';
      $scope.submit_error_count = 0;
      $scope.dependantList = [];

      $scope.prePopulated = false;

      //10,11,13,14,15,16,17

      $scope.loancomplete = false;
      $scope.loanrenew = false;

      $scope.buyInfo = function(){ // loan product review details
        $scope.loanchoose = true;
        $scope.loaninfo = false;
      }

      $scope.backInfo = function(){ 
        $scope.loanchoose = false;
        $scope.loaninfo = true;

        $ionicHistory.nextViewOptions({
          disableBack: false,
          historyRoot: true
        });

        $state.go('app.home');
      }

      if(policyNumber){
        $rootScope.statusLoading();

        apiService.get_policy_info(policyNumber, $rootScope.loginToken, function(response, error){
            console.log('get_policy_info: ', response.data.data.policies);
            $scope.policyData = response.data.data.policies;
            $scope.statusLoadingDone();

            $scope.policy_number = $scope.policyData.policy_number;
            $scope.member.member_policy_number = $scope.policyData.policy_wording_id;

            $scope.member_name = $scope.policyData.first_name;
            $scope.member_surname = $scope.policyData.last_name;
            if($scope.policyData.sa_id != ''){
              $scope.member_sa_id = parseInt($scope.policyData.sa_id);
            }
            //$scope.dob_year =
            $scope.member_passport = parseInt($scope.policyData.passport_number);
            $scope.member_cell = parseInt($scope.policyData.tel_cell);
            $scope.member_email = $scope.policyData.email_address;
            $scope.member_postalcode = $scope.policyData.postal_code;
            $scope.member_benefactor_name = $scope.policyData.beneficiary_name;
            $scope.member_benefactor_idnumber = parseInt($scope.policyData.beneficiary_sa_id);
            $scope.member_language = $scope.policyData.language;
            $scope.member_policy_number = $scope.policyData.policy_wording_id;
            $scope.customer_idcell = $scope.policyData.sa_id;
            
            $scope.prePopulated = true;

            var dobSplit = $scope.policyData.dob.split('-');

            if(dobSplit.length == 3){
              $scope.dob_year = dobSplit[0];
              $scope.dob_month = dobSplit[1];
              $scope.dob_day = dobSplit[2];

              $scope.loanbirthselected = true;
            }

            if($scope.policyData.picture){
              $scope.preview_photo = Config.urlPrefix + 'assets/uploads/insurance/pictures/' + $scope.policyData.picture;
              $scope.photosuccess = true;
            }

            if($scope.policyData.signature){
              $scope.sign_photo = Config.urlPrefix + 'assets/uploads/insurance/signatures/' + $scope.policyData.signature;
              $scope.signsuccess = true;
            }

            $scope.loan_amount = $scope.policyData.data.loan_amount;
            $scope.loan_term = $scope.policyData.data.loan_term;
            $scope.loan_policy = $scope.policyData.premium;

            $scope.loanrenew = true;

            $scope.loanbirthselected = true;
            $scope.policycalculated = true;

            if($scope.policyData.sale_complete != '1'){
               $scope.loaninfo = false;
               $scope.loanchoose = false;
               $scope.membersignature = true;
               $scope.loanrenew = false;
            }
        });
      }

      $scope.id_number_change = function(id_number){
        if(typeof id_number != 'undefined'){
          if(id_number.length == 13){
            $scope.loanbirthselected = true;
          } else {
            $scope.loanbirthselected = false;
          }
        } else {
          $scope.loanbirthselected = false;
        }
      }


      $scope.calculatePolicy = function(loan_amount, loan_term, id_number){
        if (typeof loan_amount == 'undefined' || typeof loan_term == 'unedfined') {
          return;
        }

        $scope.loan_amount = loan_amount;
        $scope.loan_term = loan_term;

        var tempDate = new Date(id_number.substring(0, 2), id_number.substring(2, 4) - 1, id_number.substring(4, 6));
        var id_year = tempDate.getFullYear();
        var dob_year = id_number.substr(0, 2);
        var dob_month = id_number.substr(2, 2);
        var dob_day = id_number.substr(4, 2);

        var current_year = (new Date()).getFullYear();

        if(id_year <= (current_year-98)){
          dob_year = "20" + dob_year;
        } else {
          dob_year = "19" + dob_year;
        }

        console.log(dob_year + '-' + dob_month + '-' + dob_day);

        $scope.dob_year = dob_year;
        $scope.dob_month = dob_month;
        $scope.dob_day = dob_day;

        $scope.dob = dob_year + '-' + dob_month + '-' + dob_day;

        console.log($scope.loan_amount + ' / ' + $scope.loan_term + ' / ' + dob_year);

        $scope.statusLoading('Calculating...');

        apiService.get_product_premium($scope.product_detail['id'], loan_amount, loan_term, $scope.dob, $rootScope.loginToken, function(response, error){
          console.log('get_product_premium', response.data.data);

          if(response.data.error == false){
            //$scope.loan_amount =  response.data.data['premium'];
            $scope.loan_policy = response.data.data['premium'];
            $scope.policycalculated = true;
          } else {
            $scope.showPopup('Error', response.data.message);
          }

          $scope.statusLoadingDone();
        });
      }

      $scope.submitLoan = function(loan_amount, loan_term, id_number){
        $scope.loan_amount = loan_amount;
        $scope.loan_term = loan_term;
        id_number = id_number.toString();
        $scope.member_sa_id = parseInt(id_number);
        $scope.customer_idcell = id_number;

        var tempDate = new Date(id_number.substring(0, 2), id_number.substring(2, 4) - 1, id_number.substring(4, 6));
        var id_year = tempDate.getFullYear();
        var dob_year = id_number.substr(0, 2);
        var dob_month = id_number.substr(2, 2);
        var dob_day = id_number.substr(4, 2);

        var current_year = (new Date()).getFullYear();

        if(id_year <= (current_year-98)){
          dob_year = "20" + dob_year;
        } else {
          dob_year = "19" + dob_year;
        }

        console.log(dob_year + '-' + dob_month + '-' + dob_day);

        $scope.dob_year = dob_year;
        $scope.dob_month = dob_month;
        $scope.dob_day = dob_day;

        $scope.dob = dob_year + '-' + dob_month + '-' + dob_day;

        $ionicLoading.show({
           template: 'Loading...'
        });

        apiService.get_product_premium($scope.product_detail['id'], $scope.loan_amount, $scope.loan_term, $scope.dob, $rootScope.loginToken, function(response, error){
          console.log('get_product_premium', response.data.data);

          if(response.data.error == false){
            //$scope.loan_amount =  response.data.data['premium'];
            $scope.loan_policy = response.data.data['premium'];

            $scope.loanchoose = false;
            $scope.loanreview = true;
          } else {
            $scope.showPopup('Error', response.data.message);
          }

          $ionicLoading.hide();
        });
      }

      $scope.completeLoan = function(customer_idcell){
        $scope.customer_idcell = customer_idcell;
        console.log("customer_idcell: " + $scope.customer_idcell);

        //920506. IAFS1095

        //7001022341341
        //7001022341342
        //8606115145084
        //8606115145081
        var hasError = false;

        //var dob = new String($scope.dob_year).substring(2, 4) + $scope.dob_month + $scope.dob_day;
        //var idDob = new String(customer_idcell).substring(0, 6);

       /*if(customer_idcell.substring(0, 1) != "0"){
          if(dob != idDob){
            hasError = true;

            var alertPopup = $ionicPopup.alert({
             title: 'Error!',
             template: 'That number/id does not match your date of birth given.'
            });
          }
        }*/

        if(!hasError){
          $ionicLoading.show({
             template: 'Loading...'
          });

          if($scope.loanrenew == false){
            // first get policy number
            apiService.get_policy_number($scope.product_detail['id'], $scope.customer_idcell, $rootScope.loginToken, function(response, error){
              console.log('get_policy_number');

              if(response.data.error == false){
                console.log(response.data.data.policy_number);

                $scope.policy_number = response.data.data.policy_number;
                var savedapplication = response.data.data.application_data;

                $scope.member_name = savedapplication.first_name;
                $scope.member_surname = savedapplication.last_name;
                $scope.member_sa_id = parseInt(savedapplication.sa_id);

                if(savedapplication.sa_id != ''){
                  $scope.member_sa_id = parseInt(savedapplication.sa_id);
                }

                $scope.member_passport = parseInt(savedapplication.passport_number);
                $scope.member_cell = savedapplication.tel_cell;
                $scope.member_email = savedapplication.email_address;
                $scope.member_postalcode = savedapplication.postal_code;
                $scope.member_benefactor_name = savedapplication.beneficiary_name;
                $scope.member_benefactor_idnumber = parseInt(savedapplication.beneficiary_sa_id);
                $scope.member_language = savedapplication.language;
                //$scope.policy_wording_id = savedapplication.policy_wording_id;
                $scope.member.member_policy_number = savedapplication.policy_wording_id;

                if(savedapplication.sa_id || savedapplication.passport_number){
                  $scope.prePopulated = true;
                } else {
                  $scope.prePopulated = false;
                }

                if(savedapplication.picture){
                  $scope.preview_photo = Config.urlPrefix + 'assets/uploads/insurance/pictures/' + savedapplication.picture;
                  $scope.photosuccess = true;
                }

                if(savedapplication.signature){
                  $scope.sign_photo = Config.urlPrefix + 'assets/uploads/insurance/signatures/' + savedapplication.signature;
                  $scope.signsuccess = true;
                }

                console.log('saved policy data: ', response.data.data.application_data);

                // get customer
                apiService.get_customer($scope.product_detail['id'], $scope.customer_idcell, $rootScope.loginToken, function(response, error){
                    console.log('get_customer', response);

                    $scope.loanchoose = false;
                    $scope.loanreview = false;
                    $scope.memberdetails = false;
                    $scope.additionaldetails = false;
                    $scope.preferredlang = false;
                    $scope.memberphoto = false;
                    $scope.membersignature = false;

                    if(response.data.error == false){

                        if(error == false){
                          
                              var customer = response.data.data.customer[0];

                                if(customer.picture){
                                  $scope.preview_photo = Config.urlPrefix + 'assets/uploads/insurance/pictures/' + customer.picture;
                                  $scope.photosuccess = true;
                                }

                                if(customer.signature){
                                  $scope.sign_photo = Config.urlPrefix + 'assets/uploads/insurance/signatures/' + customer.signature;
                                  $scope.signsuccess = true;
                                }

                                $scope.is_new = false;
                                console.log("customer found");

                                console.log('customer data', customer);

                                $scope.member_name = customer.first_name;
                                $scope.member_surname = customer.last_name;
                                $scope.member_sa_id = parseInt(customer.sa_id);

                                if(customer.sa_id != ''){
                                  $scope.member_sa_id = parseInt(customer.sa_id);
                                }

                                $scope.member.member_policy_number = customer.policy_wording_id;

                                /*var dob_array = customer.dob.split("-");
                                $scope.dob_year = dob_array[0];
                                $scope.dob_month = dob_array[1];
                                $scope.dob_day = dob_array[2];*/

                                $scope.member_passport = parseInt(customer.passport_number);
                                $scope.member_cell = customer.tel_cell;
                                $scope.member_email = customer.email_address;
                                $scope.member_postalcode = customer.postal_code;
                                $scope.member_benefactor_name = customer.beneficiary_name;
                                $scope.member_benefactor_idnumber = parseInt(customer.beneficiary_sa_id);

                                if(customer.sa_id || customer.passport_number){
                                  $scope.prePopulated = true;
                                } else {
                                  $scope.prePopulated = false;
                                }

                                /*$scope.loancomplete = true;
                                console.log(response.data.data);*/
                              $scope.memberdetails = true;
                              $ionicLoading.hide();
                        
                        } else {
                            var alertPopup = $ionicPopup.alert({
                             title: 'Error!',
                             template: 'That number/id was not allowed'
                            });

                            alertPopup.then(function(res) {
                                $scope.loanchoose = true;
                                $scope.loanreview = false;
                            });
                        }
                       // console.log(response.data);
                     } else {
                      $scope.showPopup('Error', response.data.message);
                     }

                     $ionicLoading.hide();
                 }); // end of customer
              } else {
                $scope.showPopup('Error', response.data.message);
              }

            }); // end of policy number
          } else {
            $scope.loanchoose = false;
            $scope.loanreview = false;
            $scope.memberdetails = false;
            $scope.additionaldetails = false;
            $scope.preferredlang = false;
            $scope.memberphoto = false;
            $scope.membersignature = false;

            $scope.is_new = false;
            $scope.prePopulated = true;
            $scope.memberdetails = true;

            $ionicLoading.hide();
          }
        }
      }

      $scope.backLoanComplete = function(){ // loan premium review details
        $scope.loanchoose = true;
        $scope.loanreview = false;
      }

      $scope.saveMemberDetails = function(member_name, member_surname, member_sa_id){
        $scope.member_name = member_name;
        $scope.member_surname = member_surname;
        $scope.member_sa_id = member_sa_id;
        //$scope.member_passport = member_passport;

        var user_data = new Object();

        user_data.product_id = productID;
        user_data.premium = $scope.product_detail.premium;
        user_data.product_data = { loan_amount: $scope.loan_amount, loan_term: $scope.loan_term };
        user_data.first_name = $scope.member_name;
        user_data.last_name = $scope.member_surname;
        user_data.sa_id = $scope.member_sa_id;
        user_data.dob = $scope.dob_year + '-' + $scope.dob_month + '-' + $scope.dob_day;
       // user_data.passport_number = $scope.member_passport;

        var hasError = false;

        //7001032341341

        var dob = new String($scope.dob_year).substring(2, 4) + $scope.dob_month + $scope.dob_day;
        var idDob = new String($scope.member_sa_id).substring(0, 6);

        console.log(dob + ' / ' + idDob);

        if(dob != idDob){
          hasError = true;

          var alertPopup = $ionicPopup.alert({
           title: 'Error!',
           template: 'That number/id does not match your date of birth given.'
          });
        }

        if(!hasError){
            $ionicLoading.show({
               template: 'Saving Application...'
            });

            apiService.save_policy($scope.policy_number, user_data, $rootScope.loginToken, function(response, error){
                console.log('saved_policy', response);
                if(response.data.error == true){
                  $scope.showPopup('Error', response.data.message);
                }

                $ionicLoading.hide();
            });
          }
      }

      $scope.memberDetails = function(member_name, member_surname, member_sa_id){
        $scope.member_name = member_name;
        $scope.member_surname = member_surname;
        $scope.member_sa_id = member_sa_id;

        var hasError = false;

        //7001022341341

        var dob = new String($scope.dob_year).substring(2, 4) + $scope.dob_month + $scope.dob_day;
        var idDob = new String($scope.member_sa_id).substring(0, 6);

        console.log(dob + ' / ' + idDob);

        if(dob != idDob){
          hasError = true;

          var alertPopup = $ionicPopup.alert({
           title: 'Error!',
           template: 'That number/id does not match your date of birth given.'
          });
        }

        if(!hasError){
          $scope.memberdetails = false;
          $scope.additionaldetails = true;
        }
      }

      $scope.validateMemberDetails = function(member_name, member_surname, member_sa_id){
        if(member_name && member_surname && member_sa_id){
          return false; // not to disable
        } else {
          return true;  // disable
        }
      }

      $scope.backMemberDetails = function(){ // loan premium review details
        $scope.memberdetails = false;
        $scope.loanchoose = false;
        $scope.loanreview = true;
      }

      $scope.SaveMemberAdditionalDetails = function(member_cell, member_email, member_postalcode, member_benefactor_name, member_benefactor_idnumber){
        $scope.member_cell = member_cell;
        $scope.member_email = member_email;
        $scope.member_postalcode = member_postalcode;
        $scope.member_benefactor_name = member_benefactor_name;
        $scope.member_benefactor_idnumber = member_benefactor_idnumber;

        var user_data = new Object();
        user_data.product_id = productID;
        user_data.premium = $scope.product_detail.premium;
        user_data.product_data = { loan_amount: $scope.loan_amount, loan_term: $scope.loan_term };

        user_data.tel_cell = $scope.member_cell;
        user_data.email_address = $scope.member_email;
        user_data.postal_code = $scope.member_postalcode;
        user_data.beneficiary_name = $scope.member_benefactor_name;
        user_data.beneficiary_sa_id = $scope.member_benefactor_idnumber;

        $ionicLoading.show({
           template: 'Saving Application...'
        });

        apiService.save_policy($scope.policy_number, user_data, $rootScope.loginToken, function(response, error){
            console.log('saved_policy', response);

            if(response.data.error == true){
              $scope.showPopup('Error', response.data.message);
            }

            $ionicLoading.hide();
        });
      }

      $scope.memberAdditionalDetails = function(member_cell, member_email, member_postalcode, member_benefactor_name, member_benefactor_idnumber){
        $scope.member_cell = member_cell;
        $scope.member_email = member_email;
        $scope.member_postalcode = member_postalcode;
        $scope.member_benefactor_name = member_benefactor_name;
        $scope.member_benefactor_idnumber = member_benefactor_idnumber;

        $scope.additionaldetails = false;

        if($scope.isFuneral && !$scope.noDependants){
          $scope.dependantList = [];

          $ionicLoading.show({
             template: 'Loading Dependants...'
          });

            apiService.get_dependants($scope.policy_number, $rootScope.loginToken, function(response, error){
                console.log('get_dependants', response.data.data);

                if(response.data.error == false){
                  $scope.dependantAvailSlots = response.data.data.available_slots;
                  var dependants = response.data.data.dependants;

                  for(var i in dependants){
                    var dependant = dependants[i];
                    var dob_split = dependant.dob.split('-');

                    dependant.dob_year = dob_split[0];
                    dependant.dob_month = dob_split[1];
                    dependant.dob_day = dob_split[2];

                    $scope.dependantList.push(dependant);
                  }
                } else {
                  $scope.showPopup('Error', response.data.message);
                }

                $ionicLoading.hide();
            });

            $scope.showDependants = true;
          } else {
            $scope.preferredlang = true;
          }
      }

       $scope.backMemberAdditionalDetails = function(){ // member details
        $scope.memberdetails = true;
        $scope.additionaldetails = false;
      }

      $scope.addDependant = function(first_name, last_name, dob_year, dob_month, dob_day, type) {
        $ionicLoading.show({
           template: 'Saving Dependant: ' +  first_name
        });

        var dob = dob_year + '-' + dob_month + '-' + dob_day;

        apiService.add_dependant($scope.policy_number, first_name, last_name, type, dob, $rootScope.loginToken, function(response, error){
            console.log('add_dependant', response);
            $ionicLoading.hide();

            if(response.data.error == false){
              $scope.formModel.dfirst_name = "";
              $scope.formModel.dlast_name = "";
              $scope.formModel.ddob_year = "";
              $scope.formModel.ddob_month = "";
              $scope.formModel.ddob_day = "";
              $scope.formModel.dtype = "";
            } else {
              $scope.showPopup('Error', response.data.message);
            }

            getDependants();
        });
      };

      $scope.removeDependant = function(id) {
        apiService.remove_dependant($scope.policy_number, id, $rootScope.loginToken, function(response, error){
            console.log('delete_dependant', response);
            $ionicLoading.hide();

            if(response.data.error == true){
              $scope.showPopup('Error', response.data.message);
            }

            getDependants();
        });
      };

      function getDependants(){
        $scope.dependantList = [];

        apiService.get_dependants($scope.policy_number, $rootScope.loginToken, function(response, error){
            console.log('get_dependants', response.data.data);

            if(response.data.error == false){
              $scope.dependantAvailSlots = response.data.data.available_slots;
              var dependants = response.data.data.dependants;

              for(var i in dependants){
                var dependant = dependants[i];
                var dob_split = dependant.dob.split('-');

                dependant.dob_year = dob_split[0];
                dependant.dob_month = dob_split[1];
                dependant.dob_day = dob_split[2];

                $scope.dependantList.push(dependant);
              }
            } else {
              $scope.showPopup('Error', response.data.message);
            }

            $ionicLoading.hide();
        });
      }

      $scope.nextDependant = function() {
        $scope.showDependants = false;
        $scope.preferredlang = true;
      };

      $scope.backDependant = function() {
        $scope.showDependants = false;
        $scope.additionaldetails = true;
      };

      $scope.SaveMemberPreferredLanguage = function(member_language, member_policy_number){
        $scope.member_language = member_language;
        $scope.member_policy_number = member_policy_number;

        var user_data = new Object();
        user_data.product_id = productID;
        user_data.premium = $scope.product_detail.premium;
        user_data.product_data = { loan_amount: $scope.loan_amount, loan_term: $scope.loan_term };

        user_data.language = $scope.member_language;
        user_data.policy_wording_id = $scope.member_policy_number;

        $ionicLoading.show({
           template: 'Saving Application...'
        });

        apiService.save_policy($scope.policy_number, user_data, $rootScope.loginToken, function(response, error){
            console.log('saved_policy', response);

            if(response.data.error == true){
              $scope.showPopup('Error', response.data.message);
            }

            $ionicLoading.hide();
        });
      }

      $scope.memberPreferredLanguage = function(member_language, member_policy_number){
        $scope.member_language = member_language;
        $scope.member_policy_number = member_policy_number;

        $ionicLoading.show({
           template: 'Verifying Policy Wording ID'
        });

        apiService.validate_policy_wording($scope.policy_number, member_policy_number, $rootScope.loginToken, function(response, error){
            console.log('validate_policy_wording', response);

            if(response.data.error == false){
              if(response.data.success){
                $scope.preferredlang = false;
                $scope.memberphoto = true;
              } else {
                // error
                var alertPopup = $ionicPopup.alert({
                 title: 'Policy ID Error',
                 template: response.data.message
                });
              }
            } else {
              $scope.showPopup('Error', response.data.message);
            }

            $ionicLoading.hide();
        });
      }

      $scope.backMemberPreferredLanguage = function(){ // member additional details
        if($scope.isFuneral && !$scope.noDependants){
          $scope.showDependants = true;
        } else {
          $scope.additionaldetails = true;
        }

        $scope.preferredlang = false;
      }


      $scope.file_changed = function(element) {
           $scope.$apply(function(scope) {
               var photofile = element.files[0];
               var reader = new FileReader();
               reader.onload = function(e) {
                  console.log(e);

                  var image_src = e.target.result;

                  $scope.preview_photo = "data:image/jpeg;base64," + image_src;
                  console.log(image_src);

                  $ionicLoading.show({
                     template: 'Uploading...'
                  });

                  apiService.upload_image(image_src, 'picture', $scope.policy_number, $rootScope.loginToken, function(response, error){
                    console.log('camera image upload: ', response);
                    $ionicLoading.hide();

                    if(response.data.error == false){
                      if(response.data.success == true){
                        // cont
                        $scope.photosuccess = true;
                      } else {
                        // err
                        $scope.photosuccess = false;

                        var alertPopup = $ionicPopup.alert({
                         title: 'Upload Error',
                         template: 'The photo could not be uploaded. Please take another one and try again.'
                        });
                      }
                    } else {
                      $scope.showPopup('Error', response.data.message);
                    }
                  });

               };
               reader.readAsDataURL(photofile);
           });
      };

     $scope.memberPhotoCapture = function() {
        //alert("its working")
        //if(isPhoneGap()){
           if ($rootScope.debug) {

              $scope.memberPhotoNext();
           } else {

          $ionicPlatform.ready(function() {
            console.log("its working");
            var options = {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 680,
              targetHeight: 400,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false,
              correctOrientation:true
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
              $scope.preview_photo = "data:image/jpeg;base64," + imageData;

              image_src = imageData;

              $scope.photoPreview = image_src;

              console.log('camera image');
              console.log(image_src);

              $ionicLoading.show({
                 template: 'Uploading...'
              });

              apiService.upload_image(image_src, 'picture', $scope.policy_number, $rootScope.loginToken, function(response, error){
                console.log('camera image upload: ', response);
                $ionicLoading.hide();

                if(response.data.error == false){
                  if(response.data.success == true){
                    // cont
                    $scope.photosuccess = true;
                  } else {
                    // err
                    $scope.photosuccess = false;

                    var alertPopup = $ionicPopup.alert({
                     title: 'Upload Error',
                     template: 'The photo could not be uploaded. Please take another one and try again.'
                    });
                  }
                } else {
                  $scope.showPopup('Error', response.data.message);
                }
              });

            }, function(err) {
              // error
              $scope.photosuccess = false;
              console.log(err);

              var alertPopup = $ionicPopup.alert({
               title: 'Photo Error',
               template: 'The photo could not be processed, please try again.'
              });
            });

          }, false);
          }
        // }else{
        //       console.log("Is not phoneGap");
        //      // create file input without appending to DOM
        //       var fileInput = document.getElementById("file-input");
        //       fileInput.setAttribute('type', 'file');

        //       fileInput.onchange = function() {
        //         var file = fileInput.files[0];
        //         var reader = new FileReader();
        //         reader.readAsDataURL(file);
        //         var imageData = reader.result;
        //         reader.onloadend = function () {
        //         // strip beginning from string
        //           var imageData = reader.result.replace(/data:image\/jpeg;base64,/, '');
        //           //console.log(encodedData);
        //           console.log('Image Data : '+imageData);

        //             $scope.preview_photo = "data:image/jpeg;base64," + imageData;

        //             image_src = imageData;

        //             $scope.photoPreview = image_src;
                    
        //             $ionicLoading.show({
        //                 template: 'Uploading...'
        //             });

        //             window.setTimeout(function() {


        //                   var dataURL = $scope.compress(50, 680, 'image/png');
          
        //                   photoBase64 = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

        //                   console.log('camera image');
        //                   console.log(photoBase64);

        //                   apiService.upload_image(photoBase64, 'picture', $scope.policy_number, $rootScope.loginToken, function(response, error){
        //                     console.log('camera image upload: ', response);
        //                     $ionicLoading.hide();

        //                     if(response.data.error == false){
        //                       if(response.data.success == true){
        //                         // cont
        //                         $scope.photosuccess = true;
        //                       } else {
        //                         // err
        //                         $scope.photosuccess = false;

        //                         var alertPopup = $ionicPopup.alert({
        //                          title: 'Upload Error',
        //                          template: 'The photo could not be uploaded. Please take another one and try again.'
        //                         });
        //                       }
        //                     } else {
        //                       $scope.showPopup('Error', response.data.message);
        //                     }
        //                   });
                      

        //               }, 700);
        //         };
        //       };

        //       fileInput.click();
        // }
      
      }

      $scope.memberPhotoNext = function(){
        $scope.memberphoto = false;
        $scope.membersignature = true;
      }

      $scope.backMemberPhoto = function(){ // member language
        $scope.preferredlang = true;
        $scope.memberphoto = false;
      }

      $scope.compress = function(quality, maxWidth, output_format){
        var mime_type = "image/jpeg";
        if (typeof output_format !== "undefined" && output_format == "png") {
            mime_type = "image/png";
        }

        var img = document.getElementById('smallImage');
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

      $scope.submit_error_count = 0;
      // Triggered on a button click, or some other target
      $scope.memberSignature = function() {
        $scope.data = {};

        //myPopup.then(function(res) {

            // show payment methods
            apiService.get_payment_options(productID, $rootScope.loginToken, function(response, error){
                console.log('get_payment_options', response.data.data);
                if(response.data.error == false){
                  $scope.payment_options = response.data.data.payment_options;

                  $ionicModal.fromTemplateUrl('templates/payments-modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                  }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                  });

                  $scope.$on('$destroy', function() {
                    $scope.modal.remove();
                    $scope.modal = '';
                  });
                } else {
                  $scope.showPopup('Error', response.data.message);
                }
            });

       // });
       };

       $scope.memberSignatureSave = function(){
          // save quote
          var user_data = new Object();

          user_data.product_id = productID;
          user_data.premium = $scope.product_detail.premium;
          user_data.product_data = { loan_amount: $scope.loan_amount, loan_term: $scope.loan_term };
          user_data.first_name = $scope.member_name;
          user_data.last_name = $scope.member_surname;
          user_data.sa_id = $scope.member_sa_id;
          user_data.dob = $scope.dob_year + '-' + $scope.dob_month + '-' + $scope.dob_day;
          user_data.passport_number = $scope.member_passport;
          user_data.tel_cell = $scope.member_cell;
          user_data.email_address = $scope.member_email;
          user_data.postal_code = $scope.member_postalcode;
          user_data.beneficiary_name = $scope.member_benefactor_name;
          user_data.beneficiary_sa_id = $scope.member_benefactor_idnumber;
          user_data.language = $scope.member_language;
          user_data.policy_wording_id = $scope.member_policy_number;
          user_data.is_quote = 1;

          if($scope.loanrenew){
            user_data.renewal = true;
          }

          console.log('user_data: save_policy', user_data);

          $ionicLoading.show({
             template: 'Submitting Application...'
          });

          apiService.complete_policy($scope.policy_number, user_data, $scope.paymentOption, $rootScope.loginToken, function(response, error){
              console.log('save_policy', response);
              $ionicLoading.hide();

              if(response.data.error == false){

                if(error != false){
                  if($scope.submit_error_count > 2){
                    var alertPopup = $ionicPopup.alert({
                     title: 'Submit Failed',
                     template: 'The application submission has failed 3 consecutive times, please consult your provider.'
                    });

                    alertPopup.then(function(res) {
                        resetCreditCtrl();

                        $ionicHistory.nextViewOptions({
                           disableBack: true
                        });

                        //$location.path(goTo);
                        $state.go('app.home');
                    });
                  } else {
                    var alertPopup = $ionicPopup.alert({
                     title: 'Submit Error',
                     template: 'There was an error submitting the application: <b>' + error.data.message + '</b>'
                    });
                  }
                  console.log('save_policy error: ', error);
                  console.log('submit_error_count: ', $scope.submit_error_count);

                  $scope.submit_error_count++;
                } else {
                  $rootScope.loginData.wallets = response.data.data.wallets;
                  $scope.submit_error_count = 0;

                  console.log(response.data.data.quote_id, response.data);
                  
                  var alertPopup = $ionicPopup.alert({
                     title: 'Submit Success',
                     template: 'Thank you for completing this quote. Quote Number: <b>' + response.data.data.quote_id + '</b>'
                  });

                  resetCreditCtrl();

                  $ionicHistory.nextViewOptions({
                      disableBack: true
                  });

                  //$location.path(goTo);
                  $state.go('app.home');
                }
              } else {
                $scope.showPopup('Error', response.data.message);
              }
          });  
       }

      $scope.paymentSelected = function(paymentOption){
        console.log('paymentOption: ', paymentOption);
        $scope.paymentOption = paymentOption;

        $scope.modal.hide();
        $scope.modal.remove();

        //$scope.$on('modal.hidden', function() {
          document.getElementById("bodytag").classList.remove("modal-open");

          var confirmPopup = $ionicPopup.confirm({
           title: 'Payment Method',
           template: 'You have selected *<b>' + $scope.paymentOption + '</b>* as your payment method'
         });

         confirmPopup.then(function(res) {

           if(res) {
             // send data
              var user_data = new Object();

              user_data.product_id = productID;
              user_data.premium = $scope.product_detail.premium;
              user_data.product_data = { loan_amount: $scope.loan_amount, loan_term: $scope.loan_term };
              user_data.first_name = $scope.member_name;
              user_data.last_name = $scope.member_surname;
              user_data.sa_id = $scope.member_sa_id;
              user_data.dob = $scope.dob_year + '-' + $scope.dob_month + '-' + $scope.dob_day;
              user_data.passport_number = $scope.member_passport;
              user_data.tel_cell = $scope.member_cell;
              user_data.email_address = $scope.member_email;
              user_data.postal_code = $scope.member_postalcode;
              user_data.beneficiary_name = $scope.member_benefactor_name;
              user_data.beneficiary_sa_id = $scope.member_benefactor_idnumber;
              user_data.language = $scope.member_language;
              user_data.policy_wording_id = $scope.member_policy_number;

              if($scope.loanrenew){
                user_data.renewal = true;
              }

              console.log('user_data: complete_policy', user_data);

              $ionicLoading.show({
                 template: 'Submitting Application...'
              });

              apiService.complete_policy($scope.policy_number, user_data, $scope.paymentOption, $rootScope.loginToken, function(response, error){
                  console.log('complete_policy', response);
                  $ionicLoading.hide();

                  if(response.data.error == false){

                    if(error != false){
                      if($scope.submit_error_count > 2){
                        var alertPopup = $ionicPopup.alert({
                         title: 'Submit Failed',
                         template: 'The application submission has failed 3 consecutive times, please consult your provider.'
                        });

                        alertPopup.then(function(res) {
                            resetCreditCtrl();

                            $ionicHistory.nextViewOptions({
                               disableBack: true
                            });

                            //$location.path(goTo);
                            $state.go('app.home');
                        });
                      } else {
                        var alertPopup = $ionicPopup.alert({
                         title: 'Submit Error',
                         template: 'There was an error submitting the application: <b>' + error.data.message + '</b>'
                        });
                      }
                      console.log('complete_policy error: ', error);
                      console.log('submit_error_count: ', $scope.submit_error_count);

                      $scope.submit_error_count++;
                    } else {
                      $rootScope.loginData.wallets = response.data.data.wallets;
                      $rootScope.application_id = response.data.data.policy_id;
                      $scope.submit_error_count = 0;
                      $scope.loancomplete = true;
                    }
                  } else {
                    $scope.showPopup('Error', response.data.message);
                  }
              });
           }
         });
        //});
      }

      $scope.backMemberSign = function(){ // member take photo
        $scope.memberphoto = true;
        $scope.membersignature = false;
      }

      $scope.cancelLoan = function(){
        resetCreditCtrl();
        $scope.loanchoose = false;
        $scope.loanreview = false;
        $scope.memberdetails = false;
        $scope.additionaldetails = false;
        $scope.preferredlang = false;
        $scope.memberphoto = false;
        $scope.membersignature = false;

        $ionicHistory.nextViewOptions({
           disableBack: true
        });

        //$location.path(goTo);
        $state.go('app.home');

      }

      $scope.closeLoan = function(){
        resetCreditCtrl();
        $scope.resetPanels();

        $ionicHistory.nextViewOptions({
           disableBack: true
        });

        //$location.path(goTo);
        $state.go('app.home');
      }


      $scope.reSignSignature = function() {
          $scope.sign_photo = '';
          signaturePad.clear();
          $scope.signsuccess = false;
      }

      if(isPhoneGap()){
        var canvas = document.getElementById('signatureCanvas');
      }else{
        var canvas = document.getElementById('signatureCanvasBrowser');
      }
      
      if (typeof canvas != 'undefined') {
        var signaturePad = new SignaturePad(canvas);
      }

      $scope.clearCanvas = function() {
          signaturePad.clear();
      }

      $scope.saveCanvas = function() {
          var sigImg = signaturePad.toDataURL();
          var sigImgParts = sigImg.split('data:image/png;base64,');
          image_src = sigImgParts[1];

          $scope.signature = sigImg;
          upload_img_src = image_src.trim();

          $scope.statusLoading('Uploading signatue, please be patient');

          apiService.upload_image(upload_img_src, 'signature', $scope.policy_number, $rootScope.loginToken, function(response, error){
            console.log('signture image upload: ', response);

            $scope.statusLoadingDone();

            if(response.data.error == false){
              if(response.data.success == true){
                // cont
                $scope.signsuccess = true;
              } else {
                // err
                $scope.signsuccess = false;

                var alertPopup = $ionicPopup.alert({
                 title: 'Upload Error',
                 template: 'The signature could not be uploaded. Please try again.'
                });
              }
            } else {
              $scope.showPopup('Error', response.data.message);
            }
          });
      }

      function resetCreditCtrl(){
          $scope.loan_amount = '0';
          $scope.loan_term = '0';
          $scope.product_detail = '';

          $scope.loan_min = '';
          $scope.loan_max = '';
          $scope.term_min = '';
          $scope.term_max = '';
          $scope.term_unit = '';
          $scope.loan_policy = '';

          $scope.customer_idcell = '';

          $scope.member_name = '';
          $scope.member_surname = '';
          $scope.member_sa_id = '';

          $scope.dob_year = '';
          $scope.dob_month = '';
          $scope.dob_day = '';

          $scope.member_passport = '';
          $scope.member_cell = '';
          $scope.member_email = '';
          $scope.member_postalcode = '';
          $scope.member_benefactor_name = '';
          $scope.member_benefactor_idnumber = '';

          $scope.member_language = 'english';
          $scope.member_policy_number = '';

          $scope.loanchoose = true;
          $scope.loanreview = false;

          $scope.memberdetails = false;
          $scope.additionaldetails = false;
          $scope.preferredlang = false;
          $scope.memberphoto = false;
          $scope.membersignature = false;

          $scope.memberphoto = false;
          $scope.photosuccess = false;
          $scope.signsuccess = false;
          $scope.preview_photo = '';
          $scope.submit_error_count = 0;

          $scope.loancomplete = false;
      }
}])

.controller('SearchCtrl', ['$rootScope', '$scope', 'apiService', '$state', '$ionicHistory', '$location', '$ionicModal', '$timeout', '$ionicPopup', function ($rootScope, $scope, apiService, $state, $ionicHistory, $location, $ionicModal, $timeout, $ionicPopup) {
    console.log('SearchCtrl loaded');

    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }

    $scope.search = true;
    $scope.searchList = false;
    $scope.searchView = false;

    $scope.quote_number = 'QUOTE_';

    $scope.searchResults = [];

    $scope.submitSearch = function(id_number, policy_number, cellphone, quote_number){
      $scope.statusLoading('Please wait..');

      apiService.search_policies(id_number, policy_number, cellphone, 'QUOTE_' + quote_number, $rootScope.loginToken, function(response, error){
            console.log('search_policies: ', response.data.data);
            $scope.statusLoadingDone();
            //920506. IAFS1095 QUOTE_224

            //7001022341341
            //7001022341342

            if(response.data.data.status == 1){
              $scope.search = false;
              $scope.searchList = true;

              $scope.searchResults = response.data.data.policies;

              console.log($scope.searchResults);
            } else {
              $scope.showPopup('Error', response.data.message);
            }
      });

      $scope.showItem = function(policy_number){
        $scope.statusLoading('Please wait..');

        apiService.get_policy_info(policy_number, $rootScope.loginToken, function(response, error){
            console.log('get_policy_info: ', response.data.data.policies);
            $scope.policyData = response.data.data.policies;
            $scope.statusLoadingDone();

            $scope.search = false;
            $scope.searchList = false;
            $scope.searchView = true;
        });
      }

      $scope.complete = function(product_id, policy_number){
        $scope.search = true;
        $scope.searchList = false;
        $scope.searchView = false;
        $scope.searchResults = [];
        $scope.policyData = {};

        $scope.statusLoading('Please wait..');

        apiService.get_product_details(product_id, $rootScope.loginToken, function(response, error){
            console.log('get_product: ', response.data.data.product);
            var product = response.data.data.product;
            var method = '';

            switch(parseInt(product.type_id)){
              case 1:
                  method = 'app/funeral/' +  parseInt(product.id);
                break;
              case 2:
                  method = 'app/life-insurance/' +  parseInt(product.id);
                break;
              case 3:
                  method = 'app/credit-life/' +  parseInt(product.id);
                break;
              case 4:
                  method = 'app/funeral/' +  parseInt(product.id);
                break;
            }

            $scope.statusLoadingDone();
            $location.path(method + '/' + policy_number);
        });
      }

      $scope.sms = function(policy_number){
        $scope.statusLoading('Please wait..');

        apiService.resend_policy_sms(policy_number, $rootScope.loginToken, function(response, error){
            console.log('sms_policy_info: ', response.data);
            if(response.data.message){
              $scope.showPopup('Success', response.data.message);
            } else {
              $scope.showPopup('Success', 'SMS was sent');
            }
            $scope.statusLoadingDone();
        });
      }

      $scope.renew = function(product_id, policy_number){
        $scope.search = true;
        $scope.searchList = false;
        $scope.searchView = false;
        $scope.searchResults = [];
        $scope.policyData = {};

        $scope.statusLoading('Please wait..');

        apiService.get_product_details(product_id, $rootScope.loginToken, function(response, error){
            console.log('get_product: ', response.data.data.product);
            var product = response.data.data.product;
            var method = '';

            switch(parseInt(product.type_id)){
              case 1:
                  method = 'app/funeral/' +  parseInt(product.id);
                break;
              case 2:
                  method = 'app/life-insurance/' +  parseInt(product.id);
                break;
              case 3:
                  method = 'app/credit-life/' +  parseInt(product.id);
                break;
              case 4:
                  method = 'app/funeral/' +  parseInt(product.id);
                break;
            }

            $scope.statusLoadingDone();
            $location.path(method + '/' + policy_number);
        });
      }

      $scope.backToResults = function(){
        $scope.search = false;
        $scope.searchView = false;
        $scope.searchList = true;
      }

      $scope.backToSearch = function(){
        $scope.search = true;
        $scope.searchView = false;
        $scope.searchList = false;
      }
    }

    $scope.validateSearch = function(id_number, policy_number, cellphone, quote_number){
      if(id_number){
        return true;
      } else {
        if(policy_number){
          return true;
        } else {
          if(cellphone || quote_number){
            return true;
          } else {
            return false;
          }
        }
      }
    }
}])

.controller('ClaimCtrl', ['$rootScope', '$scope', 'apiService', '$state', '$location', '$ionicPopup', '$ionicHistory', function ($rootScope, $scope, apiService, $state, $location, $ionicPopup, $ionicHistory) {

    console.log($scope.appDesign);

    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }

    var confirmPopup = $ionicPopup.confirm({
      title: '*Please Note*',
      template: 'Please note you will leave the app and enter the claims section. Are you sure?'
    });
 
    confirmPopup.then(function(res) {
      if(res) {
        //https://admin.insurapp.co.za/form/claim_form.php?token={tokenhere}
        window.open('https://admin.insurapp.co.za/form/claim_form.php?token=' + $rootScope.loginToken, '_blank', 'location=yes');
      }
    });

    $scope.resetPanels();

    $ionicHistory.nextViewOptions({
       disableBack: true
    });

    //$location.path(goTo);
    $state.go('app.home');  
}])

.controller('CashoutCtrl', ['$rootScope', '$scope', 'apiService', '$state', '$location', '$ionicPopup', '$ionicHistory', function ($rootScope, $scope, apiService, $state, $location, $ionicPopup, $ionicHistory) {
    console.log($scope.appDesign);

    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }

     $scope.submit = function (cashout_amount){
      $scope.statusLoading('Please wait..');

      apiService.cashout(cashout_amount, $rootScope.loginToken, function(response, error){
          console.log('CashoutCtrl: ', response.data);
          $scope.statusLoadingDone();
          $scope.showPopup('Success', response.data.message);
      });
    }
}])

.controller('ExpiryReportCtrl', ['$rootScope', '$scope', 'apiService', '$state', '$location', '$ionicPopup', '$ionicHistory', function ($rootScope, $scope, apiService, $state, $location, $ionicPopup, $ionicHistory) {
    console.log($scope.appDesign);

    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }

    $scope.statusLoading('Please wait..');
    $scope.expired = [];

    $scope.searchView = false;
    $scope.searchList = true;

    apiService.expiring_policies($rootScope.loginToken, function(response, error){
        console.log('ExpiryReportCtrl: ', response.data.data);
        $scope.statusLoadingDone();

        if(response.data.data.policies != undefined){
          $scope.expired = response.data.data.policies;
        }
    });

    $scope.showItem = function(policy_number){
        $scope.statusLoading('Please wait..');

        apiService.get_policy_info(policy_number, $rootScope.loginToken, function(response, error){
            console.log('get_policy_info: ', response.data.data.policies);
            $scope.policyData = response.data.data.policies;
            $scope.statusLoadingDone();

            $scope.searchList = false;
            $scope.searchView = true;
        });
      }

      $scope.complete = function(product_id, policy_number){
        $scope.searchList = false;
        $scope.searchView = false;
        $scope.searchResults = [];
        $scope.policyData = {};

        $scope.statusLoading('Please wait..');

        apiService.get_product_details(product_id, $rootScope.loginToken, function(response, error){
            console.log('get_product: ', response.data.data.product);
            var product = response.data.data.product;
            var method = '';

            switch(parseInt(product.type_id)){
              case 1:
                  method = 'app/funeral/' +  parseInt(product.id);
                break;
              case 2:
                  method = 'app/life-insurance/' +  parseInt(product.id);
                break;
              case 3:
                  method = 'app/credit-life/' +  parseInt(product.id);
                break;
              case 4:
                  method = 'app/funeral/' +  parseInt(product.id);
                break;
            }

            $scope.statusLoadingDone();
            $location.path(method + '/' + policy_number);
        });
      }

      $scope.sms = function(policy_number){
        $scope.statusLoading('Please wait..');

        apiService.resend_policy_sms(policy_number, $rootScope.loginToken, function(response, error){
            console.log('sms_policy_info: ', response.data);
            if(response.data.message){
              $scope.showPopup('Success', response.data.message);
            } else {
              $scope.showPopup('Success', 'SMS was sent');
            }
            $scope.statusLoadingDone();
        });
      }

      $scope.renew = function(product_id, policy_number){
        $scope.searchList = false;
        $scope.searchView = false;
        $scope.searchResults = [];
        $scope.policyData = {};

        $scope.statusLoading('Please wait..');

        apiService.get_product_details(product_id, $rootScope.loginToken, function(response, error){
            console.log('get_product: ', response.data.data.product);
            var product = response.data.data.product;
            var method = '';

            switch(parseInt(product.type_id)){
              case 1:
                  method = 'app/funeral/' +  parseInt(product.id);
                break;
              case 2:
                  method = 'app/life-insurance/' +  parseInt(product.id);
                break;
              case 3:
                  method = 'app/credit-life/' +  parseInt(product.id);
                break;
              case 4:
                  method = 'app/funeral/' +  parseInt(product.id);
                break;
            }

            $scope.statusLoadingDone();
            $location.path(method + '/' + policy_number);
        });
      }

      $scope.backToResults = function(){
        $scope.searchView = false;
        $scope.searchList = true;
      }
}])

.controller('ProfileCtrl', ['$rootScope', '$scope', 'apiService', '$state', '$ionicLoading', '$location', '$ionicModal', '$timeout', '$ionicPopup', function ($rootScope, $scope, apiService, $state, $ionicLoading, $location, $ionicModal, $timeout, $ionicPopup) {
    console.log('ProfileCtrl loaded');
    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }

    // Ch3wb4cc4!

    $scope.updateProfile = function(old_password, new_password, confirm_password){
        $ionicLoading.show({
            template: 'Updating Password'
        });

        apiService.update_password(localStorage.username, old_password, new_password, function(response, error){
            console.log('update profile: ', response.data.success);
            $ionicLoading.hide();

            if(response.data.success){
              $scope.old_password = '';
              $scope.new_password = '';
              $scope.confirm_password = '';

              $scope.showPopup('Success', 'Password has been updated..');
            } else {
              $scope.showPopup('Error', 'One or more passwords was incorrect or do not match..');
            }

            
        });
    }

    $scope.checkPasswordBlank = function (new_password){
      if(new_password == ''){
        return true;
      } else {
        return false;
      }
    }

    $scope.checkPasswordMatch = function (new_password, confirm_password){
      if(new_password){
          if(confirm_password){
            if(new_password == confirm_password){
              return true;
            } else {
              return false;
            }
          } else {
              return false;
            }
        } else {
            return false;  
        }
    }

    $scope.validatePasswords = function(old_password, new_password, confirm_password){
      if(old_password){
        if(new_password){
          if(confirm_password){
            if(new_password == confirm_password){
              return true;
            } else {
              return false;
            }
          } else {
              return false;
            }
        } else {
            return false;  
        }
      } else {
        return false;
      }
    }
}])

.controller('ServicesCtrl', ['$rootScope', '$scope', 'apiService', '$state', '$ionicHistory', '$location', '$ionicModal', '$timeout', '$ionicPopup', function ($rootScope, $scope, apiService, $state, $ionicHistory, $location, $ionicModal, $timeout, $ionicPopup) {
    console.log('ServicesCtrl loaded');
    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }
}])

// -- ServicesAirtimeCtrl
.controller('ServicesAirtimeCtrl', ['$rootScope', '$scope', '$state', '$ionicHistory', '$location', '$ionicModal', '$timeout', '$ionicPopup', 'salesFactory', 'ApiEndpoint', '$ionicLoading', function ($rootScope, $scope, $state, $ionicHistory, $location, $ionicModal, $timeout, $ionicPopup, salesFactory, ApiEndpoint, $ionicLoading) {

    console.log('ServicesAirtimeCtrl loaded');
    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }

    token = $rootScope.loginToken;

    console.log('token in ServicesAirtimeCtrl: ' + token);

    // show loading
    $scope.loading = true;
    $ionicLoading.show({
       template: 'Loading...'
    });

    salesFactory.setToken(token);
   /* $scope.pinless_airtime_products = salesFactory.get_pinless_airtime_products().then(function(result) {
        console.log('result');
        console.log(result);

        $scope.pinless_airtime_products_data = result.data.products.pinless_airtime;
        localStorage.setItem("current_item_data", $scope.pinless_data_products_data);

        //$scope.loading = false;
        $ionicLoading.hide();
    });*/

  salesFactory.get_pinless_airtime_products(token, function(response, err) {
    console.log('get_pinless_airtime_products', response);

    $scope.pinless_airtime_products_data = response.data.products.pinless_airtime;
    $rootScope.pinless_data_products_data = response.data.products.pinless_airtime;

    $ionicLoading.hide();
  });

}])


.controller('ServicesAirtimeDetailCtrl', ['$rootScope', '$scope', '$state', '$ionicHistory', '$location', '$ionicModal', '$timeout', '$ionicPopup', 'salesFactory', 'ApiEndpoint', '$ionicLoading', 'apiService', function ($rootScope, $scope, $state, $ionicHistory, $location, $ionicModal, $timeout, $ionicPopup, salesFactory, ApiEndpoint, $ionicLoading, apiService) {

    selectedId = $state.params.id;

    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }

    $scope.at = {amount: '', cellnumber: ''};

    //console.log('state');
    //console.log($state);

    console.log('ServicesAirtimeDetailCtrl loaded');
    //console.log('url id: ' + selectedId );

    token = $rootScope.loginToken;

    console.log('token in ServicesAirtimeDetailCtrl: ' + token);

    console.log($rootScope.pinless_airtime_products_data);

    if (typeof $scope.pinless_airtime_products_data == 'undefined') {
        $scope.pinless_airtime_products_data = $rootScope.pinless_data_products_data;
    }

    // determine selected product info.
    for (i in $scope.pinless_airtime_products_data) {
      if ($scope.pinless_airtime_products_data[i].id == selectedId) {
          $scope.pinless_airtime_products_item = $scope.pinless_airtime_products_data[i];
      }
    }

    console.log($scope.pinless_airtime_products_item);

    $scope.addListItem = function(){
      var amount = $scope.at['amount'];
      var number = $scope.at['cellnumber'];

      console.log(amount + ' / ' + number);

      $ionicLoading.show({
         template: 'Loading...'
      });

      apiService.purchase_airtime_product(selectedId, amount, number, token, function(result){
          console.log(result.data.success);
          $ionicLoading.hide();

          if(result.data.success == true){
            var alertPopup = $ionicPopup.alert({
             title: 'Success',
             template: 'Your request has been processed successfully'
            });

             $scope.at['amount'] = '';
             $scope.at['cellnumber'] = '';
          } else {
            //
            var alertPopup = $ionicPopup.alert({
             title: 'Error',
             template: result.data.message
            });
          }
      });

    }

}])

// -- Mobile Data

// -- ServicesMobileDataCtrl
.controller('ServicesMobileDataCtrl', ['$rootScope', '$scope', '$state', '$ionicHistory', '$location', '$ionicModal', '$timeout', '$ionicPopup', 'salesFactory', 'ApiEndpoint', function ($rootScope, $scope, $state, $ionicHistory, $location, $ionicModal, $timeout, $ionicPopup, salesFactory, ApiEndpoint) {

    console.log('ServicesMobileDataCtrl loaded');

    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }

    token = $rootScope.loginToken;

    console.log('token in ServicesMobileDataCtrl: ' + token);

    salesFactory.setToken(token);
    salesFactory.get_pinless_data_products(token, function(response, err) {
        console.log('get_pinless_data_products', response);

        $scope.pinless_data_products_data = response.data.products.pinless_airtime;
        $rootScope.pinless_data_products_data = response.data.products.pinless_airtime;
    });

}])


.controller('ServicesMobileDataDetailCtrl', ['$rootScope', '$scope', '$state', '$ionicHistory', '$location', '$ionicModal', '$timeout', '$ionicPopup', 'salesFactory', 'ApiEndpoint', function ($rootScope, $scope, $state, $ionicHistory, $location, $ionicModal, $timeout, $ionicPopup, salesFactory, ApiEndpoint) {

    selectedId = $state.params.id;

    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }

    //console.log('state');
    //console.log($state);

    console.log('ServicesMobileDataDetailCtrl loaded');
    //console.log('url id: ' + selectedId );

    token = $rootScope.loginToken;

    console.log('token in ServicesMobileDataDetailCtrl: ' + token);

    if (typeof $scope.pinless_data_products_data == 'undefined') {
        $scope.pinless_data_products_data = $rootScope.pinless_data_products_data;
    }

    // determine selected product info.
    for (i in $scope.pinless_data_products_data) {
      if ($scope.pinless_data_products_data[i].id == selectedId) {
          $scope.pinless_data_products_item = $scope.pinless_data_products_data[i];
      }
    }

}])

.controller('SaveLeadCtrl', ['$rootScope', '$scope', '$state', '$ionicHistory', '$location', '$ionicModal', '$timeout', '$ionicPopup', 'apiService', '$ionicLoading', function ($rootScope, $scope, $state, $ionicHistory, $location, $ionicModal, $timeout, $ionicPopup, apiService, $ionicLoading) {
    // Redirect to login screen if no session data was found
    if($rootScope.loginToken == null || $rootScope.loginToken == "" || $rootScope.loginData == null){
      $location.path('/login');
    } else {
        console.log('Login works!', $rootScope.loginData);
    }

    token = $rootScope.loginToken;  

    $scope.save = {cell_number:'', first_name: '', last_name: ''};
    console.log('token in SaveLeadCtrl: ' + token);

    $scope.create_lead = function(cell_number, first_name, last_name){
         console.log(cell_number + ' / ' + first_name + ' / ' + last_name);

          $ionicLoading.show({
             template: 'Loading...'
          });

          apiService.create_lead(cell_number, first_name, last_name, token, function(result, error){
              console.log(result);
              $ionicLoading.hide();

              var alertPopup = $ionicPopup.alert({
               title: 'Success',
               template: 'Your request has been processed successfully'
              });

              $scope.save.cell_number = '';
              $scope.save.first_name = '';
              $scope.save.last_name = '';

              //$location.path('/app/home');
          });
    }
}])

function showError($ionicPopup, title, message){
  return $ionicPopup.alert({
   title: title,
   template: message
  });
}


