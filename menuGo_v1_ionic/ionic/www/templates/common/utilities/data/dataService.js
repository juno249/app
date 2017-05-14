angular
.module('starter')
.factory(
		'dataService', 
		dataService
		);

dataService.$inject = [
                       'BROADCAST_MESSAGES', 
                       'KEYS', 
                       '$localStorage', 
                       '$q', 
                       '$rootScope', 
                       'companyService', 
                       'branchService', 
                       'menuService', 
                       'tableService', 
                       'menuitemService', 
                       'orderreferenceService', 
                       'orderService', 
                       'reservationService', 
                       'marketingService'
                       ];

function dataService(
		BROADCAST_MESSAGES, 
		KEYS, 
		$localStorage, 
		$q, 
		$rootScope, 
		companyService, 
		branchService, 
		menuService, 
		tableService, 
		menuitemService, 
		orderreferenceService, 
		orderService, 
		reservationService, 
		marketingService
		){
	var dataServiceObj = {
			companies: {}, 
			marketing: {}, 
			companyBranchOrderreferences: {}, 
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
			companies = localStorage.getItem(KEYS.Companies);
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
					branches = localStorage.getItem(KEYS.Branches);
					branches = JSON.parse(branches);
					var branchesIdx = 0;
					
					angular.forEach(
							branches, 
							function(
									v, 
									k
									){
								fetchTables(v.branch_name);
								}
							);
					
					companies[companyName][KEYS.Branches] = branches;
					
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
							tables = localStorage.getItem(KEYS.Tables);
							tables = JSON.parse(tables);
							branchesIdx++;
							
							if(branchesIdx == Object.keys(branches).length){	isGetTables = true;
							}
							
							companies[companyName][KEYS.Branches][branchName][KEYS.Tables] = tables;
							
							localStorage.removeItem(KEYS.Branches);
							localStorage.removeItem(KEYS.Tables);
							
							if(
									isGetCompanies &&
									isGetBranches &&
									isGetMenus &&
									isGetTables &&
									isGetMenuitems
									){
								companies = JSON.stringify(companies);
								
								localStorage.setItem(
										KEYS.Companies, 
										companies
										);
								
								$rootScope.$broadcast(BROADCAST_MESSAGES.getCompaniesSuccess);
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
					menus = localStorage.getItem(KEYS.Menus);
					menus = JSON.parse(menus);
					var menusIdx = 0;
					
					angular.forEach(
							menus, 
							function(
									v, 
									k
									){
								fetchMenuitems(v.menu_name);
								}
							);
					
					companies[companyName][KEYS.Menus] = menus;
					
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
							menuitems = localStorage.getItem(KEYS.Menuitems);
							menuitems = JSON.parse(menuitems);
							menusIdx++;
							
							if(menusIdx == Object.keys(menus).length){	isGetMenuitems = true;
							}
							
							companies[companyName][KEYS.Menus][menuName][KEYS.Menuitems] = menuitems;
							
							localStorage.removeItem(KEYS.Menus);
							localStorage.removeItem(KEYS.Menuitems);
							
							if(
									isGetCompanies &&
									isGetBranches &&
									isGetMenus &&
									isGetTables &&
									isGetMenuitems
									){
								companies = JSON.stringify(companies);
								
								localStorage.setItem(
										KEYS.Companies, 
										companies
										);
								
								$rootScope.$broadcast(BROADCAST_MESSAGES.getCompaniesSuccess);
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
			advertisements = localStorage.getItem(KEYS.Advertisements);
			advertisements = JSON.parse(advertisements);
			
			if(null == marketing){	marketing = {};
			}
			
			marketing[KEYS.Advertisements] = advertisements;
			
			localStorage.removeItem(KEYS.Advertisements);
			
			if(
					isGetAdvertisements &&
					isGetBlogs
					){
				marketing = JSON.stringify(marketing);
				
				localStorage.setItem(
						KEYS.Marketing, 
						marketing
						);
				
				$rootScope.$broadcast(BROADCAST_MESSAGES.getMarketingSuccess);
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
			blogs = localStorage.getItem(KEYS.Blogs);
			blogs = JSON.parse(blogs);
			
			if(null == marketing){	marketing = {};
			}
			
			localStorage.removeItem(KEYS.Blogs);
			
			if(
					isGetAdvertisements &&
					isGetBlogs
					){
				marketing[KEYS.Blogs] = blogs;
				
				marketing = JSON.stringify(marketing);
				localStorage.setItem(
						KEYS.Marketing, 
						marketing
						);
				
				$rootScope.$broadcast(BROADCAST_MESSAGES.getMarketingSuccess);
				}
			}
		
		function fetchBlogsFailedCallback(responseError){
			reset();
			$rootScope.$broadcast(BROADCAST_MESSAGES.getMarketingFailed);
			}
		}
	
	function reset(){
		localStorage.removeItem(KEYS.Companies);
		localStorage.removeItem(KEYS.Branches);
		localStorage.removeItem(KEYS.Menus);
		localStorage.removeItem(KEYS.Tables);
		localStorage.removeItem(KEYS.Menuitems);
		localStorage.removeItem(KEYS.Advertisements);
		localStorage.removeItem(KEYS.Blogs);
		}
	
	function resetOrderreferences(){
		localStorage.removeItem(KEYS.Orderreferences);
		localStorage.removeItem(KEYS.Orders);
		localStorage.removeItem(KEYS.Reservations);
		}
	
	return dataServiceObj;
	}