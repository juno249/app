<?php

namespace App\Http\Controllers;

use DB;
use Uuid;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

include_once "orderreferencesController.php";
include_once "ordersController.php";

class orderreferencesOrdersConstants{
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	
	const dbAddSuccessMsg = 'DB UPDATED W/NEW ORDERREFERENCE ORDER RECORDS';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING ORDERREFERENCE ORDER RECORDS';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING ORDERREFERENCE ORDER RECORDS';
	
	const inconsistencyValidationErr1  = 'KEYS CUSTOMER_USERNAME DO NOT MATCH';
	
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class orderreferencesOrdersController extends Controller
{
	public function __construct(){
		//$this->middleware('jwt.auth', ['except' => ['addCustomerCompanyBranch']]);
	}
	
	//URL-->>/orderreferences-orders/
	public function addOrderreferenceOrder(Request $jsonRequest){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
		
		$orderreferencesController = new orderreferencesController();
		$ordersController = new ordersController();
		
		$orderreferencesOrdersResponse = new Response();
		$orderreferencesOrdersResponse->setStatusCode(400, null);
		/*
		 * assign orderreference_code
		 * */
		for($i=0; $i<$jsonDataSize; $i++){
			$orderreferenceCode = Uuid::generate(1)->string;
			$orderreferenceOrderRunner = $jsonData[$i];
			if(array_key_exists('orderreference', $orderreferenceOrderRunner)){
				$orderreference = $orderreferenceOrderRunner['orderreference'];
				$orderreference['orderreference_code'] = $orderreferenceCode;
				
				$orderreferenceOrderRunner['orderreference'] = $orderreference;
			}
			if(array_key_exists('order', $orderreferenceOrderRunner)){
				$order = $orderreferenceOrderRunner['order'];
				$orderSize = sizeof($order);
				for($j=0; $j<$orderSize; $j++){
					$orderRunner = $order[$j];
					$orderRunner['orderreference_code'] = $orderreferenceCode;
					
					$order[$j] = $orderRunner;
				}
				
				$orderreferenceOrderRunner['order'] = $order;
			}
			
			$jsonData[$i] = $orderreferenceOrderRunner;
		}
		
		for($i=0; $i<$jsonDataSize; $i++){
			$orderreferenceOrderRunner = $jsonData[$i];
			
			DB::beginTransaction();
			try{
				/*
				 * db_transaction: add_orderreference
				 * */
				if(array_key_exists('orderreference', $orderreferenceOrderRunner)){
					$orderreference = $orderreferenceOrderRunner['orderreference'];
					if($orderreferencesController->isDataValid([$orderreference], $errorMsg, "ADD")){
						try{	DB::table(orderreferencesConstants::orderreferencesTable)->insert($orderreference);
						} catch(\PDOException $e){	throw $e;
						}
					} else {
						$orderreferencesOrdersResponse->setStatusCode(400, $errorMsg);
						return $orderreferencesOrdersResponse;
					}
				}
			
				/*
				 * db_transaction: add_order
				 * */
				if(array_key_exists('order', $orderreferenceOrderRunner)){
					$order = $orderreferenceOrderRunner['order'];
					$orderSize = sizeof($order);
					for($j=0; $j<$orderSize; $j++){
						$orderRunner = $order[$j];
						if($ordersController->isDataValid([$orderRunner], $errorMsg, "ADD")){
							if(!($orderRunner['customer_username'] == $orderreference['customer_username'])){
								$orderreferencesOrdersResponse->setStatusCode(400, orderreferencesConstants::inconsistencyValidationErr1);
								return $orderreferencesOrdersResponse;
							}
							
							try{	DB::table(ordersConstants::ordersTable)->insert($orderRunner);
							} catch(\PDOException $e){	throw $e;
							}
						} else {
							$orderreferencesOrdersResponse->setStatusCode(400, $errorMsg);
							return $orderreferencesOrdersResponse;
						}
					}
				}
				
				DB::commit();
			} catch(\PDOException $e){
				DB::rollback();
				$orderreferencesOrdersResponse->setStatusCode(400, orderreferencesOrdersConstants::dbAddCatchMsg);
				return $orderreferencesOrdersResponse;
			}
		}
		return orderreferencesOrdersConstants::dbAddSuccessMsg;
	}
}