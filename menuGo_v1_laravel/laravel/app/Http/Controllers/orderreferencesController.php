<?php

namespace App\Http\Controllers;

use DB;
use Uuid;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

include_once "customersController.php";

class orderreferencesConstants{
	const orderreferencesTable = 'orderreferences';
	/*
	 * CONSTANTS w/c signify the column_name in orders table
	 * */
	const dbOrderreferenceCode = 'orderreference_code';
	const dbCustomerUsername = 'customer_username';
	/*
	 * CONSTANTS w/c signify the request_name in HTTP GET request
	 * */
	const reqOrderreferenceCode = 'OrderreferenceCode';
	const reqCustomerUsername = 'CustomerUsername';
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
	const dbAddSuccessMsg = 'DB UPDATED W/NEW ORDER REFERENCE RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING ORDER REFERENCE RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING ORDER REFERENCE RECORD';
	/*
	 * CONSTANTS w/c signify the messages returned on custom validation errors
	 * */
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class orderreferencesController extends Controller
{
	/**
	 * Constructor
	 * add 'jwt.auth' middleware to ordersController
	 * */
	public function __construct(){
		//$this->middleware('jwt.auth');
	}
	
	/**
	 * getJoinCustomerOrderreference: joins customers_table & orderreferences_table w/a variable $mySqlWhere
	 * */
	public function getJoinCustomerOrderreference($mySqlWhere){
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
	
	/**
	 * GET method getAllCustomerOrderreferences
	 * URL-->/customers/{CustomerUsername}/orderreferences
	 **/
	public function getAllCustomerOrderreferences($CustomerUsername){
		$mySqlWhere = array();
		array_push($mySqlWhere, [customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, '=', $CustomerUsername]);
		
		$orderreferencesResponse = new Response();
		try{
			$customerOrderreferences = $this->getJoinCustomerOrderreference($mySqlWhere);
			if($customerOrderreferences->isEmpty()){
				$orderreferencesResponse->setStatusCode(200, orderreferencesConstants::emptyResultSetErr);
			} else {
				$orderreferencesResponse->setContent(json_encode($customerOrderreferences));
			}
		} catch(\PDOException $e){
			$orderreferencesResponse->setStatusCode(400, $e->getMessage());
		}
		return $orderreferencesResponse;
	}
	
	/**
	 * GET method getCustomerOrderreference
	 * URL-->/customers/{CustomerUsername}/orderreferences/{OrderreferenceCode}
	 **/
	public function getCustomerOrderreference($CustomerUsername, $OrderreferenceCode){
		$mySqlWhere = array();
		array_push($mySqlWhere, [customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, '=', $CustomerUsername]);
		array_push($mySqlWhere, [orderreferencesConstants::orderreferencesTable . '.' . orderreferencesConstants::dbOrderreferenceCode, '=', $OrderreferenceCode]);
	
		$orderreferencesResponse = new Response();
		try{
			$customerOrderreference = $this->getJoinCustomerOrderreference($mySqlWhere);
			if($customerOrderreference->isEmpty()){
				$orderreferencesResponse->setStatusCode(200, orderreferencesConstants::emptyResultSetErr);
			} else {
				$orderreferencesResponse->setContent(json_encode($customerOrderreference));
			}
		} catch(\PDOException $e){
			$orderreferencesResponse->setStatusCode(400, orderreferencesConstants::emptyResultSetErr);
		}
		return $orderreferencesResponse;
	}
	
	/**
	 * GET method getByQuery
	 * URL-->/orderreferences/query
	 **/
	public function getByQuery(){
		$mySqlWhere = array();
		
		if(isset($_GET[orderreferencesConstants::reqOrderreferenceCode])){
			array_push($mySqlWhere, [orderreferencesConstants::dbOrderreferenceCode, '=', $_GET[orderreferencesConstants::reqOrderreferenceCode]]);
		}
		if(isset($_GET[orderreferencesConstants::reqCustomerUsername])){
			array_push($mySqlWhere, [orderreferencesConstants::dbCustomerUsername, 'LIKE', '%' . $_GET[orderreferencesConstants::reqCustomerUsername] . '%']);
		}
		
		$orderreferencesResponse = new Response();
		try{
			$customerOrderreferences = DB::table(orderreferencesConstants::orderreferencesTable)->where($mySqlWhere)->get();
			if($customerOrderreferences->isEmpty()){
				$orderreferencesResponse->setStatusCode(200, orderreferencesConstants::emptyResultSetErr);
			} else {
				$orderreferencesResponse->setContent(json_encode($customerOrderreferences));
			}
		} catch(\PDOException $e){
			$orderreferencesResponse->setStatusCode(400, orderreferencesConstants::dbReadCatchMsg);
		}
		return $orderreferencesResponse;
	}
	
	/**
	 * Do basic laravel validation
	 * */
	public function isDataValid($jsonData, &$errorMsg, $dbOperation){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . orderreferencesConstants::dbOrderreferenceCode => 'unique:orderreferences,orderreference_code|required|string|max:40', 
							'*.' . orderreferencesConstants::dbCustomerUsername => 'exists:customers,customer_username|required|string|max:30'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . orderreferencesConstants::dbOrderreferenceCode => 'unique:orderreferences,orderreference_code|sometimes|string|max:40',
							'*.' . orderreferencesConstants::dbCustomerUsername => 'exists:customers,customer_username|sometimes|string|max:30'
					]
					);
		}
		if($jsonValidation->fails()){
			$errorMsg = $jsonValidation->messages();
			return false;
		} else {
			return true;
		}
	}
	
	/**
	 * POST method addOrderreference
	 * URL-->/customer/{CustomerUsername}/orderreferences
	 **/
	public function addOrderreference(Request $jsonRequest, $CustomerUsername){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
		
		$orderreferencesResponse = new Response();
		$orderreferencesResponse->setStatusCode(400, null);
		for($i=0; $i<$jsonDataSize; $i++){
			$jsonData[$i]['orderreference_code'] = Uuid::generate()->string;
		}
		
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			for($i=0; $i<$jsonDataSize; $i++){
				try{	DB::table(orderreferencesConstants::orderreferencesTable)->insert($jsonData[$i]);
				} catch(\PDOException $e){
					$orderreferencesResponse->setStatusCode(400, orderreferencesConstants::dbAddCatchMsg);
					return $orderreferencesResponse;
				}
			}
		} else {
			$orderreferencesResponse->setStatusCode(400, $errorMsg);
			return $orderreferencesResponse;
		}
		return orderreferencesConstants::dbAddSuccessMsg;
	}
	
	/**
	 * PUT method updateOrderreference
	 * URL-->/customer/{CustomerUsername}/orderreferences/{OrderreferenceCode}
	 **/
	public function updateOrderreference(Request $jsonRequest, $CustomerUsername, $OrderreferenceCode){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
		
		$orderreferencesResponse = new Response();
		$orderreferencesResponse->setStatusCode(400, null);
		if(!$this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			$orderreferencesResponse->setStatusCode(400, $errorMsg);
			return $orderreferencesResponse;
		}
		
		try{
			array_push($mySqlWhere, [orderreferencesConstants::dbCustomerUsername, '=', $CustomerUsername]);
			array_push($mySqlWhere, [orderreferencesConstants::dbOrderreferenceCode, '=', $OrderreferenceCode]);
			DB::table(orderreferencesConstants::orderreferencesTable)->where($mySqlWhere)->update($jsonData[0]);
		} catch(\PDOExceptin $e){
			$orderreferencesResponse->setStatusCode(400, orderreferencesConstants::dbUpdateCatchMsg);
			return $orderreferencesResponse;
		}
		return orderreferencesConstants::dbUpdateSuccessMsg;
	}
	
	/**
	 * DELETE method deleteOrderreference
	 * URL-->/customer/{CustomerUsername}/orderreferences/{OrderreferenceCode}
	 **/
	public function deleteOrderreference($CustomerUsername, $OrderreferenceCode){
		$mySqlWhere = array();
		$errorMsg = '';
		
		$orderreferencesResponse = new Response();
		$orderreferencesResponse->setStatusCode(400, null);
		try{
			array_push($mySqlWhere, [orderreferencesConstants::dbCustomerUsername, '=', $CustomerUsername]);
			array_push($mySqlWhere, [orderreferencesConstants::dbOrderreferenceCode, '=', $OrderreferenceCode]);
			DB::table(orderreferencesConstants::orderreferencesTable)->where($mySqlWhere)->delete();
		} catch(\PDOException $e){
			$orderreferencesResponse->setStatusCode(400, orderreferencesConstants::dbDeleteCatchMsg);
			return $orderreferencesResponse;
		}
		return orderreferencesConstants::dbDeleteSuccessMsg;
	}
}