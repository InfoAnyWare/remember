// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [

		'ionic','ionic.service.core',
  		'ngCordova',
		'ngOpenFB',
		'ui.thumbnail',
		'starter.controllers',
	])


.run(function($ionicPlatform,$rootScope,$cordovaPush) {
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
	
	////////////////////////////////////
	
	var rrrrr="";
	Ionic.io();
	var push = new Ionic.Push({
      "debug": false
    });
	
	push.init({
		"android": {
			"senderID": "478860020961"
		},
		"ios": {"alert": "true", "badge": "true", "sound": "true"}, 
		"windows": {} 
	});
	
	push.register(function(token) {
      console.log("Device token:",token.token);
	  alert("Device token=="+JSON.stringify(token.token));
	  
	   //Define relevant info
		var privateKey = 'cbabd704feea5fb593a58acb1a6da7e29fba8d4b1511cd0a';
		var tokens = ['your', 'target', token.token];
		var appId = 'c89f83f4';
		
		// Encode your key
		var auth = btoa(privateKey + ':');
		
		// Build the request object
		var req = {
		  method: 'POST',
		  url: 'https://push.ionic.io/api/v1/push',
		  headers: {
			'Content-Type': 'application/json',
			'X-Ionic-Application-Id': appId,
			'Authorization': 'basic ' + auth
		  },
		  data: {
			"tokens": tokens,
			"notification": {
			  "alert":"Hello World!"
			}
		  }
		};

		// Make the API call
		$http(req).success(function(resp){
		  // Handle success
		  console.log("Ionic Push: Push success!");
		}).error(function(error){
		  // Handle error 
		  console.log("Ionic Push: Push error...");
		});
	  
	//////////////////////////////
		// this will give you a fresh user or the previously saved 'current user'
		var user = Ionic.User.current();
		
		// if the user doesn't have an id, you'll need to give it one.
		if (!user.id) {
		  user.id = Ionic.User.anonymousId();
		  // user.id = 'your-custom-user-id';
		}
		
		// strings
		user.set('name', 'Anil Kumar');
		
		// numbers
		user.set('tokens', token.token);
		user.set('device_token', token.token);
		//persist the user
		user.save();
		
		
		
		/*var ionicPushServer = require('ionic-push-server');

		var credentials = {
			IonicApplicationID : "c89f83f4",
			IonicApplicationAPIsecret : "cbabd704feea5fb593a58acb1a6da7e29fba8d4b1511cd0a"
		};
		
		var notification = {
		  "tokens":token.token,
		  "notification":{
			"alert":"Hi from Ionic Push Service!",
			"android":{
			  "senderID":478860020961
			}
		  } 
		};
		
		ionicPushServer(credentials, notification);*/
	//////////////////////////////
	});
	
	
	
	
    
  });
  
  
  //alert("anil");
  
  /////////////////////////////////
 
	
	 
	 
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
        }
      }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});
