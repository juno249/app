angular
.module('starter')
.controller(
		'customerMymenuController', 
		customerMymenuController
		);

customerMymenuController.$inject = [
                                    'KEYS', 
                                    '$scope'
                                    ];

function customerMymenuController(
		KEYS, 
		$scope
		){
	const DOM_ION_HEADER_BAR_TAG = 'ion-header-bar';
	const DOM_ION_TABS_CLASS = '.tab-nav.tabs';
	const DOM_RESERVATION_DETAIL_CONTAINER = '#reservation_detail-container';
	const DOM_MYMENU_CONTENT = '#mymenuContent';
	const DOM_BUTTON_CONTAINER = '#button-container';
	
	var vm = this;
	vm.mymenuContentSrc = "templates/customer/mymenu/order/mymenu-order.html";
	
	//controller_method
	vm.initDom = initDom;
	//controller_method
	vm.setSrcAsAddOrder = setSrcAsAddOrder;
	//controller_method
	vm.setSrcAsMyBill = setSrcAsMyBill;
	//controller_method
	vm.gotoMymenuOrder = gotoMymenuOrder;
	
	function initDom(){
		$(DOM_RESERVATION_DETAIL_CONTAINER).eq(0).css(
				'top', 
				$(DOM_ION_HEADER_BAR_TAG).eq(0)[0].clientHeight
				);
		$(DOM_BUTTON_CONTAINER).eq(0).css(
				'bottom', 
				$(DOM_ION_TABS_CLASS).eq(0)[0].clientHeight
				);
		$(DOM_MYMENU_CONTENT).eq(0).css(
				'margin-top', 
				$(DOM_RESERVATION_DETAIL_CONTAINER).eq(0)[0].clientHeight
				);
		$(DOM_MYMENU_CONTENT).eq(0).css(
				'margin-bottom', 
				$(DOM_BUTTON_CONTAINER).eq(0)[0].clientHeight
				);
		}
	
	function setSrcAsAddOrder(){	vm.mymenuContentSrc = "templates/customer/mymenu/menu/mymenu-menu.html";
	}
	
	function setSrcAsMyBill(){	vm.mymenuContentSrc = "templates/customer/mymenu/bill/mymenu-bill.html";
	}
	
	function gotoMymenuOrder(){	vm.mymenuContentSrc = "templates/customer/mymenu/order/mymenu-order.html";
	}
	
	$scope.$on(
			function(){	return localStorage.getItem(KEYS.ReservationsDetails);
			}, 
			function(){
				vm.reservationsDetails = localStorage.getItem(KEYS.ReservationsDetails);
				
				vm.companyName = vm.reservationsDetails.companyName;
				vm.branchName = vm.reservationsDetails.branchName;
				vm.tableNumber = vm.reservationsDetails.tableNumber;
				}
			);
	}