<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

include_once "branchesController.php";
include_once "companiesController.php";
include_once "customersController.php";

class customersCompaniesBranchesConstants{
	const customersCompaniesBranchesTable = 'customers_companies_branches';
	
	const keyCustomer = 'customer';
	const keyCompany = 'company';
	const keyBranch = 'branch';
	
	const dbCustomerUsername = 'customer_username';
	const dbCompanyName = 'company_name';
	const dbBranchName = 'branch_name';
	const dbLastChangeTimestamp = 'last_change_timestamp';
	
	const reqCustomerUsername = 'CustomerUsername';
	const reqCompanyName = 'CompanyName';
	const reqBranchName = 'BranchName';
	const reqLastChangeTimestamp = 'LastChangeTimestamp';
	
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	
	const dbAddSuccessMsg = 'DB UPDATED W/NEW CUSTOMER, COMPANY, BRANCH RECORDS';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING CUSTOMER, COMPANY, BRANCH RECORDS';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING CUSTOMER, COMPANY, BRANCH RECORDS';
	
	const inconsistencyValidationErr1 = 'KEYS COMPANY_NAME DO NOT MATCH';
	
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}
		
class customersCompaniesBranchesController extends Controller
{
	public function __construct(){	//$this->middleware('jwt.auth', ['except' => ['addCustomerCompanyBranch']]);
	}
	
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
	
	//URL-->>/customers-companies-branches
	public function getAllCustomersCompaniesBranches(){
		$mySqlWhere = array();
		
		$customersCompaniesBranchesResponse = new Response();
		try{
			$customersCompaniesBranches = $this->getJoinCustomerCompanyBranch($mySqlWhere);
			if($customersCompaniesBranches->isEmpty()){	$customersCompaniesBranchesResponse->setStatusCode(
					200, 
					customersCompaniesBranchesConstants::emptyResultSetErr
					);
			} else {	$customersCompaniesBranchesResponse->setContent(json_encode($customersCompaniesBranches));
			}
		} catch(\PDOException $e){
			$customersCompaniesBranchesResponse->setStatusCode(
					400, 
					customersCompaniesBranchesConstants::dbReadCatchMsg
					);
		}
		
		return $customersCompaniesBranchesResponse;
	}
	
	//URL-->>/customers-companies-branches/{CustomerUsername}/{CompanyName}/{BranchName}
	public function getCustomerCompanyBranch(
			$CustomerUsername, 
			$CompanyName, 
			$BranchName
			){
		$mySqlWhere = array();
		
		array_push(
				$mySqlWhere, 
				[
						customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCustomerUsername, 
						'=', 
						$CustomerUsername
				]
				);
		array_push(
				$mySqlWhere, 
				[
						customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCompanyName, 
						'=', 
						$CompanyName
				]
				);
		array_push(
				$mySqlWhere, 
				[
						branchesConstants::branchesTable . '.' . branchesConstants::dbBranchName, 
						'=', 
						$BranchName
				]
				);
		
		$customersCompaniesBranchesResponse = new Response();
		try{
			$customerCompanyBranch = $this->getJoinCustomerCompanyBranch($mySqlWhere);
			if($customerCompanyBranch->isEmpty()){	$customersCompaniesBranchesResponse->setStatusCode(
					200, 
					customersCompaniesBranchesConstants::emptyResultSetErr
					);
			} else {	$customersCompaniesBranchesResponse->setContent(json_encode($customerCompanyBranch));
			}
		} catch(\PDOException $e){
			$customersCompaniesBranchesResponse->setStatusCode(
					400, 
					customersCompaniesBranchesConstants::dbReadCatchMsg
					);
		}
		
		return $customersCompaniesBranchesResponse;
	}
	
