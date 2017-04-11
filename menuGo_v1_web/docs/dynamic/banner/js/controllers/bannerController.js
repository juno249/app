angular
.module('starter')
.controller(
		'bannerController', 
		bannerController
		);

bannerController.$inject = [
	'BROADCAST_MESSAGES', 
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

function bannerController(
		BROADCAST_MESSAGES, 
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
	var vm = this;
	
	if(!(null == localStorage.getItem('User'))){
		vm.user = localStorage.getItem('User');
		vm.user= JSON.parse(vm.user);
		}
	
	//controller_method
	vm.doLogin = doLogin;
	//controller_method
	vm.doLogout = doLogout;
	//controller_method
	vm.doSignup = doSignup;
	
	function doLogin(){
		loginService.setLoginUsername(vm.loginUsername);
		loginService.setLoginPassword(vm.loginPassword);
		
		loginService.doLogin()
		.then(doLoginSuccessCallback)
		.catch(doLoginFailedCallback);
		
		function doLoginSuccessCallback(response){	$rootScope.$broadcast(BROADCAST_MESSAGES.authAuthenticated);
		}
		
		function doLoginFailedCallback(responseError){	//do something on failure
		}
		}
	
	function doLogout(){	//do something on logout
	}
	
	function doSignup(){
		var formMode = 'I';
		var fromSignup = true;
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-customers/modalCustomer.html', 
					controller: 'modalCustomerController as modalCustomerController', 
					resolve: {
						customer: function(){	return {	customerRole: 'administrator'	};
						}, 
						formMode: function(){	return formMode;
						}, 
						fromSignup: function(){	return fromSignup;
						}, 
						modalHiddenFields: function(){	return {	customerRole: true	};
						}
						}
				}
				);
		modalInstance.result.then(customerUibModalResultCallback);
		
		function customerUibModalResultCallback(data){
			vm.customer = data[0];
			
			if(null == vm.customer){	return;
			}
			
			if(USER_ROLES.administrator == vm.customer.customer_role){	doSignupAsAdministrator();
			}
			}
		
		function doSignupAsAdministrator(){
			var modalInstance =  $uibModal.open(
					{
						animation: true, 
						templateUrl: 'docs/dynamic/manage/manage-companies/modalCompany.html', 
						controller: 'modalCompanyController as modalCompanyController', 
						resolve: {
							company: function(){	return {};
							}, 
							formMode: function(){	return formMode;
							}, 
							fromSignup: function(){	return fromSignup;
							}, 
							modalHiddenFields: function(){	return null;
							}
							}
					}
					);
			modalInstance.result.then(companyUibModalResultCallback);
			
			function companyUibModalResultCallback(data){
				vm.company = data[0];
				
				modalInstance = $uibModal.open(
						{
							animation: true, 
							templateUrl: 'docs/dynamic/manage/manage-branches/modalBranch.html', 
							controller: 'modalBranchController as modalBranchController', 
							resolve: {
								branch: function(){	return {	companyName: vm.company.company_name	};
								}, 
								formMode: function(){	return formMode;
								}, 
								fromSignup: function(){	return fromSignup;
								}, 
								modalHiddenFields: function(){	return {	companyName: true	};
								}
								}
						}
						);
				modalInstance.result.then(branchUibModalResultCallback);
				
				function branchUibModalResultCallback(data){
					vm.branch = data[0];
					
					doAdminCascadedPosts();
					}
				
				function doAdminCascadedPosts(){
					var customerCompanyBranch = {
							customer_username: vm.customer.customer_username, 
							company_name: vm.company.company_name, 
							branch_name: vm.branch.branch_name
							};
					var transParams = {
							customer: vm.customer, 
							company: vm.company, 
							branch: vm.branch, 
							customerCompanyBranch: vm.customerCompanyBranch
							};
					
					customerCompanyBranchService.addCustomerCompanyBranch([transParams])
					.then(addCustomerCompanyBranchSuccessCallback)
					.catch(addCustomerCompanyBranchFailedCallback);
					
					function addCustomerCompanyBranchSuccessCallback(response){	//do something on success
					}
					
					function addCustomerCompanyBranchFailedCallback(responseError){	//do something on failure
					}
					}
				}
			}
		}
	
	function authAuthenticatedCallback(){
		const USER_KEY = 'User';
		
		if(!(null == localStorage.getItem(USER_KEY))){
			vm.user = localStorage.getItem(USER_KEY);
			vm.user = JSON.parse(vm.user);
			}
		
		$timeout(function(){	$state.go('manage');
		}
		);
		}
	
	$scope.$on(BROADCAST_MESSAGES.authAuthenticated, authAuthenticatedCallback);
	}