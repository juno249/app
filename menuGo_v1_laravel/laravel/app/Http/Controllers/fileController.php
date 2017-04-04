<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class fileConstants{
	const fileGetSuccessMsg = 'FILE RETRIEVED SUCCESSFULLY';
	const fileUploadSuccessMsg = 'FILE UPLOADED SUCCESSFULLY';
	const fileDeleteSuccessMsg = 'FILE DELETED SUCCESSFULLY';
	
	const fileGetCatchMsg = 'EXCEPTION ENCOUNTERED, UNABLE TO RETRIEVE FILE';
	const fileUploadCatchMsg = 'EXCEPTION ENCOUNTERED, UNABLE TO UPLOAD FILE';
	const fileDeleteCatchMsg = 'EXCEPTION ENCOUNTERED, UNABLE TO DELETE FILE';
}

class fileController extends Controller
{	
	//URL-->>/companies/{CompanyName}/companyImage
	public function getCompanyImage($CompanyName){
		$imgDirectory = '/companies/' . $CompanyName . '/';
		$imgFileName = $imgDirectory . $CompanyName . '.jpg';
		$companyImageResponse = new Response();
		
		try{
			$companyImage = Storage::disk('public')->get($imgFileName);
			$companyImageResponse->setContent($companyImage);
			$companyImageResponse->setStatusCode(200, fileConstants::fileGetSuccessMsg);
		} catch (\Exception $e){
			$companyImageResponse->setStatusCode(400, fileConstants::fileGetCatchMsg);
		}
		
		return $companyImageResponse;
	}
	
	//URL-->>/companies/{CompanyName}/companyImage
	public function uploadCompanyImage(Request $formRequest, $CompanyName){
			$imgDirectory = '/companies/' . $CompanyName . '/';
			$imgFile = $formRequest->file('imgFile');
			$imgFileName = $imgDirectory . $CompanyName . '.jpg';
			$companyImageResponse = new Response();
			try{
				Storage::disk('public')->put($imgFileName, File::get($imgFile));
				$companyImageResponse->setStatusCode(200, fileConstants::fileUploadSuccessMsg);
			} catch(\Exception $e){
				$companyImageResponse->setStatusCode(400, fileConstants::fileUploadCatchMsg);
			}

			return $companyImageResponse;
	}
	
	//URL-->>/companies/{CompanyName}/companyImage
	public function deleteCompanyImage($CompanyName){
		$imgDirectory = '/companies/' . $CompanyName . '/';
		$imgFileName = $imgDirectory . $CompanyName .  '.jpg';
		$companyImageResponse = new Response();
		
		try{
			Storage::disk('public')->delete($imgFileName);
			$companyImageResponse->setStatusCode(200, fileConstants::fileDeleteSuccessMsg);
		} catch (\Exception $e){
			$companyImageResponse->setStatusCode(400, fileConstants::fileDeleteCatchMsg);
		}
		
		return $companyImageResponse;
	}
	
	//URL-->>/companies/{CompanyName}/menus/{MenuName}/menuImage
	public function getCompanyMenuImage($CompanyName, $MenuName){
		$imgDirectory = '/companies/' . $CompanyName . '/menus/';
		$imgFileName = $imgDirectory . $CompanyName . '_' . $MenuName . '.jpg';
		$companyMenuImageResponse = new Response();
		
		try{
			$companyMenuImage  = Storage::disk('public')->get($imgFileName);
			$companyMenuImageResponse->setContent($companyMenuImage);
			$companyMenuImageResponse->setStatusCode(200, fileConstants::fileGetSuccessMsg);
		} catch(\Exception $e){
			$companyMenuImageResponse->setStatusCode(400, fileConstants::fileGetCatchMsg);
		}
		
		return $companyMenuImageResponse;
	}
	
	//URL-->>/companies/{CompanyName}/menus/{MenuName}/menuImage
	public function uploadCompanyMenuImage(Request $formRequest, $CompanyName, $MenuName){
		$imgDirectory = '/companies/' . $CompanyName . '/menus/';
		$imgFile = $formRequest->file('imgFile');
		$imgFileName = $imgDirectory . $CompanyName . '_' . $MenuName .'.jpg';
		$companyMenuImageResponse = new Response();
		
		try{
			Storage::disk('public')->put($imgFileName, File::get($imgFile));
			$companyMenuImageResponse->setStatusCode(200, fileConstants::fileUploadSuccessMsg);
		} catch(\Exception $e){
			$companyMenuImageResponse->setStatusCode(400, fileConstants::fileUploadCatchMsg);
		}
		
		return $companyMenuImageResponse;
	}
	
	//URL-->>/companies/{CompanyName}/menus/{MenuName}/menuImage
	public function deleteCompanyMenuImage(Request $formRequest, $CompanyName, $MenuName){
		$imgDirectory = '/companies/' . $CompanyName . '/menus/';
		$imgFileName = $imgDirectory . $CompanyName . '_' . $MenuName . '.jpg';
		$companyMenuImageResponse = new Response();
		
		try{
			Storage::disk('public')->delete($imgFileName);
			$companyMenuImageResponse->setStatusCode(200, fileConstants::fileDeleteSuccessMsg);
		} catch(\Exception $e){
			$companyMenuImageResponse->setStatusCode(400, fileConstants::fileDeleteCatchMsg);
		}
		
		return $companyMenuImageResponse;
	}
	
	//URL-->>/companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemName}/menuitemImage
	public function getCompanyMenuMenuitemImage($CompanyName, $MenuName, $MenuitemName){
		$imgDirectory = '/companies/' . $CompanyName . '/menus/' . $MenuName . '/menuitems/';
		$imgFileName = $imgDirectory . $CompanyName . '_' . $MenuName . '_' . $MenuitemName . '.jpg';
		$companyMenuMenuitemImageResponse = new Response();
		
		try{
			$companyMenuMenuitemImage = Storage::disk('public')->get($imgFileName);
			$companyMenuMenuitemImageResponse->setContent($companyMenuMenuitemImage);
			$companyMenuMenuitemImageResponse->setStatusCode(200, fileConstants::fileGetSuccessMsg);
		} catch(\Exception $e){
			$companyMenuMenuitemImageResponse->setStatusCode(400, fileConstants::fileGetCatchMsg);
		}
		
		return $companyMenuMenuitemImageResponse;
	}
	
	//URL-->>/companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemName}/menuitemImage
	public function uploadCompanyMenuMenuitemImage(Request $formRequest, $CompanyName, $MenuName, $MenuitemName){
		$imgDirectory = '/companies/' . $CompanyName . '/menus/' . $MenuName . '/menuitems/';
		$imgFile = $formRequest->file('imgFile');
		$imgFileName = $imgDirectory . $CompanyName . '_' . $MenuName . '_' . $MenuitemName . '.jpg';
		$companyMenuMenuitemImageResponse = new Response();
		try{
			Storage::disk('public')->put($imgFileName, File::get($imgFile));
			$companyMenuMenuitemImageResponse->setStatusCode(200, fileConstants::fileGetSuccessMsg);
		} catch(\Exception $e){
			$companyMenuMenuitemImageResponse->setStatusCode(400, fileConstants::fileGetCatchMsg);
		}
		
		return $companyMenuMenuitemImageResponse;
	}
	
	//URL-->>/companies/{CompanyName}/menus/{MenuName}/menuitems/{MenuitemName}/menuitemImage
	public function deleteCompanyMenuMenuitemImage($CompanyName, $MenuName, $MenuitemName){
		$imgDirectory = '/companies/' . $CompanyName . '/menus/' . $MenuName . '/menuitems/';
		$imgFileName = $imgDirectory . $CompanyName . '_' . $MenuName . '_' .$MenuitemName . '.jpg';
		$companyMenuMenuitemImageResponse = new Response();
		
		try{
			Storage::disk('public')->delete($imgFileName);
			$companyMenuMenuitemImageResponse->setStatusCode(200, fileConstants::fileDeleteSuccessMsg);
		} catch(\Exception $e){
			$companyMenuMenuitemImageResponse->setStatusCode(200, fileConstants::fileDeleteCatchMsg);
		}
		
		return $companyMenuMenuitemImageResponse;
	}
}