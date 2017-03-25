<?php

namespace App\Http\Controllers;

use DB;
use Uuid;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

include_once "customersController.php";

class reservationsConstants{
	const reservationsTable = 'reservations';
	
	const dbReservationCode = 'reservation_code';
	const dbCustomerUsername = 'customer_username';
	const dbOrderreferenceCode = 'orderreference_code';
	const dbReservationEta = 'reservation_eta';
	const dbReservationPaymentmode = 'reservation_paymentmode';
	const dbReservationServicetime = 'reservation_servicetime';
	const dbReservationStatus = 'reservation_status';
	
	const reqReservationCode = 'ReservationCode';
	const reqCustomerUsername = 'CustomerUsername';
	const reqOrderreferenceCode = 'OrderreferenceCode';
	const reqReservationEta = 'ReservationEta';
	const reqReservationPaymentmode = 'ReservationPaymentmode';
	const reqReservationServicetime = 'ReservationServicetime';
	const reqReservationStatus = 'ReservationStatus';
	
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	
	const dbAddSuccessMsg = 'DB UPDATED W/NEW RESERVATION RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING RESERVATION RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING RESERVATION RECORD';
	
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class reservationsController extends Controller
{
	public function __construct(){
		//$this->middleware('jwt.auth');
	}
	
	public function getJoinCustomerReservation($mySqlWhere){
		$customerReservation = DB::table(reservationsConstants::reservationsTable)
		->join(
				customersConstants::customersTable, 
				reservationsConstants::reservationsTable . '.' . reservationsConstants::dbCustomerUsername, 
				'=', 
				customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername
				)
				->where($mySqlWhere)
				->get();
				return $customerReservation;
	}
	
	//URL-->>/customers/{CustomerUsername}/reservations
	public function getAllCustomerReservations($CustomerUsername){
		$mySqlWhere = array();
		array_push($mySqlWhere, [customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, '=', $CustomerUsername]);
		
		$reservationsResponse = new Response();
		try{
			$customerReservations = $this->getJoinCustomerReservation($mySqlWhere);
			if($customerReservations->isEmpty()){
				$reservationsResponse->setStatusCode(200, reservationsConstants::emptyResultSetErr);
			} else {
				$reservationsResponse->setContent(json_encode($customerReservations));
			}
		} catch(\PDOException $e){
			$reservationsResponse->setStatusCode(400, reservationsConstants::dbReadCatchMsg);
		}
		return $reservationsResponse;
	}
	
	//URL-->>/customers/{CustomerUsername}/reservations/{ReservationCode}
	public function getCustomerReservation($CustomerUsername, $ReservationCode){
		$mySqlWhere = array();
		array_push($mySqlWhere, [customersConstants::customersTable . '.' . customersConstants::dbCustomerUsername, '=', $CustomerUsername]);
		array_push($mySqlWhere, [reservationsConstants::reservationsTable . '.' . reservationsConstants::dbReservationCode, '=', $ReservationCode]);
		
		$reservationsResponse = new Response();
		try{
			$customerReservations = $this->getJoinCustomerReservation($mySqlWhere);
			if($customerReservations->isEmpty()){
				$reservationsResponse->setStatusCode(200, reservationsConstants::emptyResultSetErr);
			} else {
				$reservationsResponse->setContent(json_encode($customerReservations));
			}
		} catch(\PDOException $e){
			$reservationsResponse->setStatusCode(400, reservationsConstants::dbReadCatchMsg);
		}
		return $reservationsResponse;
	}
	
	//URL-->>/reservations/query
	public function getByQuery(){
		$mySqlWhere = array();
		
		if(isset($_GET[reservationsConstants::reqReservationCode])){
			array_push($mySqlWhere, [reservationsConstants::dbReservationCode, '=', $_GET[reservationsConstants::reqReservationCode]]);
		}
		if(isset($_GET[reservationsConstants::reqCustomerUsername])){
			array_push($mySqlWhere, [reservationsConstants::dbCustomerUsername, 'LIKE', '%' . $_GET[reservationsConstants::reqCustomerUsername] . '%']);
		}
		if(isset($_GET[reservationsConstants::reqOrderreferenceCode])){
			array_push($mySqlWhere, [reservationsConstants::dbOrderreferenceCode, '=' , $_GET[reservationsConstants::reqOrderreferenceCode]]);
		}
		if(isset($_GET[reservationsConstants::reqReservationEta])){
			array_push($mySqlWhere, [reservationsConstants::dbReservationEta, 'LIKE', '%' . $_GET[reservationsConstants::reqReservationEta] . '%']);
		}
		if(isset($_GET[reservationsConstants::reqReservationPaymentmode])){
			array_push($mySqlWhere, [reservationsConstants::dbReservationPaymentmode, 'LIKE', '%' . $_GET[reservationsConstants::reqReservationPaymentmode] . '%']);
		}
		if(isset($_GET[reservationsConstants::reqReservationServicetime])){
			array_push($mySqlWhere, [reservationsConstants::dbReservationServicetime, 'LIKE', '%' . $_GET[reservationsConstants::reqReservationServicetime] . '%']);
		}
		if(isset($_GET[reservationsConstants::reqReservationStatus])){
			array_push($mySqlWhere, [reservationsConstants::dbReservationStatus, 'LIKE', '%' . $_GET[reservationsConstants::reqReservationStatus] . '%']);
		}
		
		$reservationsResponse = new Response();
		try{
			$customerReservations = DB::table(reservationsConstants::reservationsTable)->where($mySqlWhere)->get();
			if($customerReservations->isEmpty()){
				$reservationsResponse->setStatusCode(200, reservationsConstants::emptyResultSetErr);
			} else {
				$reservationsResponse->setContent(json_encode($customerReservations));
			}
		} catch(\PDOException $e){
			$reservationsResponse->setStatusCode(400, reservationsConstants::dbReadCatchMsg);
		}
		return $reservationsResponse;
	}
	
	public function isDataValid($jsonData, &$errorMsg, $dbOperation){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . reservationsConstants::dbReservationCode => 'unique:reservations,reservation_code|required|max:40', 
							'*.' . reservationsConstants::dbCustomerUsername => 'exists:customers,customer_username|required|string|max:30', 
							'*.' . reservationsConstants::dbOrderreferenceCode => 'exists:orderreferences,orderreference_code|required|string|max:40', 
							'*.' . reservationsConstants::dbReservationEta => 'required|date_format:Y-m-d H:i:s', 
							'*.' . reservationsConstants::dbReservationPaymentmode => 'required|string|max:30', 
							'*.' . reservationsConstants::dbReservationServicetime => 'required|date_format:Y-m-d H:i:s', 
							'*.' . reservationsConstants::dbReservationStatus => 'required|string|max:30'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . reservationsConstants::dbReservationCode => 'unique:reservations,reservation_code|sometimes|max:40',
							'*.' . reservationsConstants::dbCustomerUsername => 'exists:customers,customer_username|sometimes|string|max:30',
							'*.' . reservationsConstants::dbOrderreferenceCode => 'exists:orderreferences,orderreference_code|sometimes|string|max:40',
							'*.' . reservationsConstants::dbReservationEta => 'sometimes|date_format:Y-m-d H:i:s',
							'*.' . reservationsConstants::dbReservationPaymentmode => 'sometimes|string|max:30',
							'*.' . reservationsConstants::dbReservationServicetime => 'sometimes|date_format:Y-m-d H:i:s',
							'*.' . reservationsConstants::dbReservationStatus => 'sometimes|string|max:30'
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
	
	//URL-->>/customer/{CustomerUsername}/reservations
	public function addReservation(Request $jsonRequest, $CustomerUsername){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
		
		$reservationsResponse = new Response();
		$reservationsResponse->setStatusCode(400, null);
		for($i=0; $i<$jsonDataSize; $i++){
			$jsonData[$i]['reservation_code'] = Uuid::generate()->string;
			$jsonData[$i]['reservation_eta'] = Carbon::parse($jsonData[$i]['reservation_eta'])->format('Y-m-d H:i:s');
			$jsonData[$i]['reservation_servicetime'] = Carbon::parse($jsonData[$i]['reservation_servicetime'])->format('Y-m-d H:i:s');
		}
		
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			for($i=0; $i<$jsonDataSize; $i++){
				try{	DB::table(reservationsConstants::reservationsTable)->insert($jsonData[$i]);
				} catch(\PDOException $e){
					$reservationsResponse->setStatusCode(400, $e->getMessage());
					return $reservationsResponse;
				}
			}
		} else {
			$reservationsResponse->setStatusCode(400, $errorMsg);
			return $reservationsResponse;
		}
		return reservationsConstants::dbAddSuccessMsg;
	}
	
	//URL-->>/customer/{CustomerUsername}/reservations/{ReservationCode}
	public function updateReservation(Request $jsonRequest, $CustomerUsername, $ReservationCode){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
		
		$reservationsResponse = new Response();
		$reservationsResponse->setStatusCode(400, null);
		if(!$this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			$reservationsResponse->setStatusCode(400, $errorMsg);
			return $reservationsResponse;
		}
		
		try{
			array_push($mySqlWhere, [reservationsConstants::dbCustomerUsername, '=', $CustomerUsername]);
			array_push($mySqlWhere, [reservationsConstants::dbReservationCode, '=', $ReservationCode]);
			DB::table(reservationsConstants::reservationsTable)->where($mySqlWhere)->update($jsonData[0]);
		} catch(\PDOException $e){
			$reservationsResponse->setStatusCode(400, reservationsConstants::dbUpdateCatchMsg);
			return $reservationsResponse;
		}
		return reservationsConstants::dbUpdateSuccessMsg;
	}
	
	//URL-->>/customer/{CustomerUsername}/reservations/{ReservationCode}
	public function deleteReservation(Request $jsonRequest, $CustomerUsername, $ReservationCode){
		$mySqlWhere = array();
		$errorMsg = '';
		
		$reservationsResponse = new Response();
		$reservationsResponse->setStatusCode(400, null);
		try{
			array_push($mySqlWhere, [reservationsConstants::dbCustomerUsername, '=', $CustomerUsername]);
			array_push($mySqlWhere, [reservationsConstants::dbReservationCode, '=', $ReservationCode]);
			DB::table(reservationsConstants::reservationsTable)->where($mySqlWhere)->delete();	
		} catch(\PDOException $e){
			$reservationsResponse->setStatusCode(400, reservationsConstants::dbDeleteCatchMsg);
			return $reservationsResponse;
		}
		return reservationsConstants::dbDeleteSuccessMsg;
	}
}