angular
.module('starter')
.factory('menuService', menuService);

menuService.$inject = [
	'API_BASE_URL', 
	'MENUS_DB_FIELDS', 
	'$http', 
	'$localStorage', 
	'$q' 
	];

function menuService(
		API_BASE_URL, 
		MENUS_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q 
		){
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
	
	function getMenus(){	return menuServiceObj.menus;
	}
	function getMenu(){	return menuServiceObj.menu;
	}
	function getCompanyName(){	return menuServiceObj.companyName;
	}
	function getMenuName(){	return menuServiceObj.menuName
	}
	function setMenus(menus){	menuServiceObj.menus = menus;
	}
	function setMenu(menu){	menuServiceObj.menu = menu;
	}
	function setCompanyName(companyName){	menuServiceObj.companyName = companyName;
	}
	function setMenuName(menuName){	menuServiceObj.menuName = menuName;
	}
	
	function fetchMenus(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus'
		};
		
		$http(httpConfig)
		.then(fetchMenusSuccessCallback)
		.catch(fetchMenusFailedCallback);
		
		function fetchMenusSuccessCallback(response){
			var menus = undefined;
			
			convertMenusResponseToMap(response.data);
			menus = menuServiceObj.menus;
			menus = JSON.stringify(menus);
			localStorage.setItem('Menus', menus);
			
			deferred.resolve(response);
		}
		
		function fetchMenusFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertMenusResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var menusDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(MENUS_DB_FIELDS).length; j++){
					menusDetails[MENUS_DB_FIELDS[j]] = responseData[i][MENUS_DB_FIELDS[j]];
				}
				
				key = responseData[i][MENUS_DB_FIELDS[1]]; //menu_name
				menuServiceObj.menus[key] = menusDetails;
			}
		}
		return deferred.promise;
	}
	
	function fetchMenu(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus/' + menuServiceObj.menuName
		};
		
		$http(httpConfig)
		.then(fetchMenuSuccessCallback)
		.catch(fetchMenuFailedCallback);

		function fetchMenuSuccessCallback(response){
			var menu = undefined;
			
			convertMenuResponseToMap(response.data);
			menu = menuServiceObj.menu;
			menu = JSON.stringify(menu);
			localStorage.setItem('Menu', menu);
			
			deferred.resolve(response);
		}
		
		function fetchMenuFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertMenuResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var menuDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(MENUS_DB_FIELDS).length; j++){
					menuDetails[MENUS_DB_FIELDS[j]] = responseData[i][MENUS_DB_FIELDS[j]];
				}
				
				key = responseData[i][MENUS_DB_FIELDS[1]]; //menu_name
				menuServiceObj.menu[key] = menuDetails;
			}
		}
		return deferred.promise;	
	}
	
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
		
		function addMenuSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addMenuFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	function updateMenu(menu){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus/' + menuServiceObj.menuName, 
				data: menu
		};
		
		$http(httpConfig)
		.then(updateMenuSuccessCallback)
		.catch(updateMenuFailedCallback);
		
		function updateMenuSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateMenuFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	function deleteMenu(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus/' + menuServiceObj.menuName
		};
		
		$http(httpConfig)
		.then(deleteMenuSuccessCallback)
		.catch(deleteMenuFailedCallback);
		
		function deleteMenuSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteMenuFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	function uploadMenuImage(imgFile){
		var httpFD = new FormData();
		httpFD.append('imgFile', imgFile);
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus/' + menuServiceObj.menuName + '/menuImage', 
				data: httpFD, 
				headers: {	'Content-Type':	undefined	}
		};
		
		$http(httpConfig)
		.then(uploadMenuImageSuccessCallback)
		.catch(uploadMenuImageFailedCallback);
		
		function uploadMenuImageSuccessCallback(response){	deferred.resolve(response)
		}
		
		function uploadMenuImageFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	return menuServiceObj;
}