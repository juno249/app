angular
.module('starter')
.controller('customerNearbyController', customerNearbyController);

customerNearbyController.$inject = [
	'$ionicHistory', 
	'$ionicSlideBoxDelegate', 
	'$q', 
	'$scope', 
	'$state', 
	'$timeout', 
	'branchService', 
	'dataService', 
	'geolocationService', 
	'googleplacesService'
	];

function customerNearbyController(
		$ionicHistory, 
		$ionicSlideBoxDelegate, 
		$q, 
		$scope, 
		$state, 
		$timeout, 
		branchService, 
		dataService, 
		geolocationService, 
		googleplacesService
		){
	$ionicHistory.clearHistory();
	
	const COMPANIES_KEY = 'Companies';
	const DOM_FEATURED_MENUS_SLIDEBOX = 'featured-menus-slidebox';
	
	var vm = this;
	vm.mapConfig = {
			center: {
				latitude: undefined, 
				longitude: undefined
			}, 
			mapTypeControl: false, 
			scaleControl: false, 
			streetViewControl: false, 
			zoom: 15, 
			zoomControl: false
	}
	
	if(null == localStorage.getItem(COMPANIES_KEY)){
		dataService.fetchCompanies();
	} else {
		vm.companies = localStorage.getItem(COMPANIES_KEY);
		vm.companies = JSON.parse(vm.companies);
	} 
	
	//controller_method
	vm.gotoState = gotoState;
	//controller_method
	vm.initializeMapCoordinates = initializeMapCoordinates;
	//controller_method
	vm.setCategory = setCategory;
	//controller_method
	vm.toStringAddress = toStringAddress;
	
	function gotoState(
			stateName
			){
		if('customer.nearby.reservation_menu' == stateName){
			$state.go(
					stateName, 
					{
						companyName: vm.companyBranch.companyName, 
						branchName: vm.companyBranch.branchName
					}, 
					{	reload: true	}
					);
		}
	}
	
	function initializeMapCoordinates(){
		var deferred = $q.defer();
		
		geolocationService.getPosition()
		.then(getPositionSuccessCallback)
		.catch(getPositionFailedCallback);
		
		function getPositionSuccessCallback(coordinates){	vm.mapConfig.center = coordinates;
		}
		
		function getPositionFailedCallback(status){	//do something on failure
		}
		return deferred.promise;
	}

	function setCategory(category){	vm.category = category;
	}
	
	function toStringAddress(branch){
		branchService.setBranch(branch);
		
		return branchService.toStringAddress();
	}
	
	function loadCompaniesBranches(){
		vm.companiesBranches = {};
		
		angular.forEach(
				vm.companies, 
				function(
						v, 
						k
						){					
					var company = v;
					var companyBranches = company.branches;
					
					vm.companiesBranches[k] = companyBranches;
					}
					);
	}
	
	function loadCompaniesMenuitems(){
		vm.companiesMenuitems = {};
		
		angular.forEach(
				vm.companies, 
				function(
						v, 
						k
						){
					var company = v;
					var companyMenus = company.menus;
					var companyMenuitems = [];

					angular.forEach(
							companyMenus, 
							function(
									v, 
									k
									){
								var companyMenu = v;
								var companyMenuMenuitems = v.menuitems;
								
								angular.forEach(
										companyMenuMenuitems, 
										function(
												v, 
												k
												){
											var companyMenuMenuitem = v;
											
											if(1 == companyMenuMenuitem.menuitem_featured){
												companyMenuitems.push(companyMenuMenuitem);
											}
										}
										);
							}
							);
					vm.companiesMenuitems[k] = companyMenuitems;
				}
				);
		
		$timeout(function(){
			$ionicSlideBoxDelegate.$getByHandle(DOM_FEATURED_MENUS_SLIDEBOX).update();	
		});
	}
	
	function loadCompaniesCategoriesSelection(){
		vm.companiesCategoriesSelection = [];
		
		angular.forEach(
				vm.companies, 
				function(
						v, 
						k
						){
					var company = v;
					
					if(-1 == vm.companiesCategoriesSelection.indexOf(v.company_category)){
						vm.companiesCategoriesSelection.push(v.company_category);
					}
				}
				);
	}
	
	$scope.$watch(
			function(){	return localStorage.getItem(COMPANIES_KEY);
			}, 
			function(){
				vm.companies = localStorage.getItem(COMPANIES_KEY);
				vm.companies = JSON.parse(vm.companies);
			}
	);
	
	$scope.$watch(
			function(){	return vm.companies;
			}, 
			function(){
				loadCompaniesBranches();
				loadCompaniesMenuitems();
				loadCompaniesCategoriesSelection();
			}
			);
	
	$scope.$watch(
			function(){	return vm.search;
			}, 
			function(){
				if(
						null == vm.search || 
						0 == vm.search.trim().length
						){
					vm.placePredictions = undefined;
					return;
				}
				
				googleplacesService.getPlacePredictions(vm.search)
				.then(getPlacePredictionsSuccessCallback)
				.catch(getPlacePredictionsFailedCallback);
				
				function getPlacePredictionsSuccessCallback(predictions){	
					vm.placePredictions = predictions;
				}
				
				function getPlacePredictionsFailedCallback(status){	//do something on failure
				}
			}
	);
}