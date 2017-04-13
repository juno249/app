angular
.module('starter')
.controller(
		'modalTableController', 
		modalTableController
		);

modalTableController.$inject = [
                                'TABLE_STATUS', 
                                '$uibModalInstance', 
                                '$timeout', 
                                'tableService', 
                                'table', 
                                'formMode', 
                                'modalHiddenFields'
                                ];

function modalTableController(
		TABLE_STATUS, 
		$uibModalInstance, 
		$timeout, 
		tableService, 
		table, 
		formMode, 
		modalHiddenFields
		){
	const TABLE_ADD_CATCH_MESSAGE = 'UNABLE TO ADD TABLE, DB EXCEPTION ENCOUNTERED';
	const TABLE_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE TABLE, DB EXCEPTION ENCOUNTERED';
	const TABLE_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE TABLE, DATA IS EMPTY/UNCHANGED';
	const TABLE_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE TABLE, DB EXCEPTION ENCOUNTERED';
	const DOM_FORM = '#modalTable';
	const DOM_MODAL = '#modalTableContainer';
	
	var vm = this;
	vm.formMode = formMode;
	vm.table = table;
	vm.tableSnapshot = JSON.parse(JSON.stringify(table));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			tableNumber: 'table_number', 
			tableCapacity: 'table_capacity', 
			tableStatus: 'table_status'
				};
	vm.dbColumn2Dom = {
			table_number: 'tableNumber', 
			table_capacity: 'tableCapacity', 
			table_status: 'tableStatus'
				};
	vm.dbColumn2DomIndex = {
			table_number: 0, 
			table_capacity: 1, 
			table_status: 2
			};
	vm.tableStatusOptions = TABLE_STATUS;
	vm.validationErr = {};
	vm.validationErrDB = {};
	vm.isValidationErrDBHidden = true;
	
	//controller_method
	vm.initBootstrapValidator = initBootstrapValidator;
	//controller_method
	vm.initDom = initDom;
	//controller_method
	vm.doCancel = doCancel;
	
	function initBootstrapValidator(){
		$.fn.validator.Constructor.INPUT_SELECTOR = ':input:not(".ng-hide")';
		
		$(DOM_FORM).validator();
		$(DOM_FORM).validator().on(
				'submit', 
				doSubmit
				);
		
		$timeout(
				function(){	$(DOM_FORM).validator('update');
				}
				);
		}
	
	function initDom(){
		if('D' == vm.formMode){
			$('#modalTableController input').prop(
					'disabled', 
					true
					);
			$('#modalTableController textarea').prop(
					'disabled', 
					true
					);
			$('#modalTableController select').prop(
					'disabled', 
					true
					);
			}
		}
	
	function doCancel(){	$uibModalInstance.close();
	}
	
	function doSubmit(e){
		var data = [];
		
		data.push(doDom2DbColumn());
		
		hideBootstrapAlert();
		
		showBootstrapLoader($(DOM_MODAL));
		
		if('I' == vm.formMode){
			tableService.setCompanyName(vm.table.companyName);
			tableService.setBranchName(vm.table.branchName);
			
			tableService.addTable(data)
			.then(addTableSuccessCallback)
			.catch(addTableFailedCallback);
			
			function addTableSuccessCallback(response){
				hideBootstrapLoader($(DOM_MODAL));
				
				$uibModalInstance.close();
				}
			
			function addTableFailedCallback(responseError){
				hideBootstrapLoader($(DOM_MODAL));
				
				try{
					JSON.parse(responseError.statusText);
					genValidationErrorFromResponse(responseError);
				} catch(e){	showBootstrapAlert(TABLE_ADD_CATCH_MESSAGE);
				}
				}
			} else if('A' == vm.formMode){
				discardModalHiddenFields();
				discardModalUnchangedFields();
				
				if(0 == Object.keys(data).length){
					hideBootstrapLoader($(DOM_MODAL));
					
					showBootstrapAlert(TABLE_UPDATE_CUSTOM_ERR_MESSAGE);
					
					return;
					}
				
				if(!(null == data.table_status)){	data.table_status_change_timestamp = momemt(new Date()).format('YYYY-MM-DD h:mm:ss');
				}
				data.last_change_timestamp = momemt(new Date()).format('YYYY-MM-DD h:mm:ss');
				
				tableService.setCompanyName(vm.tableSnapshot.companyName);
				tableService.setBranchName(vm.tableSnapshot.branchName);
				tableService.setTableNumber(vm.tableSnapshot.tableNumber);
				
				tableService.updateTable(data)
				.then(updateTableSuccessCallback)
				.catch(updateTableFailedCallback);
				
				function updateTableSuccessCallback(response){
					hideBootstrapLoader($(DOM_MODAL));
					
					$uibModalInstance.close();
					}
				
				function updateTableFailedCallback(responseError){
					hideBootstrapLoader($(DOM_MODAL));
					
					try{
						JSON.parse(responseError.statusText);
						genValidationErrorFromResponse(responseError);
						} catch(e){	showBootstrapAlert(TABLE_UPDATE_CATCH_MESSAGE);
						}
						}
				
				function discardModalHiddenFields(){
					Object.keys(vm.modalHiddenFields).forEach(
							function(modalHiddenFieldsKey){	delete data[0][vm.dom2DbColumn[modalHiddenFieldsKey]];
							}
							);
					}
				
				function discardModalUnchangedFields(){
					var dataKeys = Object.keys(data[0]);
					
					dataKeys.forEach(
							function(dataKey){
								var dataValue = data[0][dataKey];
								var tableSnapshotValue = vm.tableSnapshot[vm.dbColumn2Dom[dataKey]];
								
								if(dataValue == tableSnapshotValue){	delete data[0][dataKey];
								}
								}
							);
					}
				} else if('D' == vm.formMode){
					tableService.setCompanyName(vm.table.companyName);
					tableService.setBranchName(vm.table.branchName);
					tableService.setTableNumber(vm.table.tableNumber);
					
					tableService.deleteTable(data)
					.then(deleteTableSuccessCallback)
					.catch(deleteTableFailedCallback);
					
					function deleteTableSuccessCallback(response){
						hideBootstrapLoader($(DOM_MODAL));
						
						$uibModalInstance.close();
						}
					
					function deleteTableFailedCallback(responseError){
						hideBootstrapLoader($(DOM_MODAL));
						
						try{
							JSON.parse(responseError.statusText);
							genValidationErrorFromResponse(responseError);
							} catch(e){	showBootstrapAlert(TABLE_DELETE_CATCH_MESSAGE);
							}
							}
					}
		vm.validationErr = {};
		vm.validationErrDB = {};
		}
	
	function doDom2DbColumn(){
		var data = {};
		
		Object.keys(vm.table).forEach(
				function(tableKey){
					if(
							!(null == vm.dom2DbColumn[tableKey]) &&
							!(undefined == vm.dom2DbColumn[tableKey])
							){	data[vm.dom2DbColumn[tableKey]] = vm.table[tableKey];
							}
					}
				);
		
		return data;
		}
	
	function genValidationErrorFromResponse(responseError){
		const CLASS_FORM_GROUP = '.form-group';
		const CLASS_HAS_ERROR = 'has-error';
		
		var statusText = responseError.statusText;
		var statusTextObj = JSON.parse(statusText);
		var statusTextKeys = Object.keys(statusTextObj);
		
		statusTextKeys.forEach(
				function(statusTextKey){
					var dbColumnName = statusTextKey.split('.')[1];
					var dbColumnIndex = getDbColumnIndex(dbColumnName);
					var errorMessage = statusTextObj[statusTextKey][0];
					var formGroups = $(CLASS_FORM_GROUP);
					
					errorMessage = errorMessage.replace(statusTextKey, vm.dbColumn2Dom[dbColumnName]);
					
					vm.validationErr[parseInt(dbColumnIndex)] = errorMessage;
					
					formGroups.eq(parseInt(dbColumnIndex+1)).addClass(CLASS_HAS_ERROR);
					}
				);
		
		function getDbColumnIndex(dbColumnName){	return vm.dbColumn2DomIndex[dbColumnName];
		}
		}
	
	function showBootstrapLoader(target){	$(target).LoadingOverlay('show');
	}
	
	function hideBootstrapLoader(target){	$(target).LoadingOverlay('hide');
	}
	
	function showBootstrapAlert(validationErrDB){
		vm.validationErrDB = validationErrDB;
		vm.isValidationErrDBHidden = false;
		}
	
	function hideBootstrapAlert(){
		vm.validationErrDB = undefined;
		vm.isValidationErrDBHidden = true;
		}
	}