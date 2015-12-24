angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $state, $filter, $ionicLoading, $cordovaFacebook, ngFB, $cordovaFile, $cordovaFileTransfer, $cordovaNetwork, $timeout, $ionicPush, $http, $cordovaDevice, $rootScope) {
	
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  //add memory icon not show this Ctrl
  $rootScope.showAddMemoryLink	=false;
  
  //set by default file size and msg
  	$rootScope.fileSizeLimit 	= 5242880;//5MB
	$rootScope.fileSizeMBMsg 	= "5MB";//5MB
	$rootScope.fileSizeLimitMsg = "Photo size should not be more then 5MB";
  
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
		
	// var for show loginMsg
		$scope.loginMsg  = false;
	
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
			$scope.fileSizeMBMsg =$rootScope.fileSizeMBMsg;
			$scope.showFileMsg = false;
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
		
   // Create the edit User modal that we will use later
		$ionicModal.fromTemplateUrl('templates/editUser.html', {
		scope: $scope
		}).then(function(editUserModal) {
			$scope.editUserModal = editUserModal;
			$scope.fileSizeMBMsg =$rootScope.fileSizeMBMsg;
			$scope.showFileMsg = false;
		});
		
		
	////////////////////////////////////////////////////////////////////////////////////	
	
	// Triggered in the login modal to close it
		$scope.closeLogin = function() {
			$scope.loginModal.hide();
		};
	
	// Open the login modal
		$scope.login = function() {
			//hide registe modal and register thanks modal when open login modal
			$scope.loginMsg = false;
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
		//hide login modal, register thanks modal when open register modal
		$scope.loginModal.hide();
		$scope.registerThanksModal.hide();
		$scope.registerModal.show();
		};
	
	//local storage key set
	 var keyName = window.localStorage.key(0);
	 
	//check user local data are store or not
	var username 			= window.localStorage.getItem("username");
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
		if(currentUser) 
		{
			//alert('currentUser= yes');
			$scope.beforeloginLinks	 = false;
			$scope.afterloginLinks   = true;
			$scope.showUserDetail    = true;
			currentUser.save(); //save app run log time
			$timeout(function() {
				$scope.userDetails(); //auto close the popup after 1\2 seconds
				$scope.userDetailsModal.hide(); //hide detail popup after 1\2 seconds
		  }, 300);
		  
		} else {
			// alert('currentUser= no');
			 $timeout(function() {
				$scope.showLoginPage();
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
			
			$timeout(function() {
			 $scope.login(); //auto close the popup after 1\2 seconds
		  }, 500);
		  
		  	$scope.loginMsg  		= true;
			$scope.loginMsgValue	= 'You have been successfully logout.';
			$timeout(function() {
			 $scope.loginMsg  		= false;
			 $scope.loginMsgValue	= '';
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
		//console.log('Doing login', $scope.loginData);
		
		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		 $scope.loginMsg = false;
		 
		 // check network connection present or not
		 if ($cordovaNetwork.isOffline()) 
		 {
			 $scope.hideLoading();
			 $scope.beforeloginLinks	 = true;
			 $scope.afterloginLinks   	 = false;
			 $scope.loginMsg 			 = true;
			 $scope.loginMsgValue 		 = "Please check your network connection and try again.";
			 $scope.$apply();
		 }
		 else
		 {
		  // alert("Data network ok CYR login");
		   Parse.User.logIn(String($scope.loginData['username']), String($scope.loginData['password']), {
			  success: function(user) {
				 var emailVerified = user.get("emailVerified");
				  if (!emailVerified) // check emiil
				  {
					  $scope.hideLoading();
					 // $scope.logOut();
					  Parse.User.logOut();
					  $scope.beforeloginLinks	 = true;
					  $scope.afterloginLinks     = false;
					  $scope.loginMsg 			 = true;
					  $scope.loginMsgValue 		 = "Please verifying your email address before Login.";
					  $scope.$apply();
				  } 
				  else
				  {
					  $scope.loginMsg 		= false;
				 	  $scope.loginMsgValue 	= "";
					  
					  user.save(); //save login module time
					  
					  //set current user is Loged In when exit app and re open it.
					  var token = user.get('token');
					  Parse.User.become(token);
					  
					  $scope.closeLogin();
					  $scope.beforeloginLinks	 = false;
					  $scope.afterloginLinks  	 = true;
					  $scope.cyrLoginLinks  	 = true;
					 
					 //////////////////////////////CYR local store data start//////////////////////////////////// 
					 // first localStorage is now empty
				 	 window.localStorage.clear();
				 	 
					 window.localStorage.setItem("username", user.get("username"));
					 window.localStorage.setItem("uName", user.get("name"));
					 window.localStorage.setItem("uEmail",user.get("email"));
					 window.localStorage.setItem("uFirstName", user.get("firstName"));
					 window.localStorage.setItem("uMiddleName", user.get("middleName"));
					 window.localStorage.setItem("uSurName", user.get("surName"));
					 window.localStorage.setItem("uDateOfBirth", $filter('date')(user.get("dateOfBirth"), "dd/MM/yyyy"));
					 window.localStorage.setItem("uLoginThroughMsg", user.get("loginThrough"));
					 //////////////////////////////CYR local store data start////////////////////////////////////
					  
					//get user image
					var photoFileObj = user.get("photoFile");
					if(photoFileObj!=undefined)
					{
						var url 		  = photoFileObj.url();
						//call function for download img
						$scope.downloadFile(url);
					}
					else
					{
						window.localStorage.removeItem("uPhotolocalPath");
					}
					//call function store Device Info for notification
					$scope.storeDeviceInfo();
					$state.go('app.home',null,{reload:true});// go to Home Memory feed page
					$scope.hideLoading();
					$scope.$apply();
				  }
			  },
			  error: function(user, error) {
				// The login failed. Check error to see.
				 $scope.hideLoading();
				 $scope.beforeloginLinks	 = true;
				 $scope.afterloginLinks   	 = false;
				 $scope.loginMsg 			 = true;
				 $scope.loginMsgValue 		 = $scope.firstCharCapital(error.message);
				 $scope.$apply();
			  }
			});
		  }
		};
	// Perform the login action when the user submits the CYR login form ***********END***********
	
	
	
	
	//define function update MentionTo field*************************************start***************
		$scope.updateMentionTo = function(userRegisterResponse,fbUser) {
			
			var userRegisterResponse	= userRegisterResponse;
			var userRefrenceIdArray		=new Array;
			
			if(fbUser==true) //check facebook login or not
			{
				//userRefrenceIdArray.push(userRegisterResponse.id);
				userRefrenceIdArray.push(userRegisterResponse.email);
				var userRefrenceName	= userRegisterResponse.id;
			}
			else
			{
				userRefrenceIdArray.push(userRegisterResponse.get("email"));
				var userRefrenceName		= userRegisterResponse.get("username");
			}
			//alert("userRefrenceIdArray=="+JSON.stringify(userRefrenceIdArray));
			for(var i=0; i<userRefrenceIdArray.length; i++)
			{
				var userRefrenceId = userRefrenceIdArray[i];
				if(userRefrenceId !="") 
				{
					//alert("userRefrenceId=="+userRefrenceId);
					//update Memory MentionTo field
					var memoryQuery   	= Parse.Object.extend("CYRme");
					var query 			= new Parse.Query(memoryQuery);
					query.equalTo("mentionTo", userRefrenceId);
					query.find({
						success: function(memoryResults) {
							for(i in memoryResults){
								//Set memoryResObj to current Memory
								  var memoryResObj = memoryResults[i];
								  var memoryMentionTo	=memoryResObj.get('mentionTo');
								  
								 //check userRefrenceId present in maintion field 
								  var index = $.inArray(userRefrenceId, memoryMentionTo)
								  if (index !== -1) {
									memoryMentionTo[index] = userRefrenceName;
									memoryResObj.set("mentionTo",memoryMentionTo);
									memoryResObj.save();
								  }
							} // End for loop
							
						},
						error: function(error){
							//alert("Error: " + error.code + " " + error.message);
						}
					}); // End memoryQuery find
					
					//update Activity MentionTo field
					var activityQuery   = Parse.Object.extend("Activity");
					var query 			= new Parse.Query(activityQuery);
					query.equalTo("mentionTo", userRefrenceId);
					query.find({
						success: function(activityResults) {
							for(i in activityResults){
								//Set activityResObj to current Activity
								  var activityResObj = activityResults[i];
								  var activityMentionTo	=activityResObj.get('mentionTo');
								  
								 //check userRefrenceId present in maintion field 
								  var index = $.inArray(userRefrenceId, activityMentionTo)
								  if (index !== -1) {
									activityMentionTo[index] = userRefrenceName;
									activityResObj.set("mentionTo",activityMentionTo);
									activityResObj.save();
								  }
							} // End for loop
						},
						error: function(error){
							//alert("Error: " + error.code + " " + error.message);
						}
					}); // End activityQuery find
				} //end if
			} //end for loop
			
			$scope.hideLoading();
			$scope.$apply();
			
		};	
	//function update MentionTo field*************************************End***********************
	
	
	
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
			//console.log(response);
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
		    //console.log('FbLogin');
            // check network connection present or not
			if ($cordovaNetwork.isOffline()) 
			{
				 $scope.hideLoading();
				 $scope.beforeloginLinks	 = true;
				 $scope.afterloginLinks   	 = false;
				 $scope.loginMsg 			 = true;
				 $scope.loginMsgValue 		 = "Please check your network connection and try again.";
				 $scope.$apply();
		    }
		    else
		    {
			  //alert("Data network ok");
			  ngFB.login({scope: 'public_profile,email,user_friends,user_birthday'}).then(
				function(fbLoginResponse) {
					//alert('Facebook login succeeded, auth data: ' +JSON.stringify(fbLoginResponse));
					$scope.showLoading();
					
					// get fb user data
					ngFB.api({
						path: '/me',
						params: {fields: "id,email,name,first_name,middle_name,last_name,birthday,gender,picture"}
					 }).then(function(fbDataResponse) {
						   //check fb user already logedIn in CYR User
							var existUserQuery  = Parse.Object.extend("_User");
							var query 			= new Parse.Query(existUserQuery);
							query.equalTo("email", fbDataResponse.email);
							query.notEqualTo("loginThrough", "Facebook");
							query.notEqualTo("fbUserId", fbDataResponse.id);
							
							query.find({
								success: function(userExistResults) {
									//alert("uResults=="+JSON.stringify(userExistResults));
									if(userExistResults.length>0) // check CYR user exist
									{
										 $scope.loginModal.show();
										 $scope.loginMsg = true;
										 $scope.loginMsgValue ="A CYR user for email '"+fbDataResponse.email+"' is already existed.";
										 $scope.hideLoading();
										 $scope.$apply();
										 $timeout(function() {
											 $scope.loginMsg 		= false;
											 $scope.loginMsgValue 	= "";
										}, 10000);
									}
									else //only fb user login section add and update data
									{
										//alert("User not exists.");
										fbLoginSuccess(fbLoginResponse); //check parse fbLoginResponse
										fbLogged.then( function(authData) {
											return Parse.FacebookUtils.logIn(authData);
										}).then( function(userObject) {
											  //alert("userObject=="+JSON.stringify(userObject));
											  //set current user is Loged In when exit app and re open it.
											  var token = userObject.get('token');
											  Parse.User.become(token);
											  
											  // first localStorage is now empty
											  window.localStorage.clear();
											  if(fbDataResponse.name!=undefined)
											  {
												  userObject.set("name", String(fbDataResponse.name));
												  window.localStorage.setItem("uName", fbDataResponse.name);
											  }
											  else
											  {
												  window.localStorage.setItem("uName", '');
											  }
											  
											  if(fbDataResponse.email!=undefined)
											  {
												  userObject.set("email", String(fbDataResponse.email));
												  window.localStorage.setItem("uEmail", fbDataResponse.email); 
											  }
											  else
											  {
												  window.localStorage.setItem("uEmail", '');
											  }
											  
											  if(fbDataResponse.first_name!=undefined)
											  {
												  userObject.set("firstName", String(fbDataResponse.first_name));
												  window.localStorage.setItem("uFirstName", fbDataResponse.first_name);
											  }
											  else
											  {
												   window.localStorage.setItem("uFirstName", '');
											  }
											  
											  if(fbDataResponse.middle_name!=undefined)
											  {
												  userObject.set("middleName", String(fbDataResponse.middle_name));
												  window.localStorage.setItem("uMiddleName", fbDataResponse.middle_name);
											  }
											  else
											  {
												  window.localStorage.setItem("uMiddleName", '');
											  }
											  
											  if(fbDataResponse.last_name!=undefined)
											  {
												  userObject.set("surName", String(fbDataResponse.last_name));
												  window.localStorage.setItem("uSurName", fbDataResponse.last_name);
											  }
											  else
											  {
												  window.localStorage.setItem("uSurName", '');
											  }
											  
											  if(fbDataResponse.birthday!=undefined)
											  {
												  var dob = new Date(fbDataResponse.birthday);
												  userObject.set("dateOfBirth", dob);
												  window.localStorage.setItem("uDateOfBirth", $filter('date')(fbDataResponse.birthday, "dd/MM/yyyy"));
											  }
											  else
											  {
												   window.localStorage.setItem("uDateOfBirth", '');
											  }
											  
											 if(fbDataResponse.id!=undefined)
											 {
												 userObject.set("username", fbDataResponse.id);
												 userObject.set("fbUserId", fbDataResponse.id);
												 window.localStorage.setItem("fbUserId", fbDataResponse.id);
												 window.localStorage.setItem("username", fbDataResponse.id);
											 }
											 else
											 {
												  window.localStorage.setItem("fbUserId", '');
												  window.localStorage.setItem("username", '');
											 }
											  
											  window.localStorage.setItem("uLoginThroughMsg", "Facebook");
											  userObject.set("loginThrough", "Facebook");
											  userObject.save(); //saved facebook user data from parse server 
											  
											  $scope.beforeloginLinks	 = false;
											  $scope.afterloginLinks  	 = true;
											  $scope.cyrLoginLinks  	 = false;
											  
											 //profile picture
											 if(fbDataResponse.picture.data!=undefined)
											 {
												 var pictureObject=fbDataResponse.picture.data;
												 var url=pictureObject.url;
												 //call function downloadFile picture file
												 $scope.downloadFile(url);
											 }
											 else
											 {
												 window.localStorage.setItem("uPhotolocalPath", '');
												 window.localStorage.setItem("filename", '');
											 }
											 
											 $scope.loginModal.hide();
											 $state.go("app.home"); // go to home page
											 $scope.hideLoading();
											 $scope.$apply();
											 
											 //call function store Device Info for notification
											 $scope.storeDeviceInfo(); 
											 //call function for update MentionTo field
											 $scope.updateMentionTo(fbDataResponse,true);
										}, 
										function(error) {
											  //Error found
											  $scope.loginModal.show();
											  $scope.loginMsg 	   = true;
											  $scope.loginMsgValue = "User cancelled the Facebook login or did not fully authorize.";
											  $scope.hideLoading();
											  $scope.$apply();
											  
											  $timeout(function() {
												 $scope.loginMsg      = false;
												 $scope.loginMsgValue ="";
												}, 3000);
										});
									} // fb user else end
								} //mainQuery find success end
							}) //mainQuery find end
						},
						function(error) {
						  //Error found
						  $scope.loginModal.show();
						  $scope.loginMsg 		= true;
						  $scope.loginMsgValue  = "User cancelled the Facebook login or did not fully authorize.";
						  $scope.hideLoading();
						  $scope.$apply();
						  
						  $timeout(function() {
							 $scope.loginMsg = false;
							 $scope.loginMsgValue ="";
							}, 3000);
						}
					 ); //fb login end
				},
				function(error) {
					//Error found
					  $scope.loginModal.show();
					  $scope.loginMsg      = false;
					  $scope.loginMsgValue = "";
					  $scope.hideLoading();
					  $scope.$apply();
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
		  //console.log('passwordNotMatch=', $scope.passwordMatch);
		};
		
		//Register photo upload btn
		$scope.uploadFileRegister = function() {
			$(function() {
					$("input:file[id=photoFileUpload]").change (function() {
					var file = $(this)[0].files[0];
					$("#uploadFileRegister").val(file.name);
				});
			});
		}
		
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
			userRegister.set("loginThrough", "CYR");
			//var userObjectID=userRegisterResponse.id;
			var fileUploadControl = $("#photoFileUpload")[0];
			if (fileUploadControl.files.length > 0) 
			{
				var file = fileUploadControl.files[0];
				
				//check upload size
				var fileSize		= file.size;
				if(parseInt(fileSize)>parseInt($rootScope.fileSizeLimit))
				{
					$scope.fileMsg=$rootScope.fileSizeLimitMsg;
					$scope.showFileMsg = true;
					$scope.hideLoading();
					$scope.$apply();
					return false;
				}
				else
				{
					$scope.showFileMsg = false;
					var name = "photo.png";
					var parseFile = new Parse.File(name, file);
					parseFile.save().then(function(parseFile) {
					  
						userRegister.set("photoFile", parseFile);
						//////////////////////////////////////////////
						userRegister.signUp(null, {
						  success: function(userRegisterResponse) {
						   //alert("userRegisterResponse=="+JSON.stringify(userRegisterResponse));
						   $scope.hideLoading();
						   //call function for update MentionTo field
						   $scope.updateMentionTo(userRegisterResponse,false);
					   
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
							//console.log("Error: " + error.code + " " + error.message);
							$scope.$apply();
						  }
						});
						//////////////////////////////////////////////
					}, 
					  function(error) {
						// The file either could not be read, or could not be saved to Parse.
						//console.log("Error: " + error.code + " " + error.message);
					  });
				}
			}
			else
			{
				userRegister.signUp(null, {
				  success: function(userRegisterResponse) {
				  // alert("userRegisterResponse=="+JSON.stringify(userRegisterResponse));
				   
				   //call function for update MentionTo field
				   $scope.updateMentionTo(userRegisterResponse,false);
				   
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
					//console.log("Error: " + error.code + " " + error.message);
					$scope.$apply();
				  }
				});
			}
			
		};
		
		// Triggered in the register thanks modal to close it
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
				$scope.showUserDetail   = true;
				$scope.showEditUserLink = true;
				$scope.showUserSomeData = true;
				
				uLoginThroughMsg 	= window.localStorage.getItem("uLoginThroughMsg");
				//set cyr Login Links false when user login with facebook
				if(uLoginThroughMsg=="Facebook")
				{
					$scope.cyrLoginLinks    = false;
					$scope.showEditUserLink = false;
					$scope.showUserSomeData = false;
				}
				
				// check current user are present or not
				var currentUser = Parse.User.current();
				if (currentUser) {
					
					/*$scope.userDetailsModal.show();
					$scope.showUserDetail = true;*/
					$scope.username 		= currentUser.get("username");
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
							$scope.photo 	  = 'img/user.png';
							window.localStorage.removeItem("uPhotolocalPath");
						}
					}
					$scope.$apply();
				} 
				else 
				{
					$scope.showEditUserLink = false;
					$timeout(function() {
						$scope.showLoginPage();
				   }, 300);
				   $scope.$apply();
				}
			};
	// Perform user details   ***********End***********
	
	
	
	////////////////////////////////////////
	
	// Perform the Forgot Password action when the user submits the Forgot Password form  ***********Start***********
	
		// Form data for the register modal
		$scope.forgotPasswordData		= [];
		$scope.forgotPasswordMsg 		= false;
		$scope.forgotPasswordMsgValue 	= "";
		
		$scope.doForgotPassword = function() {
			$scope.showLoading();
			console.log('Doing Forgot Password', $scope.forgotPasswordData);
			
			// code if using a Forgot Password system
			Parse.User.requestPasswordReset(String($scope.forgotPasswordData['email']), {
			  success: function() {
				$scope.hideLoading();
				$scope.login();
			    $scope.loginMsg = true;
				$scope.loginMsgValue ="Forgot password request was sent successfully, Please check your email.";
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
		  //console.log('resetPasswordNotMatch=', $scope.resetPasswordMatchMsg);
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
					 $scope.showHomeMsg  = false;
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
	
	
	//show showLoginPage  ***********start***********
		$scope.showLoginPage = function() {
			$timeout(function() {
					
					$scope.beforeloginLinks	 = true;
					$scope.afterloginLinks   = false;
					$scope.showHomeUserName  = false;
					
					//call hide user Details Modal
					$scope.userDetailsModal.hide();
					$scope.showUserDetail  = false;
					$scope.login();
					if($cordovaNetwork.isOffline())
					{
						$scope.loginMsg = true;
						$scope.loginMsgValue ="Please check your network connection and try again.";
					}
					$scope.hideLoading();
					$scope.$apply();
					
			  }, 400);
	     }
		 //show showLoginPage  ***********End***********
		 
		 
		 
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
		
		
	// Perform the editUser action***********Start***********
		
		//Edit User photo upload btn
		$scope.uploadFileEditUser = function() {
			$(function() {
					$("input:file[id=editUserPhotoFileUpload]").change (function() {
					var file = $(this)[0].files[0];
					$("#uploadFileEditUser").val(file.name);
				});
			});
		}
		
		// Form data for the editUser modal
			$scope.editUserData = [];
			$scope.editUserMsg 			= false;
			$scope.editUserMsgValue 	= '';
			
		// Triggered in the editUser modal to close it
			$scope.closeEditUser = function() {
				$scope.editUserModal.hide();
			};	
		
		// Open the editUser modal
			$scope.editUser = function() {
				
				//check network
				if($cordovaNetwork.isOffline()) 
				{
					$scope.editUserModal.hide();
					alert("Please check your network connection and try again.");
					$scope.$apply();
				}
				else
				{
					$scope.editUserModal.show();
					//code for edit current user
					var currentUser = Parse.User.current();
					if(currentUser)
					{ 
						$scope.showLoading();
						$scope.editUserData['firstName'] 	=currentUser.get('firstName');
						$scope.editUserData['middleName'] 	=currentUser.get('middleName');
						$scope.editUserData['surName'] 		=currentUser.get('surName');
						$scope.editUserData['dateOfBirth'] 	=currentUser.get('dateOfBirth');
						
						//get user photo
						var uPhotolocalPath 	= window.localStorage.getItem("uPhotolocalPath");
						if(uPhotolocalPath != null && uPhotolocalPath != '')
						{
							$scope.UPhoto 	= uPhotolocalPath;
						}
						else
						{
							var photoFileObj = currentUser.get("photoFile");
							if(photoFileObj!=undefined)
							{
								$scope.UPhoto  		 = photoFileObj.url();
							}
							else
							{
								$scope.UPhoto 	  = 'img/user.png';
							}
						}
						$scope.hideLoading();
						$scope.$apply();
					}
					else
					{
						$scope.editUserModal.hide();
						$scope.hideLoading();
						$scope.$apply();
					}
				}
			};
		
		//doEditUser
			$scope.doEditUser = function() {
				$scope.showLoading();
				// code if using a editUser system
				$scope.editUserMsgValue = "";
				
				//condition for edit user
				var currentUser = Parse.User.current();
				if(currentUser)
				{ 
					if($cordovaNetwork.isOffline()) 
					{
						$scope.editUserMsg = true;
						$scope.editUserMsgValue ="Please check your network connection and try again.";
						$scope.hideLoading();
						 $timeout(function() {
							 $scope.editUserrMsg = false;
							 $scope.editUserMsgValue ="";
							 $scope.editUserModal.hide();
						}, 5000);
						$scope.$apply();
					}
					else
					{
						var editUser = Parse.User.current();
						editUser.set("firstName", String($scope.editUserData['firstName']));
						editUser.set("middleName", String($scope.editUserData['middleName']));
						editUser.set("surName", String($scope.editUserData['surName']));
						editUser.set("dateOfBirth", $scope.editUserData['dateOfBirth']);
						
						var fileUploadControl = $("#editUserPhotoFileUpload")[0];
						if (fileUploadControl.files.length > 0) 
						{
							var file = fileUploadControl.files[0];
							
							//check upload size
							var fileSize		= file.size;
							if(parseInt(fileSize)>parseInt($rootScope.fileSizeLimit))
							{
								$scope.fileMsg=$rootScope.fileSizeLimitMsg;
								$scope.showFileMsg = true;
								$scope.hideLoading();
								$scope.$apply();
								return false;
							}
							else
							{
								$scope.showFileMsg = false;
								var name = "photo.png";
								var parseFile = new Parse.File(name, file);
								parseFile.save().then(function(parseFile) {
								  
									editUser.set("photoFile", parseFile);
									//////////////////////////////////////////////
									editUser.save(null, {
									  success: function(editUserResponse) {
										// alert("editUserResponse=="+JSON.stringify(editUserResponse));
										 
										 //set current user is Loged In when exit app and re open it.
										 var token = editUserResponse.get('token');
										 Parse.User.become(token);
										 
										 $scope.firstName 		 = editUserResponse.get("firstName");
										 $scope.middleName 		 = editUserResponse.get("middleName");
										 $scope.surName 		 = editUserResponse.get("surName");
										 $scope.dateOfBirth 	 = $filter('date')(editUserResponse.get("dateOfBirth"), "dd/MM/yyyy");
										 
										 window.localStorage.setItem("uFirstName", editUserResponse.get("firstName"));
										 window.localStorage.setItem("uMiddleName", editUserResponse.get("middleName"));
										 window.localStorage.setItem("uSurName", editUserResponse.get("surName"));
										 window.localStorage.setItem("uDateOfBirth", $filter('date')(editUserResponse.get("dateOfBirth"), "dd/MM/yyyy"));
										 //get user image
										 var photoFileObj = editUserResponse.get("photoFile");
										 if(photoFileObj!=undefined)
										 {
											var url 		  = photoFileObj.url();
											$scope.photo 	  = url;
											//call function for download ing
											$scope.downloadFile(url);
										 }
										 else
										 {
											$scope.photo 	  = 'img/user.png';
											window.localStorage.removeItem("uPhotolocalPath");
										 }
										 
										 $scope.editUserModal.hide();
										 $scope.hideLoading();
										 $scope.$apply();
									  },
									  error: function(editUserResponse, error) {
										// Show the error message somewhere and let the user try again.
										$scope.hideLoading(); 
										$scope.editUserMsg = true;
										$scope.editUserMsgValue = $scope.firstCharCapital(error.message);
										$timeout(function() {
										 $scope.editUserMsg = false;
										 $scope.editUserMsgValue = "";
										}, 4000);
										$scope.$apply();
									  }
									});
									//////////////////////////////////////////////
								}, 
								  function(error) {
									  $scope.hideLoading();
									  $scope.editUserMsg = true;
									  $scope.editUserMsgValue = $scope.firstCharCapital(error.message);
									  $timeout(function() {
										 $scope.editUserMsg = false;
										 $scope.editUserMsgValue = "";
									  }, 4000);
									  $scope.$apply();
								  });
							}
						}
						else
						{
							editUser.save(null, {
							  success: function(editUserResponse) {
								 //alert("editUserResponse no photo=="+JSON.stringify(editUserResponse));
								 //set current user is Loged In when exit app and re open it.
								 var token = editUserResponse.get('token');
								 Parse.User.become(token);
										 
								 $scope.firstName 		 = editUserResponse.get("firstName");
								 $scope.middleName 		 = editUserResponse.get("middleName");
								 $scope.surName 		 = editUserResponse.get("surName");
								 $scope.dateOfBirth 	 = $filter('date')(editUserResponse.get("dateOfBirth"), "dd/MM/yyyy");
								 
								 window.localStorage.setItem("uFirstName", editUserResponse.get("firstName"));
								 window.localStorage.setItem("uMiddleName", editUserResponse.get("middleName"));
								 window.localStorage.setItem("uSurName", editUserResponse.get("surName"));
								 window.localStorage.setItem("uDateOfBirth", $filter('date')(editUserResponse.get("dateOfBirth"), "dd/MM/yyyy"));
							   
								 $scope.editUserModal.hide();
								 $scope.hideLoading();
								 $scope.$apply();
							  },
							  error: function(editUserResponse, error) {
								// Show the error message somewhere and let the user try again.
								$scope.hideLoading();
								$scope.editUserMsg = true;
								$scope.editUserMsgValue = $scope.firstCharCapital(error.message);
								$timeout(function() {
								 $scope.editUserMsg = false;
								 $scope.editUserMsgValue = "";
								}, 4000);
								$scope.$apply();
							  }
							});
						}
					}
				}
				else
				{
					$scope.editUserModal.hide();
					$scope.hideLoading();
					$scope.$apply();
				}
			};
		
	// Perform the editUser action  ***********End***********
	
				
	    /////////////////////////////////////////////////
		
	  	
		//console.log('afterloginLinks=='+$scope.afterloginLinks);
		
	})
	
	

//View homePage controller******************************Start************************************************
	.controller('homePage', function($scope ,$rootScope, $state, $ionicLoading, $cordovaNetwork, $cordovaFile, $filter, $timeout) {
		
		//add memory icon show this Ctrl
		$rootScope.showAddMemoryLink	=true;
		
		//msg false by default
		$scope.showHomeMsg 		 = false;
		$scope.showHomeMsgValue  = "";
		
		//define function view Memory
		$scope.homePageData = function() {
			
				$scope.showLoading();
				$scope.showMemories		= true;
				var memoryListArray	=new Array(); //store all memory data
				var currentUser = Parse.User.current();
				var mCount=0;
				
				var query = new Parse.Query("CYRme");
				query.include("user");
				query.descending("updatedAt");
				query.find().then(function(CYRmeAllResult) {
					
					var promise = Parse.Promise.as(); // define a promise
					//alert("CYRmeAllResult=="+JSON.stringify(CYRmeAllResult));
					
					//run each loop fetch each record
					$.each(CYRmeAllResult, function(CYRmeResult) {
						
						var memoryResObj = CYRmeAllResult[CYRmeResult];
						//alert("memoryResObj=="+JSON.stringify(memoryResObj));
						
						var memoryTitle		 	=memoryResObj.get('title');
						var memoryContent 	 	=memoryResObj.get('content');
						var memoryAddOnDateTime =$filter('date')(memoryResObj.get("dateOfMemory"), "dd/MM/yyyy");
						if(memoryAddOnDateTime!=null)
						{
						   memoryAddOnDateTime 	 	 = memoryAddOnDateTime;
						}
						else
						{
						   memoryAddOnDateTime 	 	 = '';
						}
						
						var memoryType		 	=memoryResObj.get('typeOfMemory');
						if(memoryType!=undefined)
						{
						   memoryType 	 	 = memoryType;
						}
						else
						{
						   memoryType 	 	 = '';
						}
						
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
					
						//Get Memory Author's Name 
						var memoryUserName   	= memoryResObj.get("user").get("name");
						var memoryUserId   		= memoryResObj.get("user").id;
					 
					  promise = promise.then(function() { // each time this loops the promise gets reassigned to the function below
				      
					    //get Activity as per memory*************Start
						var query 	= new Parse.Query('Activity');
						query.include("fromUser");
						query.equalTo("CYRme", {"__type":"Pointer","className":"CYRme","objectId":memoryResObj.id});
						query.descending("updatedAt");
						return query.find().then(function(activityAllReault) {
						
						   	//alert("activityAllReault=="+JSON.stringify(activityAllReault));
							var activityListArray	=new Array(); //store all activities data
							
							var IREMcount	=0;
							var LIKEcount	=0;
							var FOLLOWcount	=0;
							
							var activityTotalCount=0;
							if(activityAllReault.length>0)
							{
								for (var i = 0; i < activityAllReault.length; i++) 
								{
									var activityResObj = activityAllReault[i];
									
									if(activityResObj.get('activityType')=="IREM")
									{
									 	IREMcount++;
									}
									if(activityResObj.get('activityType')=="LIKE")
									{
									 	LIKEcount++;
									}
									if(activityResObj.get('activityType')=="FOLLOW")
									{
									 	FOLLOWcount++;
									}
									
									var activityType		  =activityResObj.get('activityType');
									var activityAddOnDateTime =$filter('date')(activityResObj.get("dateOfMemory"), "dd/MM/yyyy");
									if(activityAddOnDateTime!=null)
									{
									  activityAddOnDateTime 	 	 = activityAddOnDateTime;
									}
									else
									{
									   activityAddOnDateTime 	 	 = '';
									}
									
									var activityContent 	  =activityResObj.get('content');
									//get Content
									if(activityContent!="undefined")
									{
									 	activityContent 	 	=activityContent;
									}
									else
									{ 
									  	activityContent 	 	="";
									}
									//get activity thumbnill
									var activityThumbnailObj = activityResObj.get("thumbnail");
									if(activityThumbnailObj!=undefined)
									{
									  	var activityThumbnailurl = activityThumbnailObj.url();
									  	var activityImg 	 	 = activityThumbnailurl;
									}
									else
									{
									   	var activityImg 	 	 = '';
									}
									  
									//get user profile pic 
									var activityUserImgObj 	 =  activityResObj.get("fromUser").get("photoFile");
									if(activityUserImgObj!=undefined)
									{
										var activityUserImgUrl 	 = activityUserImgObj.url();
									 	var activityUserImg 	 = activityUserImgUrl;
									}
									else
									{
										 var activityUserImg 	 	 = 'img/user.png';
									}
									  
									/* Get Memory Author's Name */
									var activityUserName   	=  activityResObj.get("fromUser").get("name");
									var activityUserId   	=  activityResObj.get("fromUser").id;
									//check user activity privacy
									if(activityResObj.get('privacy')=="No")
									{
										/* Let's Put the activityListArray Information in an Array as an Object*/
										activityListArray.push(
										{
											activityType			: activityType,
											activityContent			: activityContent,
											activityAddOnDateTime	: activityAddOnDateTime,
											activityImg				: activityImg,
											
											activityUserName		: activityUserName,
											activityUserImg			: activityUserImg,
											activityId				: activityResObj.id
												
										});
										activityTotalCount++;
									}
									else
									{
										var fbUserId 	= window.localStorage.getItem("fbUserId");
										// check username or name or email present in user group
										if((currentUser.id==activityUserId) || ($.inArray(currentUser.get("name"), activityResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("username"), activityResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("email"), activityResObj.get('mentionTo') )>=0) || ($.inArray(fbUserId, activityResObj.get('mentionTo') )>=0))
										{
											/* Let's Put the activityListArray Information in an Array as an Object*/
											activityListArray.push(
											{
												activityType			: activityType,
												activityContent			: activityContent,
												activityAddOnDateTime	: activityAddOnDateTime,
												activityImg				: activityImg,
												
												activityUserName		: activityUserName,
												activityUserImg			: activityUserImg,
												activityId				: activityResObj.id
													
											});
											activityTotalCount++;
										}
									  }
								} //end for loop
							}// end activities count if
							
						    //get Activity as per memory*************End
							
							//check user memory privacy
							if(memoryResObj.get('privacy')=="No")
							{
								 //Let's Put the memoryListArray Information in an Array as an Object
								memoryListArray.push(
								{
									memoryId			: memoryResObj.id,
									memoryTitle			: memoryTitle,
									memoryContent		: memoryContent,
									memoryAddOnDateTime	: memoryAddOnDateTime,
									memoryType			: memoryType,
									memoryImg			: memoryImg,
									memoryPrivacy		: "No",
									
									memoryUserName		: memoryUserName,
									memoryUserImg		: memoryUserImg,
									memoryUserId		: memoryUserId,
									
									activityTotalCount	: activityTotalCount,
									IREMcount			: IREMcount,
									LIKEcount			: LIKEcount,
									FOLLOWcount			: FOLLOWcount,
									activityListArray 	: activityListArray
										
								});
							  mCount++;
							}
							else
							{
								
								var fbUserId 	= window.localStorage.getItem("fbUserId");
								// check username or name or email present in user group
								if((currentUser.id==memoryUserId) || ($.inArray(currentUser.get("name"), memoryResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("username"), memoryResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("email"), memoryResObj.get('mentionTo') )>=0) || ($.inArray(fbUserId, memoryResObj.get('mentionTo') )>=0))
								{
									// Let's Put the memoryListArray Information in an Array as an Object
									memoryListArray.push(
									{
										memoryId			: memoryResObj.id,
										memoryTitle			: memoryTitle,
										memoryContent		: memoryContent,
										memoryAddOnDateTime	: memoryAddOnDateTime,
										memoryType			: memoryType,
										memoryImg			: memoryImg,
										memoryPrivacy		: "Yes",
										
										memoryUserName		: memoryUserName,
										memoryUserImg		: memoryUserImg,
										memoryUserId		: memoryUserId,
										
										activityTotalCount	: activityTotalCount,
										IREMcount			: IREMcount,
										LIKEcount			: LIKEcount,
										FOLLOWcount			: FOLLOWcount,
										activityListArray 	: activityListArray
											
									});
									mCount++;
								}
							}
							
						    // the code will wait again for the above to complete because there is another promise returning here
						  	return Parse.Promise.as(); 
				
						}, function (error) {
						 // alert("score lookup failed with error.code: " + error.code + " error.message: " + error.message);
						});
						
					  }); // end promise
					  
					  
					}); //end each loop
					return promise; // this will not be triggered until the whole loop above runs and all promises above are resolved
					
				}).then(function() {
					
					//alert('mCount='+mCount);
					//alert("memoryListArray=="+JSON.stringify(memoryListArray));
					if(mCount>0) //condition for num of records present
					{
						$scope.memoryListArr 	= memoryListArray;
						$scope.showMemories		= true;
					}
					else
					{
						$scope.showMemories		=false;
					}
					$scope.$apply();
					$timeout(function() {
						$scope.hideLoading();
					 }, 400);
					
				  }, function (error) {
					//alert("Error.code: " + error.code + " error.message: " + error.message);
					$scope.hideLoading();
					$scope.showMemories=false;
					$scope.$apply();
			});
		}// end function
		
		//call function view memory function
		$scope.homePageData();
				
	})
//View homePage controller******************************End************************************************		
	
	
	
	
//CYRme Memory controller******************************Start************************************************
	.controller('CYRmeMemory', function($scope ,$rootScope, $state, $ionicLoading, $cordovaNetwork, ThumbnailService, $ionicPush, $http, $cordovaDevice, $timeout, $stateParams, $ionicHistory) {
		
		//Memory photo upload btn
		$scope.uploadFileMemory = function() {
			$(function() {
					$("input:file[id=memoryFileUpload]").change (function() {
					var file = $(this)[0].files[0];
					$("#uploadFileMemory").val(file.name);
				});
			});
		}
		
		//add memory icon not show this Ctrl
		$rootScope.showAddMemoryLink	=false;
		// current user
		var currentUser = Parse.User.current();
		
		//autocomplete Start*******************************************
		
		//store all username detail in findUserArray array
		var findUserArray	=new Array();
		var query = new Parse.Query("_User");
		query.notEqualTo("objectId", currentUser.id);
		query.find().then(function(userAllResult) {
			var promise = Parse.Promise.as(); // define a promise
			//run each loop fetch each record
			$.each(userAllResult, function(userResult) {
			  var findUserResObj = userAllResult[userResult];
			  promise = promise.then(function() {
				 findUserArray.push(findUserResObj.get('username'));
				 findUserArray.push(findUserResObj.get('email'));
			  }); // end promise
			}); //end each loop
			return promise;
		}).then(function() {
				//alert("findUserArray=="+JSON.stringify(findUserArray));
			  }, function (error) {
				//alert("Error.code: " + error.code + " error.message: " + error.message);
		});
		
		//load user in autocomplete list   
		$scope.loadTags = function(query){
			//return $http.get('tags.json');
			var newUserArrayList=new Array;
			for(var i=0; i<findUserArray.length; i++)
			{
				var userValue 	= findUserArray[i].toLowerCase();
				var searchStr	= query.toLowerCase();
				
				if(searchStr && userValue.indexOf(searchStr)!=-1)
				{
					if(newUserArrayList.length>0)
					{
						$.each(newUserArrayList, function() {
							var key 			= Object.keys(this)[0];
							var newUserValue    = this[key].toLowerCase();
							if(searchStr && newUserValue.indexOf(searchStr)==-1)
							{
								newUserArrayList.push({"text"	: findUserArray[i]});
							}
							else
							{
								//alert("no match");
							}
						}); 
					}
					else
					{
						newUserArrayList.push({"text"	: findUserArray[i]});
					}
				}
			}//for loop End
			
			//check new user array count
			if(newUserArrayList.length<1)
			{
				newUserArrayList.push({"text"	: "No Record Found"});
			}
			return newUserArrayList;
	    };
		
	//autocomplete End*******************************************
		
		$scope.fileSizeMBMsg =$rootScope.fileSizeMBMsg;
		$scope.showFileMsg = false;
		
		//msg false by default
		$scope.addMemoryMsg = false;
		$scope.addMemoryValue ="";
		// Form data for add Memory
		$scope.addMemoryData = [];
		
		$scope.showMPhoto = false;
		
		//code for edit memory
		var mId = $stateParams.id;
		if(mId!='' && mId!='ADD')
		{ 
			$scope.showLoading();
			$scope.memoryPageHeading = "Edit";
			
			var memoryQuery = Parse.Object.extend("CYRme");
			var query 		= new Parse.Query(memoryQuery);
			query.equalTo("objectId", mId);
			query.equalTo("user", {"__type":"Pointer","className":"_User","objectId":currentUser.id});
			query.limit(1);
			
			query.find({
				success: function(memoryResults) {
					//alert("memoryResults=="+JSON.stringify(memoryResults));
					for(i in memoryResults){
						//Set memoryResObj to current Memory
						  var memoryResObj = memoryResults[i];
						
						  $scope.addMemoryData['title'] 	   =memoryResObj.get('title');
						  $scope.addMemoryData['typeOfMemory'] =memoryResObj.get('typeOfMemory');
						  $scope.addMemoryData['dateOfMemory'] =memoryResObj.get('dateOfMemory');
						  if(memoryResObj.get('mentionTo')!=undefined)
						  {
						  	$scope.addMemoryData['mentionTo']    =memoryResObj.get('mentionTo');
						  }
						  
						  $scope.addMemoryData['content'] =memoryResObj.get('content');
						  $scope.addMemoryData['privacy'] =memoryResObj.get('privacy');
						   
						  //get memory thumbnill
						  var memoryThumbnailObj = memoryResObj.get("thumbnail");
						  if(memoryThumbnailObj!=undefined)
						  {
							  var memoryThumbnailurl = memoryThumbnailObj.url();
							  $scope.MPhoto		 	 =memoryThumbnailurl;
							  $scope.showMPhoto 	 = true;
						  }
						  else
						  {
							   $scope.MPhoto		='';
							   $scope.showMPhoto 	= false;
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
		else //code for add memory
		{
			$scope.memoryPageHeading = "Add";
		}
		
		
		
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
				  "alert":fromUserName+" shared a memory with you!",
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
				var usernameQuery = new Parse.Query("_User");
					usernameQuery.notEqualTo("objectId", currentUser.id);
					usernameQuery.containedIn("username", inviteUserListArray);
				
				//email field query var	
				var emailQuery 	  = new Parse.Query("_User");
					emailQuery.notEqualTo("objectId", currentUser.id);
					emailQuery.containedIn("email", inviteUserListArray);
					
				//Compound both username and email query var
				var mainQuery = Parse.Query.or(usernameQuery, emailQuery);
				mainQuery.find({
				  success: function(results) {
					 //alert("results.length=="+results.length);
					 
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
				
				//condition for edit memory
				if(mId!='' && mId!='ADD')
				{ 
				 	CYRmeMemory.id= mId;
				}
				else
				{
					CYRmeMemory.set("user", {"__type":"Pointer","className":"_User","objectId":currentUser.id});
				}
				
				CYRmeMemory.set("title", String($scope.addMemoryData['title']));
				CYRmeMemory.set("typeOfMemory", String($scope.addMemoryData['typeOfMemory']))
				CYRmeMemory.set("dateOfMemory", $scope.addMemoryData['dateOfMemory']);
				
				//alert(typeof($scope.addMemoryData['mentionTo']));
				var mentionToArray = [];
				if(($scope.addMemoryData['mentionTo'])!=undefined)
				{
					$.each($scope.addMemoryData['mentionTo'], function() {
					  var key 	= Object.keys(this)[0];
					  var value = $.trim(this[key]);
					  mentionToArray.push(value);
					}); 
					CYRmeMemory.set("mentionTo", mentionToArray);
				}
				
				CYRmeMemory.set("content", String($scope.addMemoryData['content']));
				CYRmeMemory.set("privacy", String($scope.addMemoryData['privacy']));
				
				//upload file
				var fileUploadControl = $("#memoryFileUpload")[0];
				if (fileUploadControl.files.length > 0) {
					
					var file = fileUploadControl.files[0];
					
					//check upload size
					var fileSize		= file.size;
					if(parseInt(fileSize)>parseInt($rootScope.fileSizeLimit))
					{
						$scope.fileMsg=$rootScope.fileSizeLimitMsg;
						$scope.showFileMsg = true;
						$scope.hideLoading();
						$scope.$apply();
						return false;
					}
					else
					{
						$scope.showFileMsg = false;
					}
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
						 // alert("memoryRes=="+JSON.stringify(memoryRes));
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
						if(mId!='' && mId!='ADD')
						{ 
							//get old memory image
							var memoryQuery = Parse.Object.extend("CYRme");
							var query 		= new Parse.Query(memoryQuery);
							query.equalTo("objectId", mId);
							query.equalTo("user", {"__type":"Pointer","className":"_User","objectId":currentUser.id});
							query.limit(1);
							
							query.find({
								success: function(memoryResults) {
									//alert("memoryResults=="+JSON.stringify(memoryResults));
									for(i in memoryResults){
										//Set memoryResObj to current Memory
										  var memoryResObj = memoryResults[i];
										  //get memory photo
										  var memoryPhotoObj = memoryResObj.get("image");
										  if(memoryPhotoObj!=undefined)
										  {
											  var memoryOldPhoto   = '<img src="'+memoryPhotoObj.url()+'" >';
										  }
										  else
										  {
											 var memoryOldPhoto = '';
										  }
										   $scope.inviteUsers(mentionToArray,memoryOldPhoto,memoryContent);
										   $scope.$apply();
									} // End for loop
								}
							})
						}
						else
						{
							$scope.inviteUsers(mentionToArray,'',memoryContent);
							$scope.$apply();
						}
						
					  },
					  error: function(error) {
						//alert("error=="+JSON.stringify(error));
						$scope.$apply();
					  }
					});
				}
				
				$timeout(function() {
					$scope.hideLoading();
					$ionicHistory.clearHistory();
					$ionicHistory.nextViewOptions({
					   disableBack: true
					});
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
		
		//add memory icon show this Ctrl
		$rootScope.showAddMemoryLink =true;
		
		//define function view user Memory
		$scope.viewMemory = function() {
				// check network are present or not
				if($cordovaNetwork.isOnline())  
				{
					$scope.showLoading();
					//msg false by default
					$scope.showViewMemoryMsg 	= false;
					$scope.showViewMemoryValue  = "";
					$scope.showMemories			= true;
					var memoryListArray			= new Array(); //store all memory data
					var currentUser = Parse.User.current();
					var mCount=0;
					
					var query = new Parse.Query("CYRme");
					query.include("user");
					//query.equalTo("user", {"__type":"Pointer","className":"_User","objectId":currentUser.id});
					query.descending("updatedAt");
					query.find().then(function(CYRmeAllResult) {
						
						var promise = Parse.Promise.as(); // define a promise
						//alert("CYRmeAllResult=="+JSON.stringify(CYRmeAllResult));
						
						//run each loop fetch each record
						$.each(CYRmeAllResult, function(CYRmeResult) {
							
							var memoryResObj = CYRmeAllResult[CYRmeResult];
							//alert("memoryResObj=="+JSON.stringify(memoryResObj));
							
							var memoryTitle		 	=memoryResObj.get('title');
							var memoryContent 	 	=memoryResObj.get('content');
							var memoryAddOnDateTime =$filter('date')(memoryResObj.get("dateOfMemory"), "dd/MM/yyyy");
							if(memoryAddOnDateTime!=null)
							{
							   memoryAddOnDateTime 	 	 = memoryAddOnDateTime;
							}
							else
							{
							   memoryAddOnDateTime 	 	 = '';
							}
							
							var memoryType		 	=memoryResObj.get('typeOfMemory');
							if(memoryType!=undefined)
							{
							   memoryType 	 	 = memoryType;
							}
							else
							{
							   memoryType 	 	 = '';
							}
							
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
						
							//Get Memory Author's Name 
							var memoryUserName   	= memoryResObj.get("user").get("name");
							var memoryUserId   		= memoryResObj.get("user").id;
						 
						  promise = promise.then(function() { // each time this loops the promise gets reassigned to the function below
						  
							//get Activity as per memory*************Start
							var query 	= new Parse.Query('Activity');
							query.include("fromUser");
							query.equalTo("CYRme", {"__type":"Pointer","className":"CYRme","objectId":memoryResObj.id});
							query.descending("updatedAt");
							return query.find().then(function(activityAllReault) {
							
								//alert("activityAllReault=="+JSON.stringify(activityAllReault));
								var activityListArray	=new Array(); //store all activities data
								
								var IREMcount	=0;
								var LIKEcount	=0;
								var FOLLOWcount	=0;
								
								var activityTotalCount=0;
								if(activityAllReault.length>0)
								{
									for (var i = 0; i < activityAllReault.length; i++) 
									{
										var activityResObj = activityAllReault[i];
										
										if(activityResObj.get('activityType')=="IREM")
										{
											IREMcount++;
										}
										if(activityResObj.get('activityType')=="LIKE")
										{
											LIKEcount++;
										}
										if(activityResObj.get('activityType')=="FOLLOW")
										{
											FOLLOWcount++;
										}
										
										var activityType		  =activityResObj.get('activityType');
										var activityAddOnDateTime =$filter('date')(activityResObj.get("dateOfMemory"), "dd/MM/yyyy");
										if(activityAddOnDateTime!=null)
										{
										  activityAddOnDateTime 	 	 = activityAddOnDateTime;
										}
										else
										{
										   activityAddOnDateTime 	 	 = '';
										}
										
										var activityContent 	  =activityResObj.get('content');
										//get Content
										if(activityContent!="undefined")
										{
											activityContent 	 	=activityContent;
										}
										else
	
										{ 
											activityContent 	 	="";
										}
										//get activity thumbnill
										var activityThumbnailObj = activityResObj.get("thumbnail");
										if(activityThumbnailObj!=undefined)
										{
											var activityThumbnailurl = activityThumbnailObj.url();
											var activityImg 	 	 = activityThumbnailurl;
										}
										else
										{
											var activityImg 	 	 = '';
										}
										  
										//get user profile pic 
										var activityUserImgObj 	 =  activityResObj.get("fromUser").get("photoFile");
										if(activityUserImgObj!=undefined)
										{
											var activityUserImgUrl 	 = activityUserImgObj.url();
											var activityUserImg 	 = activityUserImgUrl;
										}
										else
										{
											 var activityUserImg 	 	 = 'img/user.png';
										}
										  
										/* Get Memory Author's Name */
										var activityUserName   	=  activityResObj.get("fromUser").get("name");
										var activityUserId   	=  activityResObj.get("fromUser").id;
										//check user activity privacy
										if(activityResObj.get('privacy')=="No" && currentUser.id==activityUserId)
										{
											/* Let's Put the activityListArray Information in an Array as an Object*/
											activityListArray.push(
											{
												activityType			: activityType,
												activityContent			: activityContent,
												activityAddOnDateTime	: activityAddOnDateTime,
												activityImg				: activityImg,
												
												activityUserName		: activityUserName,
												activityUserImg			: activityUserImg,
												activityId				: activityResObj.id
													
											});
											activityTotalCount++;
										}
										else
										{
											var fbUserId 	= window.localStorage.getItem("fbUserId");
											// check username or name or email present in user group
											if((currentUser.id==activityUserId) || ($.inArray(currentUser.get("name"), activityResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("username"), activityResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("email"), activityResObj.get('mentionTo') )>=0) || ($.inArray(fbUserId, activityResObj.get('mentionTo') )>=0))
											{
												/* Let's Put the activityListArray Information in an Array as an Object*/
												activityListArray.push(
												{
													activityType			: activityType,
													activityContent			: activityContent,
													activityAddOnDateTime	: activityAddOnDateTime,
													activityImg				: activityImg,
													
													activityUserName		: activityUserName,
													activityUserImg			: activityUserImg,
													activityId				: activityResObj.id
														
												});
												activityTotalCount++;
											}
										  }
									} //end for loop
								}// end activities count if
								
								//get Activity as per memory*************End
								
								//check user memory privacy
								if(memoryResObj.get('privacy')=="No" && currentUser.id==memoryUserId)
								{
									 //Let's Put the memoryListArray Information in an Array as an Object
									memoryListArray.push(
									{
										memoryId			: memoryResObj.id,
										memoryTitle			: memoryTitle,
										memoryContent		: memoryContent,
										memoryAddOnDateTime	: memoryAddOnDateTime,
										memoryType			: memoryType,
										memoryImg			: memoryImg,
										memoryPrivacy		: "No",
										
										memoryUserName		: memoryUserName,
										memoryUserImg		: memoryUserImg,
										memoryUserId		: memoryUserId,
										
										activityTotalCount	: activityTotalCount,
										IREMcount			: IREMcount,
										LIKEcount			: LIKEcount,
										FOLLOWcount			: FOLLOWcount,
										activityListArray 	: activityListArray
											
									});
								  mCount++;
								}
								else
								{
									
									var fbUserId 	= window.localStorage.getItem("fbUserId");
									// check username or name or email present in user group
									if((currentUser.id==memoryUserId) || ($.inArray(currentUser.get("name"), memoryResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("username"), memoryResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("email"), memoryResObj.get('mentionTo') )>=0) || ($.inArray(fbUserId, memoryResObj.get('mentionTo') )>=0))
									{
										// Let's Put the memoryListArray Information in an Array as an Object
										memoryListArray.push(
										{
											memoryId			: memoryResObj.id,
											memoryTitle			: memoryTitle,
											memoryContent		: memoryContent,
											memoryAddOnDateTime	: memoryAddOnDateTime,
											memoryType			: memoryType,
											memoryImg			: memoryImg,
											memoryPrivacy		: "Yes",
											
											memoryUserName		: memoryUserName,
											memoryUserImg		: memoryUserImg,
											memoryUserId		: memoryUserId,
											
											activityTotalCount	: activityTotalCount,
											IREMcount			: IREMcount,
											LIKEcount			: LIKEcount,
											FOLLOWcount			: FOLLOWcount,
											activityListArray 	: activityListArray
												
										});
										mCount++;
									}
								}
								
								// the code will wait again for the above to complete because there is another promise returning here
								return Parse.Promise.as(); 
					
							}, function (error) {
							 // alert("score lookup failed with error.code: " + error.code + " error.message: " + error.message);
							});
							
						  }); // end promise
						  
						  
						}); //end each loop
						return promise; // this will not be triggered until the whole loop above runs and all promises above are resolved
						
					}).then(function() {
						
						//alert('mCount='+mCount);
						//alert("memoryListArray=="+JSON.stringify(memoryListArray));
						if(mCount>0) //condition for num of records present
						{
							$scope.memoryListArr 	= memoryListArray;
							$scope.showMemories		= true;
						}
						else
						{
							$scope.showMemories		=false;
						}
						$scope.$apply();
						$timeout(function() {
							$scope.hideLoading();
						 }, 400);
						
					  }, function (error) {
						//alert("Error.code: " + error.code + " error.message: " + error.message);
						$scope.hideLoading();
						$scope.showMemories=false;
						$scope.$apply();
					});
				} 
				else 
				{
				   // Show the error message somewhere and let the user try again.
					$scope.showViewMemoryMsg   = true;
					$scope.showViewMemoryValue ="Please check your network connection and try again.";
					$scope.hideLoading();
					$scope.$apply();
				}
			}; //End function	
			
			
		//call function view memory function
		$scope.viewMemory();
		
	})
//View Memory controller******************************End************************************************	



//memory Details controller******************************Start************************************************
	.controller('memoryDetails', function($scope ,$rootScope, $ionicLoading, $state, $stateParams, $cordovaNetwork, $cordovaFile, $filter, $timeout) {
		
		//add memory icon not show this Ctrl
		$rootScope.showAddMemoryLink	=false;
		//show edit memory icon
		$scope.showEditMemory = false;
		
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
								 
								 if(memoryResObj.get("user").id==currentUser.id)
								 {
									 $scope.showEditMemory = true;
								 }
								 else
								 {
									 $scope.showEditMemory = false;
								 }
								 
								 //check memory privacy
								 if(memoryResObj.get('privacy')=="Yes")
								 {
									$scope.memoryDetailsPrivacy  = "Yes"; 
								 }
								 else
								 {
									 $scope.memoryDetailsPrivacy  = "No"; 
								 }
								 
								 
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
		
		
		//////////////////////////////////////////////////////////////////////////
		//Define addActivityTypeAction (when click Like,iREM and follow button)
		$scope.addActivityTypeAction = function(mId,toUser,activityType,activityCount) 
		{
			$scope.showMemoryDetailsMsg = false;
			$scope.showMemoryDetailsMsgValue = '';
			$scope.showLoading();
			var currentUser = Parse.User.current();
			if(currentUser && $cordovaNetwork.isOnline()) 
			{
				var Activity = new Parse.Object("Activity");
				Activity.set("CYRme", {"__type":"Pointer","className":"CYRme","objectId":mId}); //set pointer to current Memory
				Activity.set("toUser", {"__type":"Pointer","className":"_User","objectId":toUser}); //set memory user pointer in toUser
				Activity.set("fromUser", {"__type":"Pointer","className":"_User","objectId":currentUser.id}); //set current user pointer in fromUser
				Activity.set("activityType", String(activityType));
				Activity.set("dateOfMemory", new Date());
				Activity.set("privacy", "No");
				
				//save Activity object
				Activity.save(null, {
					  success: function(activityRes) {
						 //alert("activityRes=="+JSON.stringify(activityRes));
						 $scope.showMemoryDetailsMsg = true;
						 if(activityType=='IREM')
						 {
							 $scope.IREMcount = activityCount+1;
							 $scope.showMemoryDetailsMsgValue = 'iREM Successfully.';
						 }
						 
						 if(activityType=='LIKE')
						 {
							 $scope.LIKEcount = activityCount+1;
							 $scope.showMemoryDetailsMsgValue = 'Like Successfully.';
						 }
						 
						 if(activityType=='FOLLOW')
						 {
							 $scope.FOLLOWcount = activityCount+1;
							 $scope.showMemoryDetailsMsgValue = 'Follow Successfully.';
						 }
						$scope.hideLoading();
						$scope.$apply();
					  },
					  error: function(error) {
						//alert("error=="+JSON.stringify(error));
						$scope.showMemoryDetailsMsg = true;
						$scope.showMemoryDetailsMsgValue = 'Error, please try again.';
						$scope.hideLoading();
						$scope.$apply();
					  }
				});
			}
			else
			{
				// Show the error message somewhere and let the user try again.
				alert("Please check your network connection and try again.");
				$scope.hideLoading();
				$scope.$apply();
			}
		};
		//////////////////////////////////////////////////////////////////////////
		
	})
//memory Details controller******************************End************************************************	



















//activity controller******************************Start************************************************
	.controller('activity', function($scope ,$rootScope, $state, $stateParams, $ionicLoading, $cordovaNetwork, ThumbnailService,$ionicPush, $http, $cordovaDevice, $timeout, $ionicHistory,UserRetriever) {
		
		//add memory icon not show this Ctrl
		$rootScope.showAddMemoryLink	=false;
		// current user
		var currentUser = Parse.User.current();
		
		//activity photo upload btn
		$scope.uploadFileActivity = function() {
			$(function() {
					$("input:file[id=activityFileUpload]").change (function() {
					var file = $(this)[0].files[0];
					$("#uploadFileActivity").val(file.name);
				});
			});
		}
		
		
	//autocomplete Start*******************************************
		
		//store all username detail in findUserArray array
		var findUserArray	=new Array();
		var query = new Parse.Query("_User");
		query.notEqualTo("objectId", currentUser.id);
		query.find().then(function(userAllResult) {
			var promise = Parse.Promise.as(); // define a promise
			//run each loop fetch each record
			$.each(userAllResult, function(userResult) {
			  var findUserResObj = userAllResult[userResult];
			  promise = promise.then(function() {
				 findUserArray.push(findUserResObj.get('username'));
				 findUserArray.push(findUserResObj.get('email'));
			  }); // end promise
			}); //end each loop
			return promise;
		}).then(function() {
				//alert("findUserArray=="+JSON.stringify(findUserArray));
			  }, function (error) {
				//alert("Error.code: " + error.code + " error.message: " + error.message);
		});
		
		//load user in autocomplete list   
		$scope.loadTags = function(query){
			//return $http.get('tags.json');
			var newUserArrayList=new Array;
			for(var i=0; i<findUserArray.length; i++)
			{
				var userValue 	= findUserArray[i].toLowerCase();
				var searchStr	= query.toLowerCase();
				
				if(searchStr && userValue.indexOf(searchStr)!=-1)
				{
					if(newUserArrayList.length>0)
					{
						$.each(newUserArrayList, function() {
							var key 			= Object.keys(this)[0];
							var newUserValue    = this[key].toLowerCase();
							if(searchStr && newUserValue.indexOf(searchStr)==-1)
							{
								newUserArrayList.push({"text"	: findUserArray[i]});
							}
							else
							{
								//alert("no match");
							}
						}); 
					}
					else
					{
						newUserArrayList.push({"text"	: findUserArray[i]});
					}
				}
			}//for loop End
			
			//check new user array count
			if(newUserArrayList.length<1)
			{
				newUserArrayList.push({"text"	: "No Record Found"});
			}
			return newUserArrayList;
	    };
		
	//autocomplete End*******************************************
		
		$scope.fileSizeMBMsg =$rootScope.fileSizeMBMsg;
		$scope.showFileMsg = false;
		
		//msg false by default
		$scope.addActivityMsg = false;
		$scope.addActivityValue ="";
		// Form data for add Activity
		$scope.addActivityData = [];
		
		$scope.showAPhoto = false;
		
		//code for edit activity
		var aId 		= $stateParams.aId;
		var toUser 		= $stateParams.toUser;
		var mId 		= $stateParams.mId;
		var mPrivacy	= $stateParams.mPrivacy
		if(mPrivacy=="Yes")
		{
			$scope.showActivityMentionToField=false;
		}
		else
		{
			$scope.showActivityMentionToField=true;
		}
		
		if(aId!='' && aId!='ADD')
		{ 
			$scope.showLoading();
			$scope.memoryPageHeading = "Edit";
			
			var activityQuery = Parse.Object.extend("Activity");
			var query 		  = new Parse.Query(activityQuery);
			query.equalTo("objectId", aId);
			query.equalTo("fromUser", {"__type":"Pointer","className":"_User","objectId":currentUser.id});
			query.limit(1);
			
			query.find({
				success: function(activityResults) {
					//alert("activityResults=="+JSON.stringify(activityResults));
					for(i in activityResults){
						//Set activityResObj to current Memory
						  var activityResObj = activityResults[i];
						
						  $scope.addActivityData['activityType'] 	   =activityResObj.get('activityType');
						  $scope.addActivityData['dateOfMemory']       =activityResObj.get('dateOfMemory');
						  if(activityResObj.get('mentionTo')!=undefined)
						  {
							$scope.addActivityData['mentionTo']    =activityResObj.get('mentionTo');
						  }
						  
						  $scope.addActivityData['content'] =activityResObj.get('content');
						  $scope.addActivityData['privacy'] =activityResObj.get('privacy');
						   
						  //get activity thumbnill
						  var activityThumbnailObj = activityResObj.get("thumbnail");
						  if(activityThumbnailObj!=undefined)
						  {
							  var activityThumbnailurl = activityThumbnailObj.url();
							  $scope.APhoto		 	   =activityThumbnailurl;
							  $scope.showAPhoto 	  = true;
						  }
						  else
						  {
							   $scope.APhoto		='';
							   $scope.showAPhoto 	= false;
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
		else //code for add activity
		{
			$scope.activityPageHeading = "Add";
			//get to memory id
			if(mId=='')
			{
				$scope.hideLoading();
				$ionicHistory.clearHistory();
				$ionicHistory.nextViewOptions({
				   disableBack: true
				});
				$state.go('app.viewMemory',null,{reload:true});// go to viewMemory page
				var toUser='';
				$scope.$apply();
			}
		}
		
		
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
				  "alert":fromUserName+" did some activity on memory!",
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
				var usernameQuery = new Parse.Query("_User");
					usernameQuery.notEqualTo("objectId", currentUser.id);
					usernameQuery.containedIn("username", inviteUserListArray);
				
				//email field query var	
				var emailQuery 	  = new Parse.Query("_User");
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
			
			if(currentUser && $cordovaNetwork.isOnline()) 
			{
				
				var Activity = new Parse.Object("Activity");
				//condition for edit Activity
				if(aId!='' && aId!='ADD')
				{ 
				 	Activity.id= aId;
				}
				else //add case
				{
					Activity.set("CYRme", {"__type":"Pointer","className":"CYRme","objectId":mId}); //set pointer to current Memory
					Activity.set("toUser", {"__type":"Pointer","className":"_User","objectId":toUser}); //set memory user pointer in toUser
					Activity.set("fromUser", {"__type":"Pointer","className":"_User","objectId":currentUser.id}); //set current user pointer in fromUser
				}
				
				Activity.set("activityType", String($scope.addActivityData['activityType']))
				Activity.set("dateOfMemory", $scope.addActivityData['dateOfMemory']);
				Activity.set("content", String($scope.addActivityData['content']));
				Activity.set("privacy", String($scope.addActivityData['privacy']));
				
				//alert(typeof($scope.addActivityData['mentionTo']));
				var mentionToArray = [];
				if(($scope.addActivityData['mentionTo'])!=undefined)
				{ 
					$.each($scope.addActivityData['mentionTo'], function() {
					  var key 	= Object.keys(this)[0];
					  var value = $.trim(this[key]);
					  mentionToArray.push(value);
					}); 

					Activity.set("mentionTo", mentionToArray);
				}
				
				//upload file
				var fileUploadControl = $("#activityFileUpload")[0];
				if (fileUploadControl.files.length > 0) {
					
					var file = fileUploadControl.files[0];
					
					//check upload size
					var fileSize		= file.size;
					if(parseInt(fileSize)>parseInt($rootScope.fileSizeLimit))
					{
						$scope.fileMsg=$rootScope.fileSizeLimitMsg;
						$scope.showFileMsg = true;
						$scope.hideLoading();
						$scope.$apply();
						return false;
					}
					else
					{
						$scope.showFileMsg = false;
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
						$scope.generateThumbnailAndSaveParseActivity = function(fileData,thumbSizeObjData) {
						  ThumbnailService.generate(fileData,thumbSizeObjData).then(
							function success(thumbFile) {
							  $scope.APhoto=thumbFile;
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
							$scope.generateThumbnailAndSaveParseActivity(fileDataUrl,thumbSizeObj);
							$scope.$apply();
							 //return srcData;
						}
						//call function for convert image data into base64 string
						fileReader.readAsDataURL(file);
						///////////////////////Thumb nill upload End////////////////////////////////
						////////////////////////////////////////////////////////////////////////////////
					}
				}
				else
				{
					//save Activity object
                
                    Activity.save(null, {
						  success: function(activityRes) {
							 //alert("activityRes=="+JSON.stringify(activityRes));
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
							if(aId!='' && aId!='ADD')
							{ 
								//get old memory image
								var activityQuery = Parse.Object.extend("Activity");
								var query 		  = new Parse.Query(activityQuery);
								query.equalTo("objectId", aId);
								query.equalTo("fromUser", {"__type":"Pointer","className":"_User","objectId":currentUser.id});
								query.limit(1);
								
								query.find({
									success: function(activityResults) {
										//alert("activityResults=="+JSON.stringify(activityResults));
										for(i in activityResults){
											//Set activityResObj to current Memory
											  var activityResObj = activityResults[i];
						  
											  //get activity photo
											  var activityPhotoObj = activityResObj.get("image");
											  if(activityPhotoObj!=undefined)
											  {
												  var activityOldPhoto   = '<img src="'+activityPhotoObj.url()+'" >';
											  }
											  else
											  {
												 var activityOldPhoto = '';
											  }
											   $scope.inviteUsersActivity(mentionToArray,activityOldPhoto,activityContent);
											   $scope.$apply();
										} // End for loop
									}
								})
							}
							else
							{
								$scope.inviteUsersActivity(mentionToArray,'',activityContent);
								$scope.$apply();
							}
						
						  },
						  error: function(error) {
							//alert("error=="+JSON.stringify(error));
							//alert("Error1: " + error.code + " " + error.message);
							$scope.$apply();
						  }
						});
				}
				
				$timeout(function() {
					$scope.hideLoading();
					$ionicHistory.clearHistory();
					$ionicHistory.nextViewOptions({
					   disableBack: true
					});
					$state.go('app.viewMemory',null,{reload:true});// go to viewMemory page
					$scope.$apply();
				}, 10000);
			}
			else
			{
				// Show the error message somewhere and let the user try again.
				$scope.addActivityMsg = true;
				$scope.addActivityValue ="Please check your network connection and try again.";
				$scope.hideLoading();
				$scope.$apply();
			}
		};
		//////////////////////////////////////////////////////////////////////////
		
	})
//activity controller******************************End************************************************




//viewAllActivities controller******************************Start************************************************
	.controller('viewAllActivities', function($scope ,$rootScope, $state, $stateParams, $ionicLoading, $cordovaNetwork, $cordovaFile, $filter, $timeout ) {
		
		//add memory icon not show this Ctrl
		$rootScope.showAddMemoryLink	=false;
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
					query.descending("updatedAt");
					
					query.find({
						success: function(activitiesResults) {
							//alert("activitiesResults=="+JSON.stringify(activitiesResults));
							var aCount=0;
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
									aCount++;
								}
								else
								{
									var fbUserId 	= window.localStorage.getItem("fbUserId");
									// check username or name or email present in user group
									if((currentUser.id==activitiesUserId) || ($.inArray(currentUser.get("name"), activitiesResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("username"), activitiesResObj.get('mentionTo') )>=0) || ($.inArray(currentUser.get("email"), activitiesResObj.get('mentionTo') )>=0) || ($.inArray(fbUserId, activitiesResObj.get('mentionTo') )>=0))
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
										aCount++;
									}
								  }
								
								} // End for loop
							
								if(aCount>0) //condition for num of records present
								{
									$scope.activitiesListArr 	= activitiesListArray;
									$scope.showActivities=true;
								}
								else
								{
									$scope.showActivities=false;
								}
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
		
		//add memory icon not show this Ctrl
		$rootScope.showAddMemoryLink	=false;
		
		$scope.showEditActivity = false;
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
					query.include("CYRme");
					query.equalTo("objectId", aId);
					query.limit(1); // limit to at most 1 results
					query.find({
						success: function(activityResults) {
							//alert("activityResults=="+JSON.stringify(activityResults));
							
							for(i in activityResults){
								//Set activityResObj to current Memory
								  var activityResObj = activityResults[i];
								
								  $scope.activityDetailsType			=activityResObj.get('activityType');
								  $scope.activityDetailsAddOnDateTime   =$filter('date')(activityResObj.get("dateOfMemory"), "dd/MM/yyyy");
								  if(activityResObj.get('content')!="undefined")
								  {
									  $scope.activityDetailsContent 	 	=activityResObj.get('content');
								  }
								  else
								  {
									   $scope.activityDetailsContent 	 	 = '';
								  }
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
								 
								 //get memory id
								 $scope.memoryId  		= activityResObj.get("CYRme").id;
								 //check memory privacy
								 if(activityResObj.get("CYRme").get('privacy')=="Yes")
								 {
									$scope.memoryPrivacy  = "Yes"; 
								 }
								 else
								 {
									 $scope.memoryPrivacy  = "No"; 
								 }
								 
								 if(activityResObj.get("fromUser").id==currentUser.id)
								 {
									 $scope.showEditActivity = true;
								 }
								 else
								 {
									 $scope.showEditActivity = false;
								 }
								 
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
