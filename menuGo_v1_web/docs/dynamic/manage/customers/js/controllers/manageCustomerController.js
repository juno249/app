angular
.module('starter')
.controller('manageCustomerController', manageCustomerController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
manageCustomerController.$inject = [
	'API_BASE_URL', 
	'BROADCAST_MESSAGE', 
	'CUSTOMERS_DB_FIELDS', 
	'$compile', 
	'$scope', 
	'$uibModal', 
	'DTColumnBuilder', 
	'DTOptionsBuilder', 
	'datatableService'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function manageCustomerController(
		API_BASE_URL, 
		BROADCAST_MESSAGE, 
		CUSTOMERS_DB_FIELDS, 
		$compile, 
		$scope, 
		$uibModal, 
		DTColumnBuilder, 
		DTOptionsBuilder, 
		datatableService
){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this; 
	vm.tableId = '#customerTable';
	vm.customer = {};
	vm.controllerObjName = 'manageCustomerController';
	vm.dtColumns = undefined;
	vm.dtInstance = dtInstanceCallback;
	vm.dtOptions = undefined;
	vm.dtHiddenColumns = {};
	vm.dbColumnFields = CUSTOMERS_DB_FIELDS;
	vm.dbColumn2Colheader = {
			customer_username: 'Username', 
			customer_password: 'Password', 
			customer_name_fname: 'First name', 
			customer_name_mname: 'Middle name', 
			customer_name_lname: 'Last name', 
			customer_role: 'Role', 
			customer_gender: 'Gender', 
			customer_address_house_building: 'Address - house/building', 
			customer_address_street: 'Address - street', 
			customer_address_district: 'Address - district', 
			customer_address_city: 'Address - city', 
			customer_address_postalcode: 'Address - postalcode', 
			customer_address_country: 'Address - country', 
			customer_mobile: 'Mobile', 
			customer_email: 'Email', 
			customer_birthday_month: 'Birthday - month', 
			customer_birthday_date: 'Birthday - date', 
			customer_birthday_year: 'Birthday - year'
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
	vm.restApiSource = API_BASE_URL + '/customers';
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: dtInstanceCallback()
	 * purpose: initializes dt-instance
	 * ****************************** */
	function dtInstanceCallback(dtInstance){
			vm.dtInstance = dtInstance;
	}

	/* ******************************
	 * Controller Binded Methods (Start)
	 * ****************************** */
	vm.dtAssignOnSelect = dtAssignOnSelect;
	/* ******************************
	 * Controller Binded Methods (End)
	 * ****************************** */
	
	
	/* ******************************
	 * Method Implementation
	 * method name: dtAssignOnSelect()
	 * purpose: assigns customer on select
	 * ****************************** */
	function dtAssignOnSelect(data, $event){
		var eSrc = $event.currentTarget; //div
		var eSrcParent = eSrc.parentElement; //td
		var eSrcParentParent = eSrcParent.parentElement; //tr
		var eSrcParentParentClass = eSrcParentParent.className;
		var customer = {};
		
		if(-1 == eSrcParentParentClass.indexOf('selected')){	customer = data;
		} else {	customer= {};
		}
		
		vm.customer = customer;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addCustomer()
	 * purpose: launches customer uib modal w/form mode 'I'
	 * ****************************** */
	function addCustomer(){
		var formMode = 'I';
		var fromSignup = false;
		var modalInstance = undefined;
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/customers/modalCustomer.html', 
			controller: 'modalCustomerController as modalCustomerController', 
			resolve: {
				customer: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				fromSignup: function(){	return fromSignup;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode); }
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateCustomer()
	 * purpose: launches customer uib modal w/form mode 'A'
	 * ****************************** */
	function updateCustomer(){
		var customer = vm.customer;
		var formMode = 'A';
		var fromSignup = false;
		var modalInstance = undefined;
		
		if(0 == Object.keys(customer).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/customers/modalCustomer.html', 
			controller: 'modalCustomerController as modalCustomerController', 
			resolve: {
				customer: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				fromSignup: function(){	return fromSignup;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteCustomer()
	 * purpose: launches customer uib modal w/form mode 'D'
	 * ****************************** */
	function deleteCustomer(){
		var customer = vm.customer;
		var formMode = 'D';
		var fromSignup = false;
		var modalInstance  = undefined;
		
		if(0 == Object.keys(customer).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/customers/modalCustomer.html', 
			controller: 'modalCustomerController as modalCustomerController', 
			resolve: {
				customer: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return 'D';	}, 
				fromSignup: function(){	return fromSignup;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doDbColumn2Dom()
	 * purpose: converts keys from dbColumn to dom
	 * ****************************** */
	function doDbColumn2Dom(formMode){
		var dbColumn2Colheader = vm.dbColumn2Colheader;
		var dbColumn2ColheaderKeys = Object.keys(dbColumn2Colheader);
		var dbColumn2Dom = vm.dbColumn2Dom;
		var customer = vm.customer;
		var data = {};
		
		dbColumn2ColheaderKeys.forEach(function(dbColumn2ColheaderKey){
			var dataKey = dbColumn2Dom[dbColumn2ColheaderKey];
			if('I' == formMode){	data[dataKey] = undefined;
			} else {	data[dataKey] = customer[dbColumn2ColheaderKey];
			}
		});
		
		return data;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: genModalHiddenFields()
	 * purpose: generates modalHiddenFields map
	 * ****************************** */
	function genModalHiddenFields(formMode){
		genDtHiddenColumns();
		
		var dbColumn2Dom = vm.dbColumn2Dom;
		var dtHiddenColumns = vm.dtHiddenColumns;
		var dtHiddenColumnsKeys = Object.keys(dtHiddenColumns);
		var modalHiddenFields = {};
		
		if('I' == formMode){
			return null;
		}
		
		dtHiddenColumnsKeys.forEach(function(dtHiddenColumnsKey){
			modalHiddenFields[dbColumn2Dom[dtHiddenColumnsKey]] = true;
		});
		
		return modalHiddenFields;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: uibModalClosedCallback()
	 * purpose: event handler for closed uibModal
	 * ****************************** */
	function uibModalClosedCallback(){
		var dtInstance = vm.dtInstance;
		var customer = vm.customer;
		
		dtInstance.reloadData();
		customer = {};
		
		vm.dtInstance = dtInstance;
		vm.customer = customer;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: genDtHiddenColumns()
	 * purpose: generates dtHiddenColumns map
	 * ****************************** */
	function genDtHiddenColumns(){
		var tableId = vm.tableId;
		var tableDt = $(tableId).dataTable();
		var dbColumn2Dom = vm.dbColumn2Dom;
		var dtHiddenColumns = {};

		$.each(tableDt.fnSettings().aoColumns, function(aoColumn){
			var aoColumnsRunner = tableDt.fnSettings().aoColumns[aoColumn];
			var aoColumnsRunnerMdata = aoColumnsRunner.mData;
			if(!(null == aoColumnsRunnerMdata)){
				if(false == aoColumnsRunner.bVisible){
					dtHiddenColumns[aoColumnsRunnerMdata] = true;
				}
			}
		})

		vm.dtHiddenColumns = dtHiddenColumns;
	}
	
	dtInitialize();
	
	/* ******************************
	 * Method Implementation
	 * method name: dtInitialize()
	 * purpose: initializes angular-data-tables plugin
	 * ****************************** */
	function dtInitialize(){
		var dbColumnFields = vm.dbColumnFields;
		var dbColumn2Colheader = vm.dbColumn2Colheader;
		var restApiSource = vm.restApiSource;
		var dtOptions = vm.dtOptions;
		var dtColumns = vm.dtColumns;
		
		datatableService.setDbColumnFields(dbColumnFields);
		datatableService.setDbColumn2Colheader(dbColumn2Colheader);
		datatableService.doDTInitOptions(
				DTOptionsBuilder, 
				restApiSource, 
				BROADCAST_MESSAGE.addCustomer, 
				BROADCAST_MESSAGE.updateCustomer, 
				BROADCAST_MESSAGE.deleteCustomer
		);
		datatableService.doDTInitColumns(
				DTColumnBuilder, vm
		);
		
		dtOptions = datatableService.getDtOptions();
		dtColumns = datatableService.getDtColumns();
		dtOptions
		.withOption('createdRow', createdRowCallback)
		.withOption('initComplete', initCompleteCallback);
		
		/* ******************************
		 * Method Implementation
		 * method name: createdRowFunction()
		 * purpose: callback for dt created-row
		 * ****************************** */
		function createdRowCallback(row){
			$compile(angular.element(row).contents())($scope);
		}
		
		/* ******************************
		 * Method Implementation
		 * method name: initCompleteFunction()
		 * purpose: callback for dt init-complete
		 * ****************************** */
		function initCompleteCallback(row){
			var customerTableId = vm.tableId;
			var customerTableDom = $(customerTableId).DataTable();
			var dtHiddenColumns = vm.dtHiddenColumns;
			var dtHiddenColumnsKeys = Object.keys(dtHiddenColumns);
			
			//assign column-visibility
			dtHiddenColumnsKeys.forEach(function(dtHiddenColumnsKey){
				customerTableDom.column(dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
			})
		}
		
		vm.dtOptions = dtOptions;
		vm.dtColumns = dtColumns;
	}
	
	/* ******************************
	 * Broadcast Event Handlers (Start)
	 * ****************************** */
	$scope.$on(BROADCAST_MESSAGE.addCustomer, addCustomer);
	
	$scope.$on(BROADCAST_MESSAGE.updateCustomer, updateCustomer);

	$scope.$on(BROADCAST_MESSAGE.deleteCustomer, deleteCustomer);
	/* ******************************
	 * Broadcast Event Handlers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */