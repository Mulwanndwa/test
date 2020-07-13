// Ionic insuranceapp App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'insuranceapp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('insuranceapp', ['ionic', 'ngStorage', 'ngCordova', 'insuranceapp.controllers', 'insuranceapp.services', 'insuranceapp.factories', 'categoryTree', 'ionic-cache-src'])

.run(function($ionicPlatform, $interval, $rootScope, $ionicLoading) {
  $ionicPlatform.ready(function() {
    //console.log($ionicPlatform);


    $rootScope.appVersion = '';
    $rootScope.imei = '';

    //Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });

  document.addEventListener("offline", onNetworkOffline, false);
  function onNetworkOffline(){
        $ionicLoading.hide();
        alert('Youre internet connection has been disconnected');
  }

  document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {

      console.log('device.serial', device.serial);
      console.log('device.uuid', device.uuid);

      cordova.getAppVersion.getVersionNumber().then(function (version) {
        //$rootScope.version = version + '123';
        console.log('version: ', version);
        $rootScope.appVersion = version;

        $rootScope.versionDisplayParts = [];
        $rootScope.versionDisplayParts.push($rootScope.appVersion);

        $rootScope.appVersionDisplay = $rootScope.versionDisplayParts.join('<br />');

        window.plugins.sim.getSimInfo(successSimCallback, errorSimCallback);
      });

      function successSimCallback(result) {
        console.log('successSimCallback', result);

        if (typeof result.deviceId != 'undefined') {
          imei = result.deviceId;
        } else {
          imei = 'Unknown';
        }

        $rootScope.imei = imei;

        $rootScope.versionDisplayParts = [];
        $rootScope.versionDisplayParts.push($rootScope.appVersion);
        $rootScope.versionDisplayParts.push('IMEI: ' + $rootScope.imei);

        $rootScope.appVersionDisplay = $rootScope.versionDisplayParts.join('<br />');


      }

      function errorSimCallback(error) {
        console.log('errorSimCallback', error);
      }

      // Android only: check permission
      function hasReadPermission() {
        window.plugins.sim.hasReadPermission(successSimCallback, errorSimCallback);
      }

      // Android only: request permission
      function requestReadPermission() {
        window.plugins.sim.requestReadPermission(successSimCallback, errorSimCallback);
      }

    }
})

//demostartconfig
.constant('ApiEndpoint', {
  url: 'http://customer.insurapp.co.za/api'
})
.constant('Config', {
  audioUrlPrefix: 'http://customer.insurapp.co.za/assets/uploads/insurance/terms_audio/',
  imgUrlPrefix: 'http://customer.insurapp.co.za/assets/img/',
  urlPrefix: 'http://customer.insurapp.co.za/'
})
//demoendconfig

//livestartconfig
.constant('ApiEndpoint', {
  url: 'http://customer.insurapp.co.za/api'
})
.constant('Config', {
  audioUrlPrefix: 'http://customer.insurapp.co.za/assets/uploads/insurance/terms_audio/',
  imgUrlPrefix: 'http://customer.insurapp.co.za/assets/img/',
  urlPrefix: 'http://customer.insurapp.co.za/'
})
//liveendconfig


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

   .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('resetpassword', {
    url: '/reset-password',
    cache: false,
    templateUrl: 'templates/reset-password.html',
    controller: 'ResetPasswordCtrl'
  })

   .state('logout', {
    url: '/logout',
    cache: false,
    controller: 'LogoutCtrl'
  })


  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

   .state('app.home', {
    url: '/home',
    //templateUrl: 'templates/menu.html',
    //controller: 'HomeCtrl',
    views: {
    'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
      }
    }
  })
.state('app.insurance-policy', {
    url: '/insurance/:product_id/:policy_number',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/creditlife.html',
        controller: 'CreditLifeCtrl'
      }
    }
  })

.state('app.insurance', {
    url: '/insurance/:product_id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/creditlife.html',
        controller: 'CreditLifeCtrl'
      }
    }
  })

  .state('app.insurance-detail', {
    url: '/insurance/:product_id/:detail_id',
    cache: false,
      views: {
      'menuContent': {
        templateUrl: 'templates/creditlife.html',
        controller: 'CreditLifeCtrl'
      }
    }
  })

  .state('app.credit-life-policy', {
    url: '/credit-life/:product_id/:policy_number',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/creditlife.html',
        controller: 'CreditLifeCtrl'
      }
    }
  })

  .state('app.credit-life', {
    url: '/credit-life/:product_id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/creditlife.html',
        controller: 'CreditLifeCtrl'
      }
    }
  })
  .state('app.credit-life-detail', {
    url: '/credit-life/:product_id/:detail_id',
    cache: false,
      views: {
      'menuContent': {
        templateUrl: 'templates/creditlife.html',
        controller: 'CreditLifeCtrl'
      }
    }
  })

  .state('app.life-insurance-policy', {
    url: '/life-insurance/:product_id/:policy_number',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/lifeinsurance.html',
        controller: 'CreditLifeCtrl'
      }
    }
  })

  .state('app.life-insurance', {
    url: '/life-insurance/:product_id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/lifeinsurance.html',
        controller: 'CreditLifeCtrl'
      }
    }
  })

  .state('app.funeral-policy', {
    url: '/funeral/:product_id/:policy_number',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/funeral.html',
        controller: 'CreditLifeCtrl'
      }
    }
  })

  .state('app.funeral', {
    url: '/funeral/:product_id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/funeral.html',
        controller: 'CreditLifeCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('app.claim', {
    url: '/claim',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/claim.html',
        controller: 'ClaimCtrl'
      }
    }
  })

  .state('app.profile', {
    url: '/profile',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('app.cashout', {
    url: '/cashout',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/cashout.html',
        controller: 'CashoutCtrl'
      }
    }
  })

  .state('app.expiryreport', {
      url: '/expiryreport',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/expiryreport.html',
          controller: 'ExpiryReportCtrl'
        }
      }
    })

  .state('app.services', {
      url: '/services',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/services.html',
          controller: 'ServicesCtrl'
        }
      }
    })

    .state('app.savelead', {
      url: '/savelead',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/savelead.html',
          controller: 'SaveLeadCtrl'
        }
      }
  })

    .state('app.services_pinless_airtime_products', {
        url: '/services/pinless_airtime_products',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/services/pinless_airtime_products.html',
            controller: 'ServicesAirtimeCtrl'
          }
        }
      })

    // services/pinless_airtime_products/
    .state('app.services_pinless_airtime_products_detail', {
        url: '/services/pinless_airtime_products/:id',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/services/pinless_airtime_products_detail.html',
            controller: 'ServicesAirtimeDetailCtrl'
          }
        }
      })

    .state('app.services_pinless_data_products', {
        url: '/services/pinless_data_products',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/services/pinless_data_products.html',
            controller: 'ServicesMobileDataCtrl'
          }
        }
      })

    // services/pinless_data_products/
    .state('app.services_pinless_data_products_detail', {
        url: '/services/pinless_data_products/:id',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/services/pinless_data_products_detail.html',
            controller: 'ServicesMobileDataDetailCtrl'
          }
        }
      })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
