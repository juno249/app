<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

include_once "customersCompaniesBranchesController.php";

class customersConstants{
	const customersTable = 'customers';
	/*
	 * CONSTANTS w/c signify the column_name in customers table
	 * */
	const dbCustomerUsername = 'customer_username';
	const dbCustomerPassword = 'customer_password';
	const dbCustomerNameFname = 'customer_name_fname';
	const dbCustomerNameMname = 'customer_name_mname';
	const dbCustomerNameLname = 'customer_name_lname';
	const dbCustomerRole = 'customer_role';
	const dbCustomerGender = 'customer_gender';
	const dbCustomerAddressHouseBuilding = 'customer_address_house_building';
	const dbCustomerAddressStreet = 'customer_address_street';
	const dbCustomerAddressDistrict = 'customer_address_district';
	const dbCustomerAddressCity = 'customer_address_city';
	const dbCustomerAddressPostalcode = 'customer_address_postalcode';
	const dbCustomerAddressCountry = 'customer_address_country';
	const dbCustomerMobile = 'customer_mobile';
	const dbCustomerEmail = 'customer_email';
	const dbCustomerBirthdayMonth = 'customer_birthday_month';
	const dbCustomerBirthdayDate = 'customer_birthday_date';
	const dbCustomerBirthdayYear = 'customer_birthday_year';
	/*
	 * CONSTANTS w/c signify the request_name in HTTP GET request
	 * */
	const reqCustomerUsername = 'CustomerUsername';
	const reqCustomerPassword = 'CustomerPassword';
	const reqCustomerNameFname = 'CustomerNameFname';
	const reqCustomerNameMname = 'CustomerNameMname';
	const reqCustomerNameLname = 'CustomerNameLname';
	const reqCustomerRole = 'CustomerRole';
	const reqCustomerGender = 'CustomerGender';
	const reqCustomerAddressHouseBuilding = 'CustomerAddressHouseBuilding';
	const reqCustomerAddressStreet = 'CustomerAddressStreet';
	const reqCustomerAddressDistrict = 'CustomerAddressDistrict';
	const reqCustomerAddressCity = 'CustomerAddressCity';
	const reqCustomerAddressPostalcode = 'CustomerAddressPostalcode';
	const reqCustomerAddressCountry = 'CustomerAddressCountry';
	const reqCustomerMobile = 'CustomerMobile';
	const reqCustomerEmail = 'CustomerEmail';
	const reqCustomerBirthdayMonth = 'CustomerBirthdayMonth';
	const reqCustomerBirthdayDate = 'CustomerBirthdayDate';
	const reqCustomerBirthdayYear = 'CustomerBirthdayYear';
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
	 * CONSTANTS w/c signify the messages returned on validation
	 * */
	const dbAddValidateSuccessMsg = 'DATA IS VALID FOR DB ADD OPERATION';
	const dbUpdateValidateSuccessMsg = 'DATA IS VALID FOR DB UPDATE OPERATION';
	/*
	 * CONSTANTS w/c signify the messages returned on custom validation errors
	 * */
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class customersController extends Controller
{
	/**
	 * Constructor
	 * add 'jwt.auth' middleware to customersController
	 * */
	public function __construct(){
		//$this->middleware('jwt.auth', ['except' => ['addCustomer']]);
	}

	/**
	 * getJoinCustomerCustomerCompanyBranch: joins customers_table & customers_companies_branches table w/a variable $mySqlWhere
	 * */
	public function getJoinCustomerCustomerCompanyBranch($mySqlWhere){
		$customerCustomerCompanyBranch = DB::table(customersConstants::customersTable)
		->join(
				customersCompaniesBranchesConstants::customersCompaniesBranchesTable, 
				customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, 
				'=', 
				customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCustomerUsername
				)
				->where($mySqlWhere)
				->get();
				return $customerCustomerCompanyBranch;
	}
	
	/**
	 * GET method getAllCustomersAdmin
	 * URL-->/customers/companies/{CompanyName}
	 **/
	public function getAllCustomersAdmin($CompanyName){
		$mySqlWhere = array();
		array_push($mySqlWhere, [customersCompaniesBranchesConstants::customersCompaniesBranchesTable . '.' . customersCompaniesBranchesConstants::dbCompanyName,  '=', $CompanyName]);
		
		$customersResponse = new Response();
		try{
			$customers = $this->getJoinCustomerCustomerCompanyBranch($mySqlWhere);
			if($customers->isEmpty()){
				$customersResponse->setStatusCode(400, customersConstants::emptyResultSetErr);
			} else {
				$customersResponse->setContent(json_encode($customers));
			}
		} catch(\PDOException $e){
			$customersResponse->setStatusCode(400, dbReadCatchMsg);
		}
		return $customersResponse;
	}
	
	
	/**
	 * GET method getAllCustomers
	 * URL-->/customers/
	 **/
	public function getAllCustomers(){
		$customersResponse = new Response();
		try{
			$customers = DB::table(customersConstants::customersTable)->get();
			if($customers->isEmpty()){
				$customersResponse->setStatusCode(400, customersConstants::emptyResultSetErr);
			} else {
				$customersResponse->setContent(json_encode($customers));
			}
		} catch(\PDOException $e){
			$customersResponse.setStatusCode(400, customersConstants::dbReadCatchMsg);
		}
		return $customersResponse;
	}

	/**
	 * GET method getCustomer
	 * URL-->/customers/{CustomerUsername}
	 **/
	public function getCustomer($CustomerUsername){
		$mySqlWhere = array();
		array_push($mySqlWhere, [customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, '=', $CustomerUsername]);
		
		$customersResponse = new Response();
		try{
			$customer = DB::table(customersConstants::customersTable)->where($mySqlWhere)->get();
			if($customer->isEmpty()){
				$customersResponse->setStatusCode(400, customersConstants::emptyResultSetErr);
			} else {
				$customersResponse->setContent(json_encode($customer));
			}
		} catch(\PDOException $e){
			$customersResponse.setStatusCode(400, customersConstants::dbReadCatchMsg);
		}
		return $customersResponse;
	}

	/**
	 * GET method getByQuery
	 * URL-->/customers/query
	 **/
	public function getByQuery(){
		$mySqlWhere = array();

		if(isset($_GET[customersConstants::reqCustomerUsername])){
			array_push($mySqlWhere, [customersConstants::dbCustomerUsername, 'LIKE', '%' . $_GET[customersConstants::reqCustomerUsername] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerPassword])){
			array_push($mySqlWhere, [customersConstants::dbCustomerPassword, 'LIKE', '%' . $_GET[customersConstants::reqCustomerPassword] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerNameFname])){
			array_push($mySqlWhere, [customersConstants::dbCustomerNameFname, 'LIKE', '%' . $_GET[customersConstants::reqCustomerNameFname] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerNameMname])){
			array_push($mySqlWhere, [customersConstants::dbCustomerNameMname, 'LIKE', '%' . $_GET[customersConstants::reqCustomerNameMname] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerNameLname])){
			array_push($mySqlWhere, [customersConstants::dbCustomerNameLname, 'LIKE', '%' . $_GET[customersConstants::reqCustomerNameLname] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerRole])){
			array_push($mySqlWhere, [customersConstants::dbCustomerRole, 'LIKE', '%' . $_GET[customersConstants::reqCustomerRole] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerGender])){
			array_push($mySqlWhere, [customersConstants::dbCustomerGender, 'LIKE', '%' . $_GET[customersConstants::reqCustomerGender] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerAddressHouseBuilding])){
			array_push($mySqlWhere, [customersConstants::dbCustomerAddressHouseBuilding, 'LIKE', '%' . $_GET[customersConstants::reqCustomerAddressHouseBuilding] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerAddressStreet])){
			array_push($mySqlWhere, [customersConstants::dbCustomerAddressStreet, 'LIKE', '%' . $_GET[customersConstants::reqCustomerAddressStreet] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerAddressDistrict])){
			array_push($mySqlWhere, [customersConstants::dbCustomerAddressDistrict, 'LIKE', '%' . $_GET[customersConstants::reqCustomerAddressDistrict] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerAddressCity])){
			array_push($mySqlWhere, [customersConstants::dbCustomerAddressCity, 'LIKE', '%' . $_GET[customersConstants::reqCustomerAddressCity] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerAddressPostalcode])){
			array_push($mySqlWhere, [customersConstants::dbCustomerAddressPostalcode, 'LIKE', '%' . $_GET[customersConstants::reqCustomerAddressPostalcode] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerAddressCountry])){
			array_push($mySqlWhere, [customersConstants::dbCustomerAddressCountry, 'LIKE', '%' . $_GET[customersConstants::reqCustomerAddressCountry] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerMobile])){
			array_push($mySqlWhere, [customersConstants::dbCustomerMobile, 'LIKE', '%' . $_GET[customersConstants::reqCustomerMobile] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerEmail])){
			array_push($mySqlWhere, [customersConstants::dbCustomerEmail, 'LIKE', '%' . $_GET[customersConstants::reqCustomerEmail] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerBirthdayMonth])){
			array_push($mySqlWhere, [customersConstants::dbCustomerBirthdayMonth, 'LIKE', '%' . $_GET[customersConstants::reqCustomerBirthdayMonth] . '%']);
		}
		if(isset($_GET[customersConstants::reqCustomerBirthdayDate])){
			array_push($mySqlWhere, [customersConstants::dbCustomerBirthdayDate, '=', $_GET[customersConstants::reqCustomerBirthdayDate]]);
		}
		if(isset($_GET[customersConstants::reqCustomerBirthdayYear])){
			array_push($mySqlWhere, [customersConstants::dbCustomerBirthdayYear, '=', $_GET[customersConstants::reqCustomerBirthdayYear]]);
		}
		
		$customersResponse = new Response();
		try{
			$customers = DB::table(customersConstants::customersTable)->where($mySqlWhere)->get();
			if($customers->isEmpty()){
				$customersResponse->setStatusCode(400, customersConstants::emptyResultSetErr);
			} else {
				$customersResponse->setContent(json_encode($customers));
			}
		} catch(\PDOException $e){
			$customersResponse.setStatusCode(400, customersConstants::dbReadCatchMsg);
		}
		return $customersResponse;
	}

	/**
	 * Do basic Laravel validation
	 * */
	public function isDataValid($jsonData, &$errorMsg, $dbOperation){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData,
					[
							'*.' . customersConstants::dbCustomerUsername => 'unique:customers,customer_username|required|string|max:30',
							'*.' . customersConstants::dbCustomerPassword => 'required|string|max:30',
							'*.' . customersConstants::dbCustomerNameFname => 'required|string|max:30',
							'*.' . customersConstants::dbCustomerNameMname => 'required|string|max:30',
							'*.' . customersConstants::dbCustomerNameLname => 'required|string|max:30',
							'*.' . customersConstants::dbCustomerRole => 'required|string|max:30',
							'*.' . customersConstants::dbCustomerGender => 'string|max:10',
							'*.' . customersConstants::dbCustomerAddressHouseBuilding => 'string|max:30',
							'*.' . customersConstants::dbCustomerAddressStreet => 'string|max:30',
							'*.' . customersConstants::dbCustomerAddressDistrict => 'string|max:30',
							'*.' . customersConstants::dbCustomerAddressCity => 'string|max:30',
							'*.' . customersConstants::dbCustomerAddressPostalcode => 'string|max:30',
							'*.' . customersConstants::dbCustomerAddressCountry => 'string|max:30',
							'*.' . customersConstants::dbCustomerMobile => 'string|max:30',
							'*.' . customersConstants::dbCustomerEmail => 'string|email|max:30',
							'*.' . customersConstants::dbCustomerBirthdayMonth => 'string|max:30',
							'*.' . customersConstants::dbCustomerBirthdayDate => 'numeric',
							'*.' . customersConstants::dbCustomerBirthdayYear => 'numeric'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData,
					[
							'*.' . customersConstants::dbCustomerUsername => 'unique:customers,customer_username|sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerPassword => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerNameFname => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerNameMname => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerNameLname => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerRole => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerGender => 'sometimes|string|max:10',
							'*.' . customersConstants::dbCustomerAddressHouseBuilding => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerAddressStreet => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerAddressDistrict => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerAddressCity => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerAddressPostalcode => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerAddressCountry => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerMobile => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerEmail => 'sometimes|string|email|max:30',
							'*.' . customersConstants::dbCustomerBirthdayMonth => 'sometimes|string|max:30',
							'*.' . customersConstants::dbCustomerBirthdayDate => 'sometimes|numeric',
							'*.' . customersConstants::dbCustomerBirthdayYear => 'sometimes|numeric'
					]
					);
		}
		if($jsonValidation->fails()){
			$errorMsg .=  $jsonValidation->messages();
			return false;
		} else {
			return true;
		}
	}
	
	/**
	 * POST method addCustomerValidate
	 * URL-->/customers/validate
	 * */
	public function addCustomerValidate(Request $jsonRequest){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$customersResponse = new Response();
		$customersResponse->setStatusCode(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			return customersConstants::dbAddValidateSuccessMsg;
		} else {
			$customersResponse->setStatusCode(400, $errorMsg);
			return $customersResponse;
		}
	}
	
	/**
	 * POST method addCustomer
	 * URL-->/customers/
	 * */
	public function addCustomer(Request $jsonRequest){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$customersResponse = new Response();
		$customersResponse->setStatusCode(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			for($i=0; $i<$jsonDataSize; $i++){
				try{
					$pwHashed = Hash::make($jsonData[$i]['customer_password']);
					$jsonData[$i]['customer_password'] = $pwHashed;
					DB::table(customersConstants::customersTable)->insert($jsonData[$i]);
				} catch(\PDOException $e){
					$customersResponse->setStatusCode(400, customersConstants::dbAddCatchMsg);
					return $customersResponse;
				}
			}
		} else  {
			$customersResponse->setStatusCode(400, $errorMsg);
			return $customersResponse;
		}
		return customersConstants::dbAddSuccessMsg;
	}

	/**
	 * PUT method updateCustomerValidate
	 * URL-->/customers/{CustomerUsername}/validate
	 * */
	public function updateCustomerValidate(Request $jsonRequest){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
	
		$customersResponse = new Response();
		$customersResponse->setStatusCode(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			return customersConstants::dbUpdateValidateSuccessMsg;
		} else {
			$customersResponse->setStatusCode(400, $errorMsg);
			return $customersResponse;
		}
	}
	
