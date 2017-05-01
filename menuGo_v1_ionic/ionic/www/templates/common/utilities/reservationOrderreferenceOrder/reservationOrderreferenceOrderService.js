angular
.module('starter')
.factory(
		'reservationOrderreferenceOrderService', 
		reservationOrderreferenceOrderService
		);

reservationOrderreferenceOrderService.$inject = [
                                                 'API_BASE_URL', 
                                                 'ORDERREFERENCE_STATUS', 
                                                 'RESERVATION_STATUS', 
                                                 '$http', 
                                                 '$q', 
                                                 'orderService', 
                                                 'reservationService'
                                                 ];

function reservationOrderreferenceOrderService(
		API_BASE_URL, 
		ORDERREFERENCE_STATUS, 
		RESERVATION_STATUS, 
		$http, 
		$q, 
		orderService, 
		reservationService
		){
	const ORDERS_KEY = 'Orders';
	const ORDERREFERENCES_KEY = 'Orderreferences';
	const RESERVATIONS_KEY = 'Reservations';
	
	var reservationOrderreferenceOrderServiceObj = {
			reservationsOrderreferencesOrders: {}, 
			customerUsername: undefined, 
			getReservationsOrderreferencesOrders: getReservationsOrderreferencesOrders, 
			getCustomerUsername: getCustomerUsername, 
			setReservationsOrderreferencesOrders: setReservationsOrderreferencesOrders, 
			setCustomerUsername: setCustomerUsername, 
			fetchReservationsOrderreferencesOrders: fetchReservationsOrderreferencesOrders, 
			addReservationOrderreferenceOrder: addReservationOrderreferenceOrder
			}
	
	function getReservationsOrderreferencesOrders(){	return reservationOrderreferenceOrderServiceObj.reservationsOrderreferencesOrders;
	}
	function getCustomerUsername(){	return reservationOrderreferenceOrderServiceObj.customerUsername;
	}
	function setReservationsOrderreferencesOrders(reservationsOrderreferencesOrders){	reservationOrderreferenceOrderServiceObj.reservationsOrderreferencesOrders = reservationsOrderreferencesOrders;
	}
	function setCustomerUsername(customerUsername){	return reservationOrderreferenceOrderServiceObj.customerUsername = customerUsername;
	}
	
	function fetchReservationsOrderreferencesOrders(){
		var deferred = $q.defer();
		var reservationsOrderreferencesOrders = {};
		
		reservationService.setCustomerUsername(reservationOrderreferenceOrderServiceObj.customerUsername);
		reservationService.fetchReservations(	//getCustomerReservationsNotReservationStatus
				16, 
				{	ReservationStatus: RESERVATION_STATUS.done	}
				)
				.then(fetchReservationsSuccessCallback)
				.catch(fetchReservationsFailedCallback);
		
		function fetchReservationsSuccessCallback(response){
			var reservations = localStorage.getItem(RESERVATIONS_KEY);
			reservations = JSON.parse(reservations);
			var reservationsKey = Object.keys(reservations);
			
			reservationsOrderreferencesOrders.reservations = reservations[reservationsKey[0]][RESERVATIONS_KEY];
			reservationsOrderreferencesOrders.orderreferences = reservations[reservationsKey[0]][ORDERREFERENCES_KEY];
			
			orderService.fetchOrders(	//getByQuery
					13, 
					{	queryString: ('?OrderreferenceCode='+reservationsOrderreferencesOrders.orderreferences.orderreference_code)	}
					)
					.then(fetchOrdersSuccessCallback)
					.catch(fetchOrdersFailedCallback);
			}
		
		function fetchOrdersSuccessCallback(response){
			var orders = localStorage.getItem(ORDERS_KEY);
			orders = JSON.parse(orders);
			reservationsOrderreferencesOrders.orderreferences.orders = orders;
			localStorage.removeItem(ORDERS_KEY);
			
			deferred.resolve(reservationsOrderreferencesOrders);
			}
		
		function fetchOrdersFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function fetchReservationsFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function addReservationOrderreferenceOrder(transParams){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/reservations-orderreferences-orders', 
				data: transParams
				}
		
		$http(httpConfig)
		.then(addReservationOrderreferenceOrderSuccessCallback)
		.catch(addReservationOrderreferenceOrderFailedCallback);
		
		function addReservationOrderreferenceOrderSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addReservationOrderreferenceOrderFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return reservationOrderreferenceOrderServiceObj;
	}