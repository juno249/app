angular
.module('starter')
.factory('menuitemsService', menuitemsService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
menuitemsService.$inject = [
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
function menuitemsService(
		API_BASE_URL, 
		MENUITEMS_DB_FIELDS, 
		$http, 
		$q 
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var menuitemsServiceObj = {
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
			deleteMenuitem: deleteMenuitem
	};
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getMenuitems(){
		return menuitemsServiceObj.menuitems;
	}
	function getCompanyName(){
		return menuitemsServiceObj.companyName;
	}
	function getMenuName(){
		return menuitemsServiceObj.menuName;
	}
	function getMenuitemCode(){
		return menuitemsServiceObj.menuitemCode;
	}
	function setMenuitems(menuitems){
		menuitemsServiceObj.menuitems = menuitems;
	}
	function setCompanyName(companyName){
		menuitemsServiceObj.companyName = companyName;
	}
	function setMenuName(menuName){
		menuitemsServiceObj.menuName = menuName;
	}
	function setMenuitemCode(menuitemCode){
		menuitemsServiceObj.menuitemCode = menuitemCode;
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
				url: API_BASE_URL + '/companies/' + menuitemsServiceObj.companyName + '/menus/' + menuitemsServiceObj.menuName + '/menuitems'
		}
		$http(httpConfig)
		.then(fetchMenuitemsSuccessCallback)
		.catch(fetchMenuitemsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchMenuitemsSuccessCallback(response){
			menuitemsServiceObj.menuitems = {};
			convertMenuitemsResponseToMap(response.data);
			var menuitems = menuitemsServiceObj.menuitems;
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
				menuitemsServiceObj.menuitems[menuitemsKeyValue] = menuitemsDetails;
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
				url: API_BASE_URL + '/companies/' + menuitemsServiceObj.companyName + '/menus/' + menuitemsServiceObj.menuName + '/menuitems', 
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
				url: API_BASE_URL + '/companies/' + menuitemsServiceObj.companyName + '/menus/' + menuitemsServiceObj.menuName + '/menuitems/' + menuitemsServiceObj.menuitemCode, 
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
				url: API_BASE_URL + '/companies/' + menuitemsServiceObj.companyName + '/menus/' + menuitemsServiceObj.menuName + '/menuitems/' + menuitemsServiceObj.menuitemCode
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
	
	return menuitemsServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */