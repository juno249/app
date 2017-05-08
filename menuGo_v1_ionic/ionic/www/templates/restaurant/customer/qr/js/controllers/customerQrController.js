angular
.module('starter')
.controller(
		'customerQrController', 
		customerQrController
		);

customerQrController.$inject = [
                                'ERROR_MESSAGES', 
                                'KEYS', 
                                '$localStorage', 
                                'popupService', 
                                'qrService'
                                ];

function customerQrController(
		ERROR_MESSAGES, 
		KEYS, 
		$localStorage, 
		popupService, 
		qrService
		){
	var vm = this;
	
	//controller_method
	vm.doScan = doScan;
	
	function doScan(){
		qrService.doScan()
		then(doScanSuccessCallback)
		.catch(doScanFailedCallback);
		
		function doScanSuccessCallback(data){
			const DELIMETER = ';'; 
			var reservationDetails = {};
			var dataSplit = data.split(DELIMETER);
			
			reservationDetails.companyName = dataSplit[0];
			reservationDetails.branchName = dataSplit[1];
			reservationDetails.tableNumber = dataSplit[2];
			reservationDetails = JSON.stringify(reservationDetails);
			
			localStorage.setItem(
					KEYS.ReservationDetails, 
					reservationDetails
					);
			}
		
		function doScanFailedCallback(e){	popupService.dispIonicPopup(ERROR_MESSAGES.scanFailed);
		}
		}
	}