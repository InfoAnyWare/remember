angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $state, $filter, $ionicLoading, $cordovaFacebook, ngFB, $cordovaFile, $cordovaFileTransfer, $cordovaNetwork, $timeout) {
	
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
					  
					  //get profile image
					  var query = new Parse.Query("ProfilePhoto");
						query.equalTo("userObjectId", user.id);
						query.equalTo("author", user.get("name"));
						query.find({
						  success: function(results){
							 // If the query is successful, store each image URL in an array of image URL's
        						//imageURLs = [];
							    for (var i = 0; i < results.length; i++) { 
								  var object = results[i];
								  //imageURLs.push(object.get('photoFile'));
								  var photoFileObj = object.get("photoFile");
								  var url 		   = photoFileObj.url();
								}
								$scope.photo 	= url;
								$scope.downloadFile(url);
						  }
						});
					  
					$scope.hideLoading();
					$scope.$apply();
					
					$state.go("app.home"); // go to home page
					$timeout(function() {
						 $scope.showHomeMsg = false;
						}, 5000);
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
					  $scope.vEmailMsg = true;
					  $scope.vEmailMsgValue ="User cancelled the Facebook login or did not fully authorize.";
					  $scope.hideLoading();
					  $scope.$apply();
					  
					  $timeout(function() {
						 $scope.vEmailMsg = false;
						 $scope.vEmailMsgValue ="";
						}, 3000);
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
			
			userRegister.signUp(null, {
			  success: function(userRegisterResponse) {
				  
				var userObjectID=userRegisterResponse.id;
				
				var fileUploadControl = $("#photoFileUpload")[0];
				if (fileUploadControl.files.length > 0) {
					var file = fileUploadControl.files[0];
					var name = "photo.png";
					var parseFile = new Parse.File(name, file);
					parseFile.save().then(function(parseFile,userRegisterResponse) {
					  // The file has been saved to Parse. file's URL is only available 
					  //after you save the file or after you get the file from a Parse.Object.
					  //Get the function url() on the Parse.File object.
					   var ProfilePhoto =Parse.Object.extend("ProfilePhoto");
					   var photo = new ProfilePhoto();
						   photo.set("title", "Profile");
						   photo.set("photoFile", parseFile);
						   photo.set("author", String($scope.registerData['username']));
						   photo.set("userObjectId", userObjectID);
						   photo.save();
						  
						//url = parseFile.url();
						 console.log("success: file upload");
					}, 
					  function(error) {
						// The file either could not be read, or could not be saved to Parse.
						console.log("Error: " + error.code + " " + error.message);
					  });
				};
				  
				  
				$scope.hideLoading();
				Parse.User.logOut();
				$scope.beforeloginLinks	 = true;
				$scope.afterloginLinks   = false;
				
				$scope.registerThanks();
				$scope.registerMsg = true;
				$scope.registerMsgValue ="Please verifying your email address before Login.";
				$scope.$apply();
				//console.log("Register: " + userRegisterResponse.code + " " + userRegisterResponse.message);
				
				///////////////////////////////////////
				
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
						var query = new Parse.Query("ProfilePhoto");
						query.equalTo("userObjectId", currentUser.id);
						query.equalTo("author", currentUser.get("name"));
						query.find({
						  success: function(results){
							  // If the query is successful, store each image URL in an array of image URL's
								//imageURLs = [];
								for (var i = 0; i < results.length; i++) { 
								  var object = results[i];
								  //imageURLs.push(object.get('photoFile'));
								  var photoFileObj = object.get("photoFile");
								  var url 		   = photoFileObj.url();
								}
								$scope.photo 	= url;
								$scope.$apply();
						  }
						});
					}
				} else {
					
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
		 
		 
		////////////////////////////////////////////
	  	
		console.log('afterloginLinks=='+$scope.afterloginLinks);
		
	})
	
	
	
	
	
	
	
//CYRme Memory controller******************************Start************************************************
	.controller('CYRmeMemory', function($scope,$state, $ionicLoading, $cordovaNetwork,ThumbnailService, $timeout) {
		// current user
		var currentUser = Parse.User.current();
		
		//msg false by default
		$scope.addMemoryMsg = false;
		$scope.addMemoryValue ="";
		// Form data for add Memory
		$scope.addMemoryData = [];
			
		//Add CYRme Memory
		$scope.addMemory = function() {
			$scope.showLoading();
			
		//check email validation
		$scope.validateInviteEmail = function(email) {
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			alert(email+"=validateEmail=="+re.test(email));
			return re.test(email);
		}
		
		//invite user function start******************************************	
		$scope.inviteUsers=function(inviteUserListArray)
		{
			var sendCYRmeUserList=new Array; //CYRme user array for send notification on mobile
			var sendOtherUserEmailList=new Array; //other user email array for send mail 
			var sendOtherFacebookUserEmailList=new Array; //other user facebook email array for send mail
			
			if(Array.isArray(inviteUserListArray))
			{	
				for(var i=0; i<inviteUserListArray.length; i++)
				{
					var inviteUser = inviteUserListArray[i];
					
					//username field query var
					var usernameQuery = new Parse.Query("User");
						usernameQuery.notEqualTo("objectId", currentUser.id);
						usernameQuery.equalTo("username", inviteUser);
					
					//email field query var	
					var emailQuery 	  = new Parse.Query("User");
						emailQuery.notEqualTo("objectId", currentUser.id);
						emailQuery.equalTo("email", inviteUser);
						
					//Compound both username and email query var
					var mainQuery = Parse.Query.or(usernameQuery, emailQuery);
					mainQuery.find({
					  success: function(results) {
						 alert("results.length=="+results.length);
						 if(results.length>0) //CYRme user
						 {
							 alert("anil 1");
							 for (var i = 0; i < results.length; i++) { 
								  var object = results[i];
								  sendCYRmeUserList.push(object.get('name'));
								}
								//alert("sendCYRmeUserList=="+JSON.stringify(sendCYRmeUserList));
								//call function for send notification to CYRme users
						 }
						 else //other email
						 { 
						 	 alert("anil 2");
							 if($scope.validateInviteEmail(inviteUser)) // orher user check email
							 {
								 alert("anil 3");
								 //Email id add in sendOtherUserEmailList array 
								sendOtherUserEmailList.push(inviteUser);
								alert("sendOtherUserEmailList=="+JSON.stringify(sendOtherUserEmailList));
							 }
							 else
							 {
								 alert("anil 4");
								//Email id add in sendOtherFacebookUserEmailList array 
								sendOtherFacebookUserEmailList.push(inviteUser);
								alert("sendOtherFacebookUserEmailList=="+JSON.stringify(sendOtherFacebookUserEmailList));
							 }
						 }
					  },
					  error: function(error) {
						  alert("Error: " + error.code + " " + error.message);
					  }
					});
					
				} //end for loop
			}
			return false;
		}
		//invite user function End****************************************	
			
			
			if(currentUser && $cordovaNetwork.isOnline()) 
			{
				var CYRmeMemory = new Parse.Object("CYRme");
				CYRmeMemory.set("user", Parse.User.current());
				CYRmeMemory.set("title", String($scope.addMemoryData['title']));
				CYRmeMemory.set("typeOfMemory", String($scope.addMemoryData['typeOfMemory']))
				CYRmeMemory.set("dateOfMemory", $scope.addMemoryData['dateOfMemory']);
				if(String($scope.addMemoryData['mentionTo'])!="undefined")
				{
					CYRmeMemory.set("mentionTo", $scope.addMemoryData['mentionTo'].split(","));
					
					//call invite users
					$scope.inviteUsers($scope.addMemoryData['mentionTo'].split(","));
					
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
					   CYRmeMemory.save();
					   
					   //hide blow code this code get file from parse and create thumbnil and call save thumbnil to parse.
					  /* CYRmeMemory.save(null,{
						success:function(CYRmeObj)
						{
							//alert("obj="+CYRmeObj.id);
							var CYRmeObjId=CYRmeObj.id;
							var CYRmeQuery = new Parse.Query("CYRme");
							CYRmeQuery.equalTo("objectId", CYRmeObjId);
							CYRmeQuery.find({
							  success: function(results){
									for (var i = 0; i < results.length; i++) { 
									  var CYRmeImageObject = results[i];
									  var CYRmeImageFileObj = CYRmeImageObject.get("image");
									  var CYRmeImageUrl 	= CYRmeImageFileObj.url();
									}
									//call function for generate thumbnail and save in Parse server
									var fileDataUrl = CYRmeImageUrl;
									var thumbSizeObj={ width:100, height:100};
									$scope.generateThumbnailAndSaveParse(fileDataUrl,thumbSizeObj);
									$scope.$apply();
							  },
							   error: function(error){
								  //alert("Error: " + error.code + " " + error.message);
							  }
							});
						  }
					   }) */
					   //alert('success: file upload');
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
					CYRmeMemory.save();
				}
				
				$timeout(function() {
					$scope.hideLoading();
					$state.go("app.home"); // go to home page
					$scope.showHomeMsg 	 	= true;
					$scope.homeMsgValue 	= "Memory has been Added successfully.";
					$scope.$apply();
				}, 10000);
				
				$timeout(function() {
					$scope.showHomeMsg 	 	= false;
				  	$scope.homeMsgValue 	= "";
					$scope.$apply();
				}, 20000);
				
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
		
	})
//CYRme Memory controller******************************End************************************************
	
