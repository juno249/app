angular
.module('starter')
.controller('bannerController', bannerController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
bannerController.$inject = [
	'BROADCAST_MESSAGE', 
	'USER_ROLES', 
	'$localStorage', 
	'$rootScope', 
	'$scope', 
	'$state', 
	'$timeout', 
	'$uibModal', 
	'branchService', 
	'customerService', 
	'companyService', 
	'customerCompanyBranchService', 
	'loginService'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function bannerController(
		BROADCAST_MESSAGE, 
		USER_ROLES, 
		$localStorage, 
		$rootScope, 
		$scope, 
		$state, 
		$timeout, 
		$uibModal, 
		branchService, 
		customerService, 
		companyService, 
		customerCompanyBranchService, 
		loginService
){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.user = undefined;
	vm.loginUsername = undefined;
	vm.loginPassword = undefined;
	vm.isAuthenticated = undefined;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Methods (Start)
	 * ****************************** */
	vm.doLogin = doLogin;
	vm.doLogout = doLogout;
	vm.doSignup = doSignup;
	/* ******************************
	 * Controller Binded Methods (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: doLogin()
	 * purpose: do login
	 * ****************************** */
	function doLogin(){
		var loginUsername = vm.loginUsername;
		var loginPassword = vm.loginPassword;
		
		loginService.setLoginUsername(loginUsername);
		loginService.setLoginPassword(loginPassword);
		loginService.doLogin()
		.then(doLoginSuccessCallback)
		.catch(doLoginFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function doLoginSuccessCallback(response){
			$rootScope.$broadcast(BROADCAST_MESSAGE.authAuthenticated);
		}
		
		function doLoginFailedCallback(responseError){
			//do something on failure
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doLogout()
	 * purpose: do logout
	 * ****************************** */
	function doLogout(){
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doSignup()
	 * purpose: do signup
	 * ****************************** */
	function doSignup(){
		var customer = undefined;
		var company = undefined; 
		var branch = undefined;
		var customerCompanyBranch = undefined;
		var formMode = 'I';
		var fromSignup = true;
		var modalInstance = undefined;
		
		//modalCustomer
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-customers/modalCustomer.html', 
			controller: 'modalCustomerController as modalCustomerController', 
			resolve: {
				customer: function(){	
					return {
						customerRole: 'administrator'
					};	
				}, 
				formMode: function(){	return formMode;	}, 
				fromSignup: function(){	return fromSignup;	}, 
				modalHiddenFields: function(){	
					return {
						customerRole: true
					};	
				}
			}
		});
		modalInstance.result.then(customerUibModalResultCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function customerUibModalResultCallback(data){
			customer = data;
			customer = customer[0];
			
			if(null == customer){	return;	}
			
			if(USER_ROLES.administrator == customer.customer_role){
				doSignupAsAdministrator();
			}
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: doSignupAsAdministrator()
		 * purpose: do signup w/an administrator role
		 * ****************************** */
		function doSignupAsAdministrator(){
			//modalCompany
			modalInstance =  $uibModal.open({
				animation: true, 
				templateUrl: 'docs/dynamic/manage/manage-companies/modalCompany.html', 
				controller: 'modalCompanyController as modalCompanyController', 
				resolve: {
					company: function(){	return {};	}, 
					formMode: function(){	return formMode;	}, 
					fromSignup: function(){	return fromSignup;	}, 
					modalHiddenFields: function(){	return null;	}
				}
			});
			modalInstance.result.then(companyUibModalResultCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function companyUibModalResultCallback(data){
				company = data;
				company = company[0];
				
				//modalBranch
				modalInstance = $uibModal.open({
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-branches/modalBranch.html',
					controller: 'modalBranchController as modalBranchController', 
					resolve: {
						branch: function(){	
							return {
								companyName: company.company_name
							};	
						}, 
						formMode: function(){	return formMode;	}, 
						fromSignup: function(){	return fromSignup;	}, 
						modalHiddenFields: function(){	
							return {
									companyName: true
							};
						}
					}
				});
				modalInstance.result.then(branchUibModalResultCallback);
				
				/* ******************************
				 * Callback Implementations (Start)
				 * ****************************** */
				function branchUibModalResultCallback(data){
					branch = data;
					branch = branch[0];
					
					doAdminCascadedPosts();
				}
				/* ******************************
				 * Callback Implementations (End)
				 * ****************************** */
				
				/* ******************************
				 * Method Implementation
				 * method name: doAdminCascadedPosts()
				 * purpose: do posts for customer, company, branch
				 *  & customer_company_branch
				 * ****************************** */
				function doAdminCascadedPosts(){
					var customerCompanyBranch = {
							customer_username: customer.customer_username, 
							company_name: company.company_name, 
							branch_name: branch.branch_name
					};
					var transParams = {
							customer: customer, 
							company: company, 
							branch: branch, 
							customerCompanyBranch: customerCompanyBranch
					};
					
					customerCompanyBranchService.addCustomerCompanyBranchTransaction([transParams])
					.then(addCustomerCompanyBranchTransactionSuccessCallback)
					.catch(addCustomerCompanyBranchTransactionFailedCallback);
					
					/* ******************************
					 * Callback Implementations (Start)
					 * ****************************** */
					function addCustomerCompanyBranchTransactionSuccessCallback(response){
						//do something on success
					}
					
					function addCustomerCompanyBranchTransactionFailedCallback(responseError){
						//do something on failure
					}
					/* ******************************
					 * Callback Implementations (End)
					 * ****************************** */
				}				
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
		}
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: authAuthenticatedCallback()
	 * purpose: authAuthenticated message event handler
	 * ****************************** */
	function authAuthenticatedCallback(){
		$timeout(function(){
			var user = localStorage.getItem('User');
			var isAuthenticated = vm.isAuthenticated;

			user = JSON.parse(user);
			isAuthenticated = user.isAuthenticated;
			
			vm.isAuthenticated = isAuthenticated;
			$state.go('manage');
		})
	}
	
	/* ******************************
	 * Broadcast Event Handlers (Start)
	 * ****************************** */
	$scope.$on(BROADCAST_MESSAGE.authAuthenticated, authAuthenticatedCallback);
	/* ******************************
	 * Broadcast Event Handlers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */