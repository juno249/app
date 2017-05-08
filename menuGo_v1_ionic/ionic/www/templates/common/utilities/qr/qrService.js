angular
.module('starter')
.factory(
		'qrService', 
		qrService
		);

qrService.$inject = [
                     '$cordovaBarcodeScanner', 
                     '$q'
                     ];

function qrService(
		$cordovaBarcodeScanner, 
		$q
		){
	var qrServiceObj = {
			doScan: doScan
			};
	
	function doScan(){
		var deferred = $q.defer();
		
		$cordovaBarcodeScanner.scan()
		.then(scanSuccssCallback)
		.catch(scanFailedCallback);
		
		function scanSuccessCallback(data){	deferred.resolve(data);
		}
		
		function scanFailedCallback(e){	deferred.reject(e);
		}
		}
	
	return  qrServiceObj;
	}