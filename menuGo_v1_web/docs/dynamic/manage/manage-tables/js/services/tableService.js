angular
.module('starter')
.factory('tableService', tableService);

tableService.$inject = [
	'API_BASE_URL', 
	'TABLES_DB_FIELDS', 
	'$http', 
	'$localStorage', 
	'$q' 
	];

function tableService(
		API_BASE_URL, 
		TABLES_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q 
		){
	const TABLES_KEY = 'Tables';
	const TABLE_KEY = 'Table';
	
	var tableServiceObj = {
			tables: {}, 
			table: {}, 
			companyName: undefined, 
			branchName: undefined, 
			tableNumber: undefined, 
			getTables: getTables, 
			getTable: getTable, 
			getCompanyName: getCompanyName, 
			getBranchName: getBranchName, 
			getTableNumber: getTableNumber, 
			setTables: setTables, 
			setTable: setTable, 
			setCompanyName: setCompanyName, 
			setBranchName: setBranchName, 
			setTableNumber: setTableNumber, 
			fetchTables: fetchTables, 
			fetchTable: fetchTable, 
			addTable: addTable, 
			updateTable: updateTable, 
			deleteTable: deleteTable
	}
	
	function getTables(){	return tableServiceObj.tables;
	}
	function getTable(){	return tableServiceObj.table;
	}
	function getCompanyName(){	return tableServiceObj.companyName;
	}
	function getBranchName(){	return tableServiceObj.branchName;
	}
	function getTableNumber(){	return tableServiceObj.tableNumber;
	}
	function setTables(tables){	tableServiceObj.tables = tables;
	}
	function setTable(table){	tableServiceObj.table = table;
	}
	function setCompanyName(companyName){	tableServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){	tableServiceObj.branchName = branchName;
	}
	function setTableNumber(tableNumber){	tableServiceObj.tableNumber = tableNumber;
	}
	
	function fetchTables(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables'
		};
		
		$http(httpConfig)
		.then(fetchTablesSuccessCallback)
		.catch(fetchTablesFailedCallback);

		function fetchTablesSuccessCallback(response){
			var tables = undefined;
			tableServiceObj.tables = {};
			
			convertTablesResponseToMap(response.data);
			tables = tableServiceObj.tables;
			tables = JSON.stringify(tables);
			localStorage.setItem(
					TABLES_KEY, 
					tables
					);
			
			deferred.resolve(response);
		}
		
		function fetchTablesFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertTablesResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var tablesDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(TABLES_DB_FIELDS).length; j++){
					tablesDetails[TABLES_DB_FIELDS[j]] = responseData[i][TABLES_DB_FIELDS[j]];
				}
				
				key = responseData[i][TABLES_DB_FIELDS[1]]; //table_number
				tableServiceObj.tables[key] = tablesDetails;
			}
		}
		return deferred.promise;
	}
	
	function fetchTable(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables/' + tableServiceObj.tableNumber
		};
		
		$http(httpConfig)
		.then(fetchTableSuccessCallback)
		.catch(fetchTableFailedCallback);
		
		function fetchTableSuccessCallback(response){
			var table = undefined;
			tableServiceObj.table = {};
			
			convertTableResponseToMap(response.data);
			table = tableServiceObj.table;
			table = JSON.stringify(table);
			localStorage.setItem(
					TABLE_KEY, 
					table
					);
			
			deferred.resolve(response);
		}
		
		function fetchTableFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertTableResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var tableDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(TABLES_DB_FIELDS).length; j++){
					tableDetails[TABLES_DB_FIELDS[j]] = responseData[i][TABLES_DB_FIELDS[j]];
				}
				
				key = responseData[i][TABLES_DB_FIELDS[1]]; //table_number
				tableServiceObj.table[key] = tableDetails;
			}
		}
		return deferred.promise;
	}
	
	function addTable(tables){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables', 
				data: tables
		};
		
		$http(httpConfig)
		.then(addTableSuccessCallback)
		.catch(addTableFailedCallback);
		
		function addTableSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addTableFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	function updateTable(table){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables/' + tableServiceObj.tableNumber, 
				data: table
		};
		
		$http(httpConfig)
		.then(updateTableSuccessCallback)
		.catch(updateTableFailedCallback);
		
		function updateTableSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateTableFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	function deleteTable(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables/' + tableServiceObj.tableNumber
		};
		
		$http(httpConfig)
		.then(deleteTableSuccessCallback)
		.catch(deleteTableFailedCallback);
		
		function deleteTableSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteTableFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	return tableServiceObj;
}