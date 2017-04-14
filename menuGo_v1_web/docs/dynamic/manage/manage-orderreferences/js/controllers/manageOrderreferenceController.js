angular
.module('starter')
.controller(
	'manageOrderreferenceController', 
	manageOrderreferenceController
	);

manageOrderreferenceController.$inject = [
                                          'API_BASE_URL', 
                                          'BROADCAST_MESSAGES', 
                                          'ORDERREFERENCES_DB_FIELDS', 
                                          '$compile', 
                                          '$scope', 
                                          '$stateParams', 
                                          '$uibModal', 
                                          'DTOptionsBuilder', 
                                          'DTColumnBuilder', 
                                          'datatableService'
                                          ];

function manageOrderreferenceController(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		ORDERREFERENCES_DB_FIELDS, 
		$compile, 
		$scope, 
		$stateParams, 
		$uibModal, 
		DTOptionsBuilder, 
		DTColumnBuilder, 
		datatableService
		){
	const DOM_ORDERREFERENCE_TABLE = '#orderreferenceTable';
	const USER_KEY = 'User';
	
	var vm = this;
	vm.companyName = $stateParams['companyName'];
	vm.branchName = $stateParams['branchName'];
	vm.tableNumber = $stateParams['tableNumber'];
	vm.orderreference = {};
	vm.controllerObjName = 'manageOrderreferenceController';
	vm.dtInstance = dtInstanceCallback;
	vm.dtHiddenColumns = {};
	vm.dbColumnFields = ORDERREFERENCES_DB_FIELDS;
	vm.dbColumn2Colheader = {
			orderreference_id: 'Id', 
			orderreference_code: 'Code', 
			customer_username: 'Customer username', 
			table_id: 'Table Id', 
			orderreference_status: 'Status', 
			orderreference_status_change_timestamp: 'Status change timestamp', 
			last_change_timestamp: 'Last change timestamp'
				};
	vm.dbColumn2Dom = {
			orderreference_id: 'orderreferenceId', 
			orderreference_code: 'orderreferenceCode', 
			customer_username: 'customerUsername', 
			table_id: 'tableId', 
			orderreference_status: 'orderreferenceStatus'
				};
	
	if(!(null == localStorage.getItem(USER_KEY))){
		vm.user = localStorage.getItem(USER_KEY);
		vm.user = JSON.parse(vm.user);
		}
	
	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/branches/' + vm.branchName + '/tables/' + vm.tableNumber + '/orderreferences';
	
	//controller_method
	vm.dtAssignOnSelect = dtAssignOnSelect;
	
	function dtAssignOnSelect(
			data, 
			$event
			){
		var eSrc = $event.currentTarget.parentElement.parentElement;
		var eClassname = eSrc.className;
		
		if(-1 == eClassname.indexOf('selected')){	vm.orderreference = data;
		} else {	vm.orderreference = {};
		}
		}
	
	function addOrderreference(){
		var formMode = 'I';
		
		modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-orderreferences/modalOrderreference.html', 
					controller: 'modalOrderreferenceController as modalOrderreferenceController', 
					resolve: {
						orderreference: function(){	return doDbColumn2Dom(formMode);
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
	
	function updateOrderreference(){
		var formMode = 'A';
		
		if(0 == Object.keys(vm.orderreference).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-orderreferences/modalOrderreference.html', 
					controller: 'modalOrderreferenceController as modalOrderreferenceController', 
					resolve: {
						orderreference: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed(uibModalClosedCallback);
		}
	
	function deleteOrderreference(){
		var formMode = 'D';
		
		if(0 == Object.keys(vm.orderreference).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-orderreferences/modalOrderreference.html', 
					controller: 'modalOrderreferenceController as modalOrderreferenceController', 
					resolve: {
						orderreference: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed().then(uibModalClosedCallback);
		}
	
	function doDbColumn2Dom(formMode){
		var data = {};
		
		Object.keys(vm.dbColumn2Colheader).forEach(
				function(dbColumn2ColheaderKey){
					var dataKey =  vm.dbColumn2Dom[dbColumn2ColheaderKey];
					
					if('I' == formMode){	data[dataKey] = undefined;
					} else {	data[dataKey] = vm.orderreference[dbColumn2ColheaderKey];
					}
					
					data['companyName'] = vm.companyName;
					data['branchName'] = vm.branchName;
					data['tableNumber'] = vm.tableNumber;
					}
				);
		
		return data;
		}
	
	function genModalHiddenFields(formMode){
		var modalHiddenFields = {};
		
		getDtHiddenColumns();
		
		if('I' == formMode){	return null;
		}
		
		Object.keys(vm.dtHiddenColumns).forEach(
				function(dtHiddenColumnsKey){	modalHiddenFields[vm.dbColumn2Dom[dtHiddenColumnsKey]] = true;
				}
				);
		
		return modalHiddenFields;
		}
	
	function uibModalClosedCallback(){
		vm.dtInstance.relaoadData();
		vm.orderreference = {};
		}
	
	function getDtHiddenColumns(){
		var orderreferenceDt = $(DOM_ORDERREFERENCE_TABLE).dataTable();
		vm.dtHiddenColumns = {};
		
		$.each(
				orderreferenceDt.fnSettings().aoColumns, 
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
		datatableService.setDbColumn2Colheader(vm.dbColumn2Colheaeder);
		datatableService.doDTInitOptions(
				DTOptionsBuilder, 
				vm.restApiSource, 
				BROADCAST_MESSAGES.addOrderreference, 
				BROADCAST_MESSAGES.updateOrderreference, 
				BROADCAST_MESSAGES.deleteOrderreference
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
			var orderreferenceTableDom = $(DOM_ORDERREFERENCE_TABLE).DataTable();
			
			Object.keys(vm.dtHiddenColumns).forEach(
					function(dtHiddenColumnsKey){	orderreferenceTableDom.column(vm.dtHiddenColumns[dtHiddenColumnKey]).visible(false);
					}
					);
			}
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.addOrderreference, 
			addOrderreference
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.updateOrderreference, 
			updateOrderreference
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.deleteOrderreference, 
			deleteOrderreference
			);
	}