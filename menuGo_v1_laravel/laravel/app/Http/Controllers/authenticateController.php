<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use JWTAuth;

include_once "customersController.php";

class authenticateController extends Controller
{
	/*
	 * User-defined error
	 * */
	const ERR_INVALID_LOGIN_CREDENTIALS = '[Error]: Invalid Login Credentials';
	const STATUS_CODE_INVALID_LOGIN_CREDENTIALS = 401;

	/*
	 * JWT Exceptions
	 * */
	const ERR_INVALID_CLAIM_EXCEPTION = '[Error] Invalid Claim Exception';
	const ERR_PAYLOAD_EXCEPTION = '[Error] Payload Exception';
	const ERR_TOKEN_BLACKLISTED_EXCEPTION = '[Error] Token Blacklisted Exception';
	const ERR_TOKEN_EXPIRED_EXCEPTION = '[Error] Token Expired Exception';
	const ERR_TOKEN_INVALID_EXCEPTION = '[Error] Token Invalid Exception';

	/*
	 * On Success
	 * */
	const SUCCESS_MESSAGE = 'User Successfully Logged In';
	const STATUS_CODE_SUCCESS = 200;

	public function authenticate(Request $request){
		$loginCredentials = $request->only(
				customersConstants::dbCustomerUsername,
				customersConstants::dbCustomerPassword
				);
		try{
			$jwtAuthToken = JWTAuth::attempt($loginCredentials);
		} catch(InvalidClaimException $err){
			$authResponse = new Response();
			$authResponse->setStatusCode(
					$err->getStatusCode(),
					$this::ERR_INVALID_CLAIM_EXCEPTION
					);
			return $authResponse;
		} catch(PayloadException $err){
			$authResponse = new Response();
			$authResponse->setStatusCode(
					$err->getStatusCode(),
					$this::ERR_PAYLOAD_EXCEPTION
					);
			return $authResponse;
		} catch(TokenBlacklistedException $err){
			$authResponse = new Response();
			$authResponse->setStatusCode(
					$err->getStatusCode(),
					$this::ERR_TOKEN_BLACKLISTED_EXCEPTION
					);
			return $authResponse;
		} catch(TokenExpiredException $err){
			$authResponse = new Response();
			$authResponse->setStatusCode(
					$err->getStatusCode(),
					$this::ERR_TOKEN_EXPIRED_EXCEPTION
					);
			return $authResponse;
		} catch(TokenInvalidException $err){
			$authResponse = new Response();
			$authResponse->setStatusCode(
					$err->getStatusCode(),
					$this::ERR_TOKEN_INVALID_EXCEPTION
					);
			return $authResponse;
		}

		if(!$jwtAuthToken){
			$authResponse = new Response();
			$authResponse->setStatusCode(
					$this::STATUS_CODE_INVALID_LOGIN_CREDENTIALS,
					$this::ERR_INVALID_LOGIN_CREDENTIALS
					);
			return $authResponse;
		}

		/*
		 * retrieve user details
		 * */
		$mySqlWhere = array();
		array_push($mySqlWhere, [
				customersConstants::dbCustomerUsername,
				'=',
				$loginCredentials[customersConstants::dbCustomerUsername]
		]);

		$user = (array)DB::table(customersConstants::customersTable)->where($mySqlWhere)->first();

		$userDetails = array();
		$userDetails[customersConstants::dbCustomerUsername] = $user[customersConstants::dbCustomerUsername];
		$userDetails[customersConstants::dbCustomerNameFname] = $user[customersConstants::dbCustomerNameFname];
		$userDetails[customersConstants::dbCustomerNameMname] = $user[customersConstants::dbCustomerNameMname];
		$userDetails[customersConstants::dbCustomerNameLname] = $user[customersConstants::dbCustomerNameLname];
		$userDetails[customersConstants::dbCustomerRole] = $user[customersConstants::dbCustomerRole];

		return response()
		->json([
				'Token' => $jwtAuthToken,
				'Message' => $this::SUCCESS_MESSAGE,
				'Status' => $this::STATUS_CODE_SUCCESS,
				'User' => $userDetails
		]);
	}

}
