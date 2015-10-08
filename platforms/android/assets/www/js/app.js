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
	
  });
  
  ///////////////////////////////////////////////////////////////////////
  
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
		alert("anil11");
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
              //alert('registration ID = ' + notification.regid);
			 alert("notification=="+JSON.stringify(notification));
				
				/* $http.get('https://api.parse.com/1/installations').then(function(resp) {
					console.log('Success', resp);
					// For JSON responses, resp.data contains the result
				  }, function(err) {
					console.error('ERR', err);
					// err.status will contain the status code
				  })*/
				 /* $.ajax({
						type: 'POST',
						headers: {
							'X-Parse-Application-Id': "3r4ZuAyiHxcZdRD5TGRURIg95HUNmIJYgfRaZZaZ",
							'X-Parse-REST-API-Key': "GJvcxbzm0mnrYlWE2H0rdhaHCfBLkqZLOt40b73s"
						},
					    url: "https://api.parse.com/1/installations",
					    data: {
							deviceType: "android",
							pushType: "gcm",
							deviceToken: notification.regid,
							channels: [
								"Anil"
							]
						},
						contentType: "application/json"
					});*/
					
					// An object containing name, toEmail, fromEmail, subject and message
					// current user
					var currentUser = Parse.User.current();
					var pushdata = { 
					  deviceType: "android",
					  pushType: "gcm",
					  deviceToken: notification.regid,
					  channels:  [
								"Anil"
							],
					}
					
					// Run our Parse Cloud Code and pass our 'data' object to it
					Parse.Cloud.run("registerForNotifications", pushdata, {
					  success: function(object) {
						alert("result11=="+JSON.stringify(object));
					  },
				
					  error: function(error) {
						alert("error=="+JSON.stringify(error));
					  }
					});
					
				
							
					var currentUser = Parse.User.current();
					var pushdata = { 
					  deviceType: "android",
					  pushType: "gcm",
					  channel: "aaaaaa",
					  deviceToken: notification.regid,
					  userId: currentUser.id,
					  channels:  [
								"Anil","Alok"
							],
					}
					
					alert("pushdata="+ JSON.stringify(pushdata));
					// Run our Parse Cloud Code and pass our 'data' object to it
					Parse.Cloud.run("subscribeToChannel", pushdata, {
					  success: function(object) {
						alert("result22=="+JSON.stringify(object));
					  },
				
					  error: function(error) {
						alert("error=="+JSON.stringify(error));
					  }
					});

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
  ///////////////////////////////////////////////////////////////////////
  

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
