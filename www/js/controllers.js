angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $state, $filter, $ionicLoading, $cordovaFacebook, ngFB, $cordovaFile, $cordovaFileTransfer, $cordovaNetwork, $timeout,$ionicPush, $http, $cordovaDevice) {
	
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  
  	// function for show Loading
		$scope.showLoading = function() {
			$ionicLoading.show({
			  template: '<ion-spinner icon="bubbles"></ion-spinner>'
			});
		  };
		 
	// function for hide Loading
	    $scope.hideLoading = function(){
			$ionicLoading.hide();
		  };
		  
	//call for hide bydefault loding
	 	$scope.showLoading();
		$timeout(function() {
			 $scope.hideLoading();
			}, 4000);
	
  		
	// var for show home page
		$scope.showHomeMsg 			= false;
		$scope.showHomeUserName 	= false;
		
	// var for show login logout or register links
		$scope.beforeloginLinks	 = false;
		$scope.afterloginLinks   = false;
		
	// var for show user details page
		$scope.showUserDetail  = false;
		
	// var for show links when user Login in CYR
		$scope.cyrLoginLinks  = true;
		
	// var for show logou tMsg
		$scope.logoutMsg  = false;
	
	// Form data for the login modal
		$scope.loginData = [];
	
	// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
		}).then(function(loginModal) {
			$scope.loginModal = loginModal;
		});
	// Create the register modal that we will use later
		$ionicModal.fromTemplateUrl('templates/register.html', {
		scope: $scope
		}).then(function(registerModal) {
		$scope.registerModal = registerModal;
		});
		
	// Create the register thanks modal that we will use later
		$ionicModal.fromTemplateUrl('templates/registerThanks.html', {
		scope: $scope
		}).then(function(registerThanksModal) {
			$scope.registerThanksModal = registerThanksModal;
		});
		
	// Create the forgot password modal that we will use later
		$ionicModal.fromTemplateUrl('templates/forgotPassword.html', {
		scope: $scope
		}).then(function(forgotPasswordModal) {
			$scope.forgotPasswordModal = forgotPasswordModal;
		});
		
	// Create the user Detailss Modal that we will use later
		$ionicModal.fromTemplateUrl('templates/userDetails.html', {
		scope: $scope
		}).then(function(userDetailsModal) {
			$scope.userDetailsModal = userDetailsModal;
		});
	
	// Create the reset password Modal that we will use later
		$ionicModal.fromTemplateUrl('templates/resetPassword.html', {
		scope: $scope
		}).then(function(resetPasswordModal) {
			$scope.resetPasswordModal = resetPasswordModal;
		});
		
		
	////////////////////////////////////////////////////////////////////////////////////	
	
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
			$scope.forgotPasswordModal.hide();
			$scope.loginModal.show();
		};
		
		
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
		
	
	
	//local storage key set
	 var keyName = window.localStorage.key(0);
	 
	//check user local data are store or not
	var uName 				= window.localStorage.getItem("uName");
    var uEmail 				= window.localStorage.getItem("uEmail");
	var uFirstName 			= window.localStorage.getItem("uFirstName");
	var uMiddleName 		= window.localStorage.getItem("uMiddleName");
	var uSurName 			= window.localStorage.getItem("uSurName");
	var uDateOfBirth 		= window.localStorage.getItem("uDateOfBirth");
    var uLoginThroughMsg 	= window.localStorage.getItem("uLoginThroughMsg");
	var uPhotolocalPath 	= window.localStorage.getItem("uPhotolocalPath");
    //var uFileName = window.localStorage.getItem("filename");
	
	//set cyr Login Links false when user login with facebook
	if(uLoginThroughMsg=="Facebook")
	{
		$scope.cyrLoginLinks  = false;
	}
	
	// check current user are present or not
		var currentUser = Parse.User.current();
		//alert("currentUser=="+currentUser);
		if (currentUser) 
		{
			//alert('currentUser= yes');
			$scope.beforeloginLinks	 = false;
			$scope.afterloginLinks   = true;
			
			$scope.showHomeUserName 	= true;
		    $scope.name = currentUser.get("name");
			$scope.showUserDetail  = true;
			currentUser.save(); //save app run log time
			$timeout(function() {
			$scope.userDetails(); //auto close the popup after 1\2 seconds
			$scope.userDetailsModal.hide(); //hide detail popup after 1\2 seconds
		  }, 300);
		  
		} else {
			// alert('currentUser= no');
			 $timeout(function() {
				$scope.showLocalStorageData();
		  }, 300);
		}
	
	//logout current user
		$scope.logOut = function() {
			Parse.User.logOut();
			
			//call fb logout when user login with fb
			if(uLoginThroughMsg=="Facebook")
			{
				ngFB.logout();
			}
			
			var currentUser = Parse.User.current();  // this will now be null
			$scope.beforeloginLinks	 = true;
			$scope.afterloginLinks   = false;
			$scope.showHomeUserName  = false;
			
			$timeout(function() {
			 $scope.login(); //auto close the popup after 1\2 seconds
		  }, 500);
		  
		  	$scope.logoutMsg  		= true;
			$scope.logoutMsgValue	= 'You have been successfully logout.';
			$timeout(function() {
			 $scope.logoutMsg  		= false;
			 $scope.logoutMsgValue	= '';
		  }, 10000);
		};
		
	// Triggered on a button click, or some other target
		/*$scope.succeslogOutPopup = function() {
		  //custom popup
		  var mySucceslogOutPopup = $ionicPopup.show({
				 title: 'You have been successfully logout.',
			  });
		  mySucceslogOutPopup.then(function(res) {
			console.log('LogOut!', res);
		  });
		  $timeout(function() {
			 mySucceslogOutPopup.close(); //auto close the popup after 1 seconds
		  }, 3000);
		 };*/



	
	// Perform the login action when the user submits the CYR login form ***********Start***********
		$scope.doLogin = function() {
		$scope.showLoading();
		console.log('Doing login', $scope.loginData);
		
		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		 $scope.vEmailMsg = false;
		 
		 // check network connection present or not
		 if ($cordovaNetwork.isOffline()) 
		 {
				 //alert("No data network present, app use last loged in user loacl data CYR login.");
				 $scope.showLocalStorageData();
		 }
		 else
		 {
		  // alert("Data network ok CYR login");
		   Parse.User.logIn(String($scope.loginData['username']), String($scope.loginData['password']), {
			  success: function(user) {
				 var emailVerified = user.get("emailVerified");
				  if (!emailVerified) 
				  {
					  $scope.hideLoading();
					 // $scope.logOut();
					  Parse.User.logOut();
					  $scope.vEmailMsg = true;
					  $scope.vEmailMsgValue ="Please verifying your email address before Login.";
					  $scope.beforeloginLinks	 = true;
					  $scope.afterloginLinks     = false;
					  $scope.$apply();
				  } 
				  else
				  {
					  user.save(); //save login module time
					  $scope.closeLogin();
					  $scope.showHomeMsg = true;
					  $scope.homeMsgValue ="You have been successfully logged in.";
					  $scope.beforeloginLinks	 = false;
					  $scope.afterloginLinks  	 = true;
					  $scope.showHomeUserName 	 = true;
					  $scope.cyrLoginLinks  	 = true;
					  
		    		  $scope.name 				 = user.get("name");
					  $scope.email 			 	 = user.get("email");
					  $scope.firstName 			 = user.get("firstName");
					  $scope.middleName 		 = user.get("middleName");
					  $scope.surName 		     = user.get("surName");
					  $scope.dateOfBirth 		 = $filter('date')(user.get("dateOfBirth"), "dd/MM/yyyy");
					  $scope.loginThroughMsg   	 = "CYR";
					 
					 //////////////////////////////CYR local store data start//////////////////////////////////// 
					 // first localStorage is now empty
				 	 window.localStorage.clear();
				 	 
					 window.localStorage.setItem("uName", user.get("name"));
					 window.localStorage.setItem("uEmail",user.get("email"));
					 window.localStorage.setItem("uFirstName", user.get("firstName"));
					 window.localStorage.setItem("uMiddleName", user.get("middleName"));
					 window.localStorage.setItem("uSurName", user.get("surName"));
					 window.localStorage.setItem("uDateOfBirth", $filter('date')(user.get("dateOfBirth"), "dd/MM/yyyy"));
					 window.localStorage.setItem("uLoginThroughMsg", $scope.loginThroughMsg);
					 //////////////////////////////CYR local store data start////////////////////////////////////
					  
					//get user image
					var photoFileObj = user.get("photoFile");
					if(photoFileObj!=undefined)
					{
						var url 		  = photoFileObj.url();
						$scope.photo 	  = url;
						//call function for download ing
						$scope.downloadFile(url);
					}
					else
					{
						$scope.photo 	  = '';
						window.localStorage.removeItem("uPhotolocalPath");
					}
					//call function store Device Info for notification
					$scope.storeDeviceInfo();
					$scope.hideLoading();
					$scope.$apply();
					
					$state.go("app.home"); // go to home page
					$timeout(function() {
						 $scope.hideLoading();
						 $scope.showHomeMsg = false;
						 $scope.$apply();
						}, 4000);
				  }
			  },
			  error: function(user, error) {
				// The login failed. Check error to see.
				 $scope.hideLoading();
				 $scope.vEmailMsg = true;
				 $scope.vEmailMsgValue 	=$scope.firstCharCapital(error.message);
				 $scope.beforeloginLinks	 = true;
				 $scope.afterloginLinks   	 = false;
				 $scope.showHomeUserName 	 = false;
				 
				 $timeout(function() {
					 $scope.vEmailMsg = false;
					}, 3000);
				 $scope.$apply();
			  }
			});
		 }
		};
	// Perform the login action when the user submits the CYR login form ***********END***********
	
	
	
	
	//define function update Memory MentionTo field*************************************start***************
		$scope.updateMemoryMentionTo = function(userRegisterResponse) {
			var userRegisterResponse	= userRegisterResponse;
			var registerUserEmail		= userRegisterResponse.get("email");
			if(registerUserEmail) 
			{
				var memoryQuery   	= Parse.Object.extend("CYRme");
				var query 			= new Parse.Query(memoryQuery);
				query.equalTo("mentionTo", registerUserEmail);
				query.find({
					success: function(memoryResults) {
						for(i in memoryResults){
							//Set memoryResObj to current Memory
							  var memoryResObj = memoryResults[i];
							  var memoryMentionTo	=memoryResObj.get('mentionTo');
							  
							 //check email present in maintion field 
							  var index = $.inArray(registerUserEmail, memoryMentionTo)
							  if (index !== -1) {
								memoryMentionTo[index] = userRegisterResponse.get("username");
								memoryResObj.set("mentionTo",memoryMentionTo);
								memoryResObj.save();
							  }
						} // End for loop
						$scope.hideLoading();
						$scope.$apply();
					},
					error: function(error){
						//alert("Error: " + error.code + " " + error.message);
						 $scope.hideLoading();
						 $scope.$apply();
					}
				}); // End memoryQuery find
			} 
		};	
	//function update Memory MentionTo field*************************************End***********************
	
	//Define function update Activity MentionTo field*************************************start***************
		$scope.updateActivityMentionTo = function(userRegisterResponse) {
			var userRegisterResponse	= userRegisterResponse;
			var registerUserEmail		= userRegisterResponse.get("email");
			if(registerUserEmail) 
			{
				var activityQuery   = Parse.Object.extend("Activity");
				var query 			= new Parse.Query(activityQuery);
				query.equalTo("mentionTo", registerUserEmail);
				query.find({
					success: function(activityResults) {
						for(i in activityResults){
							//Set activityResObj to current Activity
							  var activityResObj = activityResults[i];
							  var activityMentionTo	=activityResObj.get('mentionTo');
							  
							 //check email present in maintion field 
							  var index = $.inArray(registerUserEmail, activityMentionTo)
							  if (index !== -1) {
								activityMentionTo[index] = userRegisterResponse.get("username");
								activityResObj.set("mentionTo",activityMentionTo);
								activityResObj.save();
							  }
						} // End for loop
						$scope.hideLoading();
						$scope.$apply();
					},
					error: function(error){
						//alert("Error: " + error.code + " " + error.message);
						 $scope.hideLoading();
						 $scope.$apply();
					}
				}); // End activityQuery find
			} 
		};	
	//function update Activity MentionTo field*************************************End*****************
	
	
	// Perform the login with FB ****************************************start***************************
		var fbLogged = new Parse.Promise();
		
		var fbLoginSuccess = function(response) {
		if (!response.authResponse.accessToken){
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
		$scope.hideLoading();
		fbLogged.reject(error);
		};
		
		// Defaults to sessionStorage for storing the Facebook token
		 ngFB.init({appId: '1442568932738358'});
		 
		//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
		openFB.init({appId: '1442568932738358', tokenStore: window.localStorage});

		$scope.fbLogin = function() {
		    console.log('FbLogin');
			
			// check network connection present or not
			if ($cordovaNetwork.isOffline()) 
			{
				 //alert("No data network present, app use last loged in user loacl data.");
				 $scope.showLocalStorageData();
		    }
		    else
		    {
			  //alert("Data network ok");
		    
			  ngFB.login({scope: 'public_profile,email,user_friends,user_birthday'}).then(
				function(response) {
					//alert('Facebook login succeeded, auth data: ' +JSON.stringify(response));
					$scope.showLoading();
					fbLoginSuccess(response);
					fbLogged.then( function(authData) {
						return Parse.FacebookUtils.logIn(authData);
					})
					.then( function(userObject) {
					  ngFB.api({
						path: '/me',
						params: {fields: "id,email,name,first_name,middle_name,last_name,birthday,gender,picture"}
               		 }).then(function(response) {
						  
						   //alert("userObject=="+JSON.stringify(userObject));
						  //alert("response=="+JSON.stringify(response));
						  
						  $scope.loginModal.hide();
						  $state.go("app.home"); // go to home page
						  
						  //user not existed
						  /*if (!userObject.existed()) 
						  {
							userObject.set("username", String(response.name));
							userObject.set("name", String(response.name));
							userObject.set("email", String(response.email));
							userObject.set("firstName", String(response.first_name));
							userObject.set("middleName", String(response.middle_name));
							userObject.set("surName", String(response.last_name));
							
							var dob = new Date(response.birthday);
							userObject.set("dateOfBirth", dob);
							userObject.save();
							$scope.showHomeMsg = true;
							$scope.homeMsgValue ="User first time signed up and logged in through Facebook!";
						  } 
						  else 
						  {
							  //user existed
							  userObject.save();
							  $scope.showHomeMsg = true;
							  $scope.homeMsgValue ="User logged in through Facebook!";
							  
						  }*/
						  userObject.set("username", String(response.name));
						  userObject.set("name", String(response.name));
						  userObject.set("email", String(response.email));
						  userObject.set("firstName", String(response.first_name));
						  userObject.set("middleName", String(response.middle_name));
						  userObject.set("surName", String(response.last_name));
							
						  var dob = new Date(response.birthday);
						  userObject.set("dateOfBirth", dob);
						  userObject.save();
						  $scope.showHomeMsg = true;
						  $scope.homeMsgValue ="User logged in through Facebook!";
						  
						  $scope.beforeloginLinks	 = false;
						  $scope.afterloginLinks  	 = true;
						  $scope.showHomeUserName 	 = true;
						  $scope.cyrLoginLinks  	 = false;
						  
						 //profile picture  
						  var pictureObject=response.picture.data;
						  var url=pictureObject.url;
						  
						  $scope.name 				 = response.name;
						  $scope.email 			 	 = response.email;
						  $scope.firstName 			 = response.first_name;
						  $scope.middleName 		 = response.middle_name;
						  $scope.surName 		     = response.last_name;
						  $scope.photo 		     	 = url;
						  $scope.dateOfBirth 		 = $filter('date')(response.birthday, "dd/MM/yyyy");
						  $scope.loginThroughMsg     = "Facebook";
						 
						 //////////////////////////////FB local store data start////////////////////////////////////
						 // first localStorage is now empty
				 	 	 window.localStorage.clear();
					 
					 	 window.localStorage.setItem("uName", response.name);
					 	 window.localStorage.setItem("uEmail", response.email);
						 window.localStorage.setItem("uFirstName", response.first_name);
						 window.localStorage.setItem("uMiddleName", response.middle_name);
						 window.localStorage.setItem("uSurName", response.last_name);
						 window.localStorage.setItem("uDateOfBirth", $filter('date')(response.birthday, "dd/MM/yyyy"));
					     window.localStorage.setItem("uLoginThroughMsg", "Facebook");
						 
						 $scope.downloadFile(url);
					     //////////////////////////////FB local store data start////////////////////////////////////
						 
						 //call function store Device Info for notification
						 $scope.storeDeviceInfo(); 
						 
						 //call function for update Memory MentionTo field
						  $scope.updateMemoryMentionTo(userRegisterResponse);
						 //call function for update Activity MentionTo field
						  $scope.updateActivityMentionTo(userRegisterResponse);
				   
						 $scope.hideLoading();
		   				 $scope.$apply();
							
						  $timeout(function() {
							 $scope.showHomeMsg = false;
							 $scope.homeMsgValue ="";
							}, 3000);
						 
						},
						function(error) {
						   //Error found
						  $scope.loginModal.show();
						  $scope.vEmailMsg = true;
						  $scope.vEmailMsgValue ="User cancelled the Facebook login or did not fully authorize.";
						  $scope.hideLoading();
		   				  $scope.$apply();
						  $timeout(function() {
							 $scope.vEmailMsg = false;
							 $scope.vEmailMsgValue ="";
							}, 3000);
						}
					  );
					 
					}, function(error) {
					  	  //Error found
						  $scope.loginModal.show();
						  $scope.vEmailMsg = true;
						  $scope.vEmailMsgValue ="User cancelled the Facebook login or did not fully authorize.";
						  $scope.hideLoading();
		   				  $scope.$apply();
						  
						  $timeout(function() {
							 $scope.vEmailMsg = false;
							 $scope.vEmailMsgValue ="";
							}, 3000);
					});
					
				},
				function(error) {
					//Error found
					  $scope.loginModal.show();
					  //$scope.vEmailMsg = true;
					  //$scope.vEmailMsgValue ="User cancelled the Facebook login or did not fully authorize.";
					  $scope.vEmailMsg = false;
					  $scope.vEmailMsgValue ="";
					  $scope.hideLoading();
					  $scope.$apply();
					  
					  /*$timeout(function() {
						 $scope.vEmailMsg = false;
						 $scope.vEmailMsgValue ="";
						}, 3000);*/
				});
			
		   }
		}
	// Perform the login with FB *****************************************END*******************************
	
	
	
	// Perform the Register action when the user submits the Register form  ***********Start***********
	
		// Form data for the register modal
		$scope.registerData = [];
		
		//check password match
		$scope.registerData['password'] = '';
		$scope.registerData['confirmPassword'] = '';
		$scope.passwordMatch = false;
		$scope.passwordMatchMsg = false;
		$scope.registerMsg 		= false;
		
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
			$scope.showLoading();
			
			// localStorage is now empty
			window.localStorage.clear();
			
			console.log('Doing register', $scope.registerData);
			
			// code if using a register system
			$scope.passwordMatchMsg = false;
			$scope.registerMsgValue = "";
			
			var userRegister = new Parse.User();
			userRegister.set("username", String($scope.registerData['username']));
			userRegister.set("name", String($scope.registerData['username']));
			userRegister.set("password", String($scope.registerData['password']));
			userRegister.set("email", String($scope.registerData['email']));
			userRegister.set("firstName", String($scope.registerData['firstName']));
			userRegister.set("middleName", String($scope.registerData['middleName']));
			userRegister.set("surName", String($scope.registerData['surName']));
			userRegister.set("dateOfBirth", $scope.registerData['dateOfBirth']);
			
			//var userObjectID=userRegisterResponse.id;
			var fileUploadControl = $("#photoFileUpload")[0];
			if (fileUploadControl.files.length > 0) 
			{
				var file = fileUploadControl.files[0];
				var name = "photo.png";
				var parseFile = new Parse.File(name, file);
				parseFile.save().then(function(parseFile) {
				  
					userRegister.set("photoFile", parseFile);
					//////////////////////////////////////////////
					userRegister.signUp(null, {
					  success: function(userRegisterResponse) {
						//alert("userRegisterResponse=="+JSON.stringify(userRegisterResponse));
						
					   //call function for update Memory MentionTo field
					   $scope.updateMemoryMentionTo(userRegisterResponse);
					   //call function for update Activity MentionTo field
					   $scope.updateActivityMentionTo(userRegisterResponse);
				   
						$scope.hideLoading();
						Parse.User.logOut();
						$scope.beforeloginLinks	 = true;
						$scope.afterloginLinks   = false;
						
						$scope.registerThanks();
						$scope.registerMsg = true;
						$scope.registerMsgValue ="Please verifying your email address before Login.";
						$scope.$apply();
					  },
					  error: function(userRegisterResponse, error) {
						// Show the error message somewhere and let the user try again.
						$scope.hideLoading();
						$scope.registerMsg = true;
						$scope.registerMsgValue = $scope.firstCharCapital(error.message);
						console.log("Error: " + error.code + " " + error.message);
						$scope.$apply();
					  }
					});
					//////////////////////////////////////////////
				}, 
				  function(error) {
					// The file either could not be read, or could not be saved to Parse.
					console.log("Error: " + error.code + " " + error.message);
				  });
			}
			else
			{
				userRegister.signUp(null, {
				  success: function(userRegisterResponse) {
				  // alert("userRegisterResponse=="+JSON.stringify(userRegisterResponse));
				   
				   //call function for update Memory MentionTo field
				   $scope.updateMemoryMentionTo(userRegisterResponse);
				   //call function for update Activity MentionTo field
				   $scope.updateActivityMentionTo(userRegisterResponse);
				   
					$scope.hideLoading();
					Parse.User.logOut();
					$scope.beforeloginLinks	 = true;
					$scope.afterloginLinks   = false;
					
					$scope.registerThanks();
					$scope.registerMsg = true;
					$scope.registerMsgValue ="Please verifying your email address before Login.";
					$scope.$apply();
				  },
				  error: function(userRegisterResponse, error) {
					// Show the error message somewhere and let the user try again.
					$scope.hideLoading();
					$scope.registerMsg = true;
					$scope.registerMsgValue = $scope.firstCharCapital(error.message);
					console.log("Error: " + error.code + " " + error.message);
					$scope.$apply();
				  }
				});
			}
			
		};
		
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
	
	// Perform the Register action when the user submits the Register form   ***********End***********
	
	
	//function for first char capital in string
		$scope.firstCharCapital = function(input){
		  return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
		};
		
		
	// Perform user details   ***********start***********	
		
		// Triggered in the user detailss modal to close it
			$scope.closeUserDetailssModal = function() {
				$scope.userDetailsModal.hide();
			};
		
			//show user details
			$scope.userDetails = function() {
				$scope.userDetailsModal.show();
				$scope.showUserDetail = true;
				
				uLoginThroughMsg 	= window.localStorage.getItem("uLoginThroughMsg");
				//set cyr Login Links false when user login with facebook
				if(uLoginThroughMsg=="Facebook")
				{
					$scope.cyrLoginLinks  = false;
				}
				// check current user are present or not
				var currentUser = Parse.User.current();
				if (currentUser) {
					/*$scope.userDetailsModal.show();
					$scope.showUserDetail = true;*/
					
					$scope.name 			= currentUser.get("name");
					$scope.email 			= currentUser.get("email");
					$scope.firstName 		= currentUser.get("firstName");
					$scope.middleName 		= currentUser.get("middleName");
					$scope.surName 		    = currentUser.get("surName");
					$scope.dateOfBirth 		= $filter('date')(currentUser.get("dateOfBirth"), "dd/MM/yyyy");
					
					if(uLoginThroughMsg!=null && uLoginThroughMsg!='')
					{
						$scope.loginThroughMsg  = uLoginThroughMsg;
					}
					else
					{
						$scope.loginThroughMsg  = $scope.loginThroughMsg;
					}
					//check user login with facebook
					//if($scope.loginThroughMsg == "Facebook")
					var uPhotolocalPath 	= window.localStorage.getItem("uPhotolocalPath");
					//alert("uPhotolocalPath="+uPhotolocalPath);
					if(uPhotolocalPath != null && uPhotolocalPath != '')
					{
						//alert("uPhotolocalPath="+uPhotolocalPath);
						$scope.photo 	= uPhotolocalPath;
					}
					else
					{
						var photoFileObj = currentUser.get("photoFile");
						if(photoFileObj!=undefined)
						{
							var url 		 = photoFileObj.url();
							$scope.photo 	 = url;
						}
						else
						{
							$scope.photo 	  = '';
							window.localStorage.removeItem("uPhotolocalPath");
						}
					}
					$scope.$apply();
				} 
				else 
				{
					$timeout(function() {
						$scope.showLocalStorageData();
				   }, 300);
				   
					/*$scope.userDetailsModal.hide();
					$scope.showUserDetail 		 = false;*/
				}
			};
	// Perform user details   ***********End***********
	
	
	
	////////////////////////////////////////
	
	// Perform the Forgot Password action when the user submits the Forgot Password form  ***********Start***********
	
		// Form data for the register modal
		$scope.forgotPasswordData = [];
		$scope.forgotPasswordMsg = false;
		$scope.successForgotPasswordMsg = false;
		
		$scope.forgotPasswordMsgValue = "";
		$scope.successForgotPasswordMsgValue = "";
		
		$scope.doForgotPassword = function() {
			$scope.showLoading();
			console.log('Doing Forgot Password', $scope.forgotPasswordData);
			
			// code if using a Forgot Password system
			Parse.User.requestPasswordReset(String($scope.forgotPasswordData['email']), {
			  success: function() {
				$scope.hideLoading();
				$scope.login();
			    $scope.successForgotPasswordMsg = true;
				$scope.successForgotPasswordMsgValue ="Forgot password request was sent successfully, Please check your email.";
				$scope.$apply();
			  },
			  error: function(error) {
				// Show the error message somewhere
				$scope.hideLoading();
				$scope.forgotPasswordMsg 	 = true;
				$scope.forgotPasswordMsgValue = $scope.firstCharCapital(error.message);
				$timeout(function() {
					 $scope.forgotPasswordMsg = false;
					}, 3000);
				$scope.$apply();
			  }
			});
		};
		
		// Triggered in the forgot password modal to close it
		$scope.closeForgotPassword = function() {
			$scope.forgotPasswordModal.hide();
		};
		
		// Open the forgot password modal
		$scope.forgotPassword = function() {
			//hide registe modal, register thanks and login modal when open forgot password modal
			$scope.loginModal.hide();
			$scope.registerModal.hide();
			$scope.registerThanksModal.hide();
			$scope.forgotPasswordModal.show();
			$scope.$apply();
		};
	
	// Perform the Register action when the user submits the Register form   ***********End***********
	
	
	
	////////////////////////////////////////////////
	
	// Perform the Reset Password action when the user submits the Reset Password form  ***********Start***********
	
		// Form data for the reset password modal
		$scope.resetPasswordData = [];
		
		//check password match
		$scope.resetPasswordData['oldPassword'] = '';
		$scope.resetPasswordData['newPassword'] = '';
		$scope.resetPasswordData['confirmNewPassword'] = '';
		
		$scope.resetPasswordMsg 	 = false;
		$scope.resetPasswordMsgValue = "";
		
		$scope.resetPasswordMatch 	 = false;
		$scope.resetPasswordMatchMsg = false;
		
		$scope.$watch("resetPasswordData['newPassword']",function() {$scope.matchResetPassword();});
		$scope.$watch("resetPasswordData['confirmNewPassword']",function() {$scope.matchResetPassword();});	
		
		$scope.matchResetPassword = function() {
		  if ($scope.resetPasswordData['newPassword'] === $scope.resetPasswordData['confirmNewPassword']) 
		  {
			$scope.resetPasswordMatch = true;
		  } 
		  else 
		  {
			$scope.resetPasswordMatch = false;
		  }
		  
		  if($scope.resetPasswordMatch==false && $scope.resetPasswordData['newPassword'].length>0 && $scope.resetPasswordData['confirmNewPassword'].length>0)
		  {
			$scope.resetPasswordMatchMsg = true;
		  }
		  else
		  {
			$scope.resetPasswordMatchMsg = false;
		  }
		  console.log('resetPasswordNotMatch=', $scope.resetPasswordMatchMsg);
		};
		
		// Perform the reset password action when the user submits the reset password form
		$scope.doResetPassword = function() {
			$scope.showLoading();
			console.log('Doing reset password', $scope.resetPasswordData);
			
			// code if using reset password system
			$scope.passwordMatchMsg = false;
			$scope.resetPasswordMsgValue = "";
			
			//check current user
			var currentUser = Parse.User.current();
			if (currentUser) {
				var currentUserName 	= currentUser.get("username");
				Parse.User.logIn(String(currentUserName), String($scope.resetPasswordData['oldPassword']), {
				  success: function(user) {
					  
					user.set("password", String($scope.resetPasswordData['newPassword']));
					user.save();
					
					$scope.resetPasswordData['oldPassword'] = '';
					$scope.resetPasswordData['newPassword'] = '';
					$scope.resetPasswordData['confirmNewPassword'] = '';
					
					$scope.closeResetPassword();
					$scope.hideLoading();
					$state.go("app.home"); // go to home page
					$scope.showHomeMsg 	 	= true;
					$scope.homeMsgValue 	= "Password has been reset successfully.";
					$timeout(function() {
					 $scope.showHomeMsg = false;
					 $scope.homeMsgValue = "";
					}, 4000);
					$scope.$apply();
					  
				  },
				  error: function(user, error) {
					  $scope.hideLoading();
					  $scope.resetPasswordMsg 	 	= true;
					  $scope.resetPasswordMsgValue 	= "Invalid Old Password, Please Enter Correct Old Password.";
					  $scope.$apply();
				  }
				});
			} 
			else {
				$scope.hideLoading();
				$scope.resetPasswordMsg 	 	= true;
				$scope.resetPasswordMsgValue 	= "Invalid User.";
				$scope.$apply();
			}
			
		};
		
		// Triggered in the reset password modal to close it
		$scope.closeResetPassword = function() {
			$scope.resetPasswordModal.hide();
		};
		
		// Open the reset password modal
		$scope.resetPassword = function() {
			//hide user details modal and register thanks modal when open reset password modal
			$scope.userDetailsModal.hide();
			$scope.registerThanksModal.hide();
			$scope.resetPasswordModal.show();
		};
	
	// Perform the Reset Password action when the user submits the Reset Password form  ***********END***********
		
	//Download File  ***********start***********
		$scope.downloadFile = function(url) {
			var filename = url.split("/").pop();
			var trustHosts = true
			var options = {};
			var targetPath = cordova.file.dataDirectory + filename;
            
			$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
			  .then(function(result) {
				//set local img path in var
				window.localStorage.setItem("uPhotolocalPath", result.nativeURL);
				window.localStorage.setItem("filename", result.name);
				//alert(JSON.stringify(result));
			  }, function(error) {
				// Error
			  }, function (progress) {
				$timeout(function () {
				  $scope.downloadProgress = (progress.loaded / progress.total) * 100;
				})
			  });
		 }
	//Download File  ***********end***********
	
	
	//show user data from local storage  ***********start***********
		$scope.showLocalStorageData = function() {
			$timeout(function() {
				//alert("uName=="+uName);
				if(uName!=null && uName!="" && $cordovaNetwork.isOffline())
				{
					$scope.closeLogin();
					//alert("hide login");
					$scope.beforeloginLinks	 = false;
					$scope.afterloginLinks   = true;
					$scope.showHomeUserName  = true;
					
					$scope.name 			= uName;
					$scope.email 			= uEmail;
					$scope.firstName 		= uFirstName;
					$scope.middleName 		= uMiddleName;
					$scope.surName 		    = uSurName;
					$scope.dateOfBirth 		= uDateOfBirth;
					$scope.loginThroughMsg  = uLoginThroughMsg;
                    $scope.photo 			= uPhotolocalPath;
					$state.go("app.home"); // go to home page
					$scope.hideLoading();
					$scope.$apply();
					
				}
				else
				{
					//alert("show login");
					
					$scope.beforeloginLinks	 = true;
					$scope.afterloginLinks   = false;
					$scope.showHomeUserName  = false;
					
					//call hide user Details Modal
					$scope.userDetailsModal.hide();
					$scope.showUserDetail  = false;
					$scope.login();
					if($cordovaNetwork.isOffline())
					{
						$scope.vEmailMsg = true;
						$scope.vEmailMsgValue ="Please check your network connection and try again";
					}

					$scope.hideLoading();
					$scope.$apply();
						
					}
			  }, 400);
	     }
		 //show user data from local storage  ***********End***********
		 
		 
		 
		 ///////////////////////////////////////////
		 //function define for store device info for notification
		 $scope.storeDeviceInfo=function()
		 {
			//ionic init push service
			$ionicPush.init({
			  "debug": false,
			  "onNotification": function(notification) {
				var payload = notification.payload;
				//console.log(notification, payload);
			  },
			  "onRegister": function(data) {
				//console.log(data.token);
				//alert("data=="+JSON.stringify(data));
				//store device detail for userin Installation class
				
				var platform = $cordovaDevice.getPlatform();
			   if(platform=="Android")
			   {
				   var pushType='gcm';
			   }
			   else if(platform=="iOS")
			   {
					var pushType='APNS';
			   }
			   else
			   {
					var pushType='';
			   }
			   var pushdata = { 
								  deviceType: platform,
								  pushType: pushType,
								  deviceToken: data.token
								 };
					// Run our Parse Cloud Code and pass our 'data' object to it
					Parse.Cloud.run("registerForNotifications", pushdata, {
					  success: function(object) {
						//alert("result11=="+JSON.stringify(object));
					  },
					  error: function(error) {
						//alert("error=="+JSON.stringify(error));
					  }
					});
			  }
			});
			$ionicPush.register();	
		 }
		////////////////////////////////////////////
	  	
		console.log('afterloginLinks=='+$scope.afterloginLinks);
		
	})
	
	
	
	
	
	
	
//CYRme Memory controller******************************Start************************************************
	.controller('CYRmeMemory', function($scope ,$rootScope, $state, $ionicLoading, $cordovaNetwork, ThumbnailService, $ionicPush, $http, $cordovaDevice, $timeout) {
		
		// current user
		var currentUser = Parse.User.current();
		
		//msg false by default
		$scope.addMemoryMsg = false;
		$scope.addMemoryValue ="";
		// Form data for add Memory
		$scope.addMemoryData = [];
		
		//////////////////////////////////////////////////////////////////////////
	   //Define Send Notification function
		$scope.sendNotification=function(deviceToken,deviceType,pushType,fromUserName)
		{	
			var tokens = [deviceToken];
			//Ionic CYRme App ID
			var appId 		= 'c89f83f4';
			//Ionic CYRme App Key
			var privateKey  = '86463055733ab9c6afa85c593bf782c748d3e9ba2a1ea7be';
			
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
				"production": false,
				"notification": {
				  "alert":fromUserName+" has invited you!",
				}
			  }
			};
	
			//alert("req"+JSON.stringify(req));
			// Make the API call
			$http(req).success(function(resp){
			  // Handle success
			  //console.log("Ionic Push: Push success!");
			 // $scope.sendMail("anil@bunkerbound.net",'Ionic Push success',JSON.stringify(resp),'anil@bunkerbound.net','anil');
			 // alert("Ionic Push: Push success!=="+JSON.stringify(resp));
			}).error(function(error){
			  // Handle error 
			 // console.log("Ionic Push: Push error...");
			 // alert("error=="+JSON.stringify(error));
			});
		}
		//////////////////////////////////////////////////////////////////////////
		
		//////////////////////////////////////////////////////////////////////////
		 //Define Send Notification to facebook user function
		$scope.sendNotificationToFacebookUser=function(userFbId,fromName)
		{	
			// Build the request object
			var reqFacebook = {
			  method: 'POST',
			  url: 'https://graph.facebook.com/oauth/access_token?client_id=1442568932738358&client_secret=bedac52dfa99af6e2e3ee9a5d1fb4eb3&grant_type=client_credentials',
			  headers: {
				'Content-Type': 'application/json'
			  }
			};
			// Make the API call
			$http(reqFacebook).success(function(respFacebook){
			  //send notification to facebook
			  var reqNotificationFacebook = {
				  method: 'POST',
				  url: 'https://graph.facebook.com/'+userFbId+'/notifications?'+respFacebook+'&template="'+fromName+' has seen this awesome app and has invited you to join and take a look."',
					
				  headers: {
					'Content-Type': 'application/json'
				  }
				};
				// Make the API call
				$http(reqNotificationFacebook).success(function(respNotificationFacebook){
				 // alert("respFacebook success!=="+JSON.stringify(respNotificationFacebook));
				  
				}).error(function(error){
				  //alert("error=="+JSON.stringify(error));
				});
			  
			  
			  
			}).error(function(error){
			 // alert("error=="+JSON.stringify(error));
			});
		}
		/////////////////////////////////////////////////////////////////////////
		
		//////////////////////////////////////////////////////////////////////////
		//Define send mail function
		$scope.sendMail=function(to,subject,message,from,fromName)
		{
			// An object containing name, toEmail, fromEmail, subject and message
			var data = { 
			  toEmail: to,
			  subject: subject,
			  message: message,
			  fromEmail: from,
			  fromName: fromName
			}
		
			// Run our Parse Cloud Code and pass our 'data' object to it
			Parse.Cloud.run("sendEmail", data, {
			  success: function(object) {
				//alert("result=="+JSON.stringify(object));
			  },
		
			  error: function(object, error) {
				//alert("Error! Email not sent!");
			  }
			});
		}
		//////////////////////////////////////////////////////////////////////////
		
		//////////////////////////////////////////////////////////////////////////
		//Define check email validation
		$scope.validateInviteEmail = function(email) 
		{
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			//alert(email+"=validateEmail=="+re.test(email));
			return re.test(email);
		}
		//////////////////////////////////////////////////////////////////////////
		
		//////////////////////////////////////////////////////////////////////////
		//Define invite user function start******************************************	
		$scope.inviteUsers=function(inviteUserListArray,memoryImg,memoryContent)
		{
			//alert("inviteUserListArray=="+JSON.stringify(inviteUserListArray));
			var CYRmeUserNameList=new Array; //CYRme user name array for send notification on mobile
			var CYRmeUserEmailList=new Array; //CYRme user email array for send notification on mobile
			var CYRmeUserIdList=new Array; //CYRme user email array for send notification on mobile
			
			
			var otherUserEmailList=new Array; //other user email array for send mail 
			var otherFacebookUserIdlList=new Array; //other facebook user id array for get email from facebook as per facebook userid
			
			if(Array.isArray(inviteUserListArray))
			{	
				//var inviteUser = inviteUserListArray[i];
				
				//username field query var
				var usernameQuery = new Parse.Query("User");
					usernameQuery.notEqualTo("objectId", currentUser.id);
					usernameQuery.containedIn("username", inviteUserListArray);
				
				//email field query var	
				var emailQuery 	  = new Parse.Query("User");
					emailQuery.notEqualTo("objectId", currentUser.id);
					emailQuery.containedIn("email", inviteUserListArray);
					
				//Compound both username and email query var
				var mainQuery = Parse.Query.or(usernameQuery, emailQuery);
				mainQuery.find({
				  success: function(results) {
					// alert("results.length=="+results.length);
					 
					 //check CYRme user
					 for (var i = 0; i < results.length; i++) 
					 { 
						  var object = results[i];
						  CYRmeUserNameList.push(object.get('name'));
						  CYRmeUserEmailList.push(object.get('email'));
						  CYRmeUserIdList.push(object.id);
					 }
					 
					//check other user
					 //user input array loop start
					 for(var j=0; j<inviteUserListArray.length; j++)
					 {
						 //user input value
						 var inviteUser = inviteUserListArray[j];
						 
						if($scope.validateInviteEmail(inviteUser)) //check input value is email
						{
							 //check CYRme User Email List loop
							 if(($.inArray( inviteUser, CYRmeUserEmailList )==-1) && (inviteUser!=currentUser.get('email')))
							 {
								//alert("orher user check email");
								//Email id add in otherUserEmailList array 
								otherUserEmailList.push(inviteUser);
							 }
							 // alert("otherUserEmailList=="+JSON.stringify(otherUserEmailList));
						}
						else
						{
							 //check CYRme User Name List loop 
							 if(($.inArray( inviteUser, CYRmeUserNameList )==-1) && (inviteUser!=currentUser.get('name')))
							 {
								//alert("facebook check user id");
								//Email id add in otherFacebookUserIdlList array 
								otherFacebookUserIdlList.push(inviteUser);
							 }
							 //alert("otherFacebookUserIdlList=="+JSON.stringify(otherFacebookUserIdlList));
						}
					 }
					 
					 var currentUserName  =currentUser.get('name');
					 var currentUserEmail =currentUser.get('email');
					 
					 //call function for send notification to CYRme users
					// alert("CYRmeUserNameList=="+JSON.stringify(CYRmeUserNameList));
					 //alert("CYRmeUserEmailList=="+JSON.stringify(CYRmeUserEmailList));
					if(CYRmeUserNameList.length>0)
					{ 
						//function call send notification by ionic
					    //find device token invited users
						var InstallationQuery = new Parse.Query("Installation");
						InstallationQuery.containedIn("userId", CYRmeUserIdList);
						//InstallationQuery.equalTo("user", {__type: "Pointer",className: "_User",objectId: CYRmeUserIdList[0]});
						InstallationQuery.find({

						  success: function(results){
							   //alert("results=="+JSON.stringify(results));
								for (var i = 0; i < results.length; i++) { 
								  var InstallationResultObject = results[i];
								  var deviceToken  = InstallationResultObject.get("deviceToken");
								  var deviceType   = InstallationResultObject.get("deviceType");
								  var pushType     = InstallationResultObject.get("pushType");
								  var fromUserName = currentUserName;
								  $scope.sendNotification(deviceToken,deviceType,pushType,fromUserName);
								}
						  },
						   error: function(error){
							 // alert("Error: " + error.code + " " + error.message);
						  }
						});
						
					}
					  
					 //call function for send email to other users
					 //alert("otherUserEmailList=="+JSON.stringify(otherUserEmailList));
					 if(otherUserEmailList.length>0)
					 {
						var  to			= otherUserEmailList;
						var  subject	= currentUserName+' have been Invited to CYRMe APP';
						var  message	= '.';
						var  from		= currentUserEmail;
						var  fromName	= currentUserName;
						// An object containing name, toEmail, fromEmail, subject,image,content and message
						var data = { 
						  toEmail: to,
						  subject: subject,
						  message: message,
						  fromEmail: from,
						  fromName: fromName,
						  memoryImg: memoryImg,
						  memoryContent: memoryContent,
						  template_id: "5e5dd99c-08ca-4126-873f-9a08b8f4c1af"
						}
					
						// Run sendEmail Parse Cloud function and pass 'data' object to it
						Parse.Cloud.run("sendEmail", data, {
						  success: function(object) {
							//alert("result=="+JSON.stringify(object));
						  },
						  error: function(error) {
							//alert("Error! Email not sent!");
							//alert("error=="+JSON.stringify(error));
						  }
						});
					 }
					 
					 //send notification to facebook user
					 //alert("otherFacebookUserIdlList=="+JSON.stringify(otherFacebookUserIdlList));
					  if(otherFacebookUserIdlList.length>0)
					  {
						  for (var f = 0; f < otherFacebookUserIdlList.length; f++)
						  {
							 //call send notification to Facebook User
							$scope.sendNotificationToFacebookUser(otherFacebookUserIdlList[f],currentUserName);
						  }
					  }
					 
				  },
				  error: function(error) {
					  //alert("Error: " + error.code + " " + error.message);
				  }
				}); //main query end
				
			} //invite array if end
		}
		//invite user function End****************************************	
		//////////////////////////////////////////////////////////////////////////
		
		
		//////////////////////////////////////////////////////////////////////////	
		//Define Add CYRme Memory
		$scope.addMemory = function() 
		{
			$scope.showLoading();
			
			if(currentUser && $cordovaNetwork.isOnline()) 
			{
				var CYRmeMemory = new Parse.Object("CYRme");
				CYRmeMemory.set("user", Parse.User.current());
				CYRmeMemory.set("title", String($scope.addMemoryData['title']));
				CYRmeMemory.set("typeOfMemory", String($scope.addMemoryData['typeOfMemory']))
				CYRmeMemory.set("dateOfMemory", $scope.addMemoryData['dateOfMemory']);
				if(String($scope.addMemoryData['mentionTo'])!="undefined")
				{
					var mentionToArray=$scope.addMemoryData['mentionTo'].split(",");
					CYRmeMemory.set("mentionTo", mentionToArray);
				}
				CYRmeMemory.set("content", String($scope.addMemoryData['content']));
				CYRmeMemory.set("privacy", String($scope.addMemoryData['privacy']));
				
				//upload file
				var fileUploadControl = $("#memoryFileUpload")[0];
				if (fileUploadControl.files.length > 0) {
					
					var file = fileUploadControl.files[0];
					
					//upload file to parse server
					var name = "photo.png";
					var parseFile = new Parse.File(name, file);
					parseFile.save().then(function(parseFile) {
						CYRmeMemory.set("image", parseFile);
					   //save CYRmeMemory object
					   CYRmeMemory.save(null, {
						  success: function(memoryRes) {
							//get activity image
							var memoryImgObj = memoryRes.get("image");
							if(memoryImgObj!=undefined)
							{
								var memoryImg   = '<img src="'+memoryImgObj.url()+'" >';
							}
							else
							{
								var memoryImg   = '';
							}
							//get memory content
							 var memoryContent 	 	=memoryRes.get('content');
							 if(memoryContent!="undefined")
							 {
								memoryContent 	 =memoryContent;
							 }
							 else
							 { 
								 memoryContent 	 ="";
							 }
							//call invite users function
							$scope.inviteUsers(mentionToArray,memoryImg,memoryContent);
							$scope.$apply();
						  },
						  error: function(error) {
							//alert("Error: " + error.code + " " + error.message);
							$scope.$apply();
						  }
						});
					}, 
					  function(error) {
						// The file either could not be read, or could not be saved to Parse.
						// alert("Error: " + error.code + " " + error.message);
					  });
					
					
					////////////////////////////////Thumb nill upload start////////////////////////////////////////////////
					//Define function for generate thumbnail and save in Parse server
					$scope.generateThumbnailAndSaveParse = function(fileData,thumbSizeObjData) {
					  ThumbnailService.generate(fileData,thumbSizeObjData).then(
						function success(thumbFile) {
						  $scope.MPhoto=thumbFile;
						  var name = "photoThumb.png";
						  var parseFileThumb = new Parse.File(name, { base64: thumbFile});
						  parseFileThumb.save().then(function(parseFileThumb) {
						  CYRmeMemory.set("thumbnail", parseFileThumb);
						  //save CYRmeMemory object
						  CYRmeMemory.save();
						  // alert('success: file upload');
						   
						}, 
						  function(error) {
							// The file either could not be read, or could not be saved to Parse.
							// alert("Error: " + error.code + " " + error.message);
						  });
						},
						function error(reason) {
						 // alert('Error: ' + reason);
						}
					  );
					};
					
					
					//Define function for convert image data into base64 string
					var fileReader = new FileReader();
					fileReader.onload = function(fileLoadedEvent) {
						var thumbnillBase64Data = fileLoadedEvent.target.result; // <--- data: base64
						//alert("thumbnillBase64Data=="+JSON.stringify(thumbnillBase64Data));
						//call function for generate thumbnail and save in Parse server
						var fileDataUrl = thumbnillBase64Data;
						var thumbSizeObj={ width:100, height:100};
						$scope.generateThumbnailAndSaveParse(fileDataUrl,thumbSizeObj);
						$scope.$apply();
						 //return srcData;
					}
					//call function for convert image data into base64 string
					fileReader.readAsDataURL(file);
					///////////////////////Thumb nill upload End////////////////////////////////
					////////////////////////////////////////////////////////////////////////////////
				}
				else
				{
					//save CYRmeMemory object
					CYRmeMemory.save(null, {
						  success: function(memoryRes) {
							 //get memory content
							  var memoryContent 	=memoryRes.get('content');
							  if(memoryContent!="undefined")
							  {
								 memoryContent 	 =memoryContent;
							  }
							  else
							  { 
								  memoryContent  ="";
							  }
							 //call invite users function
							 $scope.inviteUsers(mentionToArray,'',memoryContent);
							 $scope.$apply();
						  },
						  error: function(error) {
							//alert("Error1: " + error.code + " " + error.message);
							$scope.$apply();
						  }
						});
				}
				
				$timeout(function() {
					$scope.hideLoading();
					$state.go('app.viewMemory',null,{reload:true});// go to viewMemory page
					$scope.$apply();
				}, 10000);
			}
			else
			{
				// Show the error message somewhere and let the user try again.
				$scope.addMemoryMsg = true;
				$scope.addMemoryValue ="Please check your network connection and try again";
				$scope.hideLoading();
				$scope.$apply();
			}
		};
		//////////////////////////////////////////////////////////////////////////
	})
