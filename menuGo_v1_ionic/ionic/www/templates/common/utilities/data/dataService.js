angular
.module('starter')
.factory(
		'dataService', 
		dataService
		);

dataService.$inject = [
                       'BROADCAST_MESSAGES', 
                       '$localStorage', 
                       '$q', 
                       '$rootScope', 
                       'companyService', 
                       'branchService', 
                       'menuService', 
                       'tableService', 
                       'menuitemService', 
                       'marketingService'
                       ];

function dataService(
		BROADCAST_MESSAGES, 
		$localStorage, 
		$q, 
		$rootScope, 
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
			};
	
	function getCompanies(){	return dataServiceObj.companies;
	}
	function getMarketing(){	return dataServiceObj.marketing;
	}
	function setCompanies(companies){	dataServiceObj.companies = companies;
	}
	function setMarketing(marketing){	dataServiceObj.marketing = marketing;
	}
	
	function fetchCompanies(){
		var companies = undefined;
		var isGetCompanies = false;
		var isGetBranches = false;
		var isGetMenus = false;
		var isGetTables = false;
		var isGetMenuitems = false;
		
		reset();
		
		companyService.fetchCompanies(	//getCompanies
				2, 
				{}
				)
				.then(fetchCompaniesSuccessCallback)
				.catch(fetchCompaniesFailedCallback);
		
		function fetchCompaniesSuccessCallback(response){
			isGetCompanies = true;
			companies = localStorage.getItem(COMPANIES_KEY);
			companies = JSON.parse(companies);
			
			angular.forEach(
					companies, 
					function(
							v, 
							k
							){
						fetchBranches(v.company_name);
						fetchMenus(v.company_name);
						}
					);
			
			function fetchBranches(companyName){
				var branches = undefined;
				
				branchService.setCompanyName(companyName)
				
				branchService.fetchBranches(	//getCompanyBranches
						1, 
						{}
						)
						.then(fetchBranchesSuccessCallback)
						.catch(fetchBranchesFailedCallback);
				
				function fetchBranchesSuccessCallback(response){
					isGetBranches = true;
					branches = localStorage.getItem(BRANCHES_KEY);
					branches = JSON.parse(branches);
					
					angular.forEach(
							branches, 
							function(
									v, 
									k
									){
								fetchTables(v.branch_name);
								}
							);
					
					try{	companies = JSON.parse(companies);
					} catch(e){
					}
					
					companies[companyName][BRANCHES_KEY.toLowerCase()] = branches;
					
					function fetchTables(branchName){
						var tables = undefined;
						
						tableService.setCompanyName(companyName);
						tableService.setBranchName(branchName);
						
						tableService.fetchTables(	//getCompanyBranchTables
								1, 
								{}
								)
								.then(fetchTablesSuccessCallback)
								.catch(fetchTablesFailedCallback);
						
						function fetchTablesSuccessCallback(response){
							isGetTables = true;
							tables = localStorage.getItem(TABLES_KEY);
							tables = JSON.parse(tables);
							
							try{	companies = JSON.parse(companies);
							} catch(e){
							}
							
							companies[companyName][BRANCHES_KEY.toLowerCase()][branchName][TABLES_KEY.toLowerCase()] = tables;
							companies = JSON.stringify(companies);
							localStorage.setItem(
									COMPANIES_KEY, 
									companies
									);
							
							localStorage.removeItem(BRANCHES_KEY);
							localStorage.removeItem(TABLES_KEY);
							
							if(
									isGetCompanies &&
									isGetBranches &&
									isGetMenus &&
									isGetTables &&
									isGetMenuitems
									){	$rootScope.$broadcast(BROADCAST_MESSAGES.getCompaniesSuccess);
									}
							}
						
						function fetchTablesFailedCallback(responseError){
							reset();
							$rootScope.$broadcast(BROADCAST_MESSAGES.getCompaniesFailed);
							}
						}
					}
				
				function fetchBranchesFailedCallback(responseError){
					reset();
					$rootScope.$broadcast(BROADCAST_MESSAGES.getCompaniesFailed);
					}
				}
			
			function fetchMenus(companyName){
				var menus = undefined;
				
				menuService.setCompanyName(companyName);
				
				menuService.fetchMenus(	//getCompanyMenus
						1, 
						{}
						)
						.then(fetchMenusSuccessCallback)
						.catch(fetchMenusFailedCallback);
				
				function fetchMenusSuccessCallback(response){
					isGetMenus = true;
					menus = localStorage.getItem(MENUS_KEY);
					menus = JSON.parse(menus);
					
					angular.forEach(
							menus, 
							function(
									v, 
									k
									){
								fetchMenuitems(v.menu_name);
								}
							);
					
					try{	companies = JSON.parse(companies);
					} catch(e){
					}
					
					companies[companyName][MENUS_KEY.toLowerCase()] = menus;
					
					function fetchMenuitems(menuName){
						var menuitems = undefined;
						
						menuitemService.setCompanyName(companyName);
						menuitemService.setMenuName(menuName);
						
						menuitemService.fetchMenuitems(	//getCompanyMenuMenuitems
								1, 
								{}
								)
								.then(fetchMenuitemsSuccessCallback)
								.catch(fetchMenuitemsFailedCallback);
						
						function fetchMenuitemsSuccessCallback(response){
							isGetMenuitems = true;
							menuitems = localStorage.getItem(MENUITEMS_KEY);
							menuitems = JSON.parse(menuitems);
							
							try{	companies = JSON.parse(companies);
							} catch(e){
							}
							
							companies[companyName][MENUS_KEY.toLowerCase()][menuName][MENUITEMS_KEY.toLowerCase()] = menuitems;
							companies = JSON.stringify(companies);
							localStorage.setItem(
									COMPANIES_KEY, 
									companies
									);
							
							localStorage.removeItem(MENUS_KEY);
							localStorage.removeItem(MENUITEMS_KEY);
							
							if(
									isGetCompanies &&
									isGetBranches &&
									isGetMenus &&
									isGetTables &&
									isGetMenuitems
									){	$rootScope.$broadcast(BROADCAST_MESSAGES.getCompaniesSuccess);
									}
							}
						
						function fetchMenuitemsFailedCallback(responseError){
							reset();
							$rootScope.$broadcast(BROADCAST_MESSAGES.getCompaniesFailed);
							}
						}
					}
				
				function fetchMenusFailedCallback(responseError){
					reset();
					$rootScope.$broadcast(BROADCAST_MESSAGES.getCompaniesFailed);
					}
				}
			}
		
		function fetchCompaniesFailedCallback(responseError){
			reset();
			$rootScope.$broadcast(BROADCAST_MESSAGES.getCompaniesFailed);
			}
		}
	
	function fetchMarketing(){
		var marketing = undefined;
		var advertisements = undefined;
		var blogs = undefined;
		var isGetAdvertisements = false;
		var isGetBlogs = false;
		
		marketingService.fetchAdvertisements(	//fetchAdvertisements
				1, 
				{}
				)
				.then(fetchAdvertisementsSuccessCallback)
				.catch(fetchAdvertisementsFailedCallback);
		
		function fetchAdvertisementsSuccessCallback(response){
			isGetAdvertisements = true;
			advertisements = localStorage.getItem(ADVERTISEMENTS_KEY);
			advertisements = JSON.parse(advertisements);
			
			if(!(null == localStorage.getItem(MARKETING_KEY))){
				marketing = localStorage.getItem(MARKETING_KEY);
				marketing = JSON.parse(marketing);
			} else {	marketing = {};
			}
			
			marketing[ADVERTISEMENTS_KEY.toLowerCase()] = advertisements;
			marketing = JSON.stringify(marketing);
			localStorage.setItem(
					MARKETING_KEY, 
					marketing
					);
			
			localStorage.removeItem(ADVERTISEMENTS_KEY);
			
			if(
					isGetAdvertisements &&
					isGetBlogs
					){	$rootScope.$broadcast(BROADCAST_MESSAGES.getMarketingSuccess);
					}
			}
		
		function fetchAdvertisementsFailedCallback(responseError){
			reset();
			$rootScope.$broadcast(BROADCAST_MESSAGES.getMarketingFailed);
			}
		
		marketingService.fetchBlogs(	//getBlogs
				1, 
				{}
				)
				.then(fetchBlogsSuccessCallback)
				.catch(fetchBlogsFailedCallback);
		
		function fetchBlogsSuccessCallback(response){
			isGetBlogs = true;
			blogs = localStorage.getItem(BLOGS_KEY);
			blogs = JSON.parse(blogs);
			
			if(!(null == localStorage.getItem(MARKETING_KEY))){
				marketing = localStorage.getItem(MARKETING_KEY);
				marketing = JSON.parse(marketing);
			} else {	marketing = {};
			}
			
			marketing[BLOGS_KEY.toLowerCase()] = blogs;
			marketing = JSON.stringify(marketing);
			localStorage.setItem(
					MARKETING_KEY, 
					marketing
					);
			
			localStorage.removeItem(BLOGS_KEY);
			
			if(
					isGetAdvertisements &&
					isGetBlogs
					){	$rootScope.$broadcast(BROADCAST_MESSAGES.getMarketingSuccess);
					}
			}
		
		function fetchBlogsFailedCallback(responseError){
			reset();
			$rootScope.$broadcast(BROADCAST_MESSAGES.getMarketingFailed);
			}
		}
	
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