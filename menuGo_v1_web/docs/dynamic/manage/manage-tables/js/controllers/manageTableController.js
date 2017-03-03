angular
.module('starter')
.controller('manageTableController', manageTableController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
manageTableController.$inject = [
	'API_BASE_URL', 
	'BROADCAST_MESSAGE', 
	'TABLES_DB_FIELDS', 
	'$compile', 
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
function manageTableController(
		API_BASE_URL, 
		BROADCAST_MESSAGE, 
		TABLES_DB_FIELDS, 
		$compile, 
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
	vm.tableId = '#tableTable';
	vm.companyName = $stateParams['companyName'];
	vm.branchName = $stateParams['branchName'];
	vm.table =  {};
	vm.controllerObjName = 'manageTableController';
	vm.dtColumns = undefined;
	vm.dtInstance = dtInstanceCallback;
	vm.dtOptions = undefined;
	vm.dtHiddenColumns = {
	}
	vm.dbColumnFields = TABLES_DB_FIELDS;
	vm.dbColumn2Colheader = {
			table_id: 'Id', 
			table_number: 'Number', 
			branch_id: 'Branch id', 
			table_capacity: 'Capacity', 
			table_status: 'Status'
	};
	vm.dbColumn2Dom = {
			table_id: 'tableId', 
			table_number: 'tableNumber', 
			branch_id: 'branchId', 
			table_capacity: 'tableCapacity', 
			table_status: 'tableStatus'
	};
	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/branches/' + vm.branchName + '/tables';
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
	 * purpose: assigns table on select
	 * ****************************** */
	function dtAssignOnSelect(data, $event){
		var eSrc = $event.currentTarget; //div
		var eSrcParent = eSrc.parentElement; //td
		var eSrcParentParent = eSrcParent.parentElement; //tr
		var eSrcParentParentClass = eSrcParentParent.className;
		var table = {};
		
		if(-1 == eSrcParentParentClass.indexOf('selected')){	table = data;
		} else {	table= {};
		}
		
		vm.table = table;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addTable()
	 * purpose: launches table uib modal w/form mode 'I'
	 * ****************************** */
	function addTable(){
		var formMode = 'I';
		var modalInstance = undefined;
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-tables/modalTable.html', 
			controller: 'modalTableController as modalTableController', 
			resolve: {
				table: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateTable()
	 * purpose: launches table uib modal w/form mode 'A'
	 * ****************************** */
	function updateTable(){
		var table = vm.table;
		var formMode = 'A';
		var modalInstance = undefined;
		
		if(0 == Object.keys(table).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-tables/modalTable.html', 
			controller: 'modalTableController as modalTableController', 
			resolve: {
				table: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteTable()
	 * purpose: launches table uib modal w/form mode 'D'
	 * ****************************** */
	function deleteTable(){
		var table = vm.table;
		var formMode = 'D';
		var modalInstance = undefined;
		
		if(0 == Object.keys(table).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-tables/modalTable.html', 
			controller: 'modalTableController as modalTableController', 
			resolve: {
				table: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
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
		genModalHiddenFields();
		
		var companyName  = vm.companyName;
		var branchName = vm.branchName;
		var dbColumn2Colheader = vm.dbColumn2Colheader;
		var dbColumn2ColheaderKeys = Object.keys(dbColumn2Colheader);
		var dbColumn2Dom = vm.dbColumn2Dom;
		var table = vm.table;
		var data = {};
		
		dbColumn2ColheaderKeys.forEach(function(dbColumn2ColheaderKey){
			var dataKey = dbColumn2Dom[dbColumn2ColheaderKey];
			if('I' == formMode){	data[dataKey] = undefined;
			} else {	data[dataKey] = table[dbColumn2ColheaderKey];
			}
			
			data['companyName'] = companyName;
			data['branchName'] = branchName;
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
		var table = vm.table;
		
		dtInstance.reloadData();
		table = {};
		
		vm.dtInstance = dtInstance;
		vm.table = table;
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
				BROADCAST_MESSAGE.addTable, 
				BROADCAST_MESSAGE.updateTable, 
				BROADCAST_MESSAGE.deleteTable
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
			var tableTableId = vm.tableId;
			var tableTableDom = $(tableTableId).DataTable();
			var dtHiddenColumns = vm.dtHiddenColumns;
			var dtHiddenColumnsKeys = Object.keys(dtHiddenColumns);
			
			dtHiddenColumnsKeys.forEach(function(dtHiddenColumnsKey){
				tableTableDom.column(dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
			})
		}
		
		vm.dtOptions = dtOptions;
		vm.dtColumns = dtColumns;
	}
	
	/* ******************************
	 * Broadcast Event Handlers (Start)
	 * ****************************** */
	$scope.$on(BROADCAST_MESSAGE.addTable, addTable);
	
	$scope.$on(BROADCAST_MESSAGE.updateTable, updateTable);

	$scope.$on(BROADCAST_MESSAGE.deleteTable, deleteTable);
	/* ******************************
	 * Broadcast Event Handlers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */