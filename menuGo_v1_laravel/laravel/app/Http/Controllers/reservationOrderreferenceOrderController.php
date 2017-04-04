<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Uuid;

include_once "orderreferencesController.php";
include_once "ordersController.php";
include_once "reservationsController.php";

class reservationsOrderreferencesOrdersConstants{
	const keyOrderreference = 'orderreference';
	const keyOrder = 'order';
	const keyReservation = 'reservation';
	
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	
	const dbAddSuccessMsg = 'DB UPDATED W/NEW RESERVATION ORDERREFERENCE ORDER RECORDS';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING ORDERREFERENCE RESERVATION ORDERREFERENCE ORDER RECORDS';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING ORDERREFERENCE RESERVATION ORDERREFERENCE ORDER RECORDS';
	
	const inconsistencyValidationErr1  = 'KEYS CUSTOMER_USERNAME DO NOT MATCH';
	
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class reservationsOrderreferencesOrdersController extends Controller
{
	public function __construct(){	//$this->middleware('jwt.auth', ['except' => ['addCustomerCompanyBranch']]);
	}
	
	//URL-->>/reservations-orderreferences-orders/
	public function addReservationOrderreferenceOrder(Request $jsonRequest){
		$jsonData = json_decode(
				$jsonRequest->getContent(), 
				true
				);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
		
		$reservationsController = new reservationsController();
		$orderreferencesController = new orderreferencesController();
		$ordersController = new ordersController();
		
		$reservationsOrderreferencesOrdersResponse = new Response();
		$reservationsOrderreferencesOrdersResponse->setStatusCode(
				400, 
				null
				);
		
		//assign orderreference_code
		 
		for($i=0; $i<$jsonDataSize; $i++){
			$orderreferenceCode = Uuid::generate(1)
			->string;
			$reservationOrderreferenceOrderRunner = $jsonData[$i];
			if(array_key_exists(
					'orderreference', 
					$reservationOrderreferenceOrderRunner
					)
					){
				$orderreference = $reservationOrderreferenceOrderRunner[reservationsOrderreferencesOrdersConstants::keyOrderreference];
				$orderreference[orderreferencesConstants::dbOrderreferenceCode] = $orderreferenceCode;
				
				$reservationOrderreferenceOrderRunner[reservationsOrderreferencesOrdersConstants::keyOrderreference] = $orderreference;
			}
			if(array_key_exists(
					'order', 
					$reservationOrderreferenceOrderRunner
					)
					){
				$order = $reservationOrderreferenceOrderRunner[reservationsOrderreferencesOrdersConstants::keyOrder];
				$orderSize = sizeof($order);
				for($j=0; $j<$orderSize; $j++){
					$orderRunner = $order[$j];
					$orderRunner[ordersConstants::dbOrderreferenceCode] = $orderreferenceCode;
					
					$order[$j] = $orderRunner;
				}
				
				$reservationOrderreferenceOrderRunner[reservationsOrderreferencesOrdersConstants::keyOrder] = $order;
			}
			
			$jsonData[$i] = $reservationOrderreferenceOrderRunner;
		}
		
		//assign reservation_code
		for($i=0; $i<$jsonDataSize; $i++){
			$reservationCode = Uuid::generate(1)
			->string;
			$reservationOrderreferenceOrderRunner = $jsonData[$i];
			if(array_key_exists(
					'reservation', 
					$reservationOrderreferenceOrderRunner
					)
					){
				$reservation = $reservationOrderreferenceOrderRunner[reservationsOrderreferencesOrdersConstants::keyReservation];
				$reservation[reservationsConstants::dbReservationCode] = $reservationCode;
				$reservation[reservationsConstants::dbOrderreferenceCode] = $orderreferenceCode;
		
				$reservationOrderreferenceOrderRunner[reservationsOrderreferencesOrdersConstants::keyReservation] = $reservation;
			}
				
			$jsonData[$i] = $reservationOrderreferenceOrderRunner;
		}

		for($i=0; $i<$jsonDataSize; $i++){
			$reservationOrderreferenceOrderRunner = $jsonData[$i];
			
			DB::beginTransaction();
			try{
				//db_transaction: add_orderreference
				if(array_key_exists(
						'orderreference', 
						$reservationOrderreferenceOrderRunner
						)
						){
					$orderreference = $reservationOrderreferenceOrderRunner[reservationsOrderreferencesOrdersConstants::keyOrderreference];
					if($orderreferencesController->isDataValid(
							[$orderreference], 
							$errorMsg, 
							"ADD"
							)
							){
						try{	DB::table(orderreferencesConstants::orderreferencesTable)
						->insert($orderreference);
						} catch(\PDOException $e){	throw $e;
						}
					} else {
						$reservationsOrderreferencesOrdersResponse->setStatusCode(
								400, 
								$errorMsg
								);
						
						return $reservationsOrderreferencesOrdersResponse;
					}
				}
				
				//db_transaction: add_order
				if(array_key_exists(
						'order', 
						$reservationOrderreferenceOrderRunner
						)
						){
					$order = $reservationOrderreferenceOrderRunner[reservationsOrderreferencesOrdersConstants::keyOrder];
					$orderSize = sizeof($order);
					for($j=0; $j<$orderSize; $j++){
						$orderRunner = $order[$j];
						if($ordersController->isDataValid(
								[$orderRunner], 
								$errorMsg, 
								"ADD"
								)
								){
							if(!($orderRunner[ordersConstants::dbCustomerUsername] == $orderreference[orderreferencesConstants::dbCustomerUsername])){
								$reservationsOrderreferencesOrdersResponse->setStatusCode(
										400, 
										reservationsOrderreferencesOrdersConstants::inconsistencyValidationErr1
										);
								
								return $reservationsOrderreferencesOrdersResponse;
							}
								
							try{	DB::table(ordersConstants::ordersTable)
							->insert($orderRunner);
							} catch(\PDOException $e){	throw $e;
							}
						} else {
							$reservationsOrderreferencesOrdersResponse->setStatusCode(
									400, 
									$errorMsg
									);
							
							return $reservationsOrderreferencesOrdersResponse;
						}
					}
				}
				
				//db_transaction: add_reservation
				if(array_key_exists(
						'reservation', 
						$reservationOrderreferenceOrderRunner
						)
						){
					$reservation = $reservationOrderreferenceOrderRunner[reservationsOrderreferencesOrdersConstants::keyReservation];
					if($reservationsController->isDataValid(
							[$reservation], 
							$errorMsg, 
							"ADD"
							)
							){
						if(!($reservation[reservationsConstants::dbCustomerUsername] == $orderreference[orderreferencesConstants::dbCustomerUsername])){
							$reservationsOrderreferencesOrdersResponse->setStatusCode(
									400, 
									reservationsOrderreferencesOrdersConstants::inconsistencyValidationErr1
									);
							
							return $reservationsOrderreferencesOrdersResponse;
						}
						
						try{	DB::table(reservationsConstants::reservationsTable)
						->insert($reservation);
						} catch(\PDOException $e){	throw $e;
						}
					} else {
						$reservationsOrderreferencesOrdersResponse->setStatusCode(
								400, 
								$errorMsg
								);
						
						return $reservationsOrderreferencesOrdersResponse;
					}
				}
				
				DB::commit();
			} catch(\PDOException $e){
				DB::rollback();
				$reservationsOrderreferencesOrdersResponse->setStatusCode(
						400, 
						reservationsOrderreferencesOrdersConstants::dbAddCatchMsg
						);
				
				return $reservationsOrderreferencesOrdersResponse;
			}
		}
		
		return reservationsOrderreferencesOrdersConstants::dbAddSuccessMsg;
	}
}