//CYRme Memory controller******************************End************************************************
	


//View Memory controller******************************Start************************************************
	.controller('viewMemory', function($scope ,$rootScope, $state, $ionicLoading, $cordovaNetwork, $cordovaFile, $filter, $timeout) {
		
		
		//msg false by default
		$scope.showViewMemoryMsg 	= false;
		$scope.showViewMemoryValue  ="";
		
		//define function view Memory
		$scope.viewMemory = function() {
				$scope.showLoading();
				var memoryListArray	=new Array(); //store all memory data
				// check current user are present or not
				var currentUser = Parse.User.current();
				if(currentUser && $cordovaNetwork.isOnline())  
				{
					var memoryQuery   	= Parse.Object.extend("CYRme");
					var query 			= new Parse.Query(memoryQuery);
					query.include("user");
					query.descending("createdAt");
					
					query.find({
						success: function(memoryResults) {
							//alert("memoryResults=="+JSON.stringify(memoryResults));
							
							for(i in memoryResults){
								//Set memoryResObj to current Memory
								  var memoryResObj = memoryResults[i];
								
								  var memoryTitle		 	=memoryResObj.get('title');
								  var memoryContent 	 	=memoryResObj.get('content');
								  var memoryAddOnDateTime 	=$filter('date')(memoryResObj.get("dateOfMemory"), "dd/MM/yyyy");
								   
								  //get memory thumbnill
								  var memoryThumbnailObj = memoryResObj.get("thumbnail");
								  if(memoryThumbnailObj!=undefined)
								  {
									  var memoryThumbnailurl = memoryThumbnailObj.url();
									  var memoryImg 	 	 = memoryThumbnailurl;
								  }
								  else
								  {
									   var memoryImg 	 	 = '';
								  }
								  
								 //get user profile pic 
								 var memoryUserImgObj 	 = memoryResObj.get("user").get("photoFile");
								 if(memoryUserImgObj!=undefined)
								 {
									 var memoryUserImgUrl 	 = memoryUserImgObj.url();
									 var memoryUserImg 	 	 = memoryUserImgUrl;
								 }
								 else
								 {
									  var memoryUserImg 	 	 = 'img/user.png';
								 }
								  
								 /* Get Memory Author's Name */
								 var memoryUserName   	= memoryResObj.get("user").get("name");
								 var memoryUserId   	= memoryResObj.get("user").id;
								//check user memory privacy
								if(memoryResObj.get('privacy')=="No")
								{
									/* Let's Put the memoryListArray Information in an Array as an Object*/
									memoryListArray.push(
									{
										memoryTitle			: memoryTitle,
										memoryContent		: memoryContent,
										memoryAddOnDateTime	: memoryAddOnDateTime,
										memoryImg			: memoryImg,
										
										memoryUserName		: memoryUserName,
										memoryUserImg		: memoryUserImg,
										memoryId			: memoryResObj.id
											
									});
								}
								else
								{
									// check username or name or email present in user group
									if((currentUser.id==memoryUserId) || ($.inArray(currentUser.get("name"), memoryResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("username"), memoryResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("email"), memoryResObj.get('mentionTo') )>=0))
									{
										/* Let's Put the memoryListArray Information in an Array as an Object*/
										memoryListArray.push(
										{
											memoryTitle			: memoryTitle,
											memoryContent		: memoryContent,
											memoryAddOnDateTime	: memoryAddOnDateTime,
											memoryImg			: memoryImg,
											
											memoryUserName		: memoryUserName,
											memoryUserImg		: memoryUserImg,
											memoryId			: memoryResObj.id
												
										});
									}
								}
								
							} // End for loop
							
							$scope.memoryListArr 	= memoryListArray;
						    $scope.hideLoading();
							$scope.$apply();
						},
						error: function(error){
							//alert("Error: " + error.code + " " + error.message);
							 $scope.hideLoading();
							 $scope.$apply();
						}
					}); // End memoryQuery find
				} 
				else 
				{
				   // Show the error message somewhere and let the user try again.
					$scope.showViewMemoryMsg = true;
					$scope.showViewMemoryValue ="Please check your network connection and try again";
					$scope.hideLoading();
					$scope.$apply();
					
					$timeout(function() {
						$scope.hideLoading();
						$state.go("app.home"); // go to home page
						$scope.$apply();
				   }, 1000);
				}
			};	
			
			
			
		//call function view memory function
		$scope.viewMemory();
		
	})
//View Memory controller******************************End************************************************	



//memory Details controller******************************Start************************************************
	.controller('memoryDetails', function($scope ,$rootScope, $ionicLoading, $state, $stateParams, $cordovaNetwork, $cordovaFile, $filter, $timeout) {
		
		//define function memory Details
		$scope.memoryDetails = function(mId) {
				$scope.showLoading();
				// check current user are present or not
				var currentUser = Parse.User.current();
				if(currentUser) 
				{
					var memoryQuery   	= Parse.Object.extend("CYRme");
					var query 			= new Parse.Query(memoryQuery);
					query.include("user");
					query.equalTo("objectId", mId);
					query.limit(1); // limit to at most 1 results
					query.find({
						success: function(memoryResults) {
							//alert("memoryResults=="+JSON.stringify(memoryResults));
							
							for(i in memoryResults){
								//Set memoryResObj to current Memory
								  var memoryResObj = memoryResults[i];
								
								  $scope.memoryDetailsTitle			=memoryResObj.get('title');
								  $scope.memoryDetailsContent 	 	=memoryResObj.get('content');
								  $scope.memoryDetailsAddOnDateTime =$filter('date')(memoryResObj.get("dateOfMemory"), "dd/MM/yyyy");
								   
								  //get memory thumbnill
								  var memoryDetailsImgObj = memoryResObj.get("image");
								  if(memoryDetailsImgObj!=undefined)
								  {
									  var memoryDetailsImgurl 	 = memoryDetailsImgObj.url();
									  $scope.memoryDetailsImg 	 = memoryDetailsImgurl;
								  }
								  else
								  {
									   $scope.memoryDetailsImg 	 	 = '';
								  }
								  
								 //get user profile pic 
								 var memoryDetailsUserImgObj 	 = memoryResObj.get("user").get("photoFile");
								 if(memoryDetailsUserImgObj!=undefined)
								 {
									 var memoryDetailsUserImgUrl 	= memoryDetailsUserImgObj.url();
									 $scope.memoryDetailsUserImg 	= memoryDetailsUserImgUrl;
								 }
								 else
								 {
									  $scope.memoryDetailsUserImg 	 = 'img/user.png';
								 }
								  
								 /* Get Memory Author's Name */
								 $scope.memoryDetailsUserName   	= memoryResObj.get("user").get("name");
								 $scope.memoryDetailsUserId  		= memoryResObj.get("user").id;
								 $scope.memoryDetailsId  			= memoryResObj.id;
								 
								 
								 //get IREM activity counts
								 var activityQuery   	= Parse.Object.extend("Activity");
								 var query 				= new Parse.Query(activityQuery);
								 query.equalTo("CYRme", {"__type":"Pointer","className":"CYRme","objectId":memoryResObj.id});
								 query.equalTo("activityType", "IREM");
								 query.count({
									 success: function(IREMcount) {
										 $scope.IREMcount  	= IREMcount;
										 $scope.$apply();
									  },
									  error: function(error) {
										// The request failed
									  }
									});
									
								//get LIKE activity counts
								 var activityQuery   	= Parse.Object.extend("Activity");
								 var query 				= new Parse.Query(activityQuery);
								 query.equalTo("CYRme", {"__type":"Pointer","className":"CYRme","objectId":memoryResObj.id});
								 query.equalTo("activityType", "LIKE");
								 query.count({
									 success: function(LIKEcount) {
										 $scope.LIKEcount  	= LIKEcount;
										 $scope.$apply();
									  },
									  error: function(error) {
										// The request failed
									  }
									});
									
									
								//get FOLLOW activity counts
								 var activityQuery   	= Parse.Object.extend("Activity");
								 var query 				= new Parse.Query(activityQuery);
								 query.equalTo("CYRme", {"__type":"Pointer","className":"CYRme","objectId":memoryResObj.id});
								 query.equalTo("activityType", "FOLLOW");
								 query.count({
									 success: function(FOLLOWcount) {
										 $scope.FOLLOWcount  	= FOLLOWcount;
										 $scope.$apply();
									  },
									  error: function(error) {
										// The request failed
									  }
									});
								 
								 $scope.hideLoading();
								 $scope.$apply();
							} // End for loop
							
						},
						error: function(error){
							//alert("Error: " + error.code + " " + error.message);
							 $scope.hideLoading();
							 $scope.$apply();
						}
					}); // End memoryQuery find
				} 
				else 
				{
					$timeout(function() {
						$scope.hideLoading();
						$state.go("app.home"); // go to home page
						$scope.$apply();
				   }, 300);
				}
			};	
			
			
		//call view memory function	
		var mId = $stateParams.id;
		if(mId!='')
		{
			$scope.memoryDetails(mId);
		}
		else
		{
			$state.go("app.viewMemory"); // go to view Memory page
			$scope.$apply();
		}
		
	})
//memory Details controller******************************End************************************************	



















//activity controller******************************Start************************************************
	.controller('activity', function($scope ,$rootScope, $state, $stateParams, $ionicLoading, $cordovaNetwork, ThumbnailService,$ionicPush, $http, $cordovaDevice, $timeout) {
		
		// current user
		var currentUser = Parse.User.current();
		//msg false by default
		$scope.addActivityMsg = false;
		$scope.addActivityValue ="";
		// Form data for add Activity
		$scope.addActivityData = [];
		
		
	   //////////////////////////////////////////////////////////////////////////
	   //Define Send Notification function
		$scope.sendNotificationActivity=function(deviceToken,deviceType,pushType,fromUserName)
		{	
			var tokens = [deviceToken];
			//Ionic CYRme App ID
			var appId 		= 'c89f83f4';
			//Ionic CYRme App Key
			var privateKey  = '86463055733ab9c6afa85c593bf782c748d3e9ba2a1ea7be';
			
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
				"production": false,
				"notification": {
				  "alert":fromUserName+" has invited you!",
				}
			  }
			};
	
			//alert("req"+JSON.stringify(req));
			// Make the API call
			$http(req).success(function(resp){
			  // Handle success
			  //console.log("Ionic Push: Push success!");
			 // $scope.sendMail("anil@bunkerbound.net",'Ionic Push success',JSON.stringify(resp),'anil@bunkerbound.net','anil');
			 // alert("Ionic Push: Push success!=="+JSON.stringify(resp));
			}).error(function(error){
			  // Handle error 
			 // console.log("Ionic Push: Push error...");
			 // alert("error=="+JSON.stringify(error));
			});
		}
		//////////////////////////////////////////////////////////////////////////
		
		
		//////////////////////////////////////////////////////////////////////////
		 //Define Send Notification to facebook user function
		$scope.sendNotificationToFacebookUserActivity=function(userFbId,fromName)
		{	
			// Build the request object
			var reqFacebook = {
			  method: 'POST',
			  url: 'https://graph.facebook.com/oauth/access_token?client_id=1442568932738358&client_secret=bedac52dfa99af6e2e3ee9a5d1fb4eb3&grant_type=client_credentials',
			  headers: {
				'Content-Type': 'application/json'
			  }
			};
			// Make the API call
			$http(reqFacebook).success(function(respFacebook){
			  //send notification to facebook
			  var reqNotificationFacebook = {
				  method: 'POST',
				  url: 'https://graph.facebook.com/'+userFbId+'/notifications?'+respFacebook+'&template="'+fromName+' has seen this awesome app and has invited you to join and take a look."',
					
				  headers: {
					'Content-Type': 'application/json'
				  }
				};
				// Make the API call
				$http(reqNotificationFacebook).success(function(respNotificationFacebook){
				 // alert("respFacebook success!=="+JSON.stringify(respNotificationFacebook));
				  
				}).error(function(error){
				  //alert("error=="+JSON.stringify(error));
				});
			  
			  
			  
			}).error(function(error){
			 // alert("error=="+JSON.stringify(error));
			});
		}
		/////////////////////////////////////////////////////////////////////////
		
		
		//////////////////////////////////////////////////////////////////////////
		//Define check email validation
		$scope.validateInviteEmailActivity = function(email) 
		{
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			//alert(email+"=validateEmail=="+re.test(email));
			return re.test(email);
		}
		//////////////////////////////////////////////////////////////////////////
		
		//////////////////////////////////////////////////////////////////////////
		//Define invite user function start******************************************	
		$scope.inviteUsersActivity=function(inviteUserListArray,activityImg,activityContent)
		{
			//alert("inviteUserListArray=="+JSON.stringify(inviteUserListArray));
			var CYRmeUserNameList=new Array; //CYRme user name array for send notification on mobile
			var CYRmeUserEmailList=new Array; //CYRme user email array for send notification on mobile
			var CYRmeUserIdList=new Array; //CYRme user email array for send notification on mobile
			
			
			var otherUserEmailList=new Array; //other user email array for send mail 
			var otherFacebookUserIdlList=new Array; //other facebook user id array for get email from facebook as per facebook userid
			
			if(Array.isArray(inviteUserListArray))
			{	
				//var inviteUser = inviteUserListArray[i];
				
				//username field query var
				var usernameQuery = new Parse.Query("User");
					usernameQuery.notEqualTo("objectId", currentUser.id);
					usernameQuery.containedIn("username", inviteUserListArray);
				
				//email field query var	
				var emailQuery 	  = new Parse.Query("User");
					emailQuery.notEqualTo("objectId", currentUser.id);
					emailQuery.containedIn("email", inviteUserListArray);
					
				//Compound both username and email query var
				var mainQuery = Parse.Query.or(usernameQuery, emailQuery);
				mainQuery.find({
				  success: function(results) {
					// alert("results.length=="+results.length);
					 
					 //check CYRme user
					 for (var i = 0; i < results.length; i++) 
					 { 
						  var object = results[i];
						  CYRmeUserNameList.push(object.get('name'));
						  CYRmeUserEmailList.push(object.get('email'));
						  CYRmeUserIdList.push(object.id);
					 }
					 
					//check other user
					 //user input array loop start
					 for(var j=0; j<inviteUserListArray.length; j++)
					 {
						 //user input value
						 var inviteUser = inviteUserListArray[j];
						 
						if($scope.validateInviteEmailActivity(inviteUser)) //check input value is email
						{
							 //check CYRme User Email List loop
							 if(($.inArray( inviteUser, CYRmeUserEmailList )==-1) && (inviteUser!=currentUser.get('email')))
							 {
								//alert("orher user check email");
								//Email id add in otherUserEmailList array 
								otherUserEmailList.push(inviteUser);
							 }
							 // alert("otherUserEmailList=="+JSON.stringify(otherUserEmailList));
						}
						else
						{
							 //check CYRme User Name List loop 
							 if(($.inArray( inviteUser, CYRmeUserNameList )==-1) && (inviteUser!=currentUser.get('name')))
							 {
								//alert("facebook check user id");
								//Email id add in otherFacebookUserIdlList array 
								otherFacebookUserIdlList.push(inviteUser);
							 }
							 //alert("otherFacebookUserIdlList=="+JSON.stringify(otherFacebookUserIdlList));
						}
					 }
					 
					 var currentUserName  =currentUser.get('name');
					 var currentUserEmail =currentUser.get('email');
					 
					 //call function for send notification to CYRme users
					// alert("CYRmeUserNameList=="+JSON.stringify(CYRmeUserNameList));
					 //alert("CYRmeUserEmailList=="+JSON.stringify(CYRmeUserEmailList));
					if(CYRmeUserNameList.length>0)
					{ 
						//function call send notification by ionic
					   //find device token invited users
						var InstallationQuery = new Parse.Query("Installation");
						InstallationQuery.containedIn("userId", CYRmeUserIdList);
						//InstallationQuery.equalTo("user", {__type: "Pointer",className: "_User",objectId: CYRmeUserIdList[0]});
						InstallationQuery.find({

						  success: function(results){
							   //alert("results=="+JSON.stringify(results));
								for (var i = 0; i < results.length; i++) { 
								  var InstallationResultObject = results[i];
								  var deviceToken  = InstallationResultObject.get("deviceToken");
								  var deviceType   = InstallationResultObject.get("deviceType");
								  var pushType     = InstallationResultObject.get("pushType");
								  var fromUserName = currentUserName;
								  $scope.sendNotificationActivity(deviceToken,deviceType,pushType,fromUserName);
								}
						  },
						   error: function(error){
							 // alert("Error: " + error.code + " " + error.message);
						  }
						});
						
					}
					  
					 //call function for send email to other users
					// alert("otherUserEmailList=="+JSON.stringify(otherUserEmailList));
					 if(otherUserEmailList.length>0)
					 {
						var  to			= otherUserEmailList;
						var  subject	= currentUserName+' have been Invited to CYRMe APP';
						var  message	= '.';
						var  from		= currentUserEmail;
						var  fromName	= currentUserName;
						// An object containing name, toEmail, fromEmail, subject,image,content and message
						var data = { 
						  toEmail: to,
						  subject: subject,
						  message: message,
						  fromEmail: from,
						  fromName: fromName,
						  memoryImg: activityImg,
						  memoryContent: activityContent,
						  template_id: "5e5dd99c-08ca-4126-873f-9a08b8f4c1af"
						}
					
						// Run sendEmail Parse Cloud function and pass 'data' object to it
						Parse.Cloud.run("sendEmail", data, {
						  success: function(object) {
							//alert("result=="+JSON.stringify(object));
						  },
						  error: function(error) {
							//alert("Error! Email not sent!");
							//alert("error=="+JSON.stringify(error));
						  }
						});
					 }
					 
					 //send notification to facebook user
					 //alert("otherFacebookUserIdlList=="+JSON.stringify(otherFacebookUserIdlList));
					  if(otherFacebookUserIdlList.length>0)
					  {
						  for (var f = 0; f < otherFacebookUserIdlList.length; f++)
						  {
							 //call send notification to Facebook User
							$scope.sendNotificationToFacebookUserActivity(otherFacebookUserIdlList[f],currentUserName);
						  }
					  }
					 
				  },
				  error: function(error) {
					  //alert("Error: " + error.code + " " + error.message);
				  }
				}); //main query end
				
			} //invite array if end
		}
		//invite user function End****************************************	
		//////////////////////////////////////////////////////////////////////////
		
		
		//////////////////////////////////////////////////////////////////////////
		//Define Add Activity
		$scope.addActivity = function() 
		{
			$scope.showLoading();
			
			//get to memory id
			var mId = $stateParams.id;
			if(mId!='')
			{
				//get to User id
				var toUser=$stateParams.toUser;
			}
			else
			{
				$state.go('app.viewMemory',null,{reload:true});// go to viewMemory page
				var toUser='';
				$scope.$apply();
			}
			if(currentUser && $cordovaNetwork.isOnline()) 
			{
				var Activity = new Parse.Object("Activity");
				Activity.set("CYRme", {"__type":"Pointer","className":"CYRme","objectId":mId}); //set pointer to current Memory
				Activity.set("toUser", {"__type":"Pointer","className":"User","objectId":toUser}); //set memory user pointer in toUser
				Activity.set("fromUser", currentUser); //set current user pointer in fromUser
				Activity.set("activityType", String($scope.addActivityData['activityType']))
				Activity.set("dateOfMemory", $scope.addActivityData['dateOfMemory']);
				Activity.set("content", String($scope.addActivityData['content']));
				Activity.set("privacy", String($scope.addActivityData['privacy']));
					
				if(String($scope.addActivityData['mentionTo'])!="undefined")
				{
					var mentionToArray=$scope.addActivityData['mentionTo'].split(",");
					Activity.set("mentionTo", mentionToArray);
					//call invite users function
					//$scope.inviteUsersActivity(mentionToArray);
				}
				//upload file
				var fileUploadControl = $("#memoryFileUpload")[0];
				if (fileUploadControl.files.length > 0) {
					
					var file = fileUploadControl.files[0];
					
					//upload file to parse server
					var name = "photo.png";
					var parseFile = new Parse.File(name, file);
					parseFile.save().then(function(parseFile) {
						Activity.set("image", parseFile);
					   //save Activity object
					   Activity.save(null, {
						  success: function(activityRes) {
							 //alert("activityRes=="+JSON.stringify(activityRes));
							//get activity image
							var activityImgObj = activityRes.get("image");
							if(activityImgObj!=undefined)
							{
								var activityImg   = '<img src="'+activityImgObj.url()+'" >';
							}
							else
							{
								var activityImg   = '';
							}
							//get activity content
							 var activityContent 	 	=activityRes.get('content');
							 if(activityContent!="undefined")
							 {
								activityContent 	 =activityContent;
							 }
							 else
							 { 
								 activityContent 	 ="";
							 }
							//call invite users function
							$scope.inviteUsersActivity(mentionToArray,activityImg,activityContent);
							$scope.$apply();
						  },
						  error: function(error) {
							//alert("Error: " + error.code + " " + error.message);
							$scope.$apply();
						  }
						});
					}, 
					  function(error) {
						// The file either could not be read, or could not be saved to Parse.
						// alert("Error: " + error.code + " " + error.message);
					  });
					
					
					////////////////////////////////Thumb nill upload start////////////////////////////////////////////////
					//Define function for generate thumbnail and save in Parse server
					$scope.generateThumbnailAndSaveParse = function(fileData,thumbSizeObjData) {
					  ThumbnailService.generate(fileData,thumbSizeObjData).then(
						function success(thumbFile) {
						  $scope.MPhoto=thumbFile;
						  var name = "photoThumb.png";
						  var parseFileThumb = new Parse.File(name, { base64: thumbFile});
						  parseFileThumb.save().then(function(parseFileThumb) {
						  Activity.set("thumbnail", parseFileThumb);
						  //save Activity object
						  Activity.save();
						  // alert('success: file upload');
						   
						}, 
						  function(error) {
							// The file either could not be read, or could not be saved to Parse.
							// alert("Error: " + error.code + " " + error.message);
						  });
						},
						function error(reason) {
						 // alert('Error: ' + reason);
						}
					  );
					};
					
					
					//Define function for convert image data into base64 string
					var fileReader = new FileReader();
					fileReader.onload = function(fileLoadedEvent) {
						var thumbnillBase64Data = fileLoadedEvent.target.result; // <--- data: base64
						//alert("thumbnillBase64Data=="+JSON.stringify(thumbnillBase64Data));
						//call function for generate thumbnail and save in Parse server
						var fileDataUrl = thumbnillBase64Data;
						var thumbSizeObj={ width:100, height:100};
						$scope.generateThumbnailAndSaveParse(fileDataUrl,thumbSizeObj);
						$scope.$apply();
						 //return srcData;
					}
					//call function for convert image data into base64 string
					fileReader.readAsDataURL(file);
					///////////////////////Thumb nill upload End////////////////////////////////
					////////////////////////////////////////////////////////////////////////////////
				}
				else
				{
					//save Activity object
					Activity.save(null, {
						  success: function(activityRes) {
							//get activity content
							 var activityContent 	 	=activityRes.get('content');
							  if(activityContent!="undefined")
							  {
								 activityContent 	 	=activityContent;
							  }
							  else
							  { 
								  activityContent 	 	="";
							  }
							//call invite users function
							$scope.inviteUsersActivity(mentionToArray,'',activityContent);
							$scope.$apply();
						  },
						  error: function(error) {
							//alert("Error1: " + error.code + " " + error.message);
							$scope.$apply();
						  }
						});
				}
				
				$timeout(function() {
					$scope.hideLoading();
					$state.go('app.viewMemory',null,{reload:true});// go to viewMemory page
					$scope.$apply();
				}, 10000);
			}
			else
			{
				// Show the error message somewhere and let the user try again.
				$scope.addActivityMsg = true;
				$scope.addActivityValue ="Please check your network connection and try again";
				$scope.hideLoading();
				$scope.$apply();
			}
		};
		//////////////////////////////////////////////////////////////////////////
		
	})
