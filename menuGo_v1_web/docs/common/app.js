angular
.module(
		'starter', 
		[
			'datatables.bootstrap', 
			'datatables.buttons', 
			'datatables.fixedcolumns', 
			'datatables.light-columnfilter', 
			'datatables.scroller', 
			'datatables.select', 
			'ngStorage', 
			'ui.bootstrap', 
			'ui.router'
			]
		)
		
.config(doRouteConfig)
.run(doRunConfig);

function doRouteConfig(
		$stateProvider, 
		$urlRouterProvider
		){
	$stateProvider
	.state(
			'manage', 
			{
				url: '/manage', 
				views: {
					'main': {
						templateUrl: 'docs/dynamic/manage/manage.html'
							}
			}
			}
			)
	.state(
			'home', 
			{
				url: '/home', 
				templateUrl: 'docs/static/home/home.html'
					}
			)
	.state(
			'manage.company', 
			{
				url: '/company', 
				views: {
					'manage-datatable': {
						templateUrl: 'docs/dynamic/manage/manage-companies/manageCompany.html', 
						controller: 'manageCompanyController', 
						controllerAs: 'manageCompanyController'
							}
			}
			}
			)
	.state(
			'manage.customer', 
			{
				url: '/customer', 
				views: {
					'manage-datatable': {
						templateUrl: 'docs/dynamic/manage/manage-customers/manageCustomer.html', 
						controller: 'manageCustomerController', 
						controllerAs: 'manageCustomerController'
							}
			}
			}
			)
	.state(
			'manage.company.branch', 
			{
				url: '/:companyName/branch', 
				views: {
					'manage-datatable@manage': {
						templateUrl: 'docs/dynamic/manage/manage-branches/manageBranch.html', 
						controller: 'manageBranchController', 
						controllerAs: 'manageBranchController'
							}
			}
			}
			)
	.state(
			'manage.company.menu', 
			{
				url: '/:companyName/menu', 
				views: {
					'manage-datatable@manage': {
						templateUrl: 'docs/dynamic/manage/manage-menus/manageMenu.html', 
						controller: 'manageMenuController', 
						controllerAs: 'manageMenuController'
							}
			}
			}
			)
	.state(
			'manage.company.branch.table', 
			{
				url: '/:branchName/table', 
				views: {
					'manage-datatable@manage': {
						templateUrl: 'docs/dynamic/manage/manage-tables/manageTable.html', 
						controller: 'manageTableController', 
						controllerAs: 'manageTableController'
							}
			}
			}
			)
	.state(
			'manage.company.menu.menuitem', 
			{
				url: '/:menuName/menuitem', 
				views: {
					'manage-datatable@manage': {
						templateUrl: 'docs/dynamic/manage/manage-menuitems/manageMenuitem.html', 
						controller: 'manageMenuitemController', 
						controllerAs: 'manageMenuitemController'
							}
			}
			}
			);
	
	$urlRouterProvider
	.otherwise("/home");
	}

function doRunConfig(
		$rootScope, 
		$state, 
		$timeout
		){
	$rootScope.$on(
			'$stateChangeStart', 
			function(
					evnt, 
					toState, 
					toStateParams, 
					fromState, 
					fromStateParams
					){
				var user = localStorage.getItem('User');
				
				if(null == user){	$timeout(
						function(){	$state.go('home');
						}
						);
				}
				}
			);
	}