	//URL-->>/customers-companies-branches/query
	public function getByQuery(){
		$mySqlWhere = array();
		
		if(isset($_GET[customersCompaniesBranchesConstants::reqCustomerUsername])){	array_push(
				$mySqlWhere, 
				[
						customersCompaniesBranchesConstants::dbCustomerUsername, 
						'LIKE', 
						'%' . $_GET[customersCompaniesBranchesConstants::reqCustomerUsername] . '%'
				]
				);
		}
		if(isset($_GET[customersCompaniesBranchesConstants::reqCompanyName])){	array_push(
				$mySqlWhere, 
				[
						customersCompaniesBranchesConstants::dbCompanyName, 
						'LIKE', 
						'%' . $_GET[customersCompaniesBranchesConstants::reqCompanyName] . '%'
				]
				);
		}
		if(isset($_GET[customersCompaniesBranchesConstants::reqBranchName])){		array_push(
				$mySqlWhere, 
				[
						customersCompaniesBranchesConstants::dbBranchName, 
						'LIKE', 
						'%' . $_GET[customersCompaniesBranchesConstants::reqBranchName] . '%'
						
				]
				);
		}
		if(isset($_GET[customersCompaniesBranchesConstants::reqLastChangeTimestamp])){	array_push(
				$mySqlWhere, 
				[
						customersCompaniesBranchesConstants::dbLastChangeTimestamp, 
						'LIKE', 
						'%' . $_GET[customersCompaniesBranchesConstants::reqLastChangeTimestamp] . '%'
				]
				);
		}
		
		$customersCompaniesBranchesResponse = new Response();
		try{
			$customersCompaniesBranches = DB::table(customersCompaniesBranchesConstants::customersCompaniesBranchesTable)
			->where($mySqlWhere)
			->get();
			if($customersCompaniesBranches->isEmpty()){	$customersCompaniesBranchesResponse->setStatusCode(
					200, 
					customersCompaniesBranchesConstants::emptyResultSetErr
					);
			} else {	$customersCompaniesBranchesResponse->setContent(json_encode($customersCompaniesBranches));
			}
		} catch(\PDOException $e){	$customersCompaniesBranchesResponse->setStatusCode(
				400, 
				customersCompaniesBranchesConstants::dbReadCatchMessage
				);
		}
		
		return $customersCompaniesBranchesResponse;
	}
	
	private function isDataValid(
			$jsonData, 
			&$errorMsg, 
			$dbOperation
			){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . customersCompaniesBranchesConstants::dbCustomerUsername => 'exists:customers,customer_username|required|string|max:30', 
							'*.' . customersCompaniesBranchesConstants::dbCompanyName => 'exists:companies,company_name|required|string|max:30', 
							'*.' . customersCompaniesBranchesConstants::dbBranchName => 'exists:branches,branch_name|required|string|max:30'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . customersCompaniesBranchesConstants::dbCustomerUsername => 'exists:customers,customer_username|sometimes|string|max:30', 
							'*.' . customersCompaniesBranchesConstants::dbCompanyName => 'exists:companies,company_name|sometimes|string|max:30', 
							'*.' . customersCompaniesBranchesConstants::dbBranchName => 'exists:branches,branch_name|sometimes|string|max:30', 
							'*.' . customersCompaniesBranchesConstants::dbLastChangeTimestamp => 'required|date_format:Y-m-d H:i:s'
					]
					);
		}
		
		if($jsonValidation->fails()){
			$errorMsg = $jsonValidation->messages();
			
			return false;
		} else {	return true;
		}
	}
	
	//URL-->>/customers-companies-branches/
	public function addCustomerCompanyBranch(Request $jsonRequest){
		$customerCompanyBranch = [];
		$jsonData = json_decode(
				$jsonRequest->getContent(), 
				true
				);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
		
		$customersController = new customersController();
		$companiesController = new companiesController();
		$branchesController = new branchesController();
		
		$customerDbWrite = false;
		$companyDbWrite = false;
		$branchDbWrite = false;
		
		$customersCompaniesBranchesResponse = new Response();
		$customersCompaniesBranchesResponse->setStatusCode(
				400, 
				null
				);
		for($i=0; $i<$jsonDataSize; $i++){
			$customerCompanyBranchRunner = $jsonData[$i];
			
			DB::beginTransaction();
			try{
				//db_transaction: add_customer
				if(array_key_exists(
						customersCompaniesBranchesConstants::keyCustomer, 
						$customerCompanyBranchRunner
						)
						){
					$customer = $customerCompanyBranchRunner[customersCompaniesBranchesConstants::keyCustomer];
					if($customersController->isDataValid(
							[$customer], 
							$errorMsg, 
							"ADD"
							)
							){
						$pwHashed = Hash::make($customer[customersConstants::dbCustomerPassword]);
						$customer[customersConstants::dbCustomerPassword] = $pwHashed;
						
						try{	DB::table(customersConstants::customersTable)
						->insert($customer);
						} catch(\PDOException $e){	throw $e;
						}
						
						$customerCompanyBranch[customersConstants::dbCustomerUsername] = $customer[customersConstants::dbCustomerUsername];
						$customerDbWrite = true;
					} else {
						$customersCompaniesBranchesResponse->setStatusCode(
								400, 
								$errorMsg
								);
						
						return $customersCompaniesBranchesResponse;
					}
				}
				
				//db_transaction: add_company
				if(array_key_exists(
						customersCompaniesBranchesConstants::keyCompany, 
						$customerCompanyBranchRunner
						)
						){
					$company = $customerCompanyBranchRunner[customersCompaniesBranchesConstants::keyCompany];
					if($companiesController->isDataValid(
							[$company], 
							$errorMsg, 
							"ADD"
							)
							){
						try{	DB::table(companiesConstants::companiesTable)
						->insert($company);
						} catch(\PDOException $e){	throw $e;
						}
						
						$customerCompanyBranch[companiesConstants::dbCompanyName] = $company[companiesConstants::dbCompanyName];
						$companyDbWrite = true;
					} else {
						$customersCompaniesBranchesResponse->setStatusCode(
								400, 
								$errorMsg
								);
						
						return $customersCompaniesBranchesResponse;
					}
				}
					
				//db_transaction: add_branch
				if(array_key_exists(
						customersCompaniesBranchesConstants::keyBranch, 
						$customerCompanyBranchRunner
						)
						){
					$branch = $customerCompanyBranchRunner[customersCompaniesBranchesConstants::keyBranch];
					if($branchesController->isDataValid(
							[$branch], 
							$errorMsg, 
							"ADD"
							)
							){
						if(!($branch[branchesConstants::dbCompanyName] == $company[companiesConstants::dbCompanyName])){
							$customersCompaniesBranchesResponse->setStatusCode(
									400, 
									customersCompaniesBranchesConstants::inconsistencyValidationErr1
									);
							
							return $customersCompaniesBranchesResponse;
						}
						
						try{	DB::table(branchesConstants::branchesTable)
						->insert($branch);
						} catch(\PDOException $e){	throw $e;
						}
					}
				}
				
				//db_transaction: add_customerCompanyBranch
				if(array_key_exists(
						customersCompaniesBranchesConstants::keyBranch, 
						$customerCompanyBranchRunner
						)
						){
					$companyName = $company[companiesConstants::dbCompanyName];
					$branchName = $branch[branchesConstants::dbBranchName];
					$branch = json_decode(
							$branchesController->getCompanyBranch(
									$companyName, 
									$branchName
									)->original, 
							true)[0];
					
					$customerCompanyBranch[branchesConstants::dbBranchId] = $branch[branchesConstants::dbBranchId];
					$branchDbWrite = true;
				}
				
				if(
						$customerDbWrite && 
						$companyDbWrite && 
						$branchDbWrite
						){
					if($this->isDataValid(
							[$customerCompanyBranch], 
							$errorMsg, 
							"ADD"
							)
							){
						try{
							DB::table(customersCompaniesBranchesConstants::customersCompaniesBranchesTable)
							->insert($customerCompanyBranch);
						} catch(\PDOException $e){	throw $e;
						}	
					}
				}
				
				DB::commit();
			} catch(\PDOException $e){
				DB::rollback();
				$customersCompaniesBranchesResponse->setStatusCode(
						400, 
						customersCompaniesBranchesConstants::dbAddCatchMsg
						);
				
				return $customersCompaniesBranchesResponse;
			}
		}
		
		return customersCompaniesBranchesConstants::dbAddSuccessMsg;
	}
	
	//URL-->>/customers-companies-branches/{CustomerUsername}
	function deleteCustomerCompanyBranch($CustomerUsername){
		$mySqlWhere = array();
		$errorMsg = '';
		
		$customersCompaniesBranchesResponse = new Response();
		$customersCompaniesBranchesResponse->setStatusCode(
				400, 
				null
				);
		try{
			array_push(
					$mySqlWhere, 
					[
							customersCompaniesBranchesConstants::dbCustomerUsername, 
							'=', 
							$CustomerUsername
					]
					);
			DB::table(customersCompaniesBranchesConstants::customersCompaniesBranchesTable)
			->where($mySqlWhere)
			->delete();
		} catch(\PDOException $e){
			$customersCompaniesBranchesResponse->setStatusCode(
					400, 
					customersCompaniesBranchesConstants::dbDeleteCatchMsg
					);
			
			return $customersCompaniesBranchesResponse;
		}
		
		return customersCompaniesBranchesConstants::dbDeleteSuccessMsg;
	}
}