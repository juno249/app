angular
.module('starter')
.controller(
		'manageTableController', 
		manageTableController
		);

manageTableController.$inject = [
                                 'API_BASE_URL', 
                                 'BROADCAST_MESSAGES', 
                                 'TABLES_DB_FIELDS', 
                                 '$compile', 
                                 '$scope', 
                                 '$stateParams', 
                                 '$uibModal', 
                                 'DTColumnBuilder', 
                                 'DTOptionsBuilder', 
                                 'datatableService'
                                 ];

function manageTableController(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		TABLES_DB_FIELDS, 
		$compile, 
		$scope, 
		$stateParams, 
		$uibModal, 
		DTColumnBuilder, 
		DTOptionsBuilder, 
		datatableService
		){
	const DOM_TABLE_TABLE = '#tableTable';
	const USER_KEY = 'User';
	
	var vm = this;
	vm.tableId = '#tableTable';
	vm.companyName = $stateParams['companyName'];
	vm.branchName = $stateParams['branchName'];
	vm.table =  {};
	vm.controllerObjName = 'manageTableController';
	vm.dtInstance = dtInstanceCallback;
	vm.dtHiddenColumns = {};
	vm.dbColumnFields = TABLES_DB_FIELDS;
	vm.dbColumn2Colheader = {
			table_id: 'Id', 
			table_number: 'Number', 
			branch_id: 'Branch id', 
			table_capacity: 'Capacity', 
			table_status: 'Status', 
			table_status_change_timestamp: 'Status change timestamp', 
			last_change_timestamp: 'Last change timestamp'
				};
	vm.dbColumn2Dom = {
			table_id: 'tableId', 
			table_number: 'tableNumber', 
			branch_id: 'branchId', 
			table_capacity: 'tableCapacity', 
			table_status: 'tableStatus'
				};
	
	if(!(null == localStorage.getItem(USER_KEY))){
		vm.user = localStorage.getItem(USER_KEY);
		vm.user= JSON.parse(vm.user);
		}
	
	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/branches/' + vm.branchName + '/tables';
	
	function dtInstanceCallback(dtInstance){	vm.dtInstance = dtInstance;
	}
	
	//controller_method
	vm.dtAssignOnSelect = dtAssignOnSelect;
	
	function dtAssignOnSelect(
			data, 
			$event
			){
		var eSrc = $event.currentTarget.parentElement.parentElement;
		var eClassname = eSrc.className;
		
		if(-1 == eClassname.indexOf('selected')){	vm.table = data;
		} else {	vm.table= {};
		}
		}
	
	function addTable(){
		var formMode = 'I';
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-tables/modalTable.html', 
					controller: 'modalTableController as modalTableController', 
					resolve: {
						table: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed.then(uibModalClosedCallback);
		}
	
	function updateTable(){
		var formMode = 'A';
		
		if(0 == Object.keys(vm.table).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-tables/modalTable.html', 
					controller: 'modalTableController as modalTableController', 
					resolve: {
						table: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed.then(uibModalClosedCallback);
		}
	
	function deleteTable(){
		var formMode = 'D';
		
		if(0 == Object.keys(vm.table).length){	return;
		}
		
		modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-tables/modalTable.html', 
					controller: 'modalTableController as modalTableController', 
					resolve: {
						table: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed.then(uibModalClosedCallback);
		}
	
	function doDbColumn2Dom(formMode){
		var data = {};
		
		Object.keys(vm.dbColumn2Colheader).forEach(
				function(dbColumn2ColheaderKey){
					var dataKey = vm.dbColumn2Dom[dbColumn2ColheaderKey];
					
					if('I' == formMode){	data[dataKey] = undefined;
					} else {	data[dataKey] = vm.table[dbColumn2ColheaderKey];
					}
					
					data['companyName'] = vm.companyName;
					data['branchName'] = vm.branchName;
					}
				);
		
		return data;
		}
	
	function genModalHiddenFields(formMode){
		var modalHiddenFields = {};
		
		genDtHiddenColumns();
		
		if('I' == formMode){	return null;
		}
		
		Object.keys(vm.dtHiddenColumns).forEach(
				function(dtHiddenColumnsKey){	modalHiddenFields[vm.dbColumn2Dom[dtHiddenColumnsKey]] = true;
				}
				);
		
		return modalHiddenFields;
		}
	
	function uibModalClosedCallback(){
		vm.dtInstance.reloadData();
		vm.table = {};
		}
	
	function genDtHiddenColumns(){
		var tableDt = $(DOM_TABLE_TABLE).dataTable();
		vm.dtHiddenColumns = {};
		
		$.each(
				tableDt.fnSettings().aoColumns, 
				function(aoColumn){
					var aoColumnsRunner = tableDt.fnSettings().aoColumns[aoColumn];
					var aoColumnsRunnerMdata = aoColumnsRunner.mData;
					
					if(!(null == aoColumnsRunnerMdata)){
						if(false == aoColumnsRunner.bVisible){	vm.dtHiddenColumns[aoColumnsRunnerMdata] = true;
						}
						}
					}
				);
		}
	
	dtInitialize();
	
	function dtInitialize(){
		datatableService.setDbColumnFields(vm.dbColumnFields);
		datatableService.setDbColumn2Colheader(vm.dbColumn2Colheader);
		datatableService.doDTInitOptions(
				DTOptionsBuilder, 
				vm.restApiSource, 
				BROADCAST_MESSAGES.addTable, 
				BROADCAST_MESSAGES.updateTable, 
				BROADCAST_MESSAGES.deleteTable
				);
		datatableService.doDTInitColumns(
				DTColumnBuilder, 
				vm
				);
		
		vm.dtOptions = datatableService.getDtOptions();
		vm.dtColumns = datatableService.getDtColumns();
		vm.dtOptions
		.withOption(
				'createdRow', 
				createdRowCallback
				)
				.withOption(
						'initComplete', 
						initCompleteCallback
						);
		
		function createdRowCallback(row){	$compile(angular.element(row).contents())($scope);
		}
		
		function initCompleteCallback(row){
			var tableTableDom = $(DOM_TABLE_TABLE).DataTable();
			
			Object.keys(vm.dtHiddenColumns).forEach(
					function(dtHiddenColumnsKey){	tableTableDom.column(vm.dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
					}
					);
			}
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.addTable, 
			addTable
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.updateTable, 
			updateTable
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.deleteTable, 
			deleteTable
			);
	}