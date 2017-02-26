angular
.module('starter')
.controller('modalMenuController', modalMenuController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
modalMenuController.$inject = [
	'API_BASE_URL', 
	'$uibModalInstance', 
	'$timeout', 
	'menuService', 
	'menu', 
	'formMode', 
	'modalHiddenFields'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function modalMenuController(
		API_BASE_URL, 
		$uibModalInstance, 
		$timeout, 
		menuService, 
		menu, 
		formMode, 
		modalHiddenFields
){
	/* ******************************
	 * Messages Constants (Start)
	 * ****************************** */
	const DIALOG_ADD_HEADER_TITLE = 'ADD-MENU';
	const DIALOG_UPDATE_HEADER_TITLE = 'UPDATE-MENU';
	const DIALOG_DELETE_HEADER_TITLE = 'DELETE_MENU';
	const MENU_ADD_SUCCESS_MESSAGE = 'MENU ADDED SUCCESSFULLY';
	const MENU_UPDATE_SUCCESS_MESSAGE = 'MENU UPDATED SUCCESSFULLY';
	const MENU_DELETE_SUCCESS_MESSAGE = 'MENU DELETED SUCCESSFULLY';
	const MENU_ADD_CATCH_MESSAGE = 'UNABLE TO ADD MENU, DB EXCEPTION ENCOUNTERED';
	const MENU_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE MENU, DB EXCEPTION ENCOUNTERED';
	const MENU_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE MENU, DATA IS EMPTY/UNCHANGED';
	const MENU_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE MENU, DB EXCEPTION ENCOUNTERED';
	/* ******************************
	 * Messages Constants (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.formId = '#modalMenu';
	vm.formMode = formMode;
	vm.menu = menu;
	vm.menuCapture = JSON.parse(JSON.stringify(menu));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			menuName: 'menu_name', 
			companyName: 'company_name', 
			menuDesc: 'menu_desc', 
			menuImage: 'menu_image'
	}
	vm.dbColumn2Dom = {
			menu_name: 'menuName', 
			company_name: 'companyName', 
			menu_desc: 'menuDesc', 
			menu_image: 'menuImage'
	}
	vm.dbColumn2DomIndex = {
			menu_name: 0, 
			company_name: 1, 
			menu_desc: 2, 
			menu_image: 3
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
	vm.uploadMenuImage = uploadMenuImage;
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
		var menu = vm.menu;
		var menuImageId = '#menuImage';
		var menuImageBrowseId = '#menuImageBrowse';
		var menuImage = $(menuImageId);
		var menuImageBrowse = $(menuImageBrowseId);
		
		/* ******************************
		 * menuImage File Type (Start)
		 * ****************************** */
		menuImageBrowse.css('display', 'none');
		menuImageBrowse.on('change', menuImageBrowseChangeCallback);
		
		/* ******************************
		 * Method Implementation
		 * method name: menuImageBrowseChangeCallback
		 * purpose: handles input[type='file'] change event
		 * ****************************** */
		function menuImageBrowseChangeCallback(e){
			var eTarg = e.target;
			var eFiles = e.target.files;
			
			menu.menuImage = eFiles[0].name;
			
			$timeout(function(){
				vm.menu = menu;
			})
		}
		/* ******************************
		 * menuImage File Type (End)
		 * ****************************** */
		
		/* ******************************
		 * Input Controls (Start)
		 * ****************************** */
		if('D' == formMode){
			$('#modalMenuContainer input').prop('disabled', true);
			$('#modalMenuContainer textarea').prop('disabled', true);
			$('#modalMenuContainer select').prop('disabled', true);
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
	 * method name: uploadMenuImage()
	 * purpose: upload a menu image to server
	 * ****************************** */
	function uploadMenuImage(){
		var menu = vm.menu;
		var imgFileId = '#menuImageBrowse';
		var imgFile = $(imgFileId)[0].files[0];
		var modalMenuContainerId = '#modalMenuContainer';
		var modalMenuContainer = $(modalMenuContainerId);
		
		menuService.setCompanyName(menu.companyName);
		menuService.setMenuName(menu.menuName);
		menuService.uploadMenuImage(imgFile)
		.then(uploadMenuImageSuccessCallback)
		.catch(uploadMenuImageFailedCallback);
		
		showBootstrapLoader(modalMenuContainer);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function uploadMenuImageSuccessCallback(response){
			menu.menuImage = response.config.url;
			
			vm.menu = menu;
			
			hideLoadingOverlay(modalMenuContainer);
		}
		
		function uploadMenuImageFailedCallback(responseError){
			hideLoadingOverlay(modalMenuContainer);
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
		var modalMenuContainerId = '#modalMenuContainer';
		var modalMenuContainer = $(modalMenuContainerId);
		var data = [];
		
		data.push(doDom2DbColumn());
		
		showBootstrapLoader(modalMenuContainer);
		
		if('I' == formMode){
			var menu = vm.menu;
			var companyName = menu.companyName;
			menuService.setCompanyName(companyName);
			menuService.addMenu(data)
			.then(addMenuSuccessCallback)
			.catch(addMenuFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function addMenuSuccessCallback(response){
				hideLoadingOverlay(modalMenuContainer);
				
				$uibModalInstance.close();
				
				showBootstrapDialog(
						BootstrapDialog.TYPE_PRIMARY, 
						DIALOG_ADD_HEADER_TITLE, 
						MENU_ADD_SUCCESS_MESSAGE
				);
			}
			
			function addMenuFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideLoadingOverlay(modalMenuContainer);
				
				try{
					JSON.parse(statusText);
					
					genValidationErrorFromResponse(responseError);
				} catch(e){
					$uibModalInstance.close();
					
					showBootstrapDialog(
							BootstrapDialog.TYPE_DANGER, 
							DIALOG_ADD_HEADER_TITLE, 
							MENU_ADD_CATCH_MESSAGE
					);
				}
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
		
		} else if('A' == formMode){
			var menuCapture = vm.menuCapture;
			var companyName = menuCapture.companyName;
			var menuName = menuCapture.menuName; 
			
			discardModalHiddenFields();
			discardModalUnchangedFields();
			
			if(0 == Object.keys(data[0]).length){
				$uibModalInstance.close();
				
				showBootstrapDialog(
						BootstrapDialog.TYPE_DANGER, 
						DIALOG_UPDATE_HEADER_TITLE, 
						MENU_UPDATE_CUSTOM_ERR_MESSAGE
				);
				return
			}
			
			menuService.setCompanyName(companyName);
			menuService.setMenuName(menuName);
			menuService.updateMenu(data)
			.then(updateMenuSuccessCallback)
			.catch(updateMenuFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function updateMenuSuccessCallback(response){
				hideLoadingOverlay(modalMenuContainer);
				
				$uibModalInstance.close();
				
				showBootstrapDialog(
						BootstrapDialog.TYPE_PRIMARY, 
						DIALOG_UPDATE_HEADER_TITLE, 
						MENU_UPDATE_SUCCESS_MESSAGE
				);
			}
			
			function updateMenuFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideLoadingOverlay(modalMenuContainer);
				
				try{
					JSON.parse(statusText);
					
					genValidationErrorFromResponse(responseError);
				} catch(e){
					$uibModalInstance.close();
					
					showBootstrapDialog(
							BootstrapDialog.TYPE_DANGER, 
							DIALOG_UPDATE_HEADER_TITLE, 
							MENU_UPDATE_CATCH_MESSAGE
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
				var menuCapture = vm.menuCapture;
				var dbColumn2Dom = vm.dbColumn2Dom;
				
				dataCopyKeys.forEach(function(dataCopyKey){
					var dataCopyValue = dataCopy[dataCopyKey];
					var menuCaptureValue = menuCapture[dbColumn2Dom[dataCopyKey]];
					
					if(dataCopyValue == menuCaptureValue){	delete dataCopy[dataCopyKey];
					}
				});
				
				data[0] = dataCopy;
			}
		} else if('D' == formMode){
			var menu = vm.menu;
			var companyName = menu.companyName;
			var menuName = menu.menuName;
			menuService.setCompanyName(companyName);
			menuService.setMenuName(menuName);
			menuService.deleteMenu()
			.then(deleteMenuSuccessCallback)
			.catch(deleteMenuFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function deleteMenuSuccessCallback(response){
				hideLoadingOverlay(modalMenuContainer);
				
				$uibModalInstance.close();
				
				showBootstrapDialog(
						BootstrapDialog.TYPE_PRIMARY, 
						DIALOG_DELETE_HEADER_TITLE, 
						MENU_DELETE_SUCCESS_MESSAGE
				);
			}
			
			function deleteMenuFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideLoadingOverlay(modalMenuContainer);
				
				$uibModalInstance.close();
				
				try{
					JSON.parse(statusText);
					
					genValidationErrorFromResponse(responseError);
				} catch(e){
					$uibModalInstance.close();
					
					showBootstrapDialog(
							BootstrapDialog.TYPE_DANGER, 
							DIALOG_DELETE_HEADER_TITLE, 
							MENU_DELETE_CATCH_MESSAGE
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
		var menu = vm.menu;
		var menuKeys = Object.keys(menu);
		var dom2DbColumn = vm.dom2DbColumn;
		var data = {};
		
		menuKeys.forEach(function(menuKey){
			var dbField = dom2DbColumn[menuKey];
			if(
					!(null == dbField) && 
					!(undefined == dbField)
			){
				data[dbField] = menu[menuKey];
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
	 * method name: hideLoadingOverlay()
	 * purpose: hides bootstrap loader
	 * ****************************** */
	function hideLoadingOverlay(target){
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