//activity controller******************************End************************************************




//viewAllActivities controller******************************Start************************************************
	.controller('viewAllActivities', function($scope ,$rootScope, $state, $stateParams, $ionicLoading, $cordovaNetwork, $cordovaFile, $filter, $timeout ) {
		
		//define function view viewAllActivities
		$scope.viewAllActivities = function(mId) {
				$scope.showActivities=true;
				$scope.showLoading();
				var activitiesListArray	=new Array(); //store all activities data
				// check current user are present or not
				var currentUser = Parse.User.current();
				if (currentUser) 
				{
					var activitiesQuery   	= Parse.Object.extend("Activity");
					var query 				= new Parse.Query(activitiesQuery);
					query.include("fromUser");
					query.equalTo("CYRme", {"__type":"Pointer","className":"CYRme","objectId":mId});
					query.descending("createdAt");
					
					query.find({
						success: function(activitiesResults) {
							//alert("activitiesResults=="+JSON.stringify(activitiesResults));
							if(activitiesResults.length>0)
							{   
								for(i in activitiesResults){
								//Set activitiesResObj to current activity
								  var activitiesResObj = activitiesResults[i];
								
								  var activitiesType		 	=activitiesResObj.get('activityType');
								  var activitiesAddOnDateTime 	=$filter('date')(activitiesResObj.get("dateOfMemory"), "dd/MM/yyyy");
								  
								  var activitiesContent 	 	=activitiesResObj.get('content');
								  //get Content
								  if(activitiesContent!="undefined")
								  {
									 activitiesContent 	 	=activitiesContent;
								  }
								  else
								  { 
									  activitiesContent 	 	="";
								  }
								  //get activities thumbnill
								  var activitiesThumbnailObj = activitiesResObj.get("thumbnail");
								  if(activitiesThumbnailObj!=undefined)
								  {
									  var activitiesThumbnailurl = activitiesThumbnailObj.url();
									  var activitiesImg 	 	 = activitiesThumbnailurl;
								  }
								  else
								  {
									   var activitiesImg 	 	 = '';
								  }
								  
								 //get user profile pic 
								 var activitiesUserImgObj 	 =  activitiesResObj.get("fromUser").get("photoFile");
								 if(activitiesUserImgObj!=undefined)
								 {
									 var activitiesUserImgUrl 	 = activitiesUserImgObj.url();
									 var activitiesUserImg 	 	 = activitiesUserImgUrl;
								 }
								 else
								 {
									  var activitiesUserImg 	 	 = 'img/user.png';
								 }
								  
								 /* Get Memory Author's Name */
								 var activitiesUserName   	=  activitiesResObj.get("fromUser").get("name");
								 var activitiesUserId   	=  activitiesResObj.get("fromUser").id;
								//check user activities privacy
								if(activitiesResObj.get('privacy')=="No")
								{
									/* Let's Put the activitiesListArray Information in an Array as an Object*/
									activitiesListArray.push(
									{
										activitiesType			: activitiesType,
										activitiesContent		: activitiesContent,
										activitiesAddOnDateTime	: activitiesAddOnDateTime,
										activitiesImg			: activitiesImg,
										
										activitiesUserName		: activitiesUserName,
										activitiesUserImg		: activitiesUserImg,
										activitiesId			: activitiesResObj.id
											
									});
								}
								else
								{
									// check username or name or email present in user group
									if((currentUser.id==activitiesUserId) || ($.inArray(currentUser.get("name"), activitiesResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("username"), activitiesResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("email"), activitiesResObj.get('mentionTo') )>=0))
									{
										/* Let's Put the activitiesListArray Information in an Array as an Object*/
										activitiesListArray.push(
										{
											activitiesType			: activitiesType,
											activitiesContent		: activitiesContent,
											activitiesAddOnDateTime	: activitiesAddOnDateTime,
											activitiesImg			: activitiesImg,
											
											activitiesUserName		: activitiesUserName,
											activitiesUserImg		: activitiesUserImg,
											activitiesId			: activitiesResObj.id
												
										});
									}
								  }
								
								} // End for loop
							
								$scope.activitiesListArr 	= activitiesListArray;
								$scope.showActivities=true;
								$scope.hideLoading();
								$scope.$apply();
							}
							else
							{
								$scope.hideLoading();
								$scope.showActivities=false;
								$scope.$apply();
							}
						},
						error: function(error){
							//alert("Error: " + error.code + " " + error.message);
							 $scope.hideLoading();
							 $scope.$apply();
						}
					}); // End activitiesQuery find
				} 
				else 
				{
					$timeout(function() {
						$scope.hideLoading();
						$state.go("app.home"); // go to home page
						$scope.$apply();
				   }, 300);
				}
			};	
			
			
			
		//call function view activities function	
		//call view memory function	
		var mId = $stateParams.id;
		if(mId!='')
		{  
			var mTitle = $stateParams.mTitle;
		 	$scope.memoryTitle 	= mTitle;
			$scope.viewAllActivities(mId);
			$scope.$apply();
		}
		else
		{
			$state.go('app.viewMemory',null,{reload:true});// go to viewMemory page
			$scope.$apply();
		}
		
		
		
	})
//viewAllActivities controller******************************End************************************************


//activity Details controller******************************Start************************************************
	.controller('activityDetails', function($scope ,$rootScope, $ionicLoading, $state, $stateParams, $cordovaNetwork, $cordovaFile, $filter, $timeout) {
		
		//define function activity Details
		$scope.activityDetails = function(aId) {
				$scope.showLoading();
				// check current user are present or not
				var currentUser = Parse.User.current();
				if(currentUser) 
				{
					var activityQuery   	= Parse.Object.extend("Activity");
					var query 			    = new Parse.Query(activityQuery);
					query.include("fromUser");
					query.equalTo("objectId", aId);
					query.limit(1); // limit to at most 1 results
					query.find({
						success: function(activityResults) {
							//alert("activityResults=="+JSON.stringify(activityResults));
							
							for(i in activityResults){
								//Set activityResObj to current Memory
								  var activityResObj = activityResults[i];
								
								  $scope.activityDetailsType			=activityResObj.get('activityType');
								  $scope.activityDetailsContent 	 	=activityResObj.get('content');
								  $scope.activityDetailsAddOnDateTime   =$filter('date')(activityResObj.get("dateOfMemory"), "dd/MM/yyyy");
								   
								  //get activity thumbnill
								  var activityDetailsImgObj = activityResObj.get("image");
								  if(activityDetailsImgObj!=undefined)
								  {
									  var activityDetailsImgurl 	 = activityDetailsImgObj.url();
									  $scope.activityDetailsImg 	 = activityDetailsImgurl;
								  }
								  else
								  {
									   $scope.activityDetailsImg 	 	 = '';
								  }
								  
								 //get user profile pic 
								 var activityDetailsUserImgObj 	 = activityResObj.get("fromUser").get("photoFile");
								 if(activityDetailsUserImgObj!=undefined)
								 {
									 var activityDetailsUserImgUrl 	= activityDetailsUserImgObj.url();
									 $scope.activityDetailsUserImg 	= activityDetailsUserImgUrl;
								 }
								 else
								 {
									  $scope.activityDetailsUserImg 	 = 'img/user.png';
								 }
								  
								 /* Get Memory Author's Name */
								 $scope.activityDetailsUserName   	= activityResObj.get("fromUser").get("name");
								 $scope.activityDetailsUserId  		= activityResObj.get("fromUser").id;
								 $scope.activityDetailsId  			= activityResObj.id;
								 
								 $scope.hideLoading();
								 $scope.$apply();
							} // End for loop
							
						},
						error: function(error){
							//alert("Error: " + error.code + " " + error.message);
							 $scope.hideLoading();
							 $scope.$apply();
						}
					}); // End activityQuery find
				} 
				else 
				{
					$timeout(function() {
						$scope.hideLoading();
						$state.go("app.home"); // go to home page
						$scope.$apply();
				   }, 300);
				}
			};	
			
			
		//call view activity function	
		var aId = $stateParams.id;
		if(aId!='')
		{ 
			var mTitle = $stateParams.mTitle;
		 	$scope.memoryTitle 	= mTitle;
			$scope.$apply();
			$scope.activityDetails(aId);
		}
		else
		{
			$state.go('app.viewMemory',null,{reload:true});// go to viewMemory page
			$scope.$apply();
		}
		
	})
//activity Details controller******************************End************************************************	
