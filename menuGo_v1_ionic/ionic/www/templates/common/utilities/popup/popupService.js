angular
.module('starter')
.factory(
		'popupService', 
		popupService
		);

popupService.$inject = [
	'$ionicLoading', 
    '$ionicPopup', 
    ];

function popupService(
		$ionicLoading, 
		$ionicPopup
		){
	var popupServiceObj = {
			dispIonicLoading: dispIonicLoading, 
			hideIonicLoading: hideIonicLoading, 
			dispIonicPopup: dispIonicPopup
			};
	
	function dispIonicLoading(msg){
		var templateString = '';
		templateString += '<ion-spinner></ion-spinner><br>';
		templateString += "<span class='font-family-1-size-small'>" + msg + '</span>';
		
		$ionicLoading.show(
				{	template: templateString	}
				);
		}
	
	function hideIonicLoading(){	$ionicLoading.hide();
	}
	
	function dispIonicPopup(msg){
		var templateString = '';
		templateString += "<span class='font-family-1-size-small'>" + msg + '</span>';
		
		$ionicPopup.alert(
				{	template: templateString	}
				);
		}
	
	return popupServiceObj;
	}