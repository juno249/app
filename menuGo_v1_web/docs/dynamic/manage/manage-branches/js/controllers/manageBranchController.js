angular
.module('starter')
.controller('manageBranchController', manageBranchController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
manageBranchController.$inject = [
	'API_BASE_URL', 
	'BRANCHES_DB_FIELDS', 
	'BROADCAST_MESSAGES', 
	'$compile', 
	'$rootScope', 
	'$scope', 
	'$stateParams', 
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
function manageBranchController(
		API_BASE_URL, 
		BRANCHES_DB_FIELDS, 
		BROADCAST_MESSAGES, 
		$compile, 
		$rootScope, 
		$scope, 
		$stateParams, 
		$uibModal, 
		DTColumnBuilder, 
		DTOptionsBuilder, 
		datatableService		
	){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.tableId = '#branchTable';
	vm.companyName = $stateParams['companyName'];
	vm.branch = {};
	vm.controllerObjName = 'manageBranchController';
	vm.dtColumns = undefined;
	vm.dtInstance = dtInstanceCallback;
	vm.dtOptions = undefined;
	vm.dtHiddenColumns = {}
	vm.dbColumnFields = BRANCHES_DB_FIELDS;
	vm.dbColumn2Colheader = {
			branch_id: 'Id', 
			branch_name: 'Name', 
			company_name: 'Company name', 
			branch_address_house_building: 'Address - house/building', 
			branch_address_street: 'Address - street', 
			branch_address_district: 'Address - district', 
			branch_address_city: 'Address - city', 
			branch_address_postalcode: 'Address - postalcode', 
			branch_address_country: 'Address - country', 
			branch_hotline: 'Hotline' 
	};
	vm.dbColumn2Dom = {
			branch_id: 'branchId', 
			branch_name: 'branchName', 
			company_name: 'companyName', 
			branch_address_house_building: 'branchAddressHouseBuilding', 
			branch_address_street: 'branchAddressStreet', 
			branch_address_district: 'branchAddressDistrict', 
			branch_address_city: 'branchAddressCity', 
			branch_address_postalcode: 'branchAddressPostalcode', 
			branch_address_country: 'branchAddressCountry', 
			branch_hotline: 'branchHotline' 
	};
	var user = undefined;
	if(!(null == localStorage.getItem('User'))){
		user = localStorage.getItem('User');
		user= JSON.parse(user);
	}
	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/branches';
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
	 * purpose: assigns branch on select
	 * ****************************** */
	function dtAssignOnSelect(
			data, 
			$event
		){
		var eSrc = $event.currentTarget; //div
		var eSrcParent = eSrc.parentElement; //td
		var eSrcParentParent = eSrcParent.parentElement; //tr
		var eSrcParentParentClass = eSrcParentParent.className;
		var branch = {};
		
		if(-1 == eSrcParentParentClass.indexOf('selected')){	
			branch = data;
			/* ******************************
			 * Broadcast (Start)
			 * ****************************** */
			$rootScope.$broadcast(
					BROADCAST_MESSAGES.toggleTable, 
					{
						companyName: vm.companyName, 
						branchName: branch.branch_name
					}
			);
			/* ******************************
			 * Broadcast (End)
			 * ****************************** */
		} else {	
			branch= {};
			/* ******************************
			 * Broadcast (Start)
			 * ****************************** */
			$rootScope.$broadcast(
					BROADCAST_MESSAGES.toggleTable, 
					{
						companyName: vm.companyName, 
						branchName: branch.branch_name
					}
			);
			/* ******************************
			 * Broadcast (End)
			 * ****************************** */
		}
		
		vm.branch = branch;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addBranch()
	 * purpose: launches branch uib modal w/form mode 'I'
	 * ****************************** */
	function addBranch(){
		var formMode = 'I';
		var fromSignup = false;
		var modalInstance = undefined;
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-branches/modalBranch.html',
			controller: 'modalBranchController as modalBranchController', 
			resolve: {
				branch: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				fromSignup: function(){	return fromSignup;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateBranch()
	 * purpose: launches branch uib modal w/form mode 'A'
	 * ****************************** */
	function updateBranch(){
		var branch = vm.branch;
		var formMode = 'A';
		var fromSignup = false;
		var modalInstance = undefined; 
		
		if(0 == Object.keys(branch).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-branches/modalBranch.html',
			controller: 'modalBranchController as modalBranchController', 
			resolve: {
				branch: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				fromSignup: function(){	return fromSignup;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteBranch()
	 * purpose: launches branch uib modal w/form mode 'D'
	 * ****************************** */
	function deleteBranch(){
		var branch = vm.branch;
		var formMode = 'D';
		var fromSignup = false;
		var modalInstance = undefined; 
		
		if(0 == Object.keys(branch).length){
			return;
		}	
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-branches/modalBranch.html',
			controller: 'modalBranchController as modalBranchController', 
			resolve: {
				branch: function(){	return doDbColumn2Dom(formMode);	}, 
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
		var companyName = vm.companyName;
		var dbColumn2Colheader = vm.dbColumn2Colheader;
		var dbColumn2ColheaderKeys = Object.keys(dbColumn2Colheader);
		var dbColumn2Dom = vm.dbColumn2Dom;
		var branch = vm.branch;
		var data = {};
		
		dbColumn2ColheaderKeys.forEach(function(dbColumn2ColheaderKey){
			var dataKey = dbColumn2Dom[dbColumn2ColheaderKey];
			if('I' == formMode){	data[dataKey] = undefined;
			} else {	data[dataKey] = branch[dbColumn2ColheaderKey];
			}
			
			data['companyName'] = companyName;
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
		var branch = vm.branch;
		
		dtInstance.reloadData();
		branch = {};
		
		vm.dtInstance = dtInstance;
		vm.branch = branch;
		
		if(0 == $('.dataTable tr.selected').length){	return;	}
		//dt-Instance re-draws, toggle table usermenus
		/* ******************************
		 * Broadcast (Start)
		 * ****************************** */
		$rootScope.$broadcast(
				BROADCAST_MESSAGES.toggleTable, 
				{
					companyName: vm.companyName, 
					branchName: branch.branch_name
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
				BROADCAST_MESSAGES.addBranch, 
				BROADCAST_MESSAGES.updateBranch, 
				BROADCAST_MESSAGES.deleteBranch
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
			var branchTableId = vm.tableId;
			var branchTableDom = $(branchTableId).DataTable();
			var dtHiddenColumns = vm.dtHiddenColumns;
			var dtHiddenColumnsKeys = Object.keys(dtHiddenColumns);
			
			dtHiddenColumnsKeys.forEach(function(dtHiddenColumnsKey){
				branchTableDom.column(dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
			})
		}
		
		vm.dtOptions = dtOptions;
		vm.dtColumns = dtColumns;
	}
	
	/* ******************************
	 * Broadcast Event Handlers (Start)
	 * ****************************** */
	$scope.$on(BROADCAST_MESSAGES.addBranch, addBranch);
	
	$scope.$on(BROADCAST_MESSAGES.updateBranch, updateBranch);

	$scope.$on(BROADCAST_MESSAGES.deleteBranch, deleteBranch);
	/* ******************************
	 * Broadcast Event Handlers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */