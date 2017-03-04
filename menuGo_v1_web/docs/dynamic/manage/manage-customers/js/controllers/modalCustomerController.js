angular
.module('starter')
.controller('modalCustomerController', modalCustomerController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
modalCustomerController.$inject = [
	'USER_GENDERS', 
	'USER_ROLES', 
	'$uibModalInstance', 
	'$timeout', 
	'customerCompanyBranchService', 
	'customerService', 
	'customer', 
	'formMode', 
	'fromSignup', 
	'modalHiddenFields'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function modalCustomerController(
		USER_GENDERS, 
		USER_ROLES, 
		$uibModalInstance, 
		$timeout, 
		customerCompanyBranchService, 
		customerService, 
		customer, 
		formMode, 
		fromSignup, 
		modalHiddenFields
){
	/* ******************************
	 * Messages Constants (Start)
	 * ****************************** */
	const CUSTOMER_ADD_CATCH_MESSAGE = 'UNABLE TO ADD CUSTOMER, DB EXCEPTION ENCOUNTERED';
	const CUSTOMER_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE CUSTOMER, DB EXCEPTION ENCOUNTERED';
	const CUSTOMER_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE CUSTOMER, DATA IS EMPTY/UNCHANGED';
	const CUSTOMER_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE CUSTOMER, DB EXCEPTION ENCOUNTERED';
	/* ******************************
	 * Messages Constants (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.formId = '#modalCustomer';
	vm.formMode = formMode;
	vm.fromSignup = fromSignup;
	vm.customer = customer;
	vm.customerCapture = JSON.parse(JSON.stringify(customer));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			customerUsername: 'customer_username', 
			customerPassword: 'customer_password', 
			customerNameFname: 'customer_name_fname', 
			customerNameMname: 'customer_name_mname', 
			customerNameLname: 'customer_name_lname', 
			customerRole: 'customer_role', 
			customerGender: 'customer_gender', 
			customerAddressHouseBuilding: 'customer_address_house_building', 
			customerAddressStreet: 'customer_address_street', 
			customerAddressDistrict: 'customer_address_district',
			customerAddressCity: 'customer_address_city', 
			customerAddressPostalcode: 'customer_address_postalcode', 
			customerAddressCountry: 'customer_address_country', 
			customerMobile: 'customer_mobile', 
			customerEmail: 'customer_email', 
			customerBirthdayMonth: 'customer_birthday_month', 
			customerBirthdayDate: 'customer_birthday_date', 
			customerBirthdayYear: 'customer_birthday_year'
	}
	vm.dbColumn2Dom = {
			customer_username: 'customerUsername', 
			customer_password: 'customerPassword', 
			customer_name_fname: 'customerNameFname', 
			customer_name_mname: 'customerNameMname', 
			customer_name_lname: 'customerNameLname', 
			customer_role: 'customerRole', 
			customer_gender: 'customerGender', 
			customer_address_house_building: 'customerAddressHouseBuilding', 
			customer_address_street: 'customerAddressStreet', 
			customer_address_district: 'customerAddressDistrict',
			customer_address_city: 'customerAddressCity', 
			customer_address_postalcode: 'customerAddressPostalcode', 
			customer_address_country: 'customerAddressCountry', 
			customer_mobile: 'customerMobile', 
			customer_email: 'customerEmail', 
			customer_birthday_month: 'customerBirthdayMonth', 
			customer_birthday_date: 'customerBirthdayDate', 
			customer_birthday_year: 'customerBirthdayYear'
	}
	vm.dbColumn2DomIndex = {
			customer_username: 0, 
			customer_password: 1, 
			customer_name_fname: 2, 
			customer_name_mname: 3, 
			customer_name_lname: 4, 
			customer_role: 5, 
			customer_gender: 6, 
			customer_address_house_building: 7, 
			customer_address_street: 8, 
			customer_address_district: 9,
			customer_address_city: 10, 
			customer_address_postalcode: 11, 
			customer_address_country: 12, 
			customer_mobile: 13, 
			customer_email: 14
	}
	vm.customerRoleOptions = USER_ROLES;
	vm.customerGenderOptions = USER_GENDERS;
	vm.validationErr = {};
	vm.validationErrDB = undefined;
	vm.isValidationErrDBHidden = true;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.initBootstrapValidator = initBootstrapValidator;
	vm.initBootstrapDatepicker = initBootstrapDatepicker;
	vm.initDom = initDom;
	vm.doCancel = doCancel;
	/* ******************************
	 * Controller Binded Method (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: initBootstrapValidator()
	 * purpose: initializes bootstrap validator plugin
	 * ****************************** */
	function initBootstrapValidator(){
		var formId = vm.formId;
		$.fn.validator.Constructor.INPUT_SELECTOR = ':input:not(".ng-hide")'
		$(formId).validator();
		$(formId).validator().on('submit', doSubmit);
		
		$timeout(function(){
			$(formId).validator('update');
		})
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: initBootstrapDatepicker()
	 * purpose: initializes bootstrap datepicker plugin
	 * ****************************** */
	function initBootstrapDatepicker(){
		var customerBirthdayId = '#customerBirthday';
		$(customerBirthdayId).datepicker({
			onSelect: function(){
				var customer = vm.customer;
				var date = $(this).datepicker('getDate');
				var calendarMonths = [
					'Jan', 
					'Feb', 
					'Mar', 
					'Apr', 
					'May', 
					'Jun', 
					'Jul', 
					'Aug', 
					'Sep', 
					'Oct', 
					'Nov', 
					'Dec'
				];
				
				customer.customerBirthdayMonth = calendarMonths[date.getMonth()];
				customer.customerBirthdayDate = date.getDate();
				customer.customerBirthdayYear = date.getFullYear();
				
				$timeout(function(){
					vm.customer = customer;
				})
			}
		});
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: initDom()
	 * purpose: initializes Dom object attributes
	 * ****************************** */
	function initDom(){
		var formMode = vm.formMode;
		/* ******************************
		 * Input Controls (Start)
		 * ****************************** */
		if('D' == formMode){
			$('#modalCustomerContainer input').prop('disabled', true);
			$('#modalCustomerContainer textarea').prop('disabled', true);
			$('#modalCustomerContainer select').prop('disabled', true);
		}
		/* ******************************
		 * Input Controls (End)
		 * ****************************** */
		
		/* ******************************
		 * Hide Password on 'A' and 'D' (Start)
		 * ****************************** */
		if(!('I' == formMode)){
			var modalHiddenFields = vm.modalHiddenFields;
			
			modalHiddenFields.customerPassword = true;
			
			vm.modalHiddenFields = modalHiddenFields;
		}
		/* ******************************
		 * Hide Password on 'A' and 'D' (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doCancel()
	 * purpose: closes uib modal instance
	 * ****************************** */
	function doCancel(){
		$uibModalInstance.close();
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doSubmit()
	 * purpose: handles form-submission (insert/amend)
	 * ****************************** */
	function doSubmit(e){
		var customer = undefined;
		var customerCompanyBranch = undefined;
		var user = localStorage.getItem('User');
		user = JSON.parse(user);
		var formMode = vm.formMode;
		var fromSignup = vm.fromSignup;
		var modalCustomerContainerId = '#modalCustomerContainer';
		var modalCustomerContainer = $(modalCustomerContainerId);
		var data = [];
		
		hideBootstrapAlert();
		
		data.push(doDom2DbColumn(formMode));
		customer = data[0];
		customerCompanyBranch = {
				customer_username: customer.customer_username, 
				company_name: user.company, 
				branch_name: user.branch
		};
		
		showBootstrapLoader(modalCustomerContainer);
		
		if('I' == formMode){
			var transParams = undefined;
			
			if(fromSignup){
				customerService.addCustomerValidate(data)
				.then(addCustomerValidateSuccessCallback)
				.catch(addCustomerValidateFailedCallback);
				
				/* ******************************
				 * Callback Implementations (Start)
				 * ****************************** */
				function addCustomerValidateSuccessCallback(response){
					hideBootstrapLoader(modalCustomerContainer);
					$uibModalInstance.close(data);
				}
				
				function addCustomerValidateFailedCallback(responseError){
					hideBootstrapLoader(modalCustomerContainer);
					genValidationErrorFromResponse(responseError);
				}
				/* ******************************
				 * Callback Implementations (End)
				 * ****************************** */
				return;
			}
			
			transParams = {
					customer: customer, 
					company: null, 
					branch: null, 
					customerCompanyBranch : customerCompanyBranch
			};
			customerCompanyBranchService.addCustomerCompanyBranchTransaction([transParams])
			.then(addCustomerCompanyBranchTransactionSuccessCallback)
			.catch(addCustomerCompanyBranchTransactionFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function addCustomerCompanyBranchTransactionSuccessCallback(response){
				hideBootstrapLoader(modalCustomerContainer);
				$uibModalInstance.close();
			}
			
			function addCustomerCompanyBranchTransactionFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalCustomerContainer);
				try{
					JSON.parse(statusText);
					genValidationErrorFromResponse(responseError);
				} catch(e){	showBootstrapAlert(CUSTOMER_ADD_CATCH_MESSAGE);
				}
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
			
		} else if('A' == formMode){
			var customerCapture = vm.customerCapture;
			var customerUsername = customerCapture.customerUsername;
			
			discardModalHiddenFields();
			discardModalUnchangedFields();
			
			if(0 == Object.keys(data[0]).length){
				hideBootstrapLoader(modalCustomerContainer);
				showBootstrapAlert(CUSTOMER_UPDATE_CUSTOM_ERR_MESSAGE);
				return;
			}
			
			customerService.setCustomerUsername(customerUsername);
			customerService.updateCustomer(data)
			.then(updateCustomerSuccessCallback)
			.catch(updateCustomerFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function updateCustomerSuccessCallback(response){
				hideBootstrapLoader(modalCustomerContainer);
				$uibModalInstance.close();
			}
			
			function updateCustomerFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalCustomerContainer);
				try{
					JSON.parse(statusText);
					genValidationErrorFromResponse(responseError);
				} catch(e){	showBootstrapAlert(CUSTOMER_UPDATE_CATCH_MESSAGE);
				}
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
			
			/* ******************************
			 * Method Implementation
			 * method name: discardModalHiddenFields()
			 * purpose: discards hidden modal fields from Json-format data
			 * ****************************** */
			function discardModalHiddenFields(){
				var dataCopy = data[0];
				var modalHiddenFields = vm.modalHiddenFields;
				var modalHiddenFieldsKeys = Object.keys(modalHiddenFields);
				var dom2DbColumn = vm.dom2DbColumn;
				
				modalHiddenFieldsKeys.forEach(function(modalHiddenFieldsKey){
					delete dataCopy[dom2DbColumn[modalHiddenFieldsKey]];
				});
				
				data[0] = dataCopy;
			}
			
			/* ******************************
			 * Method Implementation
			 * method name: discardModalUnchangedFields()
			 * purpose: discards unchanged modal fields from Json-format data
			 * ****************************** */
			function discardModalUnchangedFields(){
				var dataCopy = data[0];
				var dataCopyKeys = Object.keys(dataCopy);
				var customerCapture = vm.customerCapture;
				var dbColumn2Dom = vm.dbColumn2Dom;
				
				dataCopyKeys.forEach(function(dataCopyKey){
					var dataCopyValue = dataCopy[dataCopyKey];
					var customerCaptureValue = customerCapture[dbColumn2Dom[dataCopyKey]];
					
					if(dataCopyValue == customerCaptureValue){	delete dataCopy[dataCopyKey];
					}
				});
				
				data[0] = dataCopy;
			}
		} else if('D' == formMode){
			var customer = vm.customer;
			var customerUsername = customer.customerUsername;
			customerService.setCustomerUsername(customerUsername);
			customerService.deleteCustomer()
			.then(deleteCustomerSuccessCallback)
			.catch(deleteCustomerFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function deleteCustomerSuccessCallback(response){
				hideBootstrapLoader(modalCustomerContainer);
				$uibModalInstance.close();
			}
			
			function deleteCustomerFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				try{
					JSON.parse(statusText);
					genValidationErrorFromResponse(responseError);
				} catch(e){	showBootstrapAlert(CUSTOMER_DELETE_CATCH_MESSAGE)
				}
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
		}
		
		validationErr = {};
		validationErrDB = undefined;
		
		vm.validationErr = validationErr;
		vm.validationErrDB = validationErrDB;
	}

	/* ******************************
	 * Method Implementation
	 * method name: doDom2DbColumn()
	 * purpose: converts dom to dbcolumn (server-posting)
	 * ****************************** */
	function doDom2DbColumn(formMode){
		var customer = vm.customer;
		var customerKeys = Object.keys(customer);
		var dom2DbColumn = vm.dom2DbColumn;
		var data = {};
		
		customerKeys.forEach(function(customerKey){
			var dbField = dom2DbColumn[customerKey];
			if(
					!(null == dbField) && 
					!(undefined == dbField)
			){
				data[dbField] = customer[customerKey];
			}
		});
		
		return data;
	}
		
	/* ******************************
	 * Method Implementation
	 * method name: genValidationErrorFromResponse()
	 * purpose: generates validation error from server response 
	 * ****************************** */
	function genValidationErrorFromResponse(responseError){
		/* ******************************
		 * DOM classes (start)
		 * ****************************** */
		var formGroupClass = '.form-group';
		var hasErrorClass = 'has-error';
		/* ******************************
		 * DOM classes (end)
		 * ****************************** */
		var dbColumn2Dom = vm.dbColumn2Dom;
		var validationErr = vm.validationErr;
		var statusText = responseError.statusText;
		var statusTextObj = JSON.parse(statusText);
		var statusTextKeys = Object.keys(statusTextObj);
			
		statusTextKeys.forEach(function(statusTextKey){
			var arrIndex = statusTextKey.split('.')[0];
			var dbColumnName = statusTextKey.split('.')[1];
			var dbColumnIndex = undefined;
			var errorMessage = undefined;
			var dbColPassIndex = 1;
			var domOffset = 1;
			
			if(statusTextKey == (arrIndex + '.' + dbColumnName)){
				dbColumnIndex = getDbColumnIndex(dbColumnName);
				errorMessage = statusTextObj[statusTextKey][0];
				errorMessage = errorMessage.replace(statusTextKey, dbColumn2Dom[dbColumnName]);
				validationErr[parseInt(dbColumnIndex)] = errorMessage;
					
				/* ******************************
				 * JQuery DOM update (start)
				 * ****************************** */
				var formGroups = $(formGroupClass);
				if(dbColPassIndex < dbColumnIndex){	domOffset = 2;
				} else {	domOffset = 1;
				}
				formGroups.eq(parseInt(dbColumnIndex+domOffset)).addClass(hasErrorClass);
				/* ******************************
				 * JQuery DOM update (end)
				 * ****************************** */
			}
		});
			
		/* ******************************
		 * Method Implementation
		 * method name: getDbColumnIndex()
		 * purpose: gets db column index from db column name
		 * ****************************** */
		function getDbColumnIndex(dbColumnName){
			var dbColumn2DomIndex = vm.dbColumn2DomIndex;
			
			return dbColumn2DomIndex[dbColumnName];
		}
		
		vm.validationErr = validationErr;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: showBootstrapLoader()
	 * purpose: shows bootstrap loader
	 * ****************************** */
	function showBootstrapLoader(target){
		$(target).LoadingOverlay('show');
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: hideBootstrapLoader()
	 * purpose: hides bootstrap loader
	 * ****************************** */
	function hideBootstrapLoader(target){
		$(target).LoadingOverlay('hide');
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: showBootstrapAlert()
	 * purpose: shows bootstrap alert
	 * ****************************** */
	function showBootstrapAlert(arg_validationErrDB){
		var validationErrDB = vm.validationErrDB;
		var isValidationErrDBHidden = vm.isValidationErrDBHidden;
		
		validationErrDB = arg_validationErrDB;
		isValidationErrDBHidden = false;
		
		vm.validationErrDB = validationErrDB;
		vm.isValidationErrDBHidden = isValidationErrDBHidden;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: hideBootstrapAlert()
	 * purpose: hides bootstrap alert
	 * ****************************** */
	function hideBootstrapAlert(){
		var validationErrDB = vm.validationErrDB;
		var isValidationErrDBHidden = vm.isValidationErrDBHidden;
		
		validationErrDB = undefined;
		isValidationErrDBHidden = true;
		
		vm.validationErrDB = validationErrDB;
		vm.isValidationErrDBHidden = isValidationErrDBHidden;
	}
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */