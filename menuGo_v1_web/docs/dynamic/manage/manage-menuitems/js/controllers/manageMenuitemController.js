angular
.module('starter')
.controller('manageMenuitemController', manageMenuitemController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
manageMenuitemController.$inject = [
	'API_BASE_URL', 
	'BROADCAST_MESSAGES', 
	'MENUITEMS_DB_FIELDS', 
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
function manageMenuitemController(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		MENUITEMS_DB_FIELDS, 
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
	vm.tableId = '#menuitemTable'
	vm.companyName = $stateParams['companyName'];
	vm.menuName = $stateParams['menuName'];
	vm.menuitem = {};
	vm.controllerObjName = 'manageMenuitemController';
	vm.dtColumns = undefined;
	vm.dtInstance = dtInstanceCallback;
	vm.dtOptions = undefined;
	vm.dtHiddenColumns = {
	}
	vm.dbColumnFields = MENUITEMS_DB_FIELDS;
	vm.dbColumn2Colheader = {
			menuitem_id: 'Id', 
			menuitem_code: 'Code', 
			menu_id: 'Menu id', 
			menuitem_name: 'Name', 
			menuitem_desc: 'Description', 
			menuitem_price: 'Price', 
			menuitem_featured: 'Featured', 
			menuitem_image: 'Image'
	};
	vm.dbColumn2Dom = {
			menuitem_id: 'menuitemId', 
			menuitem_code: 'menuitemCode', 
			menu_id: 'menuId', 
			menuitem_name: 'menuitemName', 
			menuitem_desc: 'menuitemDesc', 
			menuitem_price: 'menuitemPrice', 
			menuitem_featured: 'menuitemFeatured', 
			menuitem_image: 'menuitemImage'
	};
	var user = undefined;
	if(!(null == localStorage.getItem('User'))){
		user = localStorage.getItem('User');
		user= JSON.parse(user);
	}
	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/menus/' + vm.menuName + '/menuitems';
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
	 * purpose: assigns menuitem on select
	 * ****************************** */
	function dtAssignOnSelect(data, $event){
		var eSrc = $event.currentTarget; //div
		var eSrcParent = eSrc.parentElement; //td
		var eSrcParentParent = eSrcParent.parentElement; //tr
		var eSrcParentParentClass = eSrcParentParent.className;
		var menuitem = {};
		
		if(-1 == eSrcParentParentClass.indexOf('selected')){	menuitem = data;
		} else {	menuitem= {};
		}
		
		vm.menuitem = menuitem;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addMenuitem()
	 * purpose: launches menuitem uib modal w/form mode 'I'
	 * ****************************** */
	function addMenuitem(){
		var formMode = 'I';
		var modalInstance = undefined;
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-menuitems/modalMenuitem.html', 
			controller: 'modalMenuitemController as modalMenuitemController', 
			resolve: {
				menuitem: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateMenuitem()
	 * purpose: launches menuitem uib modal w/form mode 'A'
	 * ****************************** */
	function updateMenuitem(){
		var menuitem = vm.menuitem;
		var formMode = 'A';
		var modalInstance = undefined;
		
		if(0 == Object.keys(menuitem).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-menuitems/modalMenuitem.html', 
			controller: 'modalMenuitemController as modalMenuitemController', 
			resolve: {
				menuitem: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteMenuitem()
	 * purpose: launches menuitem uib modal w/form mode 'D'
	 * ****************************** */
	function deleteMenuitem(){
		var menuitem = vm.menuitem;
		var formMode = 'D';
		var modalInstance = undefined;
		
		if(0 == Object.keys(menuitem).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-menuitems/modalMenuitem.html', 
			controller: 'modalMenuitemController as modalMenuitemController', 
			resolve: {
				menuitem: function(){	return doDbColumn2Dom(formMode);	}, 
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
		var companyName = vm.companyName;
		var menuName = vm.menuName;
		var dbColumn2Colheader = vm.dbColumn2Colheader;
		var dbColumn2ColheaderKeys = Object.keys(dbColumn2Colheader);
		var dbColumn2Dom = vm.dbColumn2Dom;
		var menuitem = vm.menuitem;
		var data = {};
		
		dbColumn2ColheaderKeys.forEach(function(dbColumn2ColheaderKey){
			var dataKey = dbColumn2Dom[dbColumn2ColheaderKey];
			if('I' == formMode){	data[dataKey] = undefined;
			} else {	data[dataKey] = menuitem[dbColumn2ColheaderKey];
			}
			
			data['companyName'] = companyName;
			data['menuName'] = menuName;
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
		var menuitem = vm.menuitem;
		
		dtInstance.reloadData();
		menuitem = {};
		
		vm.dtInstance = dtInstance;
		vm.menuitem = menuitem;
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
				BROADCAST_MESSAGES.addMenuitem, 
				BROADCAST_MESSAGES.updateMenuitem, 
				BROADCAST_MESSAGES.deleteMenuitem
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
			var menuitemTableId = vm.tableId;
			var menuitemTableDom = $(menuitemTableId).DataTable();
			var dtHiddenColumns = vm.dtHiddenColumns;
			var dtHiddenColumnsKeys = Object.keys(dtHiddenColumns);
			
			dtHiddenColumnsKeys.forEach(function(dtHiddenColumnsKey){
				menuitemTableDom.column(dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
			})
		}
		
		vm.dtOptions = dtOptions;
		vm.dtColumns = dtColumns;
	}
	
	/* ******************************
	 * Broadcast Event Handlers (Start)
	 * ****************************** */
	$scope.$on(BROADCAST_MESSAGES.addMenuitem, addMenuitem);
	
	$scope.$on(BROADCAST_MESSAGES.updateMenuitem, updateMenuitem);

	$scope.$on(BROADCAST_MESSAGES.deleteMenuitem, deleteMenuitem);
	/* ******************************
	 * Broadcast Event Handlers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */