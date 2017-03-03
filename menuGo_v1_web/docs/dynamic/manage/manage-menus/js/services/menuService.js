angular
.module('starter')
.factory('menuService', menuService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
menuService.$inject = [
	'API_BASE_URL', 
	'MENUS_DB_FIELDS', 
	'$http', 
	'$httpParamSerializerJQLike', 
	'$localStorage', 
	'$q' 
];
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function menuService(
		API_BASE_URL, 
		MENUS_DB_FIELDS, 
		$http, 
		$httpParamSerializerJQLike, 
		$localStorage, 
		$q 
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var menuServiceObj = {
		menus: {}, 
		companyName: undefined, 
		menuName: undefined, 
		getMenus: getMenus, 
		getCompanyName: getCompanyName, 
		getMenuName: getMenuName, 
		setMenus: setMenus, 
		setCompanyName: setCompanyName, 
		setMenuName: setMenuName, 
		fetchMenus: fetchMenus, 
		addMenu: addMenu, 
		updateMenu: updateMenu, 
		deleteMenu: deleteMenu, 
		uploadMenuImage: uploadMenuImage
	};
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getMenus(){
		return menuServiceObj.menus;
	}
	function getCompanyName(){
		return menuServiceObj.companyName;
	}
	function getMenuName(){
		return menuServiceObj.menuName
	}
	function setMenus(menus){
		menuServiceObj.menus = menus;
	}
	function setCompanyName(companyName){
		menuServiceObj.companyName = companyName;
	}
	function setMenuName(menuName){
		menuServiceObj.menuName = menuName;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchMenus()
	 * purpose: fetch menus from server
	 * ****************************** */
	function fetchMenus(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus'
		}
		$http(httpConfig)
		.then(fetchMenusSuccessCallback)
		.catch(fetchMenusFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchMenusSuccessCallback(response){
			menuServiceObj.menus = {};
			convertMenusResponseToMap(response.data);
			var menus = menuServiceObj.menus;
			menus = JSON.stringify(menus);
			localStorage.setItem('Menus', menus);
			deferred.resolve(response);
		}
		
		function fetchMenusFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertMenusResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertMenusResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var menusKey = MENUS_DB_FIELDS[2] //menu_name
			var menusDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var menusRunner = responseData[i];
				var menusDBFieldCount = Object.keys(MENUS_DB_FIELDS).length;
				var menusDBFieldRunner = null;
				menusDetails = {};
				
				for(var j=0; j<menusDBFieldCount; j++){
					menusDBFieldRunner = MENUS_DB_FIELDS[j];
					menusDetails[menusDBFieldRunner] = menusRunner[menusDBFieldRunner];
				}
				var menusKeyValue = menusRunner[menusKey];
				menuServiceObj.menus[menusKeyValue] = menusDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addMenu()
	 * purpose: adds menu
	 * ****************************** */
	function addMenu(menus){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus', 
				data: $httpParamSerializerJQLike(menus)
		};
		$http(httpConfig)
		.then(addMenuSuccessCallback)
		.catch(addMenuFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addMenuSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addMenuFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateMenu()
	 * purpose: updates menu
	 * ****************************** */
	function updateMenu(menu){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus/' + menuServiceObj.menuName, 
				data: menu
		}
		$http(httpConfig)
		.then(updateMenuSuccessCallback)
		.catch(updateMenuFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateMenuSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateMenuFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteMenu()
	 * purpose: deletes menu
	 * ****************************** */
	function deleteMenu(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus/' + menuServiceObj.menuName
		}
		$http(httpConfig)
		.then(deleteMenuSuccessCallback)
		.catch(deleteMenuFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteMenuSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteMenuFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: uploadMenuImage()
	 * purpose: uploads menu image
	 * ****************************** */
	function uploadMenuImage(imgFile){
		var httpFD = new FormData();
		httpFD.append('imgFile', imgFile);
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus/' + menuServiceObj.menuName + '/menuImage', 
				data: httpFD, 
				headers: {	'Content-Type':	undefined	}
		}
		$http(httpConfig)
		.then(uploadMenuImageSuccessCallback)
		.catch(uploadMenuImageFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function uploadMenuImageSuccessCallback(response){
			deferred.resolve(response)
		}
		
		function uploadMenuImageFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	return menuServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */