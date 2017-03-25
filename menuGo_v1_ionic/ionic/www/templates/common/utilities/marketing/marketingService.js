angular
.module('starter')
.factory('marketingService', marketingService);

marketingService.$inject = [
	'ADVERTISEMENTS_DB_FIELDS', 
	'API_BASE_URL', 
	'BLOGS_DB_FIELDS', 
	'$http', 
	'$localStorage', 
	'$q'
	];

function marketingService(
		ADVERTISEMENTS_DB_FIELDS, 
		API_BASE_URL, 
		BLOGS_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
		){
	var marketingServiceObj = {
			advertisements: {}, 
			advertisement: {}, 
			blogs: {}, 
			blog: {}, 
			advertisementId: undefined, 
			blogId: undefined, 
			companyName: undefined, 
			getAdvertisements: getAdvertisements, 
			getAdvertisement: getAdvertisement, 
			getBlogs: getBlogs, 
			getBlog: getBlog, 
			getAdvertisementId: getAdvertisementId, 
			getBlogId: getBlogId, 
			getCompanyName: getCompanyName, 
			setAdvertisements: setAdvertisements, 
			setAdvertisement: setAdvertisement, 
			setBlogs: setBlogs, 
			setBlog: setBlog, 
			setAdvertisementId: setAdvertisementId, 
			setBlogId: setBlogId, 
			setCompanyName: setCompanyName, 
			fetchAdvertisements: fetchAdvertisements, 
			fetchAdvertisement: fetchAdvertisement, 
			addAdvertisement: addAdvertisement, 
			updateAdvertisement: updateAdvertisement, 
			deleteAdvertisement: deleteAdvertisement, 
			fetchBlogs: fetchBlogs, 
			fetchBlog: fetchBlog, 
			addBlog: addBlog, 
			updateBlog: updateBlog, 
			deleteBlog: deleteBlog
	}
	
	function getAdvertisements(){	return marketingServiceObj.advertisements;
	}
	function getAdvertisement(){	return marketingServiceObj.advertisement;
	}
	function getBlogs(){	return marketingServiceObj.blogs;
	}
	function getBlog(){	return marketingServiceObj.blog;
	}
	function getAdvertisementId(){	return marketingServiceObj.advertisementId;
	}
	function getBlogId(){	return marketingServiceObj.blogId;
	}
	function getCompanyName(){	return marketingServiceObj.companyName;
	}
	function setAdvertisements(advertisements){	marketingServiceObj.advertisements = advertisements;
	}
	function setAdvertisement(advertisement){	marketingServiceObj.advertisement = advertisement;
	}
	function setBlogs(blogs){	marketingServiceObj.blogs = blogs;
	}
	function setBlog(blog){	marketingServiceObj.blog = blog;
	}
	function setAdvertisementId(advertisementId){	marketingServiceObj.advertisementId = advertisementId;
	}
	function setBlogId(blogId){	marketingServiceObj.blogId = blogId;
	}
	function setCompanyName(companyName){	marketingServiceObj.companyName = companyName;
	}
	
	function fetchAdvertisements(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/advertisements'
		};
		
		$http(httpConfig)
		.then(fetchAdvertisementsSuccessCallback)
		.catch(fetchAdvertisementsFailedCallback);
		
		function fetchAdvertisementsSuccessCallback(response){
			var advertisements = undefined;
			
			convertAdvertisementsResponseToMap(response.data);
			advertisements = marketingServiceObj.advertisements;
			advertisements = JSON.stringify(advertisements);
			localStorage.setItem('Advertisements', advertisements);
			
			deferred.resolve(response);
		}
		
		function fetchAdvertisementsFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertAdvertisementsResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var advertisementsDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(ADVERTISEMENTS_DB_FIELDS).length; j++){
					advertisementsDetails[ADVERTISEMENTS_DB_FIELDS[j]] = responseData[i][ADVERTISEMENTS_DB_FIELDS[j]];
				}
				
				var key = responseData[i][ADVERTISEMENTS_DB_FIELDS[0]]; //advertisement_id
				marketingServiceObj.advertisements[key] = advertisementsDetails;
			}
		}
		return deferred.promise;
	}
	
	function fetchAdvertisement(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/advertisements/' + marketingServiceObj.advertisementId
		};
		
		$http(httpConfig)
		.then(fetchAdvertisementSuccessCallback)
		.catch(fetchAdvertisementFailedCallback);
		
		function fetchAdvertisementSuccessCallback(response){
			var advertisement = undefined;
			
			convertAdvertisementResponseToMap(response.data);
			advertisement = marketingServiceObj.advertisement;
			advertisement = JSON.stringify(advertisement);
			localStorage.setItem('Advertisement', advertisement);
			
			deferred.resolve(response);
		}
		
		function fetchAdvertisementFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertAdvertisementResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var advertisementDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(ADVERTISEMENTS_DB_FIELDS).length; j++){
					advertisementDetails[ADVERTISEMENTS_DB_FIELDS[j]] = responseData[i][ADVERTISEMENTS_DB_FIELDS[j]];
				}
				
				var key = responseData[i][ADVERTISEMENTS_DB_FIELDS[0]]; //advertisement_id
				marketingServiceObj.advertisement[key] = advertisementDetails;
			}
		}
		return deferred.promise;
	}
	
	function addAdvertisement(advertisements){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/advertisements', 
				data: advertisements
		};
		
		$http(httpConfig)
		.then(addAdvertisementSuccessCallback)
		.catch(addAdvertisementFailedCallback);
		
		function addAdvertisementSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addAdvertisementFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	function updateAdvertisement(advertisement){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/advertisements/' + marketingServiceObj.advertisementId, 
				data: advertisement
		};
		
		$http(httpConfig)
		.then(updateAdvertisementSuccessCallback)
		.catch(updateAdvertisementFailedCallback);
		
		function updateAdvertisementSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateAdvertisementFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	function deleteAdvertisement(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/advertisements/' + marketingServiceObj.advertisementId
		};
		
		$http(httpConfig)
		.then(deleteAdvertisementSuccessCallback)
		.catch(deleteAdvertisementFailedCallback);
		
		function deleteAdvertisementSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteAdvertisementFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	function fetchBlogs(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/blogs'
		};
		
		$http(httpConfig)
		.then(fetchBlogsSuccessCallback)
		.catch(fetchBlogsFailedCallback);
		
		function fetchBlogsSuccessCallback(response){
			var blogs = undefined;
			
			convertBlogsResponseToMap(response.data);
			blogs  = marketingServiceObj.blogs;
			blogs = JSON.stringify(blogs);
			localStorage.setItem('Blogs', blogs);
			
			deferred.resolve(response);
		}
		
		function fetchBlogsFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertBlogsResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var blogsDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(BLOGS_DB_FIELDS).length; j++){
					blogsDetails[BLOGS_DB_FIELDS[j]] = responseData[i][BLOGS_DB_FIELDS[j]];
				}
				
				var key = responseData[i][BLOGS_DB_FIELDS[0]]; //blog_id
				marketingServiceObj.blogs[key] = blogsDetails;
			}
		}
		return deferred.promise;
	}
	
	function fetchBlog(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/blogs/' + marketingServiceObj.blogId
		};
		
		$http(httpConfig)
		.then(fetchBlogSuccessCallback)
		.catch(fetchBlogFailedCallback);
		
		function fetchBlogSuccessCallback(response){
			var blog = undefined;
			
			convertBlogResponseToMap(response.data);
			blog = marketingServiceObj.blog;
			blog = JSON.stringify(blog);
			localStorage.setItem('Blog', blog);
			
			deferred.resolve(response);
		}
		
		function fetchBlogFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertBlogResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var blogDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(BLOGS_DB_FIELDS).length; j++){
					blogDetails[BLOGS_DB_FIELDS[j]] = responseData[i][BLOGS_DB_FIELDS[j]];
				}
				
				var key = responseData[i][BLOGS_DB_FIELDS[0]]; //blog_id
				marketingServiceObj.blog[key] = blogDetails;
			}
		}
		return deferred.promise;
	}
	
	function addBlog(blogs){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/blogs', 
				data: blogs
		};
		
		$http(httpConfig)
		.then(addBlogSuccessCallback)
		.catch(addBlogFailedCallback);
		
		function addBlogSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addBlogFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	function updateBlog(blog){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/blogs/' + marketingServiceObj.blogId, 
				data: blog
		};
		
		$http(httpConfig)
		.then(updateBlogSuccessCallback)
		.catch(updateBlogFailedCallback);
		
		function updateBlogSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateBlogFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	function deleteBlog(blog){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/blogs/' + marketingServiceObj.blogId
		};
		
		$http(httpConfig)
		.then(deleteBlogSuccessCallback)
		.catch(deleteBlogFailedCallback);
		
		function deleteBlogSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteBlogFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	return marketingServiceObj;
}