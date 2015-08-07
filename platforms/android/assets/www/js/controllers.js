angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
	
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = [];

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(loginModal) {
    $scope.loginModal = loginModal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };
  
  // Open the login modal
  $scope.login = function() {
	//hide registe modal and register thanks modal when open login modal
	$scope.vEmailMsg = false;
	$scope.registerModal.hide();
	$scope.registerThanksModal.hide();
    $scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
	 $scope.vEmailMsg = false;
	 $scope.sloginMsg = false;
	 
	   Parse.User.logIn(String($scope.loginData['username']), String($scope.loginData['password']), {
		  success: function(user) {
			var emailVerified = Parse.User.current().get("emailVerified");
			  if (!emailVerified) 
			  {
				  $scope.logOut();
				  $scope.vEmailMsg = true;
				  $scope.vEmailMsgValue ="Please verifying your email address before Login.";
				  $scope.$apply();  
			  } 
			  else
			  {
				  $timeout(function() {
					  $scope.closeLogin();
					}, 1000); 
				  $scope.sloginMsg = true;
				  $scope.sloginMsgValue ="You have been successfully logged in.";
				  $scope.$apply();
				  
				  $timeout(function() {
					 $scope.sloginMsg = false;
					}, 5000);
			  }
		  },
		  error: function(user, error) {
			// The login failed. Check error to see why.
			 $scope.vEmailMsg = true;
			 $scope.vEmailMsgValue =$scope.firstCharCapital(error.message);
			 $scope.$apply(); 
		  }
		});
	
   /* $timeout(function() {
      $scope.closeLogin();
    }, 1000);*/
	
  };
  
  
// Perform the FB login
  var fbLogged = new Parse.Promise();
    
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }
    var expDate = new Date(
      new Date().getTime() + response.authResponse.expiresIn * 1000
    ).toISOString();

    var authData = {
      id: String(response.authResponse.userID),
      access_token: response.authResponse.accessToken,
      expiration_date: expDate
    }
    fbLogged.resolve(authData);
    console.log(response);
  };

  var fbLoginError = function(error){
    fbLogged.reject(error);
  };


  $scope.fbLogin = function() {
    console.log('Login');
    if (!window.cordova) {
		
      //facebookConnectPlugin.browserInit('1129125900435568');
	  
	  //anil FB App id 
	  facebookConnectPlugin.browserInit('1442568932738358');
    }
    facebookConnectPlugin.login(['email'], fbLoginSuccess, fbLoginError);

    fbLogged.then( function(authData) {
    console.log('Promised');
    return Parse.FacebookUtils.logIn(authData);
	
    })
    .then( function(userObject) {
	   facebookConnectPlugin.api('/me?fields=id,email,name,gender', null, 
        function(response) {
          console.log(response);
		  
		  //user not existed
		  if (!userObject.existed()) 
		  {
			  userObject.set('name', response.name);
			  userObject.set('email', response.email);
			  userObject.save();
			  console.log("User first time signed up and logged in through Facebook!");
		  } 
		  else 
		  {
			  //user existed
			  userObject.save();
			  console.log("User already logged in through Facebook!");
		  }
		  $scope.loginModal.hide();
        },
        function(error) {
		   //Error found
		  $scope.loginModal.show();
		  console.log(error);
		  console.log("User cancelled the Facebook login or did not fully authorize.");
        }
      );
     
    }, function(error) {
	  //Error found
      console.log(error);
    });
  };
  
  
// Perform the Register action when the user submits the Register form   start***********

  // Form data for the register modal
  $scope.registerData = [];
  
  // Create the register modal that we will use later
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(registerModal) {
    $scope.registerModal = registerModal;
  });

  // Triggered in the register modal to close it
  $scope.closeRegister = function() {
    $scope.registerModal.hide();
  };
  
  // Open the register modal
  $scope.register = function() {
	//hide registe modal and register thanks modal when open login modal
	$scope.loginModal.hide();
	$scope.registerThanksModal.hide();
    $scope.registerModal.show();
  };
  
	//check password match
	$scope.registerData['password'] = '';
	$scope.registerData['confirmPassword'] = '';
	$scope.passwordMatch = false;
	$scope.passwordMatchMsg = false;
	
	$scope.$watch("registerData['password']",function() {$scope.matchPassword();});
	$scope.$watch("registerData['confirmPassword']",function() {$scope.matchPassword();});	
	
	$scope.matchPassword = function() {
	  if ($scope.registerData['password'] === $scope.registerData['confirmPassword']) 
	  {
		$scope.passwordMatch = true;
	  } 
	  else 
	  {
		$scope.passwordMatch = false;
	  }
	  
	  if($scope.passwordMatch==false && $scope.registerData['password'].length>0 && $scope.registerData['confirmPassword'].length>0)
	  {
		$scope.passwordMatchMsg = true;
	  }
	  else
	  {
		$scope.passwordMatchMsg = false;
	  }
	  console.log('passwordNotMatch=', $scope.passwordMatch);
	};
	
	// Perform the register action when the user submits the register form
	
	
	$scope.doRegister = function() {
		console.log('Doing register', $scope.registerData);
		
		// code if using a register system
		$scope.passwordMatchMsg = false;
		$scope.registerMsgValue = "";
		
		var userRegister = new Parse.User();
		userRegister.set("username", String($scope.registerData['username']));
		userRegister.set("name", String($scope.registerData['username']));
		userRegister.set("password", String($scope.registerData['password']));
		userRegister.set("email", String($scope.registerData['email']));
		userRegister.set("phone", String($scope.registerData['phoneNumber']));
		
		userRegister.signUp(null, {
		  success: function(userRegisterResponse) {
			$scope.logOut();
			$scope.registerThanks();
			$scope.registerMsg = true;
			$scope.registerMsgValue ="Please verifying your email address before Login.";
			$scope.$apply();
			//console.log("Register: " + userRegisterResponse.code + " " + userRegisterResponse.message);
		  },
		  error: function(userRegisterResponse, error) {
			// Show the error message somewhere and let the user try again.
			$scope.registerMsg = true;
			$scope.registerMsgValue = $scope.firstCharCapital(error.message);
			//console.log("Error: " + error.code + " " + error.message);
			$scope.$apply();
		  }
		});
		
	};
	
 // Perform the Register action when the user submits the Register form   End***********
 
 //logout user
  $scope.logOut = function() {
    Parse.User.logOut();
	var currentUser = Parse.User.current();  // this will now be null
  };
 
 //function for first char capital in string
 $scope.firstCharCapital = function(input){
	  return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
 };
 
 
 // Create the register thanks modal that we will use later
  $ionicModal.fromTemplateUrl('templates/registerThanks.html', {
    scope: $scope
  }).then(function(registerThanksModal) {
    $scope.registerThanksModal = registerThanksModal;
  });

  // Triggered in the rregister thanks modal to close it
  $scope.closeRegisterThanks = function() {
    $scope.registerThanksModal.hide();
  };
 // Open the register thanks modal
  $scope.registerThanks = function() {
	//hide registe modal and login modal when open register thanks modal
	$scope.loginModal.hide();
	$scope.registerModal.hide();
    $scope.registerThanksModal.show();
  };
 
})


