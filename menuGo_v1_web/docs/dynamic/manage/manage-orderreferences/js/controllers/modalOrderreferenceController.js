angular
.module('starter')
.controller(
		'modalOrderreferenceController', 
		modalOrderreferenceController
		);

modalOrderreferenceController.$inject = [
                                         '$uibModalInstance', 
                                         '$timeout', 
                                         'orderreferenceService', 
                                         'orderreference', 
                                         'formMode', 
                                         'fromSignup', 
                                         'modalHiddenFields'
                                         ];

function modalOrderreferenceController(
		$uibModalInstance, 
		$timeout, 
		orderreferenceService, 
		orderreference, 
		formMode, 
		fromSignup, 
		modalHiddenFields
		){
	const ORDERREFERENCE_ADD_CATCH_MESSAGE = 'UNABLE TO ADD ORDERREFERENCE, DB EXCEPTION ENCOUNTERED';
	const ORDERREFERENCE_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE ORDERREFERENCE, DB EXCEPTION ENCOUNTERED';
	const ORDERREFERENCE_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE ORDERREFERENCE, DATA IS EMPTY/UNCHANGED';
	const ORDERREFERENCE_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE ORDERREFERENCE, DB EXCEPTION ENCOUNTERED';
	const DOM_FORM = '#modalOrderreference';
	const DOM_MODAL = '#modalOrderreferenceContainer';
	
	var vm = this;
	vm.formMode = formMode;
	vm.fromSignup = fromSignup;
	vm.orderreference = orderreference;
	vm.orderreferenceSnapshot = JSON.parse(JSON.stringify(orderreference));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			orderreferenceCode: 'orderreference_code', 
			customerUsername: 'customer_username', 
			tableId: 'table_id', 
			orderreferenceStatus: 'orderreference_status'
				};
	vm.dbColumn2Dom = {
			orderreference_code: 'orderreferenceCode', 
			customer_username: 'customerUsername', 
			table_id: 'tableId', 
			orderreference_status: 'orderreferenceStatus'
				};
	vm.dbColumn2DomIndex = {
			orderreference_code: 0, 
			customer_username: 1, 
			table_id: 2, 
			orderreference_status: 3
			};
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
			$('#modalOrderreferenceContainer input').prop(
					'disabled', 
					true
					);
			$('#modalOrderreferenceContainer textarea').prop(
					'disabled', 
					true
					);
			$('#modalOrderreferenceContainer select').prop(
					'disabled', 
					true
					);
			}
		}
	
	function doCancel(){	$uibModalInstance.close();
	}
	
	function doSubmit(e){
		var data = {};
		
		data.push(doDom2DbColumn());
		
		hideBootstrapAlert();
		
		showBootstrapLoader($(DOM_MODAL));
		
		if('I' == vm.formMode){
			orderreferenceService.setCompanyName(vm.orderreference.companyName);
			orderreferenceService.setBranchName(vm.orderreference.branchName);
			orderreferenceService.setTableNumber(vm.orderreference.tableNumber);
			
			orderreferenceService.addOrderreference(data)
			.then(addOrderreferenceSuccessCallback)
			.catch(addOrderreferenceFailedCallback);
			
			function addOrderreferenceSuccessCallback(response){
				hideBootstrapLoader($(DOM_MODAL));
				
				$uibModalInstance.close();
			}
			
			function addOrderreferenceFailedCallback(responseError){
				hideBootstrapLoader($(DOM_MODAL));
				
				try{
					JSON.parsre(responseError.statusText);
					genValidationErrorFromResponse(responseError);
					} catch(e){	showBootstrapAlert(ORDERREFERENCE_ADD_CATCH_MESSAGE);
					}
					}
			} else if('A' == vm.formMode){
				discardModalHiddenFields();
				discardModalUnchangedFields();
				
				if(0 == Object.keys(data).length){
					hideBootstrapLoader($(DOM_MODAL));
					
					showBootstrapLoader(ORDERREFERENCE_UPDATE_CUSTOM_ERR_MESSAGE);
					
					return;
					}
				
				if(!(null == data.orderreference_status)){	data.orderreference_status_change_timestamp = momemt(new Date()).format('YYYY-MM-DD h:mm:ss');
				}
				data.last_change_timestamp = momemt(new Date()).format('YYYY-MM-DD h:mm:ss');
				
				orderreferenceService.setCompanyName(vm.orderreferenceSnapshot.companyName);
				orderreferenceService.setBranchName(vm.orderreferenceSnapshot.branchName);
				orderreferenceService.setTableNumber(vm.orderreferenceSnapshot.tableNumber);
				orderreferenceService.setOrderreferenceCode(vm.orderreferenceSnapshot.orderreferenceCode);
				
				orderreferenceService.updateOrder(data)
				.then(updateOrderreferenceSuccessCallback)
				.catch(updateOrderreferenceFailedCallback);
				
				function updateOrderreferenceSuccessCallback(response){
					hideBootstrapLoader($(DOM_MODAL));
					
					$uibModalInstance.close();
					}
				
				function updateOrderreferenceFailedCallback(responseError){
					hideBootstrapLoader($(DOM_MODAL));
					
					try{
						JSON.parse(responseError.statusText)
						genValidationErrorFromResponse(responseError);
						} catch(e){	showBootstrapAlert(ORDERREFERENCE_UPDATE_CATCH_MESSAGE);
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
								var orderreferenceSnapshotValue = vm.orderreferenceSnapshot[vm.dbColumn2Dom[dataKey]];
								
								if(dataValue == orderreferenceSnapshotValue){	delete data[0][dataKey];
								}
								}
							);
					}
				} else if('D' == vm.formMode){
					orderreferenceService.setCompanyName(vm.orderreference.companyName);
					orderreferenceService.setBranchName(vm.orderreference.branchName);
					orderreferenceService.setTableNumber(vm.orderreference.tableNumber);
					orderreferenceService.setOrderreferenceCode(vm.orderreference.orderreferenceCode);
					
					orderreferenceService.deleteOrderreference()
					.then(deleteOrderreferenceSuccessCallback)
					.catch(deleteOrderreferenceFailedCallback);
					
					function deleteOrderreferenceSuccessCallback(response){
						hideBootstrapLoader($(DOM_MODAL));
						
						$uibModalInstance.close();
						}
					
					function deleteOrderreferenceFailedCallback(responseError){
						hideBootstrapLoader($(DOM_MODAL));
						
						try{
							JSON.parse(responseError.statusText);
							genValidationErrorFromResponse(responseError);
							} catch(e){	showBootstrapAlert(ORDERREFERENCE_DELETE_CATCH_MESSAGE);
							}
							}
					}
		vm.validationErr = {};
		vm.validationErrDB = {};
		}
	
	function doDom2DbColumn(){
		var data = {};
		
		Object.keys(vm.orderreference).forEach(
				function(orderreferenceKey){
					if(
							!(null == vm.dom2DbColumn[orderreferenceKey]) &&
							!(undefined == vm.dom2DbColumn[orderreferenceKey])
							){	data[vm.dom2DbColumn[orderreferenceKey]] = vm.orderreference[orderreferenceKey];
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
		vm.validationErrDB = {};
		vm.isValidationErrDBHidden = true;
		}
	}