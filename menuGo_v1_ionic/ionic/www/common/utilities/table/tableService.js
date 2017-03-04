angular
.module('starter')
.factory('tableService', tableService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
tableService.$inject = [
	'API_BASE_URL', 
	'TABLES_DB_FIELDS', 
	'$http', 
	'$localStorage', 
	'$q' 
];
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function tableService(
		API_BASE_URL, 
		TABLES_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q 
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var tableServiceObj = {
			table: {}, 
			tables: {}, 
			companyName: undefined, 
			branchName: undefined, 
			tableNumber: undefined, 
			getTable: getTable, 
			getTables: getTables, 
			getCompanyName: getCompanyName, 
			getBranchName: getBranchName, 
			getTableNumber: getTableNumber, 
			setTable: setTable, 
			setTables: setTables, 
			setCompanyName: setCompanyName, 
			setBranchName: setBranchName, 
			setTableNumber: setTableNumber, 
			fetchTable: fetchTable, 
			fetchTables: fetchTables, 
			addTable: addTable, 
			updateTable: updateTable, 
			deleteTable: deleteTable
	}
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getTable(){
		return tableServiceObj.table;
	}
	function getTables(){
		return tableServiceObj.tables;
	}
	function getCompanyName(){
		return tableServiceObj.companyName;
	}
	function getBranchName(){
		return tableServiceObj.branchName;
	}
	function getTableNumber(){
		return tableServiceObj.tableNumber;
	}
	function setTable(table){
		tableServiceObj.table = table;
	}
	function setTables(tables){
		tableServiceObj.tables = tables;
	}
	function setCompanyName(companyName){
		tableServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){
		tableServiceObj.branchName = branchName;
	}
	function setTableNumber(tableNumber){
		tableServiceObj.tableNumber = tableNumber;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchTable()
	 * purpose: fetch table from server
	 * ****************************** */
	function fetchTable(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables/' + tableServiceObj.tableNumber
		}
		$http(httpConfig)
		.then(fetchTableSuccessCallback)
		.catch(fetchTableFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchTableSuccessCallback(response){
			tableServiceObj.table = {};
			convertTableResponseToMap(response.data);
			var table = tableServiceObj.table;
			table = JSON.stringify(table);
			localStorage.setItem('Table', table);
			deferred.resolve(response);
		}
		
		function fetchTableFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertTableResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertTableResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var tableKey = TABLES_DB_FIELDS[2]; //table_number
			var tableDetails = {};
			
			for(var i=0; i<responseDataLength; i++){
				var tableRunner = responseData[i];
				var tableDBFieldCount = Object.keys(TABLES_DB_FIELDS).length;
				var tableDBFieldRunner = null;
				tableDetails = {};
				
				for(var j=0; j<tableDBFieldCount; j++){
					tableDBFieldRunner = TABLES_DB_FIELDS[j];
					tableDetails[tableDBFieldRunner] = tableRunner[tableDBFieldRunner];
				}
				var tableKeyValue = tableRunner[tableKey];
				tableServiceObj.table[tableKeyValue] = tableDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchTables()
	 * purpose: fetch tables from server
	 * ****************************** */
	function fetchTables(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables'
		};
		$http(httpConfig)
		.then(fetchTablesSuccessCallback)
		.catch(fetchTablesFailedCallback);

		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchTablesSuccessCallback(response){
			tableServiceObj.tables = {};
			convertTablesResponseToMap(response.data);
			var tables = tableServiceObj.tables;
			tables = JSON.stringify(tables);
			localStorage.setItem('Tables', tables);
			deferred.resolve(response);
		}
		
		function fetchTablesFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertTablesResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertTablesResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var tablesKey = TABLES_DB_FIELDS[2]; //table_number
			var tablesDetails = {};
			
			for(var i=0; i<responseDataLength; i++){
				var tablesRunner = responseData[i];
				var tablesDBFieldCount = Object.keys(TABLES_DB_FIELDS).length;
				var tablesDBFieldRunner = null;
				tablesDetails = {};
				
				for(var j=0; j<tablesDBFieldCount; j++){
					tablesDBFieldRunner = TABLES_DB_FIELDS[j];
					tablesDetails[tablesDBFieldRunner] = tablesRunner[tablesDBFieldRunner];
				}
				var tablesKeyValue = tablesRunner[tablesKey];
				tableServiceObj.tables[tablesKeyValue] = tablesDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addTable()
	 * purpose: adds table
	 * ****************************** */
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
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addTableSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addTableFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateTable()
	 * purpose: updates table
	 * ****************************** */
	function updateTable(table){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables/' + tableServiceObj.tableNumber, 
				data: table
		}
		$http(httpConfig)
		.then(updateTableSuccessCallback)
		.catch(updateTableFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateTableSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateTableFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteTable()
	 * purpose: deletes table
	 * ****************************** */
	function deleteTable(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables/' + tableServiceObj.tableNumber
		}
		$http(httpConfig)
		.then(deleteTableSuccessCallback)
		.catch(deleteTableFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteTableSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteTableFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	return tableServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */