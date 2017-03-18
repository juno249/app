angular
.module('starter')
.controller('manageOrderController', manageOrderController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
manageOrderController.$inject = [
	'API_BASE_URL', 
	'BROADCAST_MESSAGES', 
	'ORDERS_DB_FIELDS', 
	'$compile', 
	'$scope', 
	'$uibModal', 
	'DTOptionsBuilder', 
	'DTColumnBuilder', 
	'datatableService'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function manageOrderController(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		ORDERS_DB_FIELDS, 
		$compile, 
		$scope, 
		$uibModal, 
		DTOptionsBuilder, 
		DTColumnBuilder, 
		datatableService
){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.companyName = undefined;
	vm.branchName = undefined;
	vm.order = {};
	vm.controllerObjName = 'manageOrderController';
	vm.dtColumns = undefined;
	vm.dtInstance = undefined;
	vm.dtOptions = undefined;
	vm.dtHiddenColumns = {
	}
	vm.dbColumnFields = ORDERS_DB_FIELDS;
	vm.dbColumn2Colheader = {
			order_id: 'Id', 
			customer_username: 'Customer username', 
			menuitem_id: 'Menuitem id', 
			table_id: 'Table id', 
			order_timestamp: 'Timestamp', 
			order_status: 'Status'
	};
	vm.dbColumn2Dom = {
			order_id: 'orderId', 
			customer_username: 'customerUsername', 
			menuitem_id: 'menuitemId', 
			table_id: 'tableId', 
			order_timestamp: 'orderTimestamp', 
			order_status: 'orderStatus'
	}
	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/branches/' + vm.branchName + '/orders';
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
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
	 * purpose: assigns order on select
	 * ****************************** */
	function dtAssignOnSelect(data, $event){
		var eSrc = $event.currentTarget; //div
		var eSrcParent = eSrc.parentElement; //td
		var eSrcParentParent = eSrcParent.parentElement; //tr
		var eSrcParentParentClass = eSrcParentParent.className;
		var order = {};
		
		if(-1 == eSrcParentParentClass.indexOf('selected')){	order = data;
		} else {	order= {};
		}
		
		vm.order = order;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addOrder()
	 * purpose: launches order uib modal w/form mode 'I'
	 * ****************************** */
	function addOrder(){
		var formMode = 'I';
		var modalInstance = undefined;
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-orders/modalOrder.html', 
			controller: 'modalOrderController as modalOrderController', 
			resolve: {
				order: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		});
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateOrder()
	 * purpose: launches order uib modal w/form mode 'A'
	 * ****************************** */
	function updateOrder(){
		var order = vm.order;
		var formMode = 'A';
		var modalInstance = undefined;
		
		if(0 == Object.keys(order).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-modalOrder.html', 
			controller: 'modalOrderController as modalOrderController', 
			resolve: {
				order: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		});
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteOrder()
	 * purpose: launches order uib modal w/form mode 'D'
	 * ****************************** */
	function deleteOrder(){
		var order = vm.order;
		var formMode = 'D';
		var modalInstance = undefined;
		
		if(0 == Object.keys(order).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-modalOrder.html', 
			controller: 'modalOrderController as modalOrderController', 
			resolve: {
				order: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		});
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doDbColumn2Dom()
	 * purpose: converts keys from dbColumn to dom
	 * ****************************** */
	function doDbColumn2Dom(formMode){
		var companyName = vm.companyName;
		var branchName = vm.branchName;
		var dbColumn2Colheader = vm.dbColumn2Colheader;
		var dbColumn2ColheaderKeys = Object.keys(dbColumn2Colheader);
		var dbColumn2Dom = vm.dbColumn2Dom;
		var order = vm.order;
		var data = {};
		
		dbColumn2ColheaderKeys.forEach(function(dbColumn2ColheaderKey){
			var dataKey = dbColumn2Dom[dbColumn2ColheaderKey];
			if('I' == formMode){	data[dataKey] = undefined;
			} else {	data[dataKey] = order[dbColumn2ColheaderKey];
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
				BROADCAST_MESSAGES.addOrder, 
				BROADCAST_MESSAGES.updateOrder, 
				BROADCAST_MESSAGES.deleteOrder
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
			var orderTableId = '#orderTable';
			var orderTableDom = $(orderTableId).DataTable();
			var dtHiddenColumns = vm.dtHiddenColumns;
			var dtHiddenColumnsKeys = Object.keys(dtHiddenColumns);
			
			dtHiddenColumnsKeys.forEach(function(dtHiddenColumnsKey){
				orderTableDom.column(dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
			})
		}
		
		vm.dtOptions = dtOptions;
		vm.dtColumns = dtColumns;
	}
	
	/* ******************************
	 * Broadcast Event Handlers (Start)
	 * ****************************** */
	$scope.$on(BROADCAST_MESSAGES.addOrder, addOrder);
	
	$scope.$on(BROADCAST_MESSAGES.updateOrder, updateOrder);

	$scope.$on(BROADCAST_MESSAGES.deleteOrder, deleteOrder);
	/* ******************************
	 * Broadcast Event Handlers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */