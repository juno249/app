angular
.module('starter')
.factory('dataService', dataService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
dataService.$inject = [
	'$localStorage', 
	'$q', 
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
		$q, 
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
	const MARKETING_KEY = 'Marketing';
	const ADVERTISEMENTS_KEY = 'Advertisements';
	const BLOGS_KEY = 'Blogs';
	
	var dataServiceObj = {
			companies: {}, 
			marketing: {}, 
			fetchCompanies: fetchCompanies, 
			fetchMarketing: fetchMarketing
	}
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getCompanies(){
		return dataServiceObj.companies;
	}
	
	function getMarketing(){
		return dataServiceObj.marketing;
	}
	
	function setCompanies(companies){
		dataServiceObj.companies = companies;
	}
	
	function setMarketing(marketing){
		dataServiceObj.marketing = marketing;
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
		reset();
		
		companyService.fetchCompanies()
		.then(fetchCompaniesSuccessCallback)
		.catch(fetchCompaniesFailedCallback);
		
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
							localStorage.setItem(COMPANIES_KEY, companies);
							
							localStorage.removeItem(BRANCHES_KEY);
							localStorage.removeItem(TABLES_KEY);
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
							localStorage.setItem(COMPANIES_KEY, companies);
							
							localStorage.removeItem(MENUS_KEY);
							localStorage.removeItem(MENUITEMS_KEY);
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
	 * method name: fetchMarketing()
	 * purpose: fetch advertisements and blogs from server
	 * ****************************** */
	function fetchMarketing(){
		marketingService.fetchAdvertisements()
		.then(fetchAdvertisementsSuccessCallback)
		.catch(fetchAdvertisementsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchAdvertisementsSuccessCallback(response){
			var advertisements = undefined;
			var marketing = undefined;
			
			advertisements = localStorage.getItem(ADVERTISEMENTS_KEY);
			advertisements = JSON.parse(advertisements);
			
			if(!(null == localStorage.getItem(MARKETING_KEY))){
				marketing = localStorage.getItem(MARKETING_KEY);
				marketing = JSON.parse(marketing);
			} else {
				marketing = {};
			}
			
			marketing['advertisements'] = advertisements;
			marketing = JSON.stringify(marketing);
			localStorage.setItem(MARKETING_KEY, marketing);
			
			localStorage.removeItem(ADVERTISEMENTS_KEY);
		}
		
		function fetchAdvertisementsFailedCallback(responseError){
			reset();
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		marketingService.fetchBlogs()
		.then(fetchBlogsSuccessCallback)
		.catch(fetchBlogsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchBlogsSuccessCallback(response){
			var blogs = undefined;
			var marketing = undefined;
			
			blogs = localStorage.getItem(BLOGS_KEY);
			blogs = JSON.parse(blogs);
			
			if(!(null == localStorage.getItem(MARKETING_KEY))){
				marketing = localStorage.getItem(MARKETING_KEY);
				marketing = JSON.parse(marketing);
			} else {
				marketing = {};
			}
			
			marketing['blogs'] = blogs;
			marketing = JSON.stringify(marketing);
			localStorage.setItem(MARKETING_KEY, marketing);
			
			localStorage.removeItem(BLOGS_KEY);
		}
		
		function fetchBlogsFailedCallback(responseError){
			reset();
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
		localStorage.removeItem(ADVERTISEMENTS_KEY);
		localStorage.removeItem(BLOGS_KEY);
	}
	
	return dataServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */