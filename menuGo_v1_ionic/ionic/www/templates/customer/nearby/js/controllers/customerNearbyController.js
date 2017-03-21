angular
.module('starter')
.controller('customerNearbyController', customerNearbyController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerNearbyController.$inject = [
	'$ionicSlideBoxDelegate', 
	'$q', 
	'$scope', 
	'$state', 
	'$stateParams', 
	'branchService', 
	'dataService', 
	'geolocationService', 
	'googleplacesService'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function customerNearbyController(
		$ionicSlideBoxDelegate, 
		$q, 
		$scope, 
		$state, 
		$stateParams, 
		branchService, 
		dataService, 
		geolocationService, 
		googleplacesService
	){
	const COMPANIES_KEY = 'Companies';
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.stateParams = {
			category: $stateParams.category, 
			search: $stateParams.search
	}
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
	var companies = undefined;
	if(null == localStorage.getItem(COMPANIES_KEY)){
		dataService.fetchCompanies();
		vm.companies = undefined;
	} else {
		companies = localStorage.getItem(COMPANIES_KEY);
		companies = JSON.parse(companies);
		vm.companies = companies;
	}
	vm.companiesBranches = undefined;
	vm.companiesMenuitems = undefined;
	vm.companiesCategoriesSelection = undefined;
	vm.placePredictions = undefined;
	if(
			!(null == vm.stateParams.category) || 
			!(0 == vm.stateParams.category.trim().length)
		){
		vm.category = vm.stateParams.category;
	} else {
		vm.category = new String('');
	}
	vm.search = undefined;
	vm.companyBranch = undefined;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	 
	/* ******************************
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.initializeMapCoordinates = initializeMapCoordinates;
	vm.setCategory = setCategory;
	vm.toStringAddress = toStringAddress;
	/* ******************************
	 * Controller Binded Method (End)
	 * ****************************** */

	/* ******************************
	 * Method Implementation
	 * method name: initializeMapCoordinates()
	 * purpose: initializes map coordinates
	 * ****************************** */
	function initializeMapCoordinates(){
		var deferred = $q.defer();
		
		geolocationService.getPosition()
		.then(getPositionSuccessCallback)
		.catch(getPositionFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function getPositionSuccessCallback(coordinates){
			var mapConfig = vm.mapConfig;
			
			mapConfig.center = coordinates;
			
			vm.mapConfig = mapConfig;
		}
		
		function getPositionFailedCallback(status){
			//do something on failure
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		return deferred.promise;
	}

	/* ******************************
	 * Method Implementation
	 * method name: setCategory()
	 * purpose: sets category
	 * ****************************** */
	function setCategory(arg_category){
		var category = vm.category;
		
		category = arg_category;
		
		vm.category = category;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: toStringAddress()
	 * purpose: returns an address string
	 * ****************************** */
	function toStringAddress(branch){
		branchService.setBranch(branch);
		
		return branchService.toStringAddress();
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: loadCompaniesBranches()
	 * purpose: loads companies branches
	 * ****************************** */
	function loadCompaniesBranches(){
		var companies = vm.companies;
		var companiesBranches = {};
		
		angular.forEach(companies, function(v, k){
			var company = v;
			var companyBranches = company.branches;
			
			companiesBranches[k] = companyBranches;
		});
		
		vm.companiesBranches = companiesBranches;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: loadCompaniesMenuitems()
	 * purpose: loads companies menuitems
	 * ****************************** */
	function loadCompaniesMenuitems(){
		var companies = vm.companies;
		var companiesMenuitems = {};
		var companiesMenuitemsSlidebox = 'featured-menus-slidebox';
		
		angular.forEach(companies, function(v, k){
			var company = v;
			var companyMenus = company.menus;
			var companyMenuitems = [];
			
			angular.forEach(companyMenus, function(v, k){
				var companyMenu = v;
				var companyMenuMenuitems = v.menuitems;
				
				angular.forEach(companyMenuMenuitems, function(v, k){
					var companyMenuMenuitem = v;
					
					if(1 == companyMenuMenuitem.menuitem_featured){
						companyMenuitems.push(companyMenuMenuitem);
					}
				});
			});
			
			companiesMenuitems[k] = companyMenuitems;
		});
		
		$ionicSlideBoxDelegate.$getByHandle(companiesMenuitemsSlidebox).update();
		vm.companiesMenuitems = companiesMenuitems;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: loadCompaniesCategoriesSelection()
	 * purpose: loads companies categories selection
	 * ****************************** */
	function loadCompaniesCategoriesSelection(){
		var companies = vm.companies;
		var companiesCategoriesSelection = [];
		
		angular.forEach(companies, function(v, k){
			var company = v;
			if(-1 == companiesCategoriesSelection.indexOf(v.company_category)){
				companiesCategoriesSelection.push(v.company_category);
			}
		});
		
		vm.companiesCategoriesSelection = companiesCategoriesSelection;
	}
	
	/* ******************************
	 * Watchers (Start)
	 * ****************************** */
	$scope.$watch(
			function(){
				return localStorage.getItem(COMPANIES_KEY);
			}, 
			function(
					nVal, 
					oVal
				){
				var companies = vm.companies;
				
				companies = localStorage.getItem(COMPANIES_KEY);
				companies = JSON.parse(companies);
				
				vm.companies = companies;
			}
	);
	
	$scope.$watch(
			function(){
				return vm.companies;
			}, 
			function(){
				loadCompaniesBranches();
				loadCompaniesMenuitems();
				loadCompaniesCategoriesSelection();
			}
	);
	
	$scope.$watch(
			function(){
				return vm.search;
			}, 
			function(
					nVal, 
					oVal
				){
				var companies = vm.companies;
				var companiesNames = '';
				var search = nVal;
				
				if(
						null == search ||
						0 == search.trim().length
				){	
					var placePredictions = vm.placePredictions;
					
					placePredictions = undefined;
					
					vm.placePredictions = placePredictions;	
					return;
				}
				
				googleplacesService.getPlacePredictions(search)
				.then(getPlacePredictionsSuccessCallback)
				.catch(getPlacePredictionsFailedCallback);
				
				/* ******************************
				 * Callback Implementations (Start)
				 * ****************************** */
				function getPlacePredictionsSuccessCallback(predictions){
					var placePredictions = vm.placePredictions;
					
					placePredictions = predictions;
					
					vm.placePredictions = placePredictions;
				}
				
				function getPlacePredictionsFailedCallback(status){
					//do something on failure
				}
				/* ******************************
				 * Callback Implementations (End)
				 * ****************************** */
			}
	);
	/* ******************************
	 * Watchers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */