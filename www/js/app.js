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
	
	var appId 		= "3r4ZuAyiHxcZdRD5TGRURIg95HUNmIJYgfRaZZaZ";
	var clientKey 	= "70EeC8AhC8OePERtMVF3iiSLR0ivDlzMvrNXlqgf";
	parsePlugin.initialize(appId, clientKey, function() {
	parsePlugin.subscribe('SampleChannel', function() {
		parsePlugin.getInstallationId(function(id) {
	
				/**
				 * Now you can construct an object and save it to your own services, or Parse, and corrilate users to parse installations
				 * 
				 var install_data = {
					installation_id: id,
					channels: ['SampleChannel']
				 }
				 *
				 */
				 var install_data = {
					installation_id: id,
					channels: ['SampleChannel']
				 }
				 
			 /*var InstallationObj = new Parse.Object("Installation");
				//InstallationObj.set("user", Parse.User.current());
				InstallationObj.set("installation_id", id);
				InstallationObj.set("SampleChannel", '')
				InstallationObj.set("dateOfMemory", $scope.addMemoryData['dateOfMemory']);
			    InstallationObj.save();*/
					
					   
	alert("notification result11=="+JSON.stringify(id));
			}, function(e) {
				alert('error');
			});
	
		}, function(e) {
			alert('error');
		});
	
	}, function(e) {
		alert('error');
	});

	
  });
  
  //cordove push notification for android
  var androidConfig = {
    "senderID": "478860020961",
  };

  document.addEventListener("deviceready", function(){
    $cordovaPush.register(androidConfig).then(function(result) {
      // Success
	  alert("notification result=="+JSON.stringify(result));
    }, function(err) {
      // Error
	   alert("notification err=="+JSON.stringify(err));
    })

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            alert('registration ID = ' + notification.regid);
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
          break;

        case 'error':
          alert('GCM error = ' + notification.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }
    });


    // WARNING: dangerous to unregister (results in loss of tokenID)
    $cordovaPush.unregister(options).then(function(result) {
      // Success!
    }, function(err) {
      // Error
    })

  }, false);
  

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
