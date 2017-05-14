angular
.module('starter')
.factory(
		'orderreferenceOrderService', 
		orderreferenceOrderService
		);

orderreferenceOrderService.$inject = [
                                      'API_BASE_URL', 
                                      'KEYS', 
                                      'ORDERREFERENCE_STATUS', 
                                      'TABLE_STATUS', 
                                      '$http', 
                                      '$q', 
                                      'orderService', 
                                      'orderreferenceService', 
                                      'tableService'
                                      ];

function orderreferenceOrderService(
		API_BASE_URL, 
		KEYS, 
		ORDERREFERENCE_STATUS, 
		TABLE_STATUS, 
		$http, 
		$q, 
		orderService, 
		orderreferenceService, 
		tableService
		){
	var orderreferenceOrderServiceObj = {
			orderreferencesOrders: {}, 
			customerUsername: undefined, 
			companyName: undefined, 
			branchName: undefined, 
			TableNumber: undefined, 
			getOrderreferencesOrders: getOrderreferencesOrders, 
			getCustomerUsername: getCustomerUsername, 
			getCompanyName: getCompanyName, 
			getBranchName: getBranchName, 
			getTableNumber: getTableNumber, 
			setOrderreferencesOrders: setOrderreferencesOrders, 
			setCustomerUsername: setCustomerUsername, 
			setCompanyName: setCompanyName, 
			setBranchName: setBranchName, 
			setTableNumber: setTableNumber, 
			fetchOrderreferencesOrders: fetchOrderreferencesOrders, 
			addOrderreferenceOrder: addOrderreferenceOrder
			}
	
	function getOrderreferencesOrders(){	return orderreferenceOrderServiceObj.orderreferencesOrders;
	}
	function getCustomerUsername(){	return orderreferenceOrderServiceObj.customerUsername;
	}
	function getCompanyName(){	return orderreferenceOrderServiceObj.companyName;
	}
	function getBranchName(){	return orderreferenceOrderServiceObj.branchName;
	}
	function getTableNumber(){	return orderreferenceOrderServiceObj.tableNumber;
	}
	function setOrderreferencesOrders(orderreferencesOrders){	orderreferenceOrderServiceObj.orderreferencesOrders = orderreferencesOrders;
	}
	function setCustomerUsername(customerUsername){	orderreferenceOrderServiceObj.customerUsername = customerUsername;
	}
	function setCompanyName(companyName){	orderreferenceOrderServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){	orderreferenceOrderServiceObj.branchName = branchName;
	}
	function setTableNumber(tableNumber){	orderreferenceOrderServiceObj.tableNumber = tableNumber;
	}
	
	function fetchOrderreferencesOrders(getOptionOrderreference){
		var deferred = $q.defer();
		var orderreferencesOrders = {};
		
		if(12 == getOptionOrderreference){
			orderreferenceService.setCustomerUsername(orderreferenceOrderServiceObj.customerUsername);
			orderreferenceService.fetchOrderreferences(	//getCustomerOrderreferencesNotOrderreferenceStatus
					12, 
					{	OrderreferenceStatus: ORDERREFERENCE_STATUS.done	}
					)
					.then(fetchOrderreferencesSuccessCallback)
					.catch(fetchOrderreferencesFailedCallback);
			} else if(8 == getOptionOrderreference){	//getCompanyBranchTableOrderreferencesNotOrderreferenceStatus
				orderreferenceService.setCompanyName(orderreferenceOrderServiceObj.companyName);
				orderreferenceService.setBranchName(orderreferenceOrderServiceObj.branchName);
				orderreferenceService.setTableNumber(orderreferenceOrderServiceObj.tableNumber);
				orderreferenceService.fetchOrderreferences(
						8, 
						{	OrderreferenceStatus: ORDERREFERENCE_STATUS.done	}
						)
						.then(fetchOrderreferencesSuccessCallback)
						.catch(fetchOrderreferencesSuccessCallback);
				} else if(4 == getOptionOrderreference){	//getCompanyBranchOrderreferencesNotOrderreferenceStatus
					orderreferenceService.setCompanyName(orderreferenceOrderServiceObj.companyName);
					orderreferenceService.setBranchName(orderreferenceOrderServiceObj.branchName);
					orderreferenceService.fetchOrderreferences(
							4, 
							{	OrderreferenceStatus: ORDERREFERENCE_STATUS.done	}
							)
							.then(fetchOrderreferencesSuccessCallback)
							.catch(fetchOrderreferencesSuccessCallback);
					}
		
		function fetchOrderreferencesSuccessCallback(response){
			var orderreferences = localStorage.getItem(KEYS.Orderreferences);
			orderreferences = JSON.parse(orderreferences);
			var orderreferencesKeyIdx = 0;
			
			if(0 == Object.keys(orderreferences).length){	deferred.resolve();
			}
			
			angular.forEach(
					orderreferences, 
					function(
							v, 
							k
							){
						orderreferencesOrders[k] = {};
						orderreferencesOrders[k][KEYS.Customers] = orderreferences[k][KEYS.Customers];
						orderreferencesOrders[k][KEYS.Companies] = orderreferences[k][KEYS.Companies];
						orderreferencesOrders[k][KEYS.Branches] = orderreferences[k][KEYS.Branches];
						orderreferencesOrders[k][KEYS.Tables] = orderreferences[k][KEYS.Tables];
						orderreferencesOrders[k][KEYS.Orderreferences] = orderreferences[k][KEYS.Orderreferences];
						
						orderService.fetchOrders(	//getByQuery
								13, 
								{	queryString: ('?OrderreferenceCode='+orderreferencesOrders[k][KEYS.Orderreferences].orderreference_code)	}
								)
								.then(fetchOrdersSuccessCallback)
								.catch(fetchOrdersFailedCallback);
						}
					);
			
			function fetchOrdersSuccessCallback(response){
				var orders = localStorage.getItem(KEYS.Orders);
				orders = JSON.parse(orders);
				var orderreferenceCode;
				localStorage.removeItem(KEYS.Orders);
				
				angular.forEach(
						orders, 
						function(
								v, 
								k
								){	orderreferenceCode = v.orderreference_code;
								}
						);
				
				orderreferencesOrders[orderreferenceCode][KEYS.Orders] = orders;
				orderreferencesKeyIdx++;
				
				if(orderreferencesKeyIdx == Object.keys(orderreferences).length){
					deferred.resolve(orderreferencesOrders);
					}
				}
			
			function fetchOrdersFailedCallback(responseError){	deferred.reject(responseError);
			}
			}
		
		function fetchOrderreferencesFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function addOrderreferenceOrder(transParams){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/orderreferences-orders', 
				data: transParams
				}
		
		$http(httpConfig)
		.then(addOrderreferenceOrderSuccessCallback)
		.catch(addOrderreferenceOrderFailedCallback);
		
		function addOrderreferenceOrderSuccessCallback(response){
			tableService.setCompanyName(orderreferenceOrderServiceObj.companyName);
			tableService.setBranchName(orderreferenceOrderServiceObj.branchName);
			tableService.setTableNumber(orderreferenceOrderServiceObj.tableNumber);
			tableService.updateTable(
					[
						{
							table_status: TABLE_STATUS.occupied, 
							table_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss'), 
							table_last_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
							}
						]
					)
					.then(updateTableSuccessCallback)
					.catch(updateTableFailedCallback);
			
			function updateTableSuccessCallback(response){	deferred.resolve(response);
			}
			
			function updateTableFailedCallback(responseError){	deferred.reject(responseError);
			}
			}
		
		function addOrderreferenceOrderFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return orderreferenceOrderServiceObj;
	}