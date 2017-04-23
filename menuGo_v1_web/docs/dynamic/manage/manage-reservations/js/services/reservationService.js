angular
.module('starter')
.factory(
		'reservationService', 
		reservationService
		);

reservationService.$inject = [
                              'API_BASE_URL', 
                              'RESERVATIONS_DB_FIELDS', 
                              '$http', 
                              '$localStorage', 
                              '$q'
                              ];

function reservationService(
		API_BASE_URL, 
		RESERVATIONS_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
		){
	const RESERVATIONS_KEY = 'Reservations';
	
	reservationServiceObj = {
			reservations: {}, 
			companyName: undefined, 
			branchName: undefined, 
			tableNumber: undefined, 
			orderreferenceCode: undefined, 
			customerUsername: undefined, 
			reservationCode: undefined, 
			getReservations: getReservations, 
			getCompanyName: getCompanyName, 
			getBranchName: getBranchName, 
			getTableNumber: getTableNumber, 
			getOrderreferenceCode: getOrderreferenceCode, 
			getCustomerUsername: getCustomerUsername, 
			getReservationCode: getReservationCode, 
			setReservations: setReservations, 
			setCompanyName: setCompanyName, 
			setBranchName: setBranchName, 
			setTableNumber: setTableNumber, 
			setOrderreferenceCode: setOrderreferenceCode, 
			setCustomerUsername: setCustomerUsername, 
			setReservationCode: setReservationCode, 
			getOptions: {
				1: 'getCompanyBranchReservations', 
				2: 'getCompanyBranchReservation', 
				3: 'getCompanyBranchReservationsReservationStatus', 
				4: 'getCompanyBranchReservationsNotReservationStatus', 
				5: 'getCompanyBranchTableReservations', 
				6: 'getCompanyBranchTableReservation', 
				7: 'getCompanyBranchTableReservationsReservationStatus', 
				8: 'getCompanyBranchTableReservationsNotReservationStatus', 
				9: 'getCompanyBranchTableOrderreferenceReservations', 
				10: 'getCompanyBranchTableOrderreferenceReservation', 
				11: 'getCompanyBranchTableOrderreferenceReservationsReservationStatus', 
				12: 'getCompanyBranchTableOrderreferenceReservationsNotReservationStatus', 
				13: 'getCustomerReservations', 
				14: 'getCustomerReservation', 
				15: 'getCustomerReservationsReservationStatus', 
				16: 'getCustomerReservationsNotReservationStatus'
					}, 
					fetchReservations: fetchReservations, 
					addReservation: addReservation, 
					addReservationValidate: addReservationValidate, 
					updateReservation: updateReservation, 
					deleteReservation: deleteReservation
					}
	
	function getReservations(){	return reservationServiceObj.reservations;
	}
	function getCompanyName(){	return reservationServiceObj.companyName;
	}
	function getBranchName(){	return reservationServiceObj.branchName;
	}
	function getTableNumber(){	return reservationServiceObj.tableNumber;
	}
	function getOrderreferenceCode(){	return reservationServiceObj.orderreferenceCode;
	}
	function getCustomerUsername(){	return reservationServiceObj.customerUsername;
	}
	function getReservationCode(){	return reservationServiceObj.reservationCode;
	}
	function setReservations(reservations){	reservationServiceObj.reservations = reservations;
	}
	function setCompanyName(companyName){	reservationServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){	reservationServiceObj.branchName = branchName;
	}
	function setTableNumber(tableNumber){	reservationServiceObj.tableNumber = tableNumber;
	}
	function setOrderreferenceCode(orderreferenceCode){	reservationServiceObj.orderreferenceCode = orderreferenceCode;
	}
	function setCustomerUsername (customerUsername){	reservationServiceObj.customerUsername = customerUsername;
	}
	function setReservationCode(reservationCode){	reservationServiceObj.reservationCode = reservationCode;
	}
	
	function fetchReservations(
			getOption, 
			getParams
			){
		var deferred = $q.defer();
		var httpConfig = {	method: 'GET'	};
		
		switch(reservationServiceObj.getOptions[getOption]){
		case 'getCompanyBranchReservations':
			httpConfig['url'] = API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/reservations';
			break;
		case 'getCompanyBranchReservation':
			httpConfig['url'] = API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/reservations/' + reservationServiceObj.reservationCode;
			break;
		case 'getCompanyBranchReservationsReservationStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/reservations/status/' + getParams['ReservationStatus'];
			break;
		case 'getCompanyBranchReservationsNotReservationStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/reservations/status_not/' + getParams['ReservationStatus'];
			break;
		case 'getCompanyBranchTableReservations':
			httpConfig['url'] = API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/tables/' + reservationServiceObj.tableNumber + '/reservations';
			break;
		case 'getCompanyBranchTableReservation':
			httpConfig['url'] = API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/tables/' + reservationServiceObj.tableNumber + '/reservations/' + reservationServiceObj.reservationCode;
			break;
		case 'getCompanyBranchTableReservationsReservationStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/tables/' + reservationServiceObj.tableNumber + '/reservations/status/' + getParams['ReservationStatus'];
			break;
		case 'getCompanyBranchTableReservationsNotReservationStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/tables/' + reservationServiceObj.tableNumber + '/reservations/status_not/' + getParams['ReservationStatus'];
			break;
		case 'getCompanyBranchTableOrderreferenceReservations':
			httpConfig['url'] = API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/tables/' + reservationServiceObj.tableNumber + '/orderreferences/' + reservationServiceObj.orderreferenceCode + '/reservations';
			break;
		case 'getCompanyBranchTableOrderreferenceReservation':
			httpConfig['url'] = API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/tables/' + reservationServiceObj.tableNumber + '/orderreferences/' + reservationServiceObj.orderreferenceCode + '/reservations/' + reservationServiceObj.reservationCode;
			break;
		case 'getCompanyBranchTableOrderreferenceReservationsReservationStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/tables/' + reservationServiceObj.tableNumber + '/orderreferences/' + reservationServiceObj.orderreferenceCode + '/reservations/status/' + getParams['ReservationStatus'];
			break;
		case 'getCompanyBranchTableOrderreferenceReservationsNotReservationStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/tables/' + reservationServiceObj.tableNumber + '/orderreferences/' + reservationServiceObj.orderreferenceCode + '/reservations/status_not/' + getParams['ReservationStatus'];
			break;
		case 'getCustomerReservations':
			httpConfig['url'] = API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations';
			break;
		case 'getCustomerReservation':
			httpConfig['url'] = API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations/' + reservationServiceObj.reservationCode;
			break;
		case 'getCustomerReservationsReservationStatus':
			httpConfig['url'] = API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations/status/' + getParams['ReservationStatus'];
			break;
		case 'getCustomerReservationsNotReservationStatus':
			httpConfig['url'] = API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations/status_not/' + getParams['ReservationStatus'];
			break;
			default:
				break;
			}
		
		$http(httpConfig)
		.then(fetchReservationsSuccessCallback)
		.catch(fetchReservationsFailedCallback);
		
		function fetchReservationsSuccessCallback(response){
			var reservations = undefined;
			reservationServiceObj.reservations = {};
			
			convertReservationsResponseToMap(response.data);
			reservations = reservationServiceObj.reservations;
			reservations = JSON.stringify(reservations);
			localStorage.setItem(
					RESERVATIONS_KEY, 
					reservations
					);
			
			deferred.resolve(response);
			}
		
		function fetchReservationsFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertReservationsResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var reservationsDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(RESERVATIONS_DB_FIELDS).length; j++){	reservationsDetails[RESERVATIONS_DB_FIELDS[j]] = responseData[i][RESERVATIONS_DB_FIELDS[j]];
				}
				
				var key = responseData[i][RESERVATIONS_DB_FIELDS[1]]; //reservation_code
				reservationServiceObj.reservations[key] = reservationsDetails;
				}
			}
		return deferred.promise;
		}
	
	function addReservation(reservations){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/tables/' + reservationServiceObj.tableNumber + '/orderreferences/' + reservationServiceObj.orderreferenceCode + '/reservations', 
				data: reservations
				};
		
		$http(httpConfig)
		.then(addReservationSuccessCallback)
		.catch(addReservationFailedCallback);
		
		function addReservationSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addReservationFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function addReservationValidate(reservations){
		var isReservationValid = true;
		
		if(!(null == reservations)){
			angular.forEach(
					reservations, 
					function(
							v, 
							k
							){
						switch(k){
						case 'customer_username':
							if(null == v){	isReservationValid = isReservationValid && false;
							}
							break;
						case 'reservation_diners_count':
							if(null == v){	isReservationValid = isReservationValid && false;
							}
							break;
						case 'reservation_eta':
							if(null == v){	isReservationValid = isReservationValid && false;
							}
							break;
						case 'reservation_payment_mode':
							if(null == v){	isReservationValid = isReservationValid && false;
							}
							break;
						case 'reservation_service_time':
							if(null == v){	isReservationValid = isReservationValid && false;
							}
							break;
						case 'reservation_status':
							if(null == v){	isReservationValid = isReservationValid && false;
							}
							break;
						case 'reservation_status_change_timestamp':
							if(null == v){	isReservationValid = isReservationValid && false;
							}
							break;
							}
						}
					);
			} else {	isReservationValid = isReservationValid && false;
			}
		return isReservationValid;
		}
	
	function updateReservation(reservation){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/tables/' + reservationServiceObj.tableNumber + '/orderreferences/' + reservationServiceObj.orderreferenceCode + '/reservations/' + reservationServiceObj.reservationCode, 
				data: reservation
				};
		
		$http(httpConfig)
		.then(updateReservationSuccessCallback)
		.catch(updateReservationFailedCallback);
		
		function updateReservationSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateReservationFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function deleteReservation(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + reservationServiceObj.companyName + '/branches/' + reservationServiceObj.branchName + '/tables/' + reservationServiceObj.tableNumber + '/orderreferences/' + reservationServiceObj.orderreferenceCode + '/reservations/' + reservationServiceObj.reservationCode
				};
		
		$http(httpConfig)
		.then(deleteReservationSuccessCallback)
		.catch(deleteReservationFailedCallback);
		
		function deleteReservationSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteReservationFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return reservationServiceObj;
	}