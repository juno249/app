<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

include_once "customersController.php";
include_once "companiesController.php";
include_once "branchesController.php";

class customersCompaniesBranchesConstants{
	const customersCompaniesBranchesTable = 'customers_companies_branches';
	/*
	 * CONSTANTS w/c signify the column_name in tables table
	 * */
	const dbCustomerUsername = 'customer_username';
	const dbCompanyName = 'company_name';
	const dbBranchName = 'branch_name';
	/*
	 * CONSTANTS w/c signify the request_name in HTTP GET request
	 * */
	const reqCustomerUsername = 'customerUsername';
	const reqCompanyName = 'companyName';
	const reqBranchName = 'branchName';
	/*
	 * CONSTANTS w/c signify the messages returned on failed DB operation
	 * */
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	/*
	 * CONSTANTS w/c signify the messages returned on successful DB operation
	 * */
	const dbAddSuccessMsg = 'DB UPDATED W/NEW CUSTOMER RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING CUSTOMER RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING CUSTOMER RECORD';
	/*
	 * CONSTANTS w/c signify the messages returned on custom validation errors
	 * */
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}
		
class customersCompaniesBranchesController extends Controller
{
	/**
	 * Constructor
	 * add 'jwt.auth' middleware to customersController
	 * */
	public function __construct(){
		//$this->middleware('jwt.auth', ['except' => ['addCustomerCompanyBranch']]);
	}
	
	/**
	 * getJoinCustomerCompanyBranch: joins customers_table & companies_table & branches_table w/a variable $mySqlWhere
	 * */
	public function getJoinCustomerCompanyBranch($mySqlWhere){
		$customerCompanyBranch = DB::table(customersCompaniesBranchesConstants::customersCompaniesBranchesTable)
		->join(
				customersConstants::customersTable, 
				customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCustomerUsername, 
				'=', 
				customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername
				)
				->join(
						companiesConstants::companiesTable, 
						customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCompanyName, 
						'=', 
						companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName
						)
						->join(
								branchesConstants::branchesTable, 
								companiesConstants::companiesTable . '.' . companiesConstants::dbCompanyName, 
								'=', 
								branchesConstants::branchesTable . '.' . branchesConstants::dbCompanyName
								)
								->where($mySqlWhere)
								->get();
								return $customerCompanyBranch;
	}
	
	/**
	 * GET method getAllCustomersCompaniesBranches
	 * URL-->/customers-companies-branches
	 **/
	public function getAllCustomersCompaniesBranches(){
		$mySqlWhere = array();
		
		$customersCompaniesBranchesResponse = new Response();
		try{
			$customersCompaniesBranches = $this->getJoinCustomerCompanyBranch($mySqlWhere);
			if($customersCompaniesBranches->isEmpty()){
				$customersCompaniesBranchesResponse->setStatusCode(200, customersCompaniesBranchesConstants::emptyResultSetErr);
			} else {
				$customersCompaniesBranchesResponse->setContent(json_encode($customersCompaniesBranches));
			}
		} catch(\PDOException $e){
			$customersCompaniesBranchesResponse->setStatusCode(400, customersCompaniesBranchesConstants::dbReadCatchMsg);
		}
		return $customersCompaniesBranchesResponse;
	}
	
	/**
	 * GET method getCustomerCompanyBranch
	 * URL-->/customers-companies-branches/{CustomerUsername}/{CompanyName}/{BranchName}
	 **/
	public function getCustomerCompanyBranch($CustomerUsername, $CompanyName, $BranchName){
		$mySqlWhere = array();
		array_push($mySqlWhere, [customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCustomerUsername, '=', $CustomerUsername]);
		array_push($mySqlWhere, [customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCompanyName, '=', $CompanyName]);
		array_push($mySqlWhere, [branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, '=', $BranchName]);
		
		$customersCompaniesBranchesResponse = new Response();
		try{
			$customerCompanyBranch = $this->getJoinCustomerCompanyBranch($mySqlWhere);
			if($customerCompanyBranch->isEmpty()){
				$customersCompaniesBranchesResponse->setStatusCode(200, customersCompaniesBranchesConstants::emptyResultSetErr);
			} else {
				$customersCompaniesBranchesResponse->setContent(json_encode($customerCompanyBranch));
			}
		} catch(\PDOException $e){
			$customersCompaniesBranchesResponse->setStatusCode(400, customersCompaniesBranchesConstants::dbReadCatchMsg);
		}
		return $customersCompaniesBranchesResponse;
	}
	
