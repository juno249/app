angular
.module('starter')
.controller('modalBranchController', modalBranchController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
modalBranchController.$inject = [
	'$uibModalInstance', 
	'$timeout', 
	'branchService', 
	'branch', 
	'formMode', 
	'fromSignup', 
	'modalHiddenFields'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function modalBranchController(
		$uibModalInstance, 
		$timeout, 
		branchService, 
		branch, 
		formMode, 
		fromSignup, 
		modalHiddenFields
){
	/* ******************************
	 * Messages Constants (Start)
	 * ****************************** */
	const DIALOG_ADD_HEADER_TITLE = 'ADD-BRANCH';
	const DIALOG_UPDATE_HEADER_TITLE = 'UPDATE-BRANCH';
	const DIALOG_DELETE_HEADER_TITLE = 'DELETE_BRANCH';
	const BRANCH_ADD_SUCCESS_MESSAGE = 'BRANCH ADDED SUCCESSFULLY';
	const BRANCH_UPDATE_SUCCESS_MESSAGE = 'BRANCH UPDATED SUCCESSFULLY';
	const BRANCH_DELETE_SUCCESS_MESSAGE = 'BRANCH DELETED SUCCESSFULLY';
	const BRANCH_ADD_CATCH_MESSAGE = 'UNABLE TO ADD BRANCH, DB EXCEPTION ENCOUNTERED';
	const BRANCH_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE BRANCH, DB EXCEPTION ENCOUNTERED';
	const BRANCH_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE BRANCH, DATA IS EMPTY/UNCHANGED';
	const BRANCH_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE BRANCH, DB EXCEPTION ENCOUNTERED';
	/* ******************************
	 * Messages Constants (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.formId = '#modalBranch';
	vm.formMode = formMode;
	vm.fromSignup = fromSignup;
	vm.branch = branch;
	vm.branchCapture = JSON.parse(JSON.stringify(branch));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			branchName: 'branch_name', 
			companyName: 'company_name', 
			branchAddressHouseBuilding: 'branch_address_house_building', 
			branchAddressStreet: 'branch_address_street', 
			branchAddressDistrict: 'branch_address_district', 
			branchAddressCity: 'branch_address_city', 
			branchAddressPostalcode: 'branch_address_postalcode', 
			branchAddressCountry: 'branch_address_country', 
			branchHotline: 'branch_hotline'
	}
	vm.dbColumn2Dom = {
			branch_name: 'branchName', 
			company_name: 'companyName', 
			branch_address_house_building: 'branchAddressHouseBuilding', 
			branch_address_street: 'branchAddressStreet', 
			branch_address_district: 'branchAddressDistrict', 
			branch_address_city: 'branchAddressCity', 
			branch_address_postalcode: 'branchAddressPostalcode', 
			branch_address_country: 'branchAddressCountry', 
			branch_hotline: 'branchHotline'
	}
	vm.dbColumn2DomIndex = {
			branch_name: 0, 
			company_name: 1, 
			branch_address_house_building: 2, 
			branch_address_street: 3, 
			branch_address_district: 4, 
			branch_address_city: 5, 
			branch_address_postalcode: 6, 
			branch_address_country: 7, 
			branch_hotline: 8
	}
	vm.validationErr = {};
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
			$('#modalBranchContainer input').prop('disabled', true);
			$('#modalBranchContainer textarea').prop('disabled', true);
			$('#modalBranchContainer select').prop('disabled', true);
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
		var fromSignup = vm.fromSignup;
		var modalBranchContainerId = '#modalBranchContainer';
		var modalBranchContainer = $(modalBranchContainerId);
		var data = [];
		
		data.push(doDom2DbColumn());
		
		showBootstrapLoader(modalBranchContainer);
		
		if('I' == formMode){
			if(fromSignup){
				hideBootstrapLoader(modalBranchContainer);
				
				$uibModalInstance.close(data);
				
				return;
			}

			var branch = vm.branch;
			var companyName = branch.companyName;
			branchService.setCompanyName(companyName);
			branchService.addBranch(data)
			.then(addBranchSuccessCallback)
			.catch(addBranchFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function addBranchSuccessCallback(response){
				hideBootstrapLoader(modalBranchContainer);
				
				$uibModalInstance.close();
				
				showBootstrapDialog(
						BootstrapDialog.TYPE_PRIMARY, 
						DIALOG_ADD_HEADER_TITLE, 
						BRANCH_ADD_SUCCESS_MESSAGE
				);
			}
			
			function addBranchFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalBranchContainer);
				
				try{
					JSON.parse(statusText);
					
					genValidationErrorFromResponse(responseError);
				} catch(e){
					$uibModalInstance.close();
					
					showBootstrapDialog(
							BootstrapDialog.TYPE_DANGER, 
							DIALOG_ADD_HEADER_TITLE, 
							BRANCH_ADD_CATCH_MESSAGE
					);
				}
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
			
		} else if('A' == formMode){
			var branchCapture = vm.branchCapture;
			var companyName = branchCapture.companyName;
			var branchName = branchCapture.branchName;
			
			discardModalHiddenFields();
			discardModalUnchangedFields();
			
			if(0 == Object.keys(data[0]).length){
				$uibModalInstance.close();
				
				showBootstrapDialog(
						BootstrapDialog.TYPE_DANGER, 
						DIALOG_UPDATE_HEADER_TITLE, 
						BRANCH_UPDATE_CUSTOM_ERR_MESSAGE
				);
				return;
			}
			
			branchService.setCompanyName(companyName);
			branchService.setBranchName(branchName);
			branchService.updateBranch(data)
			.then(updateBranchSuccessCallback)
			.catch(updateBranchFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function updateBranchSuccessCallback(response){
				hideBootstrapLoader(modalBranchContainer);
				
				$uibModalInstance.close();
				
				showBootstrapDialog(
						BootstrapDialog.TYPE_PRIMARY, 
						DIALOG_UPDATE_HEADER_TITLE, 
						BRANCH_UPDATE_SUCCESS_MESSAGE
				);
			}
			
			function updateBranchFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalBranchContainer);
				
				try{
					JSON.parse(statusText);
					
					genValidationErrorFromResponse(responseError);
				} catch(e){
					$uibModalInstance.close();
					
					showBootstrapDialog(
							BootstrapDialog.TYPE_DANGER, 
							DIALOG_UPDATE_HEADER_TITLE, 
							BRANCH_UPDATE_CATCH_MESSAGE
					);
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
				var branchCapture = vm.branchCapture;
				var dbColumn2Dom = vm.dbColumn2Dom;
				
				dataCopyKeys.forEach(function(dataCopyKey){
					var dataCopyValue = dataCopy[dataCopyKey];
					var branchCaptureValue = branchCapture[dbColumn2Dom[dataCopyKey]];
					
					if(dataCopyValue == branchCaptureValue){	delete dataCopy[dataCopyKey];
					}
				});
				
				data[0] = dataCopy;
			}
		} else if('D' == formMode){
			var branch = vm.branch;
			var companyName = branch.companyName;
			var branchName = branch.branchName;
			branchService.setCompanyName(companyName);
			branchService.setBranchName(branchName);
			branchService.deleteBranch()
			.then(deleteBranchSuccessCallback)
			.catch(deleteBranchFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function deleteBranchSuccessCallback(response){
				hideBootstrapLoader(modalBranchContainer);
				
				$uibModalInstance.close();
				
				showBootstrapDialog(
						BootstrapDialog.TYPE_PRIMARY, 
						DIALOG_DELETE_HEADER_TITLE, 
						BRANCH_DELETE_SUCCESS_MESSAGE
				);
			}
			
			function deleteBranchFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				try{
					JSON.parse(statusText);
					
					genValidationErrorFromResponse(responseError);
				} catch(e){
					$uibModalInstance.close();
					
					showBootstrapDialog(
							BootstrapDialog.TYPE_DANGER, 
							DIALOG_DELETE_HEADER_TITLE, 
							BRANCH_DELETE_CATCH_MESSAGE
					);
				}
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
		}
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doDom2DbColumn()
	 * purpose: converts dom to dbcolumn (server-posting)
	 * ****************************** */
	function doDom2DbColumn(){
		var branch = vm.branch;
		var branchKeys = Object.keys(branch);
		var dom2DbColumn = vm.dom2DbColumn;
		var data = {};
		
		branchKeys.forEach(function(branchKey){
			var dbField = dom2DbColumn[branchKey];
			if(
					!(null == dbField) && 
					!(undefined == dbField)
			){
				data[dbField] = branch[branchKey];
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
	 * method name: showBootstrapDialog()
	 * purpose: shows bootstrap dialog box
	 * ****************************** */
	function showBootstrapDialog(dialogType, msgTitle, msgString){
		BootstrapDialog.alert({
			type: dialogType, 
			title: msgTitle, 
			message: msgString
		});
	}
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */