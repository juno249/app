<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class blogsConstants{
	const blogsTable = 'blogs';
	
	const dbBlogId = 'blog_id';
	const dbBlogTitle = 'blog_title';
	const dbBlogAuthor = 'blog_branches';
	const dbBlogContent = 'blog_content';
	const dbBlogImage = 'blog_image';
	const dbBlogUrl = 'blog_url';
	
	const reqBlogId = 'BlogId';
	const reqBlogTitle = 'BlogTitle';
	const reqBlogAuthor = 'BlogBranches';
	const reqBlogContent = 'BlogContent';
	const reqBlogImage = 'BlogImage';
	const reqBlogUrl = 'BlogUrl';
	
	const dbReadCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO READ RECORD';
	const dbAddCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO ADD RECORD';
	const dbUpdateCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO UPDATE RECORD';
	const dbDeleteCatchMsg = 'DB EXCEPTION ENCOUNTERED, UNABLE TO DELETE RECORD';
	
	const dbAddSuccessMsg = 'DB UPDATED W/NEW BLOG RECORD';
	const dbUpdateSuccessMsg = 'DB UPDATED EXISTING BLOG RECORD';
	const dbDeleteSuccessMsg = 'DB DELETED EXISTING BLOG RECORD';
	
	const emptyResultSetErr = 'DB SELECT RETURNED EMPTY RESULT SET';
}

class blogsController extends Controller
{
	public function __construct(){
		//$this->middleware('jwt.auth');
	}
	
	//URL-->>/blogs
	public function getAllBlogs(){
		$blogsResponse = new Response();
		try{
			$blogs = DB::table(blogsConstants::blogsTable)->get();
			if($blogs->isEmpty()){
				$blogs->setStatusCode(200, blogsConstants::emptyResultSetErr);
			} else {
				$blogsResponse->setContent(json_encode($blogs));
			}
		} catch(\PDOException $e){
			$blogsResponse->setStatusCode(400, blogsConstants::dbReadCatchMsg);
		}
		return $blogsResponse;
	}
	
	//URL-->>/blogs/{BlogId}
	public function getBlog($BlogId){
		$mySqlWhere = array();
		array_push($mySqlWhere, [blogsConstants::blogsTable . '.' . blogsConstants::dbBlogId, '=', $BlogId]);
		
		$blogsResponse = new Response();
		try{
			$blog = DB::table(blogsConstants::blogsTable)->where($mySqlWhere)->get();
			if($blog->isEmpty()){
				$blogsResponse->setStatusCode(200, blogsConstants::emptyResultSetErr);
			} else {
				$blogsResponse->setContent(json_encode($blog));
			}
		} catch(\PDOException $e){
			$blogsResponse->setStatusCode(400, blogsConstants::dbReadCatchMsg);
		}
		return $blogsResponse;
	}
	
	//URL-->>/blogs/query
	public function getByQuery(){
		$mySqlWhere = array();
		
		if(isset($_GET[blogsConstants::reqBlogId])){
			array_push($mySqlWhere, [blogsConstants::dbBlogId, '=', $_GET[blogsConstants::reqBlogId]]);
		}
		if(isset($_GET[blogsConstants::reqBlogTitle])){
			array_push($mySqlWhere, [blogsConstants::dbBlogTitle, 'LIKE', '%' . $_GET[blogsConstants::reqBlogTitle] . '%']);
		}
		if(isset($_GET[blogsConstants::reqBlogAuthor])){
			array_push($mySqlWhere, [blogsConstants::dbBlogAuthor, 'LIKE', '%' . $_GET[blogsConstants::reqBlogAuthor] . '%']);
		}
		if(isset($_GET[blogsConstants::reqBlogContent])){
			array_push($mySqlWhere, [blogsConstans::dbBlogContent, 'LIKE', '%' . $_GET[blogsConstans::reqBlogContents] . '%']);
		}
		if(isset($_GET[blogsConstants::reqBlogImage])){
			array_push($mySqlWhere, [blogsConstants::dbBlogImage, 'LIKE', '%' . $_GET[blogsConstants::reqBlogImage] . '%']);
		}
		if(isset($_GET[blogsConstants::reqBlogUrl])){
			array_push($mySqlWhere, [blogsConstants::dbBlogUrl, 'LIKE', '%' . $_GET[blogsConstants::reqBlogUrl] . '%']);
		}
		
		$blogsResponse = new Response();
		try{
			$blogs = DB::table(blogsConstants::blogsTable)->where($mySqlWhere)->get();
			if($blogs->isEmpty()){
				$blogsResponse->setStatusCode(200, blogsConstants::emptyResultSetErr);
			} else {
				$blogsResponse->setContent(json_encode($blogs));
			}
		} catch(\PDOException $e){
			$blogsResponse->setStatusCode(400, blogsConstants::dbReadCatchMsg);
		}
		return $blogsResponse;
	}
	
	public function isDataValid($jsonData, &$errorMsg, $dbOperation){
		if("ADD" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . blogsConstants::dbBlogTitle => 'required|string|max:100', 
							'*.' . blogsConstants::dbBlogAuthor => 'sometimes|string|max:50', 
							'*.' . blogsConstants::dbBlogContent => 'required|string|max:1000', 
							'*.' . blogsConstants::dbBlogImage => 'required|string|max:500', 
							'*.' . blogsConstants::dbBlogUrl => 'required|string|max:500'
					]
					);
		} else if("UPDATE" == $dbOperation){
			$jsonValidation = Validator::make(
					$jsonData, 
					[
							'*.' . blogsConstants::dbBlogTitle => 'sometimes|string|max:100', 
							'*.' . blogsConstants::dbBlogAuthor => 'sometimes|string|max:50', 
							'*.' . blogsConstants::dbBlogContent => 'sometimes|string|max:1000', 
							'*.' . blogsConstants::dbBlogImage => 'sometimes|string|max:500', 
							'*.' . blogsConstants::dbBlogUrl => 'sometimes|string|max:500'
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
	
	//URL-->>/blogs
	public function addBlog(Request $jsonRequest){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$errorMsg = '';
		
		$blogsResponse = new Response();
		$blogsResponse->setStatusCode(400, null);
		if($this->isDataValid($jsonData, $errorMsg, "ADD")){
			for($i=0; $i<$jsonDataSize; $i++){
				try{	DB::table(blogsConstants::blogsTable)->insert($jsonData[$i]);
				} catch(\PDOException $e){
					$blogsResponse->setStatusCode(400, blogsConstants::dbAddCatchMsg);
					return $blogsResponse;
				}
			}
		} else {
			$blogsResponse->setStatusCode(400, $errorMsg);
			return $blogsResponse;
		}
		return blogsConstants::dbAddSuccessMsg;
	}
	
	//URL-->>/blogs/{BlogId}
	public function updateBlog(Request $jsonRequest, $BlogId){
		$jsonData = json_decode($jsonRequest->getContent(), true);
		$jsonDataSize = sizeof($jsonData);
		$mySqlWhere = array();
		$errorMsg = '';
		
		$blogsResponse = new Response();
		$blogsResponse->setStatusCode(400, null);
		if(!$this->isDataValid($jsonData, $errorMsg, "UPDATE")){
			$blogsResponse->setStatusCode(400, $errorMsg);
			return $blogsResponse;
		}
		
		try{
			array_push($mySqlWhere, [blogsConstants::dbBlogId, '=' , $BlogId]);
			DB::table(blogsConstants::blogsTable)->where($mySqlWhere)->update($jsonData[0]);
		} catch(\PDOException $e){
			$blogsResponse->setStatusCode(400, blogsConstants::dbUpdateCatchMsg);
			return $blogsResponse;
		}
		return blogsConstants::dbUpdateSuccessMsg;
	}
	
	//URL-->>/blogs/{BlogId}
	public function deleteBlog($BlogId){
		$mySqlWhere = array();
		$errorMsg = '';
		
		$blogsResponse = new Response();
		$blogsResponse->setStatusCode(400, null);
		try{
			array_push($mySqlWhere, [blogsConstants::dbBlogId, '=', $BlogId]);
			DB::table(blogsConstants::blogsTable)->where($mySqlWhere)->delete();
		} catch(\PDOException $e){
			$blogsResponse->setStatusCode(400, blogsConstants::dbDeleteCatchMsg);
			return $blogsResponse;
		}
		return blogsConstants::dbDeleteSuccessMsg;
	}
}