	/**
	 * GET method getByQuery
	 * URL-->/customers-companies-branches/query
	 **/
	public function getByQuery(){
		$mySqlWhere = array();
		
		if(isset($_GET[customersCompaniesBranchesConstants::reqCustomerUsername])){
			array_push($mySqlWhere, [customersCompaniesBranchesConstants::dbCustomerUsername, '=', $_GET[customersCompaniesBranchesConstants::reqCustomerUsername]]);
		}
		if(isset($_GET[customersCompaniesBranchesConstants::reqCompanyName])){
			array_push($mySqlWhere, [customersCompaniesBranchesConstants::dbCompanyName, 'LIKE', '%' . $_GET[customersCompaniesBranchesConstants::reqCompanyName] . '%']);
		}
		if(isset($_GET[customersCompaniesBranchesConstants::reqBranchName])){
			array_push($mySqlWhere, [customersCompaniesBranchesConstants::dbBranchName, 'LIKE', '%' . $_GET[customersCompaniesBranchesConstants::reqBranchName] . '%']);
		}
		
		$customersCompaniesBranchesResponse = new Response();
		try{
			$customersCompaniesBranches = DB::table(customersCompaniesBranchesConstants::customersCompaniesBranchesTable)->where($mySqlWhere)->get();
			if($customersCompaniesBranches->isEmpty()){
				$customersCompaniesBranchesResponse->setStatusCode(200, customersCompaniesBranchesConstants::emptyResultSetErr);
			} else {
				$customersCompaniesBranchesResponse->setContent(json_encode($customersCompaniesBranches));
			}
		} catch(\PDOException $e){
			$customersCompaniesBranchesResponse->setStatusCode(400, customersCompaniesBranchesConstants::dbReadCatchMessage);
		}
		return $customersCompaniesBranchesResponse;
	}
	
	/**
	 * POST method addCustomerCompanyBranch
	 * URL-->/customers-companies-branches/
	 * */
	public function addCustomerCompanyBranch(Request $jsonRequest){
		$customerCompanyBranch = [];
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
		
		$customersController = new customersController();
		$companiesController = new companiesController();
		$branchesController = new branchesController();
		
		$customerDbWrite = false;
		$companyDbWrite = false;
		$branchDbWrite = false;
		
		$customersCompaniesBranchesResponse = new Response();
		$customersCompaniesBranchesResponse->setStatusCode(400, null);
		
		for($i=0; $i<$jsonDataSize; $i++){
			$customerCompanyBranchRunner = $jsonData[$i];
			
			DB::beginTransaction();
			try{
				/*
				 * db_transaction: add_customer
				 * */
				if(array_key_exists('customer', $customerCompanyBranchRunner)){
					$customer = $customerCompanyBranchRunner['customer'];
					if($customersController->isDataValid([$customer], $errorMsg, "ADD")){
						$pwHashed = Hash::make($customer['customer_password']);
						$customer['customer_password'] = $pwHashed;
						
						try{	DB::table(customersConstants::customersTable)->insert($customer);
						} catch(\PDOException $e){	throw $e;
						}
						
						$customerCompanyBranch['customer_username'] = $customer['customer_username'];
						$customerDbWrite = true;
					} else {
						$customersCompaniesBranchesResponse->setStatusCode(400, $errorMsg);
						return $customersCompaniesBranchesResponse;
					}
				}
					
				/*
				 * db_transaction: add_company
				 * */
				if(array_key_exists('company', $customerCompanyBranchRunner)){
					$company = $customerCompanyBranchRunner['company'];
					if($companiesController->isDataValid([$company], $errorMsg, "ADD")){
						try{	DB::table(companiesConstants::companiesTable)->insert($company);
						} catch(\PDOException $e){	throw $e;
						}
						
						$customerCompanyBranch['company_name'] = $company['company_name'];
						$companyDbWrite = true;
					} else {
						$customersCompaniesBranchesResponse->setStatusCode(400, $errorMsg);
						return $customersCompaniesBranchesResponse;
					}
				}
					
				/*
				 * db_transaction: add_branch
				 * */
				if(array_key_exists('branch', $customerCompanyBranchRunner)){
					$branch = $customerCompanyBranchRunner['branch'];
					if($branchesController->isDataValid([$branch], $errorMsg, "ADD")){
						try{	DB::table(branchesConstants::branchesTable)->insert($branch);
						} catch(\PDOException $e){	throw $e;
						}
					}
				}
				
				DB::commit();
				
				/*
				 * db_transaction: add_customerCompanyBranch
				 * */
				if(array_key_exists('branch', $customerCompanyBranchRunner)){
					$companyName = $company['company_name'];
					$branchName = $branch['branch_name'];
					$branch = json_decode($branchesController->getCompanyBranch($companyName, $branchName)->original, true)[0];
					
					var_dump($branch);
					
					$customerCompanyBranch['branch_id'] = $branch['branch_id'];
					$branchDbWrite = true;
				}
				
				/*
				 * db_transaction: add_customers_companies_branches
				 * */
				if(
						$customerDbWrite && 
						$companyDbWrite && 
						$branchDbWrite
						){
					try{	DB::table(customersCompaniesBranchesConstants::customersCompaniesBranchesTable)->insert($customerCompanyBranch);
					} catch(\PDOException $e){	throw $e;
					}
				}
				
				DB::commit();
			} catch(\PDOException $e){
				DB::rollback();
				$customersCompaniesBranchesResponse->setStatusCode(400, $e->getMessage());
				return $customersCompaniesBranchesResponse;
			}
		}
	}
}
