angular
.module('starter')
.factory(
		'reservationOrderreferenceOrderService', 
		reservationOrderreferenceOrderService
		);

reservationOrderreferenceOrderService.$inject = [
                                                 'API_BASE_URL', 
                                                 'KEYS', 
                                                 'ORDERREFERENCE_STATUS', 
                                                 'RESERVATION_STATUS', 
                                                 '$http', 
                                                 '$q', 
                                                 'orderService', 
                                                 'reservationService'
                                                 ];

function reservationOrderreferenceOrderService(
		API_BASE_URL, 
		KEYS, 
		ORDERREFERENCE_STATUS, 
		RESERVATION_STATUS, 
		$http, 
		$q, 
		orderService, 
		reservationService
		){
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
	
	function fetchReservationsOrderreferencesOrders(getOptionReservation){
		var deferred = $q.defer();
		var reservationsOrderreferencesOrders = {};
		
		if(16 == getOptionReservation){
			reservationService.setCustomerUsername(reservationOrderreferenceOrderServiceObj.customerUsername);
			reservationService.fetchReservations(	//getCustomerReservationsNotReservationStatus
					16, 
					{	ReservationStatus: RESERVATION_STATUS.done	}
					)
					.then(fetchReservationsSuccessCallback)
					.catch(fetchReservationsFailedCallback);
			} else if(13 == getOptionReservation){
				reservationService.setCustomerUsername(reservationOrderreferenceOrderServiceObj.customerUsername);
				reservationService.fetchReservations(	//getCustomerReservations
						13, 
						{}
						)
						.then(fetchReservationsSuccessCallback)
						.catch(fetchReservationsFailedCallback);
				}
		
		function fetchReservationsSuccessCallback(response){
			var reservations = localStorage.getItem(KEYS.Reservations);
			reservations = JSON.parse(reservations);
			var reservationsKey = Object.keys(reservations);
			
			reservationsOrderreferencesOrders[KEYS.Customers] = reservations[reservationsKey[0]][KEYS.Customers];
			reservationsOrderreferencesOrders[KEYS.Companies] = reservations[reservationsKey[0]][KEYS.Companies];
			reservationsOrderreferencesOrders[KEYS.Branches] = reservations[reservationsKey[0]][KEYS.Branches];
			reservationsOrderreferencesOrders[KEYS.Tables] = reservations[reservationsKey[0]][KEYS.Tables];
			reservationsOrderreferencesOrders[KEYS.Reservations] = reservations[reservationsKey[0]][KEYS.Reservations];
			reservationsOrderreferencesOrders[KEYS.Orderreferences] = reservations[reservationsKey[0]][KEYS.Orderreferences];
			
			orderService.fetchOrders(	//getByQuery
					13, 
					{	queryString: ('?OrderreferenceCode='+reservationsOrderreferencesOrders.orderreferences.orderreference_code)	}
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