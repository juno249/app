angular
.module('starter')
.controller(
		'customerMymenuController', 
		customerMymenuController
		);

customerMymenuController.$inject = [
                                    'ERROR_MESSAGES', 
                                    'LOADING_MESSAGES', 
                                    'KEYS', 
                                    '$scope', 
                                    'popupService', 
                                    'reservationOrderreferenceOrderService'
                                    ];

function customerMymenuController(
		ERROR_MESSAGES, 
		LOADING_MESSAGES, 
		KEYS, 
		$scope, 
		popupService, 
		reservationOrderreferenceOrderService
		){
	const DOM_ION_HEADER_BAR_TAG = 'ion-header-bar';
	const DOM_ION_TABS_CLASS = '.tab-nav.tabs';
	const DOM_RESERVATION_DETAIL_CONTAINER = '#reservation_detail-container';
	const DOM_MYMENU_CONTENT = '#mymenu_content';
	const DOM_BUTTON_CONTAINER = '#mymenu_button-container';
	
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
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.User);
			}, 
			function(){
				vm.user = localStorage.getItem(KEYS.User);
				vm.user = JSON.parse(vm.user);
				
				if(null == vm.user.reservationOrder){	vm.user.reservationOrder = {};
				}
				}
			);
	
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
	
	$scope.$on(
			'$ionicView.afterEnter', 
			function(){
				if(!(null == vm.user)){
					popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
					
					reservationOrderreferenceOrderService.setCustomerUsername(vm.user.username);
					reservationOrderreferenceOrderService.fetchReservationsOrderreferencesOrders(16)
					.then(fetchReservationsOrderreferencesOrdersSuccessCallback)
					.catch(fetchReservationsOrderreferencesOrdersFailedCallback);
					}
				
				function fetchReservationsOrderreferencesOrdersSuccessCallback(response){
					popupService.hideIonicLoading();
					
					vm.user.reservation = response.reservations;
					vm.user.orderreference = response.orderreferences;
					vm.user.orderreference.order = vm.user.orderreference.orders;
					delete vm.user.orderreference.orders;
					delete vm.user.reservationOrder;
					localStorage.removeItem(KEYS.Reservations);
					
					localStorage.setItem(
							KEYS.User, 
							JSON.stringify(vm.user)
							);
					}
				
				function fetchReservationsOrderreferencesOrdersFailedCallback(responseError){
					popupService.hideIonicLoading();
					
					popupService.dispIonicPopup(ERROR_MESSAGES.getFailed);
					}
				}
			);
	}