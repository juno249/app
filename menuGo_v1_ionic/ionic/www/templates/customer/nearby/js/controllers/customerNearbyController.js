angular
.module('starter')
.controller('customerNearbyController', customerNearbyController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerNearbyController.$inject = [
	'$scope', 
	'$state', 
	'$stateParams', 
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
		$scope, 
		$state, 
		$stateParams, 
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
			place: $stateParams.place
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
	if(null == localStorage.getItem(COMPANIES_KEY)){
		dataService.fetchCompanies();
	}
	var companies = localStorage.getItem(COMPANIES_KEY);
	companies = JSON.parse(companies);
	vm.companies = companies;
	vm.companiesMenuitems = undefined;
	vm.companiesBranches = undefined;
	vm.mapCenterCoordinates = {
			latitude: undefined, 
			longitude: undefined
	}
	vm.placePredictions = undefined;
	vm.categoryVal = vm.stateParams.category;
	vm.searchVal = vm.stateParams.place;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.gotoState = gotoState;
	vm.getPlacesNearby = getPlacesNearby;
	/* ******************************
	 * Controller Binded Method (End)
	 * ****************************** */

	initializeMap();
	loadCompaniesBranches();
	loadCompaniesMenuitems();
	
	/* ******************************
	 * Method Implementation
	 * method name: gotoState()
	 * purpose: go to a state
	 * ****************************** */
	function gotoState(
			stateName, 
			company
	){
		//go to a state
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: getPlacesNearby()
	 * purpose: get places nearby
	 * ****************************** */
	function getPlacesNearby(place){
		googleplacesService.getPlaceCoordinates(place.place_id)
		.then(getPlaceCoordinatesSuccessCallback)
		.catch(getPlaceCoordinatesFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function getPlaceCoordinatesSuccessCallback(placeLocation){
			var companies = vm.companies;
			var companiesNames = '';
			var placeLocation = placeLocation;
			
			angular.forEach(companies, function(v, k){
				companiesNames += k + '|';
			});
			
			googleplacesService.getPlacesNearby(
					companiesNames, 
					placeLocation
			)
			.then(getPlacesNearbyCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function getPlacesNearbyCallback(){
				//do something on success
			}			
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
		}
		
		function getPlaceCoordinatesFailedCallback(serviceErr){
			//do something on failure
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}

	/* ******************************
	 * Method Implementation
	 * method name: initializeMap()
	 * purpose: initializes map
	 * ****************************** */
	function initializeMap(){
		geolocationService.getPosition()
		.then(getPositionSuccessCallback)
		.catch(getPositionFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function getPositionSuccessCallback(coordinates){
			var mapCenterCoordinates = vm.mapCenterCoordinates;
			
			mapCenterCoordinates = coordinates;
			
			vm.mapCenterCoordinates = mapCenterCoordinates;
			vm.mapConfig.center = mapCenterCoordinates;
		}
		
		function getPositionFailedCallback(){
			//do something on error
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
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
		
		vm.companiesMenuitems = companiesMenuitems;
	}
	
	/* ******************************
	 * Watchers (Start)
	 * ****************************** */
	$scope.$watch(
		function(){
			return localStorage.getItem(COMPANIES_KEY);
		}, 
		function(nVal, oVal){
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
		function(nVal, oVal){
			loadCompaniesBranches();
			loadCompaniesMenuitems();
		}
	);
	
	$scope.$watch(
			function(){
				return vm.categoryVal;
			}, 
			function(nVal, oVal){
				var companies = vm.companies;
				var categoryVal = vm.categoryVal;
				
				if(
						null == categoryVal || 
						0 == categoryVal.trim().length
				){
					return;
				}
				
				angular.forEach(companies, function(v, k){
					if(!(categoryVal == v.company_category)){
						delete companies[k];
					}
				})
			}
	);
	
	$scope.$watch(
		function(){
			return vm.searchVal;
		}, 
		function(nVal, oVal){
			var companies = vm.companies;
			var companiesNames = '';
			var searchVal = nVal;
			
			if(
					null == searchVal || 
					0 == searchVal.trim().length
			){	
				var placePredictions = vm.placePredictions;
				
				placePredictions = undefined;
				
				vm.placePredictions = placePredictions;
				return;	
			}
			
			googleplacesService.getPlacePredictions(searchVal)
			.then(getPlacePredictionsCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function getPlacePredictionsCallback(predictions){
				var placePredictions = vm.placePredictions;
				
				placePredictions = predictions;
				
				vm.placePredictions = placePredictions;
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