angular
.module('starter')
.controller('customerNearbyController', customerNearbyController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerNearbyController.$inject = [
	'$scope', 
	'$state', 
	'dataService', 
//	'geolocationService'
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
		dataService, 
		geolocationService
){
	const COMPANIES_KEY = 'Companies';
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.mapConfig = {
			center: {
				latitude: vm.mapCenterCoordinates.latitude, 
				longitude: vm.mapCenterCoordinates.longitude
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
	vm.searchVal = undefined;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.gotoState = gotoState;
	/* ******************************
	 * Controller Binded Method (End)
	 * ****************************** */

	initializeMap();
	loadCompaniesMenuitems();
	loadCompaniesBranches();
	
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
	 * method name: initializeMap()
	 * purpose: initializes map
	 * ****************************** */
	function initializeMap(){
		geolocation.getPosition()
		.then(getPositionSuccessCallback)
		.catch(getPositionFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function getPositionSuccessCallback(coordinates){
			var mapCenterCoordinates = vm.mapCenterCoordinates;
			
			mapCenterCoordinates = coordinates;
			
			vm.mapCenterCoordinates = mapCenterCoordinates;
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
	 * Watchers (Start)
	 * ****************************** */
	$scope.$watch(
		function(){
			return localStorage.getItem(COMPANIES_KEY);
		}, 
		function(nVal, oVal){
			var companies = nVal;
			companies = JSON.parse(companies);
			vm.companies = companies;
			
			loadCompaniesMenuitems();
			loadCompaniesBranches();
		}
	);
	
	$scope.$watch(
		vm.searchVal, 
		function(nVal, oVal){
			var companies = vm.companies;
			var companiesNames = '';
			var searchVal = nVal;
			
			angular.forEach(companies, function(v, k){
				companiesNames += k + '|';
			});
			
			googleplacesService.getPlacePredictions(searchVal)
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
			
			function getPlacePredictionsFailedCallback(){
				//do something on error
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