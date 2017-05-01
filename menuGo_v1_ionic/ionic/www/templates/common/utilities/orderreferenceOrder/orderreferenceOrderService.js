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
                                      '$http', 
                                      '$q', 
                                      'orderService', 
                                      'orderreferenceService'
                                      ];

function orderreferenceOrderService(
		API_BASE_URL, 
		KEYS, 
		ORDERREFERENCE_STATUS, 
		$http, 
		$q, 
		orderService, 
		orderreferenceService
		){
	var orderreferenceOrderServiceObj = {
			orderreferencesOrders: {}, 
			customerUsername: undefined, 
			getOrderreferencesOrders: getOrderreferencesOrders, 
			getCustomerUsername: getCustomerUsername, 
			setOrderreferencesOrders: setOrderreferencesOrders, 
			setCustomerUsername: setCustomerUsername, 
			fetchOrderreferencesOrders: fetchOrderreferencesOrders, 
			addOrderreferenceOrder: addOrderreferenceOrder
			}
	
	function getOrderreferencesOrders(){	return orderreferenceOrderServiceObj.orderreferencesOrders;
	}
	function getCustomerUsername(){	return orderreferenceOrderServiceObj.customerUsername;
	}
	function setOrderreferencesOrders(orderreferencesOrders){	orderreferenceOrderServiceObj.orderreferencesOrders = orderreferencesOrders;
	}
	function setCustomerUsername(customerUsername){	orderreferenceOrderServiceObj.customerUsername = customerUsername;
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
			}
		
		function fetchOrderreferencesSuccessCallback(response){
			var orderreferences = localStorage.getItem(KEYS.Orderreferences);
			orderreferences = JSON.parse(orderreferences);
			var orderreferencesKey = Object.keys(orderreferences);
			
			orderreferencesOrders.orderreferences[KEYS.Customers] = orderreferences[orderreferencesKey[0]][KEYS.Customers];
			orderreferencesOrders.orderreferences[KEYS.Companies] = orderreferences[orderreferencesKey[0]][KEYS.Companies];
			orderreferencesOrders.orderreferences[KEYS.Branches] = orderreferences[orderreferencesKey[0]][KEYS.Branches];
			orderreferencesOrders.orderreferences[KEYS.Tables] = orderreferences[orderreferencesKey[0]][KEYS.Tables];
			orderreferencesOrders.orderreferences[KEYS.Orderreferences] = orderreferences[orderreferencesKey[0]][KEYS.Orderreferences];
			
			orderService.fetchOrders(	//getByQuery
					13, 
					{	queryString: ('?OrderreferenceCode='+orderreferencesOrders.orderreferences.orderreference_code)	}
					)
					.then(fetchOrdersSuccessCallback)
					.catch(fetchOrdersFailedCallback);
			
			function fetchOrdersSuccessCallback(response){
				var orders = localStorage.getItem(KEYS.Orders);
				orders = JSON.parse(orders);
				reservationsOrderreferencesOrders.orderreferences.orders = orders;
				localStorage.removeItem(KEYS.Orders);
				
				deferred.resolve(reservationsOrderreferencesOrders);
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
		
		function addOrderreferenceOrderSuccessCallback(response){	deferred.promise(response);
		}
		
		function addOrderreferenceOrderFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return orderreferenceOrderServiceObj;
	}