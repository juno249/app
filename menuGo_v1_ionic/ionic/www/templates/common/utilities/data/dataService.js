angular
.module('starter')
.factory('dataService', dataService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
dataService.$inject = [
	'$localStorage', 
	'companyService', 
	'branchService', 
	'menuService', 
	'tableService', 
	'menuitemService', 
	'marketingService'
]
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function dataService(
		$localStorage, 
		companyService, 
		branchService, 
		menuService, 
		tableService, 
		menuitemService, 
		marketingService
){
	const COMPANIES_KEY = 'Companies';
	const BRANCHES_KEY = 'Branches'; 
	const MENUS_KEY = 'Menus';
	const TABLES_KEY = 'Tables';
	const MENUITEMS_KEY = 'Menuitems';
	const RESTAURANT_ADS_KEY = 'Restaurant_Ads';
	const FOOD_BLOGS_KEY = 'Food_Blogs';
	
	var dataServiceObj = {
			companies: {}, 
			restaurantAds: {}, 
			foodBlogs: {}, 
			getCompanies: getCompanies, 
			getRestaurantAds: getRestaurantAds, 
			getFoodBlogs: getFoodBlogs, 
			setCompanies: setCompanies, 
			setRestaurantAds: setRestaurantAds, 
			setFoodBlogs: setFoodBlogs, 
			fetchCompanies: fetchCompanies, 
			fetchRestaurantAds: fetchRestaurantAds, 
			fetchFoodBlogs: fetchFoodBlogs
	}
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getCompanies(){
		return dataServiceObj.companies;
	}
	
	function getRestaurantAds(){
		return dataServiceObj.restaurantAds;
	}
	
	function getFoodBlogs(){
		return dataServiceObj.foodBlogs;
	}
	
	function setCompanies(companies){
		dataServiceObj.companies = companies;
	}
	
	function setRestaurantAds(restaurantAds){
		dataServiceObj.restaurantAds = restaurantAds;
	}
	
	function setFoodBlogs(foodBlogs){
		dataServiceObj.foodBlogs = foodBlogs;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchCompanies()
	 * purpose: fetch companies from server
	 * ****************************** */
	function fetchCompanies(){
		companyService.fetchCompanies()
		.then(fetchCompaniesSuccessCallback)
		.catch(fetchCompaniesFailedCallback);
		
		reset();
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchCompaniesSuccessCallback(response){
			var companies = undefined;
			
			companies = localStorage.getItem(COMPANIES_KEY);
			companies = JSON.parse(companies);
			angular.forEach(companies, function(v, k){
				fetchBranches(v.company_name)
				fetchMenus(v.company_name);
			});
			
			/* ******************************
			 * Method Implementation
			 * method name: fetchBranches()
			 * purpose: fetch branches from server
			 * ****************************** */
			function fetchBranches(companyName){
				branchService.setCompanyName(companyName)
				branchService.fetchBranches()
				.then(fetchBranchesSuccessCallback)
				.catch(fetchBranchesFailedCallback);
				
				/* ******************************
				 * Callback Implementations (Start)
				 * ****************************** */
				function fetchBranchesSuccessCallback(response){
					var branches = undefined;
					
					branches = localStorage.getItem(BRANCHES_KEY);
					branches = JSON.parse(branches);
					angular.forEach(branches, function(v, k){
						fetchTables(v.branch_name);
					});
					
					try{	companies = JSON.parse(companies);
					} catch(e){						
					}
					companies[companyName]['branches'] = branches;
					
					/* ******************************
					 * Method Implementation
					 * method name: fetchTables()
					 * purpose: fetch tables from server
					 * ****************************** */
					function fetchTables(branchName){
						tableService.setCompanyName(companyName);
						tableService.setBranchName(branchName);
						tableService.fetchTables()
						.then(fetchTablesSuccessCallback)
						.catch(fetchTablesFailedCallback);
						
						/* ******************************
						 * Callback Implementations (Start)
						 * ****************************** */
						function fetchTablesSuccessCallback(response){
							var tables = undefined;
							
							tables = localStorage.getItem(TABLES_KEY);
							tables = JSON.parse(tables);
							
							try{	companies = JSON.parse(companies);
							} catch(e){
							}
							companies[companyName]['branches'][branchName]['tables'] = tables;
							companies = JSON.stringify(companies);
							localStorage.setItem('Companies', companies);
						}
						
						function fetchTablesFailedCallback(responseError){
							reset();
						}
						/* ******************************
						 * Callback Implementations (End)
						 * ****************************** */
					}
				}
				
				function fetchBranchesFailedCallback(responseError){
					reset();
				}
				/* ******************************
				 * Callback Implementations (End)
				 * ****************************** */
			}
			
			/* ******************************
			 * Method Implementation
			 * method name: fetchMenus()
			 * purpose: fetch menus from server
			 * ****************************** */
			function fetchMenus(companyName){
				menuService.setCompanyName(companyName);
				menuService.fetchMenus()
				.then(fetchMenusSuccessCallback)
				.catch(fetchMenusFailedCallback);
				
				/* ******************************
				 * Callback Implementations (Start)
				 * ****************************** */
				function fetchMenusSuccessCallback(response){
					var menus = undefined;
					
					menus = localStorage.getItem(MENUS_KEY);
					menus = JSON.parse(menus);
					angular.forEach(menus, function(v, k){
						fetchMenuitems(v.menu_name);
					});
					
					try{	companies = JSON.parse(companies);
					} catch(e){
					}
					companies[companyName]['menus'] = menus;
					
					/* ******************************
					 * Method Implementation
					 * method name: fetchMenuitems()
					 * purpose: fetch menuitems from server
					 * ****************************** */
					function fetchMenuitems(menuName){
						menuitemService.setCompanyName(companyName);
						menuitemService.setMenuName(menuName);
						menuitemService.fetchMenuitems()
						.then(fetchMenuitemsSuccessCallback)
						.catch(fetchMenuitemsFailedCallback);
						
						/* ******************************
						 * Callback Implementations (Start)
						 * ****************************** */
						function fetchMenuitemsSuccessCallback(response){
							var menuitems = undefined;
							
							menuitems = localStorage.getItem(MENUITEMS_KEY);
							menuitems = JSON.parse(menuitems);
							
							try{	companies = JSON.parse(companies);
							} catch(e){
							}
							companies[companyName]['menus'][menuName]['menuitems'] = menuitems;
							companies = JSON.stringify(companies);
							localStorage.setItem('Companies', companies);
						}
						
						function fetchMenuitemsFailedCallback(responseError){
							reset();
						}
						/* ******************************
						 * Callback Implementations (End)
						 * ****************************** */
					}
				}
				
				function fetchMenusFailedCallback(responseError){
					reset();
				}
				/* ******************************
				 * Callback Implementations (End)
				 * ****************************** */
			}
		}
		
		function fetchCompaniesFailedCallback(responseError){
			reset();
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchRestaurantAds()
	 * purpose: fetch restaurant ads from server
	 * ****************************** */
	function fetchRestaurantAds(){
		marketingService.fetchRestaurantAds()
		.then(fetchRestaurantAdsSuccessCallback)
		.catch(fetchRestaurantAdsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchRestaurantAdsSuccessCallback(response){
			//do something on success
		}
		
		function fetchRestaurantAdsFailedCallback(responseError){
			//do something on failure
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchFoodBlogs()
	 * purpose: fetch food blogs from server
	 * ****************************** */
	function fetchFoodBlogs(){
		marketingService.fetchFoodBlogs()
		.then(fetchFoodBlogsSuccessCallback)
		.catch(fetchFoodBlogsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchFoodBlogsSuccessCallback(response){
			//do something on success
		}
		
		function fetchFoodBlogsFailedCallback(responseError){
			//do something on failure
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: reset()
	 * purpose: do reset
	 * ****************************** */
	function reset(){
		localStorage.removeItem(COMPANIES_KEY);
		localStorage.removeItem(BRANCHES_KEY);
		localStorage.removeItem(MENUS_KEY);
		localStorage.removeItem(TABLES_KEY);
		localStorage.removeItem(MENUITEMS_KEY);
	}
	
	return dataServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */