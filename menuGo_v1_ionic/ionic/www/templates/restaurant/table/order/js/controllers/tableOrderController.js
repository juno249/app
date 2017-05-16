angular
.module('starter')
.controller(
		'tableOrderController', 
		tableOrderController
		);

tableOrderController.$inject = [
                                'KEYS', 
                                'ERROR_MESSAGES', 
                                'LOADING_MESSAGES', 
                                '$scope', 
                                '$stateParams', 
                                'orderService', 
                                'popupService'
                                ];

function tableOrderController(
		KEYS, 
		ERROR_MESSAGES, 
		LOADING_MESSAGES, 
		$scope, 
		$stateParams, 
		orderService, 
		popupService
		){
	var vm = this;
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	if(!(null == $stateParams.branchName)){	vm.branchName = $stateParams.branchName;
	}
	if(!(null == $stateParams.orderreference)){
		vm.orderreference = $stateParams.orderreference;
		vm.order = JSON.parse(vm.orderreference).order;
		vm.orderreference = JSON.parse(vm.orderreference).orderreference;
		}
	if(!(null == localStorage.getItem(KEYS.Companies))){
		vm.company = localStorage.getItem(KEYS.Companies);
		vm.company = JSON.parse(vm.company);
		}
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user = JSON.parse(vm.user);
		}
	
	//controller_method
	vm.updateOrderStatus = updateOrderStatus;
	//controller_method
	vm.getMenuitemFromId = getMenuitemFromId;
	
	function updateOrderStatus(
			orderId, 
			orderStatus
			){
		var order = {
				order_status: orderStatus, 
				order_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss'), 
				order_last_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
					}
		
		orderService.setCompanyName(vm.companyName);
		orderService.setBranchName(vm.branchName);
		orderService.setTableNumber(getTableNumberFromId(vm.orderreference[Object.keys(vm.orderreference)[0]].table_id));
		orderService.setOrderreferenceCode(Object.keys(vm.orderreference)[0]);
		orderService.setOrderId(orderId);
		orderService.updateOrder([order])
		.then(updateOrderSuccessCallback)
		.catch(updateOrderFailedCallback);
		
		popupService.dispIonicLoading(LOADING_MESSAGES.updatingOrder);
		
		function updateOrderSuccessCallback(response){
			popupService.hideIonicLoading();
			
			var orderStatus = response.config.data[0].order_status;
			var orderId = response.config.url.split('/');
			orderId = orderId[orderId.length-1];
			vm.order[orderId].order_status = orderStatus;
			}
		
		function updateOrderFailedCallback(responseError){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.updateFailed);
			}
		}
	
	function genCompanyMenuMenuitem(){
		var companyMenuMenuitem = {};
		
		angular.forEach(
				vm.companyMenu, 
				function(
						v, 
						k
						){
					if(null == vm.menuName){	vm.menuName = k;
					}
					angular.forEach(
							v.menuitems, 
							function(
									v, 
									k
									){	companyMenuMenuitem[v.menuitem_code] = v;
									}
							);
					}
				);
		
		return companyMenuMenuitem;
		}
	
	function getTableNumberFromId(tableId){
		var tableNumber = undefined;
		
		angular.forEach(
				vm._branch.tables, 
				function(
						v, 
						k
						){
					if(k == tableId){	tableNumber = v.table_number;
					}
					}
				);
		
		return tableNumber;
		}
	
	function getMenuitemFromId(menuitemId){
		var menuitem = undefined;
		
		angular.forEach(
				vm.companyMenuMenuitem, 
				function(
						v, 
						k
						){
					if(k == menuitemId){	menuitem = v;
					}
					}
				);
		
		return menuitem;
		}
	
	$scope.$watchCollection(
			function(){	return vm.company;
			}, 
			function(){
				if(!(null == vm.company)){
					vm._company = vm.company[vm.companyName];
					if(null == vm._company){	return;
					}
					
					if(!(null == vm._company.branches)){
						vm._branch = vm._company.branches[vm.branchName];
						if(null == vm._branch){	return;
						}
						
						if(!(null == vm._branch.tables)){	vm._table = vm._branch.tables[vm.tableNumber];
						}
						}
					
					if(!(null == vm._company.menus)){	vm.companyMenu = vm._company.menus;
					}
				}
				vm.companyMenuMenuitem = genCompanyMenuMenuitem();
			}
			);
	}