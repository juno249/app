angular
.module('starter')
.controller(
		'customerMymenuController', 
		customerMymenuController
		);

customerMymenuController.$inject = [
	];

function customerMymenuController(
		){
	const DOM_ION_HEADER_BAR_TAG = 'ion-header-bar';
	const DOM_ION_TABS_CLASS = '.tab-nav.tabs';
	const DOM_RESERVATION_DETAIL_CONTAINER = '#reservation-detail-container';
	const DOM_BUTTON_CONTAINER = '#button-container';
	
	var vm = this;
	
	//dummy data - test (start)
	vm.companyName = "Max's";
	vm.branchName = 'Ermita';
	vm.tableNumber = 1;
	//dummy data - test (end)
	
	//controller_method
	vm.initDom = initDom;
	
	function initDom(){
		var domIonNavBar = $(DOM_ION_HEADER_BAR_TAG).eq(0);
		var domIonTabs = $(DOM_ION_TABS_CLASS).eq(0);
		var domReservationDetailContainer = $(DOM_RESERVATION_DETAIL_CONTAINER).eq(0);
		var domButtonContainer = $(DOM_BUTTON_CONTAINER).eq(0);
		
		domReservationDetailContainer.css(
				'top', 
				domIonNavBar[0].clientHeight
				);
		domButtonContainer.css(
				'bottom', 
				domIonTabs[0].clientHeight
				);
		}
	}