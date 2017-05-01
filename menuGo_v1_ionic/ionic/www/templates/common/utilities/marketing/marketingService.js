angular
.module('starter')
.factory(
		'marketingService', 
		marketingService
		);

marketingService.$inject = [
                            'ADVERTISEMENTS_DB_FIELDS', 
                            'API_BASE_URL', 
                            'BLOGS_DB_FIELDS', 
                            'KEYS', 
                            '$http', 
                            '$localStorage', 
                            '$q'
                            ];

function marketingService(
		ADVERTISEMENTS_DB_FIELDS, 
		API_BASE_URL, 
		BLOGS_DB_FIELDS, 
		KEYS, 
		$http, 
		$localStorage, 
		$q
		){
	var marketingServiceObj = {
			advertisements: {}, 
			blogs: {}, 
			advertisementId: undefined, 
			blogId: undefined, 
			companyName: undefined, 
			getAdvertisements: getAdvertisements, 
			getBlogs: getBlogs, 
			getAdvertisementId: getAdvertisementId, 
			getBlogId: getBlogId, 
			getCompanyName: getCompanyName, 
			setAdvertisements: setAdvertisements, 
			setBlogs: setBlogs, 
			setAdvertisementId: setAdvertisementId, 
			setBlogId: setBlogId, 
			setCompanyName: setCompanyName, 
			getOptionsAdvertisements: {
				1: 'getAdvertisements', 
				2: 'getAdvertisement', 
				3: 'getCompanyAdvertisements', 
				4: 'getCompanyAdvertisement'
					}, 
					fetchAdvertisements: fetchAdvertisements, 
					addAdvertisement: addAdvertisement, 
					updateAdvertisement: updateAdvertisement, 
					deleteAdvertisement: deleteAdvertisement, 
			getOptionsBlogs: {
				1: 'getBlogs', 
				2: 'getBlog'
					}, 
					fetchBlogs: fetchBlogs, 
					addBlog: addBlog, 
					updateBlog: updateBlog, 
					deleteBlog: deleteBlog
					};
	
	function getAdvertisements(){	return marketingServiceObj.advertisements;
	}
	function getBlogs(){	return marketingServiceObj.blogs;
	}
	function getAdvertisementId(){	return marketingServiceObj.advertisementId;
	}
	function getBlogId(){	return marketingServiceObj.blogId;
	}
	function getCompanyName(){	return marketingServiceObj.companyName;
	}
	function setAdvertisements(advertisements){	marketingServiceObj.advertisements = advertisements;
	}
	function setBlogs(blogs){	marketingServiceObj.blogs = blogs;
	}
	function setAdvertisementId(advertisementId){	marketingServiceObj.advertisementId = advertisementId;
	}
	function setBlogId(blogId){	marketingServiceObj.blogId = blogId;
	}
	function setCompanyName(companyName){	marketingServiceObj.companyName = companyName;
	}
	
	function fetchAdvertisements(
			getOption, 
			getParams
			){
		var deferred = $q.defer();
		var httpConfig = {	method: 'GET'	};
		
		switch(marketingServiceObj.getOptionsAdvertisements[getOption]){
		case 'getAdvertisements':
			httpConfig['url'] = API_BASE_URL + '/advertisements';
			break;
		case 'getAdvertisement':
			httpConfig['url'] = API_BASE_URL + '/advertisements/' + marketingServiceObj.advertisementId;
			break;
		case 'getCompanyAdvertisements':
			httpConfig['url'] = API_BASE_URL + '/companies/' + marketingServiceObj.companyName + '/advertisements';
			break;
		case 'getCompanyAdvertisement':
			httpConfig['url'] = API_BASE_URL + '/companies/' + marketingServiceObj.companyName + '/advertisements/' + marketingServiceObj.advertisementId;
			break;
			default:
				break;
			}
		
		$http(httpConfig)
		.then(fetchAdvertisementsSuccessCallback)
		.catch(fetchAdvertisementsFailedCallback);
		
		function fetchAdvertisementsSuccessCallback(response){
			var advertisements = undefined;
			
			convertAdvertisementsResponseToMap(response.data);
			advertisements = marketingServiceObj.advertisements;
			advertisements = JSON.stringify(advertisements);
			localStorage.setItem(
					KEYS.Advertisements, 
					advertisements
					);
			
			deferred.resolve(response);
			}
		
		function fetchAdvertisementsFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertAdvertisementsResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var advertisementsDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(ADVERTISEMENTS_DB_FIELDS).length; j++){	advertisementsDetails[ADVERTISEMENTS_DB_FIELDS[j]] = responseData[i][ADVERTISEMENTS_DB_FIELDS[j]];
				}
				
				var key = responseData[i][ADVERTISEMENTS_DB_FIELDS[0]]; //advertisement_id
				marketingServiceObj.advertisements[key] = advertisementsDetails;
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
	
	function fetchBlogs(
			getOption, 
			getParams
			){
		var deferred = $q.defer();
		var httpConfig = {	method: 'GET'	};
		
		switch(marketingServiceObj.getOptionsBlogs[getOption]){
		case 'getBlogs':
			httpConfig['url'] = API_BASE_URL + '/blogs';
			break;
		case 'getBlog':
			httpConfig['url'] = API_BASE_URL + '/blogs/' + marketingServiceObj.blogId;
			break;
			default:
				break;
			}
		
		$http(httpConfig)
		.then(fetchBlogsSuccessCallback)
		.catch(fetchBlogsFailedCallback);
		
		function fetchBlogsSuccessCallback(response){
			var blogs = undefined;
			
			convertBlogsResponseToMap(response.data);
			blogs  = marketingServiceObj.blogs;
			blogs = JSON.stringify(blogs);
			localStorage.setItem(
					KEYS.Blogs, 
					blogs
					);
			
			deferred.resolve(response);
			}
		
		function fetchBlogsFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertBlogsResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var blogsDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(BLOGS_DB_FIELDS).length; j++){	blogsDetails[BLOGS_DB_FIELDS[j]] = responseData[i][BLOGS_DB_FIELDS[j]];
				}
				
				var key = responseData[i][BLOGS_DB_FIELDS[0]]; //blog_id
				marketingServiceObj.blogs[key] = blogsDetails;
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