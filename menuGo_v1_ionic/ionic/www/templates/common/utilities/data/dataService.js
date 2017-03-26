angular
.module('starter')
.factory(
		'dataService', 
		dataService
		);

dataService.$inject = [
	'$localStorage', 
	'$q', 
	'companyService', 
	'branchService', 
	'menuService', 
	'tableService', 
	'menuitemService', 
	'marketingService'
	];

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
		
		reset();
		
		companyService.fetchCompanies()
		.then(fetchCompaniesSuccessCallback)
		.catch(fetchCompaniesFailedCallback);
		
		function fetchCompaniesSuccessCallback(response){
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
				
				branchService.fetchBranches()
				.then(fetchBranchesSuccessCallback)
				.catch(fetchBranchesFailedCallback);
				
				function fetchBranchesSuccessCallback(response){
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
					
					companies[companyName]['branches'] = branches;
					
					function fetchTables(branchName){
						var tables = undefined;
						
						tableService.setCompanyName(companyName);
						tableService.setBranchName(branchName);
						
						tableService.fetchTables()
						.then(fetchTablesSuccessCallback)
						.catch(fetchTablesFailedCallback);
						
						function fetchTablesSuccessCallback(response){
							tables = localStorage.getItem(TABLES_KEY);
							tables = JSON.parse(tables);
							
							try{	companies = JSON.parse(companies);
							} catch(e){
							}
							
							companies[companyName]['branches'][branchName]['tables'] = tables;
							companies = JSON.stringify(companies);
							localStorage.setItem(
									COMPANIES_KEY, 
									companies
									);
							
							localStorage.removeItem(BRANCHES_KEY);
							localStorage.removeItem(TABLES_KEY);
							}
						
						function fetchTablesFailedCallback(responseError){	reset();
						}
						}
					}
				
				function fetchBranchesFailedCallback(responseError){	reset();
				}
				}
			
			function fetchMenus(companyName){
				var menus = undefined;
				
				menuService.setCompanyName(companyName);
				
				menuService.fetchMenus()
				.then(fetchMenusSuccessCallback)
				.catch(fetchMenusFailedCallback);
				
				function fetchMenusSuccessCallback(response){
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
					
					companies[companyName]['menus'] = menus;
					
					function fetchMenuitems(menuName){
						var menuitems = undefined;
						
						menuitemService.setCompanyName(companyName);
						menuitemService.setMenuName(menuName);
						
						menuitemService.fetchMenuitems()
						.then(fetchMenuitemsSuccessCallback)
						.catch(fetchMenuitemsFailedCallback);
						
						function fetchMenuitemsSuccessCallback(response){
							menuitems = localStorage.getItem(MENUITEMS_KEY);
							menuitems = JSON.parse(menuitems);
							
							try{	companies = JSON.parse(companies);
							} catch(e){
							}
							
							companies[companyName]['menus'][menuName]['menuitems'] = menuitems;
							companies = JSON.stringify(companies);
							localStorage.setItem(
									COMPANIES_KEY, 
									companies
									);
							
							localStorage.removeItem(MENUS_KEY);
							localStorage.removeItem(MENUITEMS_KEY);
							}
						
						function fetchMenuitemsFailedCallback(responseError){	reset();
						}
						}
					}
				
				function fetchMenusFailedCallback(responseError){	reset();
				}
				}
			}
		
		function fetchCompaniesFailedCallback(responseError){	reset();
		}
		}
	
	function fetchMarketing(){
		var marketing = undefined;
		var advertisements = undefined;
		var blogs = undefined;
		
		marketingService.fetchAdvertisements()
		.then(fetchAdvertisementsSuccessCallback)
		.catch(fetchAdvertisementsFailedCallback);
		
		function fetchAdvertisementsSuccessCallback(response){
			advertisements = localStorage.getItem(ADVERTISEMENTS_KEY);
			advertisements = JSON.parse(advertisements);
			
			if(!(null == localStorage.getItem(MARKETING_KEY))){
				marketing = localStorage.getItem(MARKETING_KEY);
				marketing = JSON.parse(marketing);
			} else {	marketing = {};
			}
			
			marketing['advertisements'] = advertisements;
			marketing = JSON.stringify(marketing);
			localStorage.setItem(
					MARKETING_KEY, 
					marketing
					);
			
			localStorage.removeItem(ADVERTISEMENTS_KEY);
			}
		
		function fetchAdvertisementsFailedCallback(responseError){	reset();
		}
		
		marketingService.fetchBlogs()
		.then(fetchBlogsSuccessCallback)
		.catch(fetchBlogsFailedCallback);
		
		function fetchBlogsSuccessCallback(response){
			blogs = localStorage.getItem(BLOGS_KEY);
			blogs = JSON.parse(blogs);
			
			if(!(null == localStorage.getItem(MARKETING_KEY))){
				marketing = localStorage.getItem(MARKETING_KEY);
				marketing = JSON.parse(marketing);
			} else {	marketing = {};
			}
			
			marketing['blogs'] = blogs;
			marketing = JSON.stringify(marketing);
			localStorage.setItem(
					MARKETING_KEY, 
					marketing
					);
			
			localStorage.removeItem(BLOGS_KEY);
			}
		
		function fetchBlogsFailedCallback(responseError){	reset();
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