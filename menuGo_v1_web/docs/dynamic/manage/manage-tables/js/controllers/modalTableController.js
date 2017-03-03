angular
.module('starter')
.controller('modalTableController', modalTableController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
modalTableController.$inject = [
	'TABLE_STATUS', 
	'$uibModalInstance', 
	'$timeout', 
	'tableService', 
	'table', 
	'formMode', 
	'modalHiddenFields'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function modalTableController(
		TABLE_STATUS, 
		$uibModalInstance, 
		$timeout, 
		tableService, 
		table, 
		formMode, 
		modalHiddenFields
){
	/* ******************************
	 * Messages Constants (Start)
	 * ****************************** */
	const TABLE_ADD_CATCH_MESSAGE = 'UNABLE TO ADD TABLE, DB EXCEPTION ENCOUNTERED';
	const TABLE_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE TABLE, DB EXCEPTION ENCOUNTERED';
	const TABLE_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE TABLE, DATA IS EMPTY/UNCHANGED';
	const TABLE_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE TABLE, DB EXCEPTION ENCOUNTERED';
	/* ******************************
	 * Messages Constants (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.formId = '#modalTable';
	vm.formMode = formMode;
	vm.table = table;
	vm.tableCapture = JSON.parse(JSON.stringify(table));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			tableNumber: 'table_number', 
			tableCapacity: 'table_capacity', 
			tableStatus: 'table_status'
	}
	vm.dbColumn2Dom = {
			table_number: 'tableNumber', 
			table_capacity: 'tableCapacity', 
			table_status: 'tableStatus'
	}
	vm.dbColumn2DomIndex = {
			table_number: 0, 
			table_capacity: 1, 
			table_status: 2
	}
	vm.tableStatusOptions = TABLE_STATUS;
	vm.validationErr = {};
	vm.validationErrDB = undefined;
	vm.isValidationErrDB = true;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.initBootstrapValidator = initBootstrapValidator;
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
	 * method name: initDom()
	 * purpose: initializes Dom object attributes
	 * ****************************** */
	function initDom(){
		var formMode = vm.formMode;
		/* ******************************
		 * Input Controls (Start)
		 * ****************************** */
		if('D' == formMode){
			$('#modalTableController input').prop('disabled', true);
			$('#modalTableController textarea').prop('disabled', true);
			$('#modalTableController select').prop('disabled', true);
		}
		/* ******************************
		 * Input Controls (End)
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
		var formMode = vm.formMode;
		var modalTableContainerId = '#modalTableContainer';
		var modalTableContainer = $(modalTableContainerId);
		var data = [];
		var validationErr = vm.validationErr;
		var validationErrDB = vm.validationErrDB;
		
		hideBootstrapAlert();
		
		data.push(doDom2DbColumn());
		
		showBootstrapLoader(modalTableContainer);
		
		if('I' == formMode){
			var table = vm.table;
			var companyName = table.companyName; 
			var branchName = table.branchName;
			tableService.setCompanyName(companyName);
			tableService.setBranchName(branchName);
			tableService.addTable(data)
			.then(addTableSuccessCallback)
			.catch(addTableFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function addTableSuccessCallback(response){
				hideBootstrapLoader(modalTableContainer);
				$uibModalInstance.close();
			}
			
			function addTableFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalTableContainer);
				try{
					JSON.parse(statusText);
					genValidationErrorFromResponse(responseError);
				} catch(e){	showBootstrapAlert(TABLE_ADD_CATCH_MESSAGE);
				}
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
			
		} else if('A' == formMode){
			var tableCapture = vm.tableCapture;
			var companyName = tableCapture.companyName;
			var branchName = tableCapture.branchName; 
			var tableNumber = tableCapture.tableNumber;
			
			discardModalHiddenFields();
			discardModalUnchangedFields();
			
			if(0 == Object.keys(data).length){
				hideBootstrapLoader(modalTableContainer);
				showBootstrapAlert(TABLE_UPDATE_CUSTOM_ERR_MESSAGE)
				return;
			}
			
			tableService.setCompanyName(companyName);
			tableService.setBranchName(branchName);
			tableService.setTableNumber(tableNumber);
			tableService.updateTable(data)
			.then(updateTableSuccessCallback)
			.catch(updateTableFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function updateTableSuccessCallback(response){
				hideBootstrapLoader(modalTableContainer);
				$uibModalInstance.close();
			}
			
			function updateTableFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalTableContainer);
				try{
					JSON.parse(statusText);
					genValidationErrorFromResponse(responseError);
				} catch(e){	showBootstrapAlert(TABLE_UPDATE_CATCH_MESSAGE);
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
				var tableCapture = vm.tableCapture;
				var dbColumn2Dom = vm.dbColumn2Dom;
				
				dataCopyKeys.forEach(function(dataCopyKey){
					var dataCopyValue = dataCopy[dataCopyKey];
					var tableCaptureValue = tableCapture[dbColumn2Dom[dataCopyKey]];
					
					if(dataCopyValue == tableCaptureValue){	delete dataCopy[dataCopyKey];
					}
				});
				
				data[0] = dataCopy;
			}
		} else if('D' == formMode){
			var table = vm.table;
			var companyName = table.companyName;
			var branchName = table.branchName; 
			var tableNumber = table.tableNumber;
			tableService.setCompanyName(companyName);
			tableService.setBranchName(branchName);
			tableService.setTableNumber(tableNumber);
			tableService.deleteTable(data)
			.then(deleteTableSuccessCallback)
			.catch(deleteTableFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function deleteTableSuccessCallback(response){
				hideBootstrapLoader(modalTableContainer);
				$uibModalInstance.close();
			}
			
			function deleteTableFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalTableContainer);
				try{
					JSON.parse(statusText);
					genValidationErrorFromResponse(responseError);
				} catch(e){	showBootstrapAlert(TABLE_DELETE_CATCH_MESSAGE);
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
	function doDom2DbColumn(){
		var table = vm.table;
		var tableKeys = Object.keys(table);
		var dom2DbColumn = vm.dom2DbColumn;
		var data = {};
		
		tableKeys.forEach(function(tableKey){
			var dbField = dom2DbColumn[tableKey];
			if(
					!(null == dbField) && 
					!(undefined == dbField)
			){
				data[dbField] = table[tableKey];
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
			
			if(statusTextKey = (arrIndex + '.' + dbColumnName)){
				dbColumnIndex = getDbColumnIndex(dbColumnName);
				errorMessage = statusTextObj[statusTextKey][0];
				errorMessage = errorMessage.replace(statusTextKey, dbColumn2Dom[dbColumnName]);
				validationErr[parseInt(dbColumnIndex)] = errorMessage;
				
				/* ******************************
				 * JQuery DOM update (start)
				 * ****************************** */
				var formGroups = $(formGroupClass);
				formGroups.eq(parseInt(dbColumnIndex+1)).addClass(hasErrorClass);
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