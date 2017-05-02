angular
.module('starter')
.factory(
		'networkService', 
		networkService
		);

networkService.$inject = [
	'$cordovaNetwork', 
	'$rootScope'
	];

function networkService(
		$cordovaNetwork, 
		$rootScope
		){
	networkServiceObj = {
			deviceIsOnline: deviceIsOnline, 
			deviceIsOffline: deviceIsOffline, 
			};
	
	function deviceIsOnline(){
		if(ionic.Platform.isWebView()){	return $cordovaNetwork.isOnline();
		} else {	return navigator.onLine;
		}
		}
	
	function deviceIsOffline(){
		if(ionic.Platform.isWebView()){	return !$cordovaNetwork.isOnline();
		} else {	return !navigator.onLine;
		}
		}
	
	return networkServiceObj;
	}