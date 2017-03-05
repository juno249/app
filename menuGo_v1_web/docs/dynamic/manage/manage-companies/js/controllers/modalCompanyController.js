angular
.module('starter')
.controller('modalCompanyController', modalCompanyController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
modalCompanyController.$inject = [
	'API_BASE_URL', 
	'$uibModalInstance', 
	'$scope', 
	'$timeout', 
	'companyService', 
	'company', 
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
function modalCompanyController(
		API_BASE_URL, 
		$uibModalInstance, 
		$scope, 
		$timeout, 
		companyService, 
		company, 
		formMode, 
		fromSignup, 
		modalHiddenFields
){	
	/* ******************************
	 * Messages Constants (Start)
	 * ****************************** */
	const COMPANY_ADD_CATCH_MESSAGE = 'UNABLE TO ADD COMPANY, DB EXCEPTION ENCOUNTERED';
	const COMPANY_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE COMPANY, DB EXCEPTION ENCOUNTERED';
	const COMPANY_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE COMPANY, DATA IS EMPTY/UNCHANGED';
	const COMPANY_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE COMPANY, DB EXCEPTION ENCOUNTERED';
	/* ******************************
	 * Messages Constants (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.formId = '#modalCompany';
	vm.formMode = formMode;
	vm.fromSignup = fromSignup;
	vm.company = company;
	vm.companyCapture = JSON.parse(JSON.stringify(company));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			companyName: 'company_name', 
			companyDesc: 'company_desc', 
			companyCategory: 'company_category', 
			companyLogo: 'company_logo'
	};
	vm.dbColumn2Dom = {
			company_name: 'companyName', 
			company_desc: 'companyDesc', 
			company_category: 'companyCategory', 
			company_logo: 'companyLogo'
	}
	vm.dbColumn2DomIndex = {
			company_name: 0, 
			company_desc: 1, 
			company_category: 2, 
			company_logo: 3
	}
	vm.validationErr = {};
	vm.validationErrDB = undefined;
	vm.isValidationErrDBHidden = true;
	vm.companyLogoImage = undefined;
	vm.isCompanyLogoImageHidden = true;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.initBootstrapValidator = initBootstrapValidator;
	vm.initDom = initDom;
	vm.doCancel = doCancel;
	vm.uploadCompanyLogo = uploadCompanyLogo;
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
	 * method name: initDom
	 * purpose: initializes Dom object attributes
	 * ****************************** */
	function initDom(){
		var formMode = vm.formMode;
		var company = vm.company;
		var companyLogoId = '#companyLogo';
		var companyLogoBrowseId = '#companyLogoBrowse';
		var companyLogo = $(companyLogoId);
		var companyLogoBrowse =$(companyLogoBrowseId);
		
		/* ******************************
		 * companyLogoBrowse File Type (Start)
		 * ****************************** */
		companyLogoBrowse.css('display', 'none');
		companyLogoBrowse.on('change', companyLogoBrowseChangeCallback);
		/* ******************************
		 * Method Implementation
		 * method name: companyLogoBrowseChangeCallback
		 * purpose: handles input[type='file'] change event
		 * ****************************** */
		function companyLogoBrowseChangeCallback(e){
			var eTarg = e.target;
			var eFiles = e.target.files;
			var isCompanyLogoImageHidden = vm.isCompanyLogoImageHidden;

			company.companyLogo = eFiles[0].name;
			isCompanyLogoImageHidden = true;
			
			vm.isCompanyLogoImageHidden = isCompanyLogoImageHidden;
			$timeout(function(){
				vm.company = company;
			})
		}
		/* ******************************
		 * companyLogoBrowse File Type (End)
		 * ****************************** */
		
		/* ******************************
		 * Input Controls (Start)
		 * ****************************** */
		if('D' == formMode){
			$('#modalCompanyContainer input').prop('disabled', true);
			$('#modalCompanyContainer textarea').prop('disabled', true);
			$('#modalCompanyContainer select').prop('disabled', true);
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
	 * method name: uploadCompanyLogo()
	 * purpose: upload a company logo to server
	 * ****************************** */
	function uploadCompanyLogo(){
		var company = vm.company;
		var imgFileId = '#companyLogoBrowse';
		var imgFile = $(imgFileId)[0].files[0];
		var modalCompanyContainerId = '#modalCompanyContainer';
		var modalCompanyContainer = $(modalCompanyContainerId);
		
		companyService.setCompanyName(company.companyName);
		companyService.uploadCompanyLogo(imgFile)
		.then(uploadCompanyLogoSuccessCallback)
		.catch(uploadCompanyLogoFailedCallback);
		
		showBootstrapLoader(modalCompanyContainer);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function uploadCompanyLogoSuccessCallback(response){
			var companyLogoImage = vm.companyLogoImage;
			var isCompanyLogoImageHidden = vm.isCompanyLogoImageHidden;
			var appQueryStr = '?timestamp=' + new Date().getTime();
			
			company.companyLogo = response.config.url + appQueryStr;
			companyLogoImage = company.companyLogo;
			isCompanyLogoImageHidden = false;
			
			vm.company = company;
			vm.companyLogoImage = companyLogoImage;
			vm.isCompanyLogoImageHidden = isCompanyLogoImageHidden;
			hideBootstrapLoader(modalCompanyContainer);
		}
		
		function uploadCompanyLogoFailedCallback(responseError){
			hideBootstrapLoader(modalCompanyContainer);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doSubmit()
	 * purpose: handles form-submission (insert/amend)
	 * ****************************** */
	function doSubmit(e){
		var formMode = vm.formMode;
		var fromSignup = vm.fromSignup;
		var modalCompanyContainerId = '#modalCompanyContainer';
		var modalCompanyContainer = $(modalCompanyContainerId);
		var data = [];
		
		hideBootstrapAlert();
		
		data.push(doDom2DbColumn());
		
		showBootstrapLoader(modalCompanyContainer);
		
		if('I' == formMode){
			if(fromSignup){
				companyService.addCompanyValidate(data)
				.then(addCompanyValidateSuccessCallback)
				.catch(addCompanyValidateFailedCallback);
				
				/* ******************************
				 * Callback Implementations (Start)
				 * ****************************** */
				function addCompanyValidateSuccessCallback(response){
					hideBootstrapLoader(modalCompanyContainer);
					$uibModalInstance.close(data);
				}
				
				function addCompanyValidateFailedCallback(responseError){
					hideBootstrapLoader(modalCompanyContainer);
					genValidationErrorFromResponse(responseError);
				}
				/* ******************************
				 * Callback Implementations (End)
				 * ****************************** */
				return;
			}
			
			companyService.addCompany(data)
			.then(addCompanySuccessCallback)
			.catch(addCompanyFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function addCompanySuccessCallback(response){
				hideBootstrapLoader(modalCompanyContainer);
				$uibModalInstance.close();
			}
			
			function addCompanyFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalCompanyContainer);
				try{
					JSON.parse(statusText);
					genValidationErrorFromResponse(responseError);
				} catch(e){	showBootstrapAlert(COMPANY_ADD_CATCH_MESSAGE);
				}
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
			
		} else if('A' == formMode){
			var companyCapture = vm.companyCapture;
			var companyName = companyCapture.companyName;
			
			discardModalHiddenFields();
			discardModalUnchangedFields();
			
			if(0 == Object.keys(data[0]).length){
				hideBootstrapLoader(modalCompanyContainer);
				showBootstrapAlert(COMPANY_UPDATE_CUSTOM_ERR_MESSAGE);
				return;
			}
			
			companyService.setCompanyName(companyName);
			companyService.updateCompany(data)
			.then(updateCompanySuccessCallback)
			.catch(updateCompanyFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function updateCompanySuccessCallback(response){
				hideBootstrapLoader(modalCompanyContainer);
				$uibModalInstance.close();
			}
			
			function updateCompanyFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalCompanyContainer);
				try{
					JSON.parse(statusText);
					genValidationErrorFromResponse(responseError);
				} catch(e){	showBootstrapAlert(COMPANY_UPDATE_CATCH_MESSAGE);
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
				var companyCapture = vm.companyCapture;
				var dbColumn2Dom = vm.dbColumn2Dom;
				
				dataCopyKeys.forEach(function(dataCopyKey){
					var dataCopyValue = dataCopy[dataCopyKey];
					var companyCaptureValue = companyCapture[dbColumn2Dom[dataCopyKey]];
					
					if(dataCopyValue == companyCaptureValue){	delete dataCopy[dataCopyKey];
					}
				});
				
				data[0] = dataCopy;
			}
		} else if('D' == formMode){
			var company = vm.company;
			var companyName = company.companyName;
			companyService.setCompanyName(companyName);
			companyService.deleteCompany()
			.then(deleteCompanySuccessCallback)
			.catch(deleteCompanyFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function deleteCompanySuccessCallback(response){
				hideBootstrapLoader(modalCompanyContainer);
				$uibModalInstance.close();
			}
						
			function deleteCompanyFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalCompanyContainer);
				try{
					JSON.parse(statusText)
					genValidationErrorFromResponse(responseError);
				} catch(e){	showBootstrapAlert(COMPANY_DELETE_CATCH_MESSAGE);
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
		var company = vm.company;
		var companyKeys = Object.keys(company);
		var dom2DbColumn = vm.dom2DbColumn;
		var data = {};
		
		companyKeys.forEach(function(companyKey){
			var dbField = dom2DbColumn[companyKey];
			if(
					!(null == dbField) && 
					!(undefined == dbField)
			){
				data[dbField] = company[companyKey];
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
			
			if(statusTextKey == (arrIndex + '.' + dbColumnName)){
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