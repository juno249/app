<?php

namespace App\Http\Controllers;

use DB;
use Uuid;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

include_once "branchesController.php";
include_once "companiesController.php";
include_once "customersController.php";
include_once "menuitemsController.php";
include_once "tablesController.php";

class orderreferencesConstants{
	const orderreferencesTable = 'orderreferences';
	
	const dbOrderreferenceCode = 'orderreference_code';
	const dbCustomerUsername = 'customer_username';
	const dbTableId = 'table_id';
	const dbOrderreferenceStatus = 'orderreference_status';
	const dbOrderreferenceStatusChangeTimestamp = 'orderreference_status_change_timestamp';
	
	const reqOrderreferenceCode = 'OrderreferenceCode';
	const reqCustomerUsername = 'CustomerUsername';
	const reqTableId = 'TableId';
	const reqOrderreferenceStatus = 'OrderreferenceStatus';
	const reqOrderreferenceStatusChangeTimestamp = 'OrderreferenceStatusChangeTimestamp';
	
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	
	const dbAddSuccessMsg = 'DB UPDATED W/NEW ORDER REFERENCE RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING ORDER REFERENCE RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING ORDER REFERENCE RECORD';
	
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class orderreferencesController extends Controller
{
	public function __construct(){
		//$this->middleware('jwt.auth');
	}
	
	public function getJoinCompanyBranchTableOrderreferences(){
		$companyBranchTableOrderreference = DB::table(orderreferencesConstants::orderreferencesTable)
		->join(
				tablesConstants::tablesTable, 
				orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbTableId, 
				'=', 
				tablesConstants::tablesTable . '.' . tablesConstants::dbTableId
				)
				->join(
						branchesConstants::branchesTable, 
						tablesConstants::tablesTable . '.' . tablesConstants::dbBranchId, 
						'=', 
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchId
						)
						->join(
								companiesConstants::companiesTable, 
								branchesConstants::branchesTable . '.' . branchesConstants::dbCompanyName, 
								'=', 
								companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName
								)
								->where($mySqlWhere)
								->get();
								return $companyBranchTableOrderreference;
	}
	
	public function getJoinCustomerOrderreferences(){
		$customerOrderreference = DB::table(orderreferencesConstants::orderreferencesTable)
		->join(
				customersConstants::customersTable, 
				orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbCustomerUsername, 
				'=', 
				customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername
				)
				->where($mySqlWhere)
				->get();
				return $customerOrderreference;
	}
	
	public function getCompanyBranchOrderreference
}