	/**
	 * PUT method updateCustomer
	 * URL-->/customers/{CustomerUsername}
	 * */
	public function updateCustomer(Request $jsonRequest, $CustomerUsername){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
	
		$customersResponse = new Response();
		$customersResponse->setStatusCode(400, null);
		if(!$this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			$customersResponse->setStatusCode(400, $errorMsg);
			return $customersResponse;
		}
	
		try{
			array_push($mySqlWhere, [customersConstants::dbCustomerUsername, '=', $CustomerUsername]);
			DB::table(customersConstants::customersTable)->where($mySqlWhere)->update($jsonData[0]);
		} catch(\PDOException $e){
			$customersResponse->setStatusCode(400, customersConstants::dbUpdateCatchMsg);
			return $customersResponse;
		}
		return customersConstants::dbUpdateSuccessMsg;
	}

	/**
	 * DELETE method deleteCustomer
	 * URL-->/customers/{CustomerUsername}
	 * */
	public function deleteCustomer($CustomerUsername){
		$mySqlWhere = array();
		$errorMsg = '';
	
		$customersResponse = new Response();
		$customersResponse->setStatusCode(400, null);
		try{
			array_push($mySqlWhere, [customersConstants::dbCustomerUsername, '=', $CustomerUsername]);
			DB::table(customersConstants::customersTable)->where($mySqlWhere)->delete();
		} catch(\PDOException $e){
			$customersResponse->setStatusCode(400, customersConstants::dbDeleteCatchMsg);
			return $customersResponse;
		}
		return customersConstants::dbDeleteSuccessMsg;
	}
}