// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [

		'ionic',
  		'ngCordova',
		'ngOpenFB',
		'ui.thumbnail',
		'starter.controllers',
	])


.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
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
  

})

.config(function ($stateProvider, $urlRouterProvider, $cordovaFacebookProvider, $cordovaAppRateProvider, $cordovaInAppBrowserProvider, ThumbnailServiceProvider) 
 {
	 //set default thumbnil width and height
	 ThumbnailServiceProvider.defaults.width = 100;
     ThumbnailServiceProvider.defaults.height = 100;

    var browserOptions = {
      location: "yes",
      toolbar: "yes"
    };

  $cordovaInAppBrowserProvider.setDefaultOptions(browserOptions);
	 
	 
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
		controller: 'AppCtrl'
      }
    }
  })
  
  .state('app.Memory', {
    url: '/Memory',
    views: {
      'menuContent': {
        templateUrl: 'templates/addMemory.html',
		 controller: "CYRmeMemory"
      }
    }
  })

  .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
		  controller: 'AppCtrl'
        }
      }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});
