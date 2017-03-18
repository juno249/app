angular
.module('starter')
.controller('manageMenuController', manageMenuController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
manageMenuController.$inject = [
	'API_BASE_URL', 
	'BROADCAST_MESSAGES', 
	'MENUS_DB_FIELDS', 
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
function manageMenuController(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		MENUS_DB_FIELDS, 
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
	vm.tableId = '#menuTable';
	vm.companyName = $stateParams['companyName'];
	vm.controllerObjName = 'manageMenuController';
	vm.menu = {};
	vm.dtColumns = undefined;
	vm.dtInstance = dtInstanceCallback;
	vm.dtOptions = undefined;
	vm.dtHiddenColumns = {};
	vm.dbColumnFields = MENUS_DB_FIELDS;
	vm.dbColumn2Colheader = {
			menu_id: 'Id', 
			menu_name: 'Name', 
			company_name: 'Company name', 
			menu_desc: 'Description', 
			menu_image: 'Image'
	};
	vm.dbColumn2Dom = {
			menu_id: 'menuId', 
			menu_name: 'menuName', 
			company_name: 'companyName', 
			menu_desc: 'menuDesc', 
			menu_image: 'menuImage'
	};
	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/menus';
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
	 * purpose: assigns menu on select
	 * ****************************** */
	function dtAssignOnSelect(data, $event){
		var eSrc = $event.currentTarget; //div
		var eSrcParent = eSrc.parentElement; //td
		var eSrcParentParent = eSrcParent.parentElement; //tr
		var eSrcParentParentClass = eSrcParentParent.className;
		var menu = {};
		
		if(-1 == eSrcParentParentClass.indexOf('selected')){	
			menu = data;
			/* ******************************
			 * Broadcast (Start)
			 * ****************************** */
			$rootScope.$broadcast(
					BROADCAST_MESSAGES.toggleMenuitem, 
					{
						companyName: vm.companyName, 
						menuName: menu.menu_name
					}
			);
			/* ******************************
			 * Broadcast (End)
			 * ****************************** */
		} else {
			menu= {};
			/* ******************************
			 * Broadcast (Start)
			 * ****************************** */
			$rootScope.$broadcast(
					BROADCAST_MESSAGES.toggleMenuitem, 
					{
						companyName: vm.companyName, 
						menuName: menu.menu_name
					}
			);
			/* ******************************
			 * Broadcast (End)
			 * ****************************** */
		}
		
		vm.menu = menu;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addMenu()
	 * purpose: launches menu uib modal w/form mode 'I'
	 * ****************************** */
	function addMenu(){
		var formMode = 'I';
		var modalInstance = undefined
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-menus/modalMenu.html', 
			controller: 'modalMenuController as modalMenuController', 
			resolve:	{
				menu: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateMenu()
	 * purpose: launches menu uib modal w/form mode 'A'
	 * ****************************** */
	function updateMenu(){
		var menu = vm.menu;
		var formMode = 'A';
		var modalInstance = undefined;
		
		if(0 == Object.keys(menu).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-menus/modalMenu.html', 
			controller: 'modalMenuController as modalMenuController', 
			resolve:	{
				menu: function(){	return doDbColumn2Dom(formMode);	}, 
				formMode: function(){	return formMode;	}, 
				modalHiddenFields: function(){	return genModalHiddenFields(formMode);	}
			}
		}).closed.then(uibModalClosedCallback);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteMenu()
	 * purpose: launches menu uib modal w/form mode 'D'
	 * ****************************** */
	function deleteMenu(){
		var menu = vm.menu;
		var formMode = 'D';
		var modalInstance = undefined;
		
		if(0 == Object.keys(menu).length){
			return;
		}
		
		modalInstance = $uibModal.open({
			animation: true, 
			templateUrl: 'docs/dynamic/manage/manage-menus/modalMenu.html', 
			controller: 'modalMenuController as modalMenuController', 
			resolve:	{
				menu: function(){	return doDbColumn2Dom(formMode);	}, 
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
		var dbColumn2Colheader = vm.dbColumn2Colheader;
		var dbColumn2ColheaderKeys = Object.keys(dbColumn2Colheader);
		var dbColumn2Dom = vm.dbColumn2Dom;
		var menu = vm.menu;
		var data = {};
		
		dbColumn2ColheaderKeys.forEach(function(dbColumn2ColheaderKey){
			var dataKey = dbColumn2Dom[dbColumn2ColheaderKey];
			if('I' == formMode){	data[dataKey] = undefined;
			} else {	data[dataKey] = menu[dbColumn2ColheaderKey];
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
		var menu = vm.menu;
		
		dtInstance.reloadData();
		menu = {};
		
		vm.dtInstance = dtInstance;
		vm.menu = menu;
		
		if(0 == $('.dataTable tr.selected').length){	return;	}
		//dt-Instance re-draws, toggle table usermenus
		/* ******************************
		 * Broadcast (Start)
		 * ****************************** */
		$rootScope.$broadcast(
				BROADCAST_MESSAGES.toggleMenuitem, 
				{
					companyName: vm.companyName, 
					menuName: menu.menu_name
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
				BROADCAST_MESSAGES.addMenu, 
				BROADCAST_MESSAGES.updateMenu, 
				BROADCAST_MESSAGES.deleteMenu
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
			var menuTableId = vm.tableId;
			var menuTableDom = $(menuTableId).DataTable();
			var dtHiddenColumns = vm.dtHiddenColumns;
			var dtHiddenColumnsKeys = Object.keys(dtHiddenColumns);
			
			dtHiddenColumnsKeys.forEach(function(dtHiddenColumnsKey){
				menuTableDom.column(dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
			})
		}
		
		vm.dtOptions = dtOptions;
		vm.dtColumns = dtColumns;
	}
	
	/* ******************************
	 * Broadcast Event Handlers (Start)
	 * ****************************** */
	$scope.$on(BROADCAST_MESSAGES.addMenu, addMenu);
	
	$scope.$on(BROADCAST_MESSAGES.updateMenu, updateMenu);

	$scope.$on(BROADCAST_MESSAGES.deleteMenu, deleteMenu);
	/* ******************************
	 * Broadcast Event Handlers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */