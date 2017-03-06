angular
.module('starter')
.controller('manageCompanyController', manageCompanyController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
manageCompanyController.$inject = [
	'API_BASE_URL', 
	'BROADCAST_MESSAGE', 
	'COMPANIES_DB_FIELDS', 
	'$compile', 
	'$localStorage', 
	'$rootScope', 
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
function manageCompanyController(	
		API_BASE_URL, 
		BROADCAST_MESSAGE, 
		COMPANIES_DB_FIELDS, 
		$compile, 
		$localStorage, 
		$rootScope, 
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
	vm.tableId = '#companyTable';
	vm.company = {};
	vm.controllerObjName = 'manageCompanyController';
	vm.dtColumns = undefined;
	vm.dtInstance = dtInstanceCallback;
	vm.dtOptions = undefined;
	vm.dtHiddenColumns = {};
	vm.dbColumnFields = COMPANIES_DB_FIELDS;
	vm.dbColumn2Colheader = {
			company_name: 'Name', 
			company_desc: 'Description', 
			company_category: 'Category', 
			company_logo: 'Logo'
	}
	vm.dbColumn2Dom = {
			company_name: 'companyName', 
			company_desc: 'companyDesc', 
			company_category: 'companyCategory', 
			company_logo: 'companyLogo'
	}
	var user = localStorage.getItem('User');
	user = JSON.parse(user);
	vm.restApiSource = API_BASE_URL + '/companies/customers/' + user.username;
	vm.isBranchThumbnailDisabled = true;
	vm.isMenuThumbnailDisabled = true;
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
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.dtAssignOnSelect = dtAssignOnSelect;
	/* ******************************
	 * Controller Binded Method (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: dtAssignOnSelect()
	 * purpose: assigns company on select
	 * ****************************** */
	function dtAssignOnSelect(data, $event){
		var eSrc = $event.currentTarget; //div
		var eSrcParent = eSrc.parentElement; //td
		var eSrcParentParent = eSrcParent.parentElement; //tr
		var eSrcParentParentClass = eSrcParentParent.className;
		var company = {};
		
		if(-1 == eSrcParentParentClass.indexOf('selected')){	
			company = data;
			/* ******************************
			 * Broadcast (Start)
			 * ****************************** */
			$rootScope.$broadcast(
					BROADCAST_MESSAGE.toggleBranch, 
					{	
						companyName: company.company_name
					}
			);
			$rootScope.$broadcast(
					BROADCAST_MESSAGE.toggleMenu, 
					{
						companyName: company.company_name
					}
			);
			/* ******************************
			 * Broadcast (End)
			 * ****************************** */
		} else {	
			company = {};
			/* ******************************
			 * Broadcast (Start)
			 * ****************************** */
			$rootScope.$broadcast(
					BROADCAST_MESSAGE.toggleBranch, 
					{	
						companyName: company.company_name
					}
			);
			$rootScope.$broadcast(
					BROADCAST_MESSAGE.toggleMenu, 
					{	
						companyName: company.company_name
					}
			);
			/* ******************************
			 * Broadcast (End)
			 * ****************************** */
		}
		
		vm.company = company;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addCompany()
	 * purpose: launches company uib modal w/form mode 'I'
	 * ****************************** */
	function addCompany(){
		var formMode = 'I';
		var fromSignup = false;
		var modalInstance = undefined;
			
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-companies/modalCompany.html', 
			controller: 'modalCompanyController as modalCompanyController', 
			resolve: {
				company: function(){	return doDbColumn2Dom(formMode); }, 
				formMode: function(){	return formMode;	}, 
				fromSignup: function(){	return fromSignup;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateCompany()
	 * purpose: launches company uib modal w/form mode 'A'
	 * ****************************** */
	function updateCompany(){
		var company = vm.company;
		var formMode = 'A';
		var fromSignup = false;
		var modalInstance = undefined;

		if(0 == Object.keys(company).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-companies/modalCompany.html', 
			controller: 'modalCompanyController as modalCompanyController', 
			resolve: {
				company: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				fromSignup: function(){	return fromSignup;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteCompany()
	 * purpose: launches company uib modal w/form mode 'D'
	 * ****************************** */
	function deleteCompany(){
		var company = vm.company;
		var formMode = 'D';
		var fromSignup = false;
		var modalInstance = undefined;
		
		if(0 == Object.keys(company).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-companies/modalCompany.html', 
			controller: 'modalCompanyController as modalCompanyController', 
			resolve: {
				company: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
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
		var company = vm.company;
		var data = {};
		
		dbColumn2ColheaderKeys.forEach(function(dbColumn2ColheaderKey){
			var dataKey = dbColumn2Dom[dbColumn2ColheaderKey];
			if('I' == formMode){	data[dataKey] = undefined;
			} else {	data[dataKey] = company[dbColumn2ColheaderKey];
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
		var company = vm.company;
		var formMode = vm.formMode;
		
		dtInstance.reloadData();
		company = {};
		
		vm.dtInstance = dtInstance;
		vm.company = company;
		
		if(0 == $('.dataTable tr.selected').length){	return;	}
		//dt-Instance re-draws, toggle branch & menu usermenus
		/* ******************************
		 * Broadcast (Start)
		 * ****************************** */
		$rootScope.$broadcast(
				BROADCAST_MESSAGE.toggleBranch, 
				{	
					companyName: company.company_name
				}
		);
		$rootScope.$broadcast(
				BROADCAST_MESSAGE.toggleMenu, 
				{	
					companyName: company.company_name
				}
		);
		/* ******************************
		 * Broadcast (End)
		 * ****************************** */
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
				BROADCAST_MESSAGE.addCompany, 
				BROADCAST_MESSAGE.updateCompany, 
				BROADCAST_MESSAGE.deleteCompany
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
			var companyTableId = vm.tableId;
			var companyTableDom = $(companyTableId).DataTable();
			var dtHiddenColumns = vm.dtHiddenColumns;
			var dtHiddenColumnsKeys = Object.keys(dtHiddenColumns);
			
			dtHiddenColumnsKeys.forEach(function(dtHiddenColumnsKey){
				companyTableDom.column(dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
			})
		}
		
		vm.dtOptions = dtOptions;
		vm.dtColumns = dtColumns;
	}
	
	/* ******************************
	 * Broadcast Event Handlers (Start)
	 * ****************************** */
	$scope.$on(BROADCAST_MESSAGE.addCompany, addCompany);
	
	$scope.$on(BROADCAST_MESSAGE.updateCompany, updateCompany);
	
	$scope.$on(BROADCAST_MESSAGE.deleteCompany, deleteCompany);
	/* ******************************
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */