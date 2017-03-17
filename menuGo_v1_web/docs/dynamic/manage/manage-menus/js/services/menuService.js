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
		$localStorage, 
		$q 
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var menuServiceObj = {
		menus: {}, 
		menu: {}, 
		companyName: undefined, 
		menuName: undefined, 
		getMenus: getMenus, 
		getMenu: getMenu, 
		getCompanyName: getCompanyName, 
		getMenuName: getMenuName, 
		setMenus: setMenus, 
		setMenu: setMenu, 
		setCompanyName: setCompanyName, 
		setMenuName: setMenuName, 
		fetchMenus: fetchMenus, 
		fetchMenu: fetchMenu, 
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
	function getMenu(){
		return menuServiceObj.menu;
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
	function setMenu(menu){
		menuServiceObj.menu = menu;
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
			var menusKey = MENUS_DB_FIELDS[1]; //menu_name
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
	 * method name: fetchMenu()
	 * purpose: fetch menu from server
	 * ****************************** */
	function fetchMenu(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus/' + menuServiceObj.menuName
		}
		$http(httpConfig)
		.then(fetchMenuSuccessCallback)
		.catch(fetchMenuFailedCallback);

		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchMenuSuccessCallback(response){
			menuServiceObj.menu = {};
			convertMenuResponseToMap(response.data);
			var menu = menuServiceObj.menu;
			menu = JSON.stringify(menu);
			localStorage.setItem('Menu', menu);
			deferred.resolve(response);
		}
		
		function fetchMenuFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertMenuResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertMenuResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var menuKey = MENUS_DB_FIELDS[1]; //menu_name
			var menuDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var menuRunner = responseData[i];
				var menuDBFieldCount = Object.keys(MENUS_DB_FIELDS).length;
				var menuDBFieldRunner = null;
				menuDetails = {};
				
				for(var j=0; j<menuDBFieldCount; j++){
					menuDBFieldRunner = MENUS_DB_FIELDS[j];
					menuDetails[menuDBFieldRunner] = menuRunner[menuDBFieldRunner];
				}
				var menuKeyValue = menuRunner[menuKey];
				menuServiceObj.menu[menuKeyValue] = menuDetails;
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
				data: menus
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