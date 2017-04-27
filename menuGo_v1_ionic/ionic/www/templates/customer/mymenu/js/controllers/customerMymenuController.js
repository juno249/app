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
	const DOM_MYMENU_CONTENT = '#mymenuContent';
	const DOM_BUTTON_CONTAINER = '#button-container';
	
	var vm = this;
	
	//dummy data - test (start)
	vm.companyName = "Max's";
	vm.branchName = 'Ermita';
	vm.tableNumber = 1;
	//dummy data - test (end)
	vm.mymenuContentSrc = "templates/customer/mymenu/order/mymenu-order.html";
	
	//controller_method
	vm.initDom = initDom;
	//controller_method
	vm.setSrcAsAddOrder = setSrcAsAddOrder;
	//controller_method
	vm.setSrcAsMyBill = setSrcAsMyBill;
	
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
	}