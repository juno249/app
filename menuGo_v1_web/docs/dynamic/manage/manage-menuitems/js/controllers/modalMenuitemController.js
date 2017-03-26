angular
.module('starter')
.controller(
		'modalMenuitemController', 
		modalMenuitemController
		);

modalMenuitemController.$inject = [
	'API_BASE_URL', 
	'IS_FEATURED_VALUES', 
	'$uibModalInstance', 
	'$timeout', 
	'menuitemService', 
	'menuitem', 
	'formMode', 
	'modalHiddenFields'
	];

function modalMenuitemController(
		API_BASE_URL, 
		IS_FEATURED_VALUES, 
		$uibModalInstance, 
		$timeout, 
		menuitemService, 
		menuitem, 
		formMode, 
		modalHiddenFields
		){
	
	const MENUITEM_ADD_CATCH_MESSAGE = 'UNABLE TO ADD MENUITEM, DB EXCEPTION ENCOUNTERED';
	const MENUITEM_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE MENUITEM, DB EXCEPTION ENCOUNTERED';
	const MENUITEM_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE MENUITEM, DATA IS EMPTY/UNCHANGED';
	const MENUITEM_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE MENUITEM, DB EXCEPTION ENCOUNTERED';
	const DOM_FORM = '#modalMenuitem';
	const DOM_MODAL = '#modalMenuitemContainer';
	
	var vm = this;
	vm.formMode = formMode;
	vm.menuitem = menuitem;
	vm.menuitemSnapshot = JSON.parse(JSON.stringify(menuitem));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			menuitemCode: 'menuitem_code', 
			menuitemName: 'menuitem_name', 
			menuitemDesc: 'menuitem_desc', 
			menuitemPrice: 'menuitem_price', 
			menuitemFeatured: 'menuitem_featured', 
			menuitemImage: 'menuitem_image'
				}
	vm.dbColumn2Dom = {
			menuitem_code: 'menuitemCode', 
			menuitem_name: 'menuitemName', 
			menuitem_desc: 'menuitemDesc', 
			menuitem_price: 'menuitemPrice', 
			menuitem_featured: 'menuitemFeatured', 
			menuitem_image: 'menuitemImage'
				}
	vm.dbColumn2DomIndex = {
			menuitem_code: 0, 
			menuitem_name: 1, 
			menuitem_desc: 2, 
			menuitem_price: 3, 
			menuitem_featured: 4, 
			menuitem_image: 5
			}
	vm.featuredOptions = IS_FEATURED_VALUES;
	vm.validationErr = {};
	vm.validationErrDB = {};
	vm.isValidationErrDBHidden = true;
	vm.isMenuitemImageImageHidden = true;
	
	//controller_method
	vm.initBootstrapValidator = initBootstrapValidator;
	//controller_method
	vm.initDom = initDom;
	//controller_method
	vm.doCancel = doCancel;
	//controller_method
	vm.uploadMenuitemImage =uploadMenuitemImage;
	
	function initBootstrapValidator(){
		$.fn.validator.Constructor.INPUT_SELECTOR = ':input:not(".ng-hide")';
		
		$(DOM_FORM).validator();
		$(DOM_FORM).validator().on(
				'submit', 
				doSubmit
				);
		
		$timeout(	function(){	$(DOM_FORM).validator('update');
		}
		);
		}
	
	function initDom(){
		const MENUITEM_IMAGE_BROWSE = '#menuitemImageBrowse';
		
		var menuitemImageBrowse = $(MENUITEM_IMAGE_BROWSE);
		
		$(MENUITEM_IMAGE_BROWSE).css(
				'display', 
				'none'
				);
		$(MENUITEM_IMAGE_BROWSE).on(
				'change', 
				menuitemImageBrowseChangeCallback
				);
		
		function menuitemImageBrowseChangeCallback(e){
			var eFiles = e.target.files;
			
			$timeout(
					function(){
						vm.menuitem.menuitemImage = eFiles[0].name;
						vm.isMenuitemImageImageHidden = true;
						}
					);
			}
		
		if('D' == vm.formMode){
			$('#modalMenuitemContainer input').prop(
					'disabled', 
					true
					);
			$('#modalMenuitemContainer textarea').prop(
					'disabled', 
					true
					);
			$('#modalMenuitemContainer select').prop(
					'disabled', 
					true
					);
			}
		}
	
	function doCancel(){	$uibModalInstance.close();
	}
	
	function uploadMenuitemImage(){
		const MENUITEM_IMAGE_BROWSE = '#menuitemImageBrowse';
		
		var menuitemImage = $(MENUITEM_IMAGE_BROWSE)[0].files[0];
		
		menuitemService.setCompanyName(vm.menuitem.companyName);
		menuitemService.setMenuName(vm.menuitem.menuName);
		
		menuitemService.uploadMenuitemImage(menuitemImage)
		.then(uploadMenuitemImageSuccessCallback)
		.catch(uploadMenuitemImageFailedCallback);
		
		showBootstrapLoader($(DOM_MODAL));
		
		function uploadMenuitemImageSuccessCallback(response){
			var appQueryStr = '?timestamp=' + new Date().getTime();
			
			vm.menuitem.menuitemImage = response.config.url + appQueryStr;
			vm.isMenuitemImageImageHidden = false;
			
			hideBootstrapLoader($(DOM_MODAL));
			}
		
		function uploadMenuitemImageFailedCallback(responseError){	hideBootstrapLoader($(DOM_MODAL));
		}
		}
	
	function doSubmit(e){
		var data = [];
		
		data.push(doDom2DbColumn());
		
		hideBootstrapAlert();
		
		showBootstrapLoader($(DOM_MODAL));
		
		if('I' == vm.formMode){
			menuitemService.setCompanyName(vm.menuitem.companyName);
			menuitemService.setMenuName(vm.menuitem.menuName);
			
			menuitemService.addMenuitem(data)
			.then(addMenuitemSuccessCallback)
			.catch(addMenuitemFailedCallback);
			
			function addMenuitemSuccessCallback(response){
				hideBootstrapLoader($(DOM_MODAL));
				
				$uibModalInstance.close();
				}
			
			function addMenuitemFailedCallback(responseError){
				hideBootstrapLoader($(DOM_MODAL));
				
				try{
					JSON.parse(responseError.statusText);
					genValidationErrorFromResponse(responseError);
					} catch(e){	showBootstrapAlert(MENUITEM_ADD_CATCH_MESSAGE);
					}
					}
			} else if('A' == vm.formMode){
				discardModalHiddenFields();
				discardModalUnchangedFields();
				
				if(0 == Object.keys(data).length){
					hideBootstrapLoader($(DOM_MODAL));
					
					showBootstrapLoader(MENUITEM_UPDATE_CUSTOM_ERR_MESSAGE);
					
					return;
					}
				
				menuitemService.setCompanyName(vm.menuitemSnapshot.companyName);
				menuitemService.setMenuName(vm.menuitemSnapshot.menuName);
				menuitemService.setMenuitemCode(vm.menuitemSnapshot.menuitemCode);
				
				menuitemService.updateMenuitem(data)
				.then(updateMenuitemSuccessCallback)
				.catch(updateMenuitemFailedCallback);
				
				function updateMenuitemSuccessCallback(response){
					hideBootstrapLoader($(DOM_MODAL));
					
					$uibModalInstance.close();
					}
				
				function updateMenuitemFailedCallback(responseError){
					hideBootstrapLoader($(DOM_MODAL));
					
					try{
						JSON.parse(responseError.statusText);
						genValidationErrorFromResponse(responseError);
						} catch(e){	showBootstrapAlert(MENUITEM_UPDATE_CATCH_MESSAGE);
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
								var menuitemSnapshotValue = vm.menuitemSnapshot[vm.dbColumn2Dom[dataKey]];
								
								if(dataValue == menuitemSnapshotValue){	delete data[0][dataKey];
								}
								}
							);
					}
				} else if('D' == vm.formMode){
					menuitemService.setCompanyName(vm.menuitem.companyName);
					menuitemService.setMenuName(vm.menuitem.menuName);
					menuitemService.setMenuitemCode(vm.menuitem.menuitemCode);
					
					menuitemService.deleteMenuitem()
					.then(deleteMenuitemSuccessCallback)
					.catch(deleteMenuitemFailedCallback);\
					
					function deleteMenuitemSuccessCallback(response){
						hideBootstrapLoader($(DOM_MODAL));
						
						$uibModalInstance.close();
						}
					
					function deleteMenuitemFailedCallback(responseError){
						hideBootstrapLoader($(DOM_MODAL));
						
						try{
							JSON.parse(responseError.statusText);
							genValidationErrorFromResponse(responseError);
							} catch(e){	showBootstrapAlert(MENUITEM_DELETE_CATCH_MESSAGE);
							}
							}
					}
		
		vm.validationErr = {};
		vm.validationErrDB = {};
		}
	
	function doDom2DbColumn(){
		var data = {};
		
		Object.keys(vm.menuitem).forEach(
				function(menuitemKey){
					if(
							!(null == vm.dom2DbColumn[menuitemKey]) && 
							!(undefined == vm.dom2DbColumn[menuitemKey])
							){	data[vm.dom2DbColumn[menuitemKey]] = vm.menuitem[menuitemKey];
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