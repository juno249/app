angular
.module('starter')
.controller('bannerController', bannerController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
bannerController.$inject = [
	'USER_ROLES', 
	'$localStorage', 
	'$state', 
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
		USER_ROLES, 
		$localStorage, 
		$state, 
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
	vm.isAuthenticated = false;
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
			templateUrl: 'docs/dynamic/manage/customers/modalCustomer.html', 
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
				templateUrl: 'docs/dynamic/manage/companies/modalCompany.html', 
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
					templateUrl: 'docs/dynamic/manage/branches/modalBranch.html',
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
					//customer
					customerService.addCustomer([customer])
					.then(addCustomerSuccessCallback)
					.catch(addCustomerFailedCallback);
					
					/* ******************************
					 * Callback Implementations (Start)
					 * ****************************** */
					function addCustomerSuccessCallback(response){
						//company
						companyService.addCompany([company])
						.then(addCompanySuccessCallback)
						.catch(addCompanyFailedCallback);
						
						/* ******************************
						 * Callback Implementations (Start)
						 * ****************************** */
						function addCompanySuccessCallback(response){
							//branch
							branchService.setCompanyName(company.company_name);
							branchService.addBranch([branch])
							.then(addBranchSuccessCallback)
							.catch(addBranchFailedCallback);
							
							/* ******************************
							 * Callback Implementations (Start)
							 * ****************************** */
							function addBranchSuccessCallback(response){
								//customer_company_branch
								customerCompanyBranch = {
									customer_username: customer.customer_username, 
									company_name: company.company_name, 
									branch_name: branch.branch_name
								};
								customerCompanyBranchService.addCustomerCompanyBranch([customerCompanyBranch])
								.then(addCustomerCompanyBranchSuccessCallback)
								.catch(addCustomerCompanyBranchFailedCallback);
								
								/* ******************************
								 * Callback Implementations (Start)
								 * ****************************** */
								function addCustomerCompanyBranchSuccessCallback(response){
									//do somthing on success
								}
								
								function addCustomerCompanyBranchFailedCallback(responseError){
									//do something on failure
								}
								/* ******************************
								 * Callback Implementations (End)
								 * ****************************** */
							}
							
							function addBranchFailedCallback(responseError){
								//do something on failure
							}
							/* ******************************
							 * Callback Implementations (End)
							 * ****************************** */
						}
						
						function addCompanyFailedCallback(responseError){
							//do something on failure
						}
						/* ******************************
						 * Callback Implementations (End)
						 * ****************************** */
					}
					
					function addCustomerFailedCallback(responseError){
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
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */