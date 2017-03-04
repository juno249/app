angular
.module('starter')
.factory('menuitemService', menuitemService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
menuitemService.$inject = [
	'API_BASE_URL', 
	'MENUITEMS_DB_FIELDS', 
	'$http', 
	'$q' 
];
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function menuitemService(
		API_BASE_URL, 
		MENUITEMS_DB_FIELDS, 
		$http, 
		$q 
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var menuitemServiceObj = {
			menuitems: {}, 
			companyName: undefined, 
			menuName: undefined, 
			menuitemCode: undefined, 
			getMenuitems: getMenuitems, 
			getCompanyName: getCompanyName, 
			getMenuName: getMenuName, 
			getMenuitemCode: getMenuitemCode, 
			setMenuitems: setMenuitems, 
			setCompanyName: setCompanyName, 
			setMenuName: setMenuName, 
			setMenuitemCode: setMenuitemCode, 
			fetchMenuitems: fetchMenuitems, 
			addMenuitem: addMenuitem, 
			updateMenuitem: updateMenuitem, 
			deleteMenuitem: deleteMenuitem, 
			uploadMenuitemImage: uploadMenuitemImage
	};
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getMenuitems(){
		return menuitemServiceObj.menuitems;
	}
	function getCompanyName(){
		return menuitemServiceObj.companyName;
	}
	function getMenuName(){
		return menuitemServiceObj.menuName;
	}
	function getMenuitemCode(){
		return menuitemServiceObj.menuitemCode;
	}
	function setMenuitems(menuitems){
		menuitemServiceObj.menuitems = menuitems;
	}
	function setCompanyName(companyName){
		menuitemServiceObj.companyName = companyName;
	}
	function setMenuName(menuName){
		menuitemServiceObj.menuName = menuName;
	}
	function setMenuitemCode(menuitemCode){
		menuitemServiceObj.menuitemCode = menuitemCode;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchMenuitems()
	 * purpose: fetch menuitems from server
	 * ****************************** */
	function fetchMenuitems(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + menuitemServiceObj.companyName + '/menus/' + menuitemServiceObj.menuName + '/menuitems'
		}
		$http(httpConfig)
		.then(fetchMenuitemsSuccessCallback)
		.catch(fetchMenuitemsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchMenuitemsSuccessCallback(response){
			menuitemServiceObj.menuitems = {};
			convertMenuitemsResponseToMap(response.data);
			var menuitems = menuitemServiceObj.menuitems;
			response.data = menuitems;
			deferred.resolve(response);
		}
		
		function fetchMenuitemsFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertMenuitemsResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertMenuitemsResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var menuitemsKey = MENUITEMS_DB_FIELDS[1]; //menuitem_code
			var menuitemsDetails = {};
			
			for(var i=0; i<responseDataLength; i++){
				var menuitemsRunner = responseData[i];
				var menuitemsDBFieldCount = Object.keys(MENUITEMS_DB_FIELDS).length;
				var menuitemsDBFieldRunner = null;
				menuitemsDetails = {};
				
				for(var j=0; j<menuitemsDBFieldCount; j++){
					menuitemsDBFieldRunner = MENUITEMS_DB_FIELDS[j];
					menuitemsDetails[menuitemsDBFieldRunner] = menuitemsRunner[menuitemsDBFieldRunner];
				}
				var menuitemsKeyValue = menuitemsRunner[menuitemsKey];
				menuitemServiceObj.menuitems[menuitemsKeyValue] = menuitemsDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addMenuitem()
	 * purpose: adds menuitem
	 * ****************************** */
	function addMenuitem(menuitems){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + menuitemServiceObj.companyName + '/menus/' + menuitemServiceObj.menuName + '/menuitems', 
				data: menuitems
		};
		$http(httpConfig)
		.then(addMenuitemsSuccessCallback)
		.catch(addMenuitemsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addMenuitemsSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addMenuitemsFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateMenuitem()
	 * purpose: updates menuitem
	 * ****************************** */
	function updateMenuitem(menuitem){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + menuitemServiceObj.companyName + '/menus/' + menuitemServiceObj.menuName + '/menuitems/' + menuitemServiceObj.menuitemCode, 
				data: menuitem
		};
		$http(httpConfig)
		.then(updateMenuitemSuccessCallback)
		.catch(updateMenuitemFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function  updateMenuitemSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateMenuitemFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteMenuitem()
	 * purpose: updates menuitem
	 * ****************************** */
	function deleteMenuitem(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + menuitemServiceObj.companyName + '/menus/' + menuitemServiceObj.menuName + '/menuitems/' + menuitemServiceObj.menuitemCode
		};
		$http(httpConfig)
		.then(deleteMenuitemSuccessCallback)
		.catch(deleteMenuitemFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteMenuitemSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteMenuitemFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: uploadMenuitemImage()
	 * purpose: uploads menuitem image
	 * ****************************** */
	function uploadMenuitemImage(imgFile){
		var httpFD = new FormData();
		httpFD.append('imgFile', imgFile);
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + menuitemServiceObj.companyName + '/menus/' + menuitemServiceObj.menuName + '/menuitems/' + menuitemServiceObj.menuitemCode + '/menuitemImage', 
				data: httpFD, 
				headers: {	'Content-Type': undefined	}
		}
		$http(httpConfig)
		.then(uploadMenuitemImageSuccessCallback)
		.catch(uploadMenuitemImageFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function uploadMenuitemImageSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function uploadMenuitemImageFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	return menuitemServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */