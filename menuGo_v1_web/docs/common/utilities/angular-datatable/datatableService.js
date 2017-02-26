angular
.module('starter')
.factory('datatableService', datatableService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
datatableService.$inject = [
	'$http', 
	'$q', 
	'$rootScope'
];
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function datatableService(
		$http, 
		$q, 
		$rootScope
){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var datatableServiceObj = {
		dtOptions: {}, 
		dtColumns: [], 
		dbColumnFields: {}, 
		dbColumn2Colheader: {}, 
		getDtOptions: getDtOptions, 
		getDtColumns: getDtColumns, 
		getDbColumnFields: getDbColumnFields, 
		getdbColumn2Colheader: getdbColumn2Colheader, 
		setDtOptions: setDtOptions, 
		setDtColumns: setDtColumns, 
		setDbColumnFields: setDbColumnFields, 
		setDbColumn2Colheader: setDbColumn2Colheader, 
		doDTInitOptions: doDTInitOptions, 
		doDTInitColumns: doDTInitColumns, 
		//dt configurations
		doDTConfigButton: doDTConfigButton, 
		doDTConfigDom: doDTConfigDom, 
		doDTConfigLightColumnFilter: doDTConfigLightColumnFilter, 
		doDTConfigSelect: doDTConfigSelect
	};
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getDtOptions(){
		return datatableServiceObj.dtOptions;
	}
	function getDtColumns(){
		return datatableServiceObj.dtColumns;
	}
	function getDbColumnFields(){
		return datatableServiceObj.dbColumnFields;
	}
	function getdbColumn2Colheader(){
		return datatableServiceObj.dbColumn2Colheader;
	}
	function setDtOptions(dtOptions){
		datatableServiceObj.dtOptions = dtOptions;
	}
	function setDtColumns(dtColumns){
		datatableServiceObj.dtColumns = dtColumns;
	}
	function setDbColumnFields(dbColumnFields){
		datatableServiceObj.dbColumnFields = dbColumnFields;
	}
	function setDbColumn2Colheader(dbColumn2Colheader){
		datatableServiceObj.dbColumn2Colheader = dbColumn2Colheader;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: doDTInitOptions()
	 * purpose: initialize DT options for angular-datatables
	 * ****************************** */
	function doDTInitOptions(
			dtOptionsBuilder, 
			restApiSource, 
			broadcastMsgAdd, 
			broadcastMsgUpdate, 
			broadcastMsgDelete
	){	
		var dtOptions = datatableServiceObj.dtOptions;
		
		dtOptions = dtOptionsBuilder
		.fromFnPromise(fromFnPromise)
		//angular-datatable bootstrap
		.withBootstrap()
		//angular-datatable buttons
		.withButtons(doDTConfigButton(
				broadcastMsgAdd, 
				broadcastMsgUpdate, 
				broadcastMsgDelete
		))
		//angular-datatable dom
		.withDOM(doDTConfigDom())
		//angular-datatable lightColumnFilter
		.withLightColumnFilter(doDTConfigLightColumnFilter())
		//angular-datatable select
		.withSelect(doDTConfigSelect());
		
		datatableServiceObj.dtOptions = dtOptions;
	
		/* ******************************
		 * Method Implementation
		 * method name: fromFnPromise()
		 * purpose: initailizes dtOption data from promise
		 * ****************************** */
		function fromFnPromise(){
			var deferred = $q.defer();
			var httpConfig = {
					method: 'GET', 
					url: restApiSource
			};
			$http(httpConfig)
			.then(fromFnPromiseSuccessCallback)
			.catch(fromFnPromiseFailedCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function fromFnPromiseSuccessCallback(response){
				deferred.resolve(response.data);
			}
			
			function fromFnPromiseFailedCallback(responseError){
				deferred.reject(responseError.data);
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
			
			return deferred.promise;
		}
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doDTInitColumns()
	 * purpose: initialize DT columns for angular-datatables
	 * ****************************** */
	function doDTInitColumns(
			dtColumnBuilder, 
			controllerObj
	){
		var dtColumns = [];
		var dbColumnFields = datatableServiceObj.dbColumnFields;
		var dbColumnFieldsLength = Object.keys(dbColumnFields);
		dbColumnFieldsLength = dbColumnFieldsLength.length;
		var dbColumn2Colheader = datatableServiceObj.dbColumn2Colheader;
		
		for(var i=0; i<dbColumnFieldsLength; i++){
			var dbFieldRunner = dbColumnFields[i];
			dtColumns.push(
					dtColumnBuilder
					.newColumn(dbFieldRunner)
					.withClass('dt-table-cell')
					.withTitle(dbColumn2Colheader[dbFieldRunner])
			);
		}
		/* ******************************
		 * Select (Start)
		 * ****************************** */
		dtColumns.unshift(
				dtColumnBuilder
				.newColumn(null)
				.notSortable()
				.renderWith(function(data){
					var params = JSON.stringify(data).replace(/"/g, "&quot;");
					var htmlStr = '';
					htmlStr += '<div ';
					htmlStr += 'style="position: absolute; top: 0px; left: 0px; display:block; width: 100%; height: 100%; z-index: 3;" ';
					htmlStr += 'ng-click="' + controllerObj.controllerObjName + '.dtAssignOnSelect(' + params +  ', $event);">';
					htmlStr += '&nbsp'; 
					htmlStr += '</div>';
					
					return htmlStr;
				})
				.withClass('select-checkbox')
				.withOption('width', '5%')
				.withTitle('')
		);
		/* ******************************
		 * Select (End)
		 * ****************************** */
		
		datatableServiceObj.dtColumns = dtColumns;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doDTConfigButton()
	 * purpose: initialize DT buttons plugin
	 * ****************************** */
	function doDTConfigButton(
			broadcastMsgAdd, 
			broadcastMsgUpdate, 
			broadcastMsgDelete
	){
		var colVis = {
				extend: 'colvis', 
				text: 'Columns', 
				className: 'btn-control btn-success font-family-1-size-small'
		}
		var addButton = {
				text: 'Add', 
				action: function(){	$rootScope.$broadcast(broadcastMsgAdd);	}, 
				className: 'btn-control btn-primary font-family-1-size-small'
		}
		var updateButton = {
				text: 'Update', 
				action: function(){	$rootScope.$broadcast(broadcastMsgUpdate);	}, 
				className: 'btn-control btn-warning font-family-1-size-small'
		}
		var deleteButton = {
				text: 'Delete', 
				action: function(){	$rootScope.$broadcast(broadcastMsgDelete);	}, 
				className: 'btn-control btn-danger font-family-1-size-small'
		}
		return [
			colVis, 
			addButton, 
			updateButton, 
			deleteButton
		]
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doDTConfigDom()
	 * purpose: initialize DT Dom plugin
	 * ****************************** */
	function doDTConfigDom(){
		var domStr = '';
		
		domStr += '<"row"'; 
		domStr += '<"col-md-6 col-sm-6 col-xs-12"i>';
		domStr += '<"col-md-6 col-sm-6 col-xs-12"f>';
		domStr += '>';
		domStr += '<"#dtWrapper.row"';
		domStr += '<"col-md-12 col-sm-12 col-xs-12"t>';
		domStr += '>';
		domStr += '<"row"';
		domStr += '<"col-md-6 col-sm-6 col-xs-12"B>';
		domStr += '<"col-md-6 col-sm-6 col-xs-12"p>';
		domStr += '>';
		
		return domStr;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doDTConfigLightColumnFilter()
	 * purpose: initialize DT lightColumnFilter plugin
	 * ****************************** */
	function doDTConfigLightColumnFilter(){
		var dbColumnFields = datatableServiceObj.dbColumnFields;
		var dbColumnFieldsLength = Object.keys(dbColumnFields);
		dbColumnFieldsLength = dbColumnFieldsLength.length;
		var lightColumnFilter = {};

		for(var i=0; i<dbColumnFieldsLength; i++){
			//increment (+1) is accounted to select plugin
			lightColumnFilter[i+1] = {	type:	'text'	}
		}
		
		return lightColumnFilter;	
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doDTConfigSelect()
	 * purpose: initialize DT select plugin
	 * ****************************** */
	function doDTConfigSelect(){
		return {
			style: 'os', 
			selector: 'td:first-child'
		}
	}
	
	return datatableServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */