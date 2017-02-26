angular
.module('starter')
.controller('modalMenuitemController', modalMenuitemController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
modalMenuitemController.$inject = [
	'API_BASE_URL', 
	'$uibModalInstance', 
	'$timeout', 
	'menuitemService', 
	'menuitem', 
	'formMode', 
	'modalHiddenFields'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function modalMenuitemController(
		API_BASE_URL, 
		$uibModalInstance, 
		$timeout, 
		menuitemService, 
		menuitem, 
		formMode, 
		modalHiddenFields
){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	
	/* ******************************
	 * Messages Constants (Start)
	 * ****************************** */
	const DIALOG_ADD_HEADER_TITLE = 'ADD-MENUITEM';
	const DIALOG_UPDATE_HEADER_TITLE = 'UPDATE-MENUITEM';
	const DIALOG_DELETE_HEADER_TITLE = 'DELETE_MENUITEM';
	const MENUITEM_ADD_SUCCESS_MESSAGE = 'MENUITEM ADDED SUCCESSFULLY';
	const MENUITEM_UPDATE_SUCCESS_MESSAGE = 'MENUITEM UPDATED SUCCESSFULLY';
	const MENUITEM_DELETE_SUCCESS_MESSAGE = 'MENUITEM DELETED SUCCESSFULLY';
	const MENUITEM_ADD_CATCH_MESSAGE = 'UNABLE TO ADD MENUITEM, DB EXCEPTION ENCOUNTERED';
	const MENUITEM_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE MENUITEM, DB EXCEPTION ENCOUNTERED';
	const MENUITEM_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE MENUITEM, DATA IS EMPTY/UNCHANGED';
	const MENUITEM_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE MENUITEM, DB EXCEPTION ENCOUNTERED';
	/* ******************************
	 * Messages Constants (End)
	 * ****************************** */
	
	var vm = this;
	vm.formId = '#modalMenuitem';
	vm.formMode = formMode;
	vm.menuitem = menuitem;
	vm.menuitemCapture = JSON.parse(JSON.stringify(menuitem));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			menuitemCode: 'menuitem_code', 
			menuitemName: 'menuitem_name', 
			menuitemDesc: 'menuitem_desc', 
			menuitemPrice: 'menuitem_price', 
			menuitemImage: 'menuitem_image'
	}
	vm.dbColumn2Dom = {
			menuitem_code: 'menuitemCode', 
			menuitem_name: 'menuitemName', 
			menuitem_desc: 'menuitemDesc', 
			menuitem_price: 'menuitemPrice', 
			menuitem_image: 'menuitemImage'
	}
	vm.dbColumn2DomIndex = {
			menuitem_code: 0, 
			menuitem_name: 1, 
			menuitem_desc: 2, 
			menuitem_price: 3, 
			menuitem_image: 4
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
	vm.uploadMenuitemImage =uploadMenuitemImage;
	/* ******************************
	 * Controller Binded Method (end)
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
		var menuitem = vm.menuitem;
		var menuitemImageId = '#menuitemImage';
		var menuitemImageBrowseId = '#menuitemImageBrowse';
		var menuitemImage = $(menuitemImageId);
		var menuitemImageBrowse = $(menuitemImageBrowseId);
		
		/* ******************************
		 * menuitemImageBrowse File Type (Start)
		 * ****************************** */
		menuitemImageBrowse.css('display', 'none');
		menuitemImageBrowse.on('change', menuitemImageBrowseChangeCallback);
		
		/* ******************************
		 * Method Implementation
		 * method name: menuitemImageBrowseChangeCallback
		 * purpose: handles input[type='file'] change event
		 * ****************************** */
		function menuitemImageBrowseChangeCallback(e){
			var eTarg = e.target;
			var eFiles = e.target.files;
			
			menuitem.menuitemImage = eFiles[0].name;
			
			$timeout(function(){
				vm.menuitem = menuitem;
			})
		}
		/* ******************************
		 * menuitemImageBrowse File Type (End)
		 * ****************************** */
		
		/* ******************************
		 * Input Controls (Start)
		 * ****************************** */
		if('D' == formMode){
			$('#modalMenuitemContainer input').prop('disabled', true);
			$('#modalMenuitemContainer textarea').prop('disabled', true);
			$('#modalMenuitemContainer select').prop('disabled', true);
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
	 * method name: uploadMenuitemImage()
	 * purpose: upload a menuitem image to server
	 * ****************************** */
	function uploadMenuitemImage(){
		var menuitem = vm.menuitem;
		var imgFileId = '#menuitemImageBrowse';
		var imgFile = $(imgFileId)[0].files[0];
		var modalMenuitemContainerId = '#modalMenuitemContainer';
		var modalMenuitemContainer = $(modalMenuitemContainerId);
		
		menuitemService.setCompanyName(menuitem.companyName);
		menuitemService.setMenuName(menuitem.menuName);
		menuitemService.uploadMenuitemImage(imgFile)
		.then(uploadMenuitemImageSuccessCallback)
		.catch(uploadMenuitemImageFailedCallback);
		
		showBootstrapLoader(modalMenuitemContainer);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function uploadMenuitemImageSuccessCallback(response){
			menuitem.menuitemImage = response.config.url;
			
			vm.menuitem = menuitem;
			
			hideBootstrapLoader(modalMenuitemContainer);
		}
		
		function uploadMenuitemImageFailedCallback(responseError){
			hideBootstrapLoader(modalMenuitemContainer);
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
		var modalMenuitemContainerId = '#modalMenuitemContainer';
		var modalMenuitemContainer = $(modalMenuitemContainerId);
		var data = [];
		
		data.push(doDom2DbColumn());
		
		showBootstrapLoader(modalMenuitemContainer);
		
		if('I' == formMode){
			var menuitem = vm.menuitem;
			var companyName = menuitem.companyName;
			var menuName = menuitem.menuName;
			menuitemService.setCompanyName(companyName);
			menuitemService.setMenuName(menuName);
			menuitemService.addMenuitem(data)
			.then(addMenuitemSuccessCallback)
			.catch(addMenuitemFailedCallback);
			
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function addMenuitemSuccessCallback(response){
				hideBootstrapLoader(modalMenuitemContainer);
				
				$uibModalInstance.close();
				
				showBootstrapDialog(
						BootstrapDialog.TYPE_PRIMARY, 
						DIALOG_ADD_HEADER_TITLE, 
						MENUITEM_ADD_SUCCESS_MESSAGE
				);
			}
			
			function addMenuitemFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalMenuitemContainer);
				
				try{
					JSON.parse(statusText);
					
					genValidationErrorFromResponse(responseError);
				} catch(e){
					$uibModalInstance.close();
					
					showBootstrapDialog(
							BootstrapDialog.TYPE_DANGER, 
							DIALOG_ADD_HEADER_TITLE, 
							MENUITEM_ADD_CATCH_MESSAGE
					);
				}
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
			
		} else if('A' == formMode){
			var menuitemCapture = vm.menuitemCapture;
			var companyName = menuitemCapture.companyName;
			var menuName = menuitemCapture.menuName;
			var menuitemCode = menuitemCapture.menuitemCode;
			
			discardModalHiddenFields();
			discardModalUnchangedFields();
			
			if(0 == Object.keys(data).length){
				$uibModalInstance.close();
				
				showBootstrapDialog(
						BootstrapDialog.TYPE_DANGER, 
						DIALOG_UPDATE_HEADER_TITLE, 
						MENUITEM_UPDATE_CUSTOM_ERR_MESSAGE
				);
				return;
			}
			
			menuitemService.setCompanyName(companyName);
			menuitemService.setMenuName(menuName);
			menuitemService.setMenuitemCode(menuitemCode);
			menuitemService.updateMenuitem(data)
			.then(updateMenuitemSuccessCallback)
			.catch(updateMenuitemFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function updateMenuitemSuccessCallback(response){
				hideBootstrapLoader(modalMenuitemContainer);
				
				$uibModalInstance.close();
				
				showBootstrapDialog(
						BootstrapDialog.TYPE_PRIMARY, 
						DIALOG_UPDATE_HEADER_TITLE, 
						MENUITEM_UPDATE_SUCCESS_MESSAGE
				);
			}
			
			function updateMenuitemFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalMenuitemContainer);
				
				try{
					JSON.parse(statusText);
					
					genValidationErrorFromResponse(responseError);
				} catch(e){
					$uibModalInstance.close();
					
					showBootstrapDialog(
							BootstrapDialog.TYPE_DANGER, 
							DIALOG_UPDATE_HEADER_TITLE, 
							MENUITEM_UPDATE_CATCH_MESSAGE
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
				var menuitemCapture = vm.menuitemCapture;
				var dbColumn2Dom = vm.dbColumn2Dom;
				
				dataCopyKeys.forEach(function(dataCopyKey){
					var dataCopyValue = dataCopy[dataCopyKey];
					var menuitemCaptureValue = menuitemCapture[dbColumn2Dom[dataCopyKey]];
					
					if(dataCopyValue == menuitemCaptureValue){	delete dataCopy[dataCopyKey];
					}
				});
				
				data[0] = dataCopy;
			}
		} else if('D' == formMode){
			var menuitem = vm.menuitem;
			var companyName = menuitem.companyName;
			var menuName = menuitem.menuName; 
			var menuitemCode = menuitem.menuitemCode;
			menuitemService.setCompanyName(companyName);
			menuitemService.setMenuName(menuName);
			menuitemService.setMenuitemCode(menuitemCode);
			menuitemService.deleteMenuitem()
			.then(deleteMenuitemSuccessCallback)
			.catch(deleteMenuitemFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function deleteMenuitemSuccessCallback(response){
				hideBootstrapLoader(modalMenuitemContainer);
				
				$uibModalInstance.close();
				
				showBootstrapDialog(
						BootstrapDialog.TYPE_PRIMARY, 
						DIALOG_DELETE_HEADER_TITLE, 
						MENUITEM_DELETE_SUCCESS_MESSAGE
				);
			}
			
			function deleteMenuitemFailedCallback(responseError){
				var statusText = responseError.statusText;
				
				hideBootstrapLoader(modalMenuitemContainer);
				
				$uibModalInstance.close();
				
				try{
					JSON.parse(statusText);
					
					genValidationErrorFromResponse(responseError);
				} catch(e){
					$uibModalInstance.close();
					
					showBootstrapDialog(
							BootstrapDialog.TYPE_DANGER, 
							DIALOG_DELETE_HEADER_TITLE, 
							MENUITEM_DELETE_CATCH_MESSAGE
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
		var menuitem = vm.menuitem;
		var menuitemKeys = Object.keys(menuitem);
		var dom2DbColumn = vm.dom2DbColumn;
		var data = {};
		
		menuitemKeys.forEach(function(menuitemKey){
			var dbField = dom2DbColumn[menuitemKey];
			if(
					!(null == dbField) && 
					!(undefined == dbField)
			){
				data[dbField] = menuitem[menuitemKey];
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