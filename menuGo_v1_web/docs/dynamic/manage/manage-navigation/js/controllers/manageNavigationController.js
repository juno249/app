angular
.module('starter')
.controller('manageNavigationController', manageNavigationController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
manageNavigationController.$inject = [
	'BROADCAST_MESSAGES', 
	'$scope', 
	'$state'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function manageNavigationController(
		BROADCAST_MESSAGES, 
		$scope, 
		$state
){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.isManageBranchHidden = true;
	vm.isManageMenuHidden = true;
	vm.isManageTableHidden = true;
	vm.isManageMenuitemHidden = true;
	vm.companyName = undefined;
	vm.branchName = undefined;
	vm.menuName = undefined;
	var user = undefined;
	if(!(null == localStorage.getItem('User'))){
		user = localStorage.getItem('User');
		user= JSON.parse(user);
	}
	vm.customerUsername = user.username;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.initDom = initDom;
	/* ******************************
	 * Controller Binded Method (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: initDom()
	 * purpose: initializes Dom object attributes
	 * ****************************** */
	function initDom(){
		var usermenuSelector = 'ul.nav.nav-list > li > a';
		
		$(usermenuSelector).each(function(){
			$(this).click(clickCallback);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function clickCallback(){
				var activeClass = 'active';
				
				//resets class attributes of usermenu
				$(usermenuSelector).each(function(){
					$(this).removeClass(activeClass);
				});
				//adds 'active' on class attribute of usermenu
				$(this).addClass(activeClass);
				
				//hides inner nodes
				$(this).parent().find(usermenuSelector).each(function(){
					var innerText = $(this).text();
					hideUsermenu(innerText);
				})
				
				//hide sibling nodes
				$(this).parent().siblings('li').find(usermenuSelector).each(function(){
					var innerText = $(this).text();
					hideUsermenu(innerText);
				})
				
				/* ******************************
				 * Method Implementation
				 * method name: hideUsermenu()
				 * purpose: hides usermenu
				 * ****************************** */
				function hideUsermenu(innerText){
					var isManageBranchHidden = vm.isManageBranchHidden;
					var isManageMenuHidden = vm.isManageMenuHidden;
					var isManageTableHidden = vm.isManageTableHidden;
					var isManageMenuitemHidden = vm.isManageMenuitemHidden;
					
					if(0 < innerText.indexOf('Branch')){	isManageBranchHidden = true;
					} else if(0 < innerText.indexOf('Menuitem')){	isManageMenuitemHidden = true;
					} else if(0 < innerText.indexOf('Table')){	isManageTableHidden = true;
					} else if(0 < innerText.indexOf('Menu')){ isManageMenuHidden = true;
					}
					
					vm.isManageBranchHidden = isManageBranchHidden;
					vm.isManageMenuHidden = isManageMenuHidden;
					vm.isManageTableHidden = isManageTableHidden;
					vm.isManageMenuitemHidden = isManageMenuitemHidden;
				}
			}
			
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
		});
	}
	
	/* ******************************
	 * Broadcast Event Handlers (Start)
	 * ****************************** */
	$scope.$on(BROADCAST_MESSAGES.toggleBranch, toggleBranchCallback);
	
	/* ******************************
	 * Method Implementation
	 * method name: toggleBranchCallback()
	 * purpose: toggles branch's visibility
	 * ****************************** */
	function toggleBranchCallback(
			e, 
			args
		){
		var companyName = vm.companyName;
		var isManageBranchHidden = vm.isManageBranchHidden;
		
		companyName = args.companyName;
		isManageBranchHidden = !isManageBranchHidden;
		
		vm.companyName = companyName;
		vm.isManageBranchHidden = isManageBranchHidden;
	}
	
	$scope.$on(BROADCAST_MESSAGES.toggleMenu, toggleMenuCallback);
	
	/* ******************************
	 * Method Implementation
	 * method name: toggleMenuCallback()
	 * purpose: toggles menu's visibility
	 * ****************************** */
	function toggleMenuCallback(
			e, 
			args
		){
		var companyName = vm.companyName;
		var isManageMenuHidden = vm.isManageMenuHidden;
		
		companyName = args.companyName
		isManageMenuHidden = !isManageMenuHidden;
		
		vm.companyName = companyName;
		vm.isManageMenuHidden = isManageMenuHidden;
	}
	
	$scope.$on(BROADCAST_MESSAGES.toggleTable, toggleTableCallback);
	
	/* ******************************
	 * Method Implementation
	 * method name: toggleTableCallback()
	 * purpose: toggles table's visibility
	 * ****************************** */
	function toggleTableCallback(
			e, 
			args
		){
		var companyName = vm.companyName; 
		var branchName = vm.branchName;
		var isManageTableHidden = vm.isManageTableHidden;
		
		companyName = args.companyName;
		branchName = args.branchName;
		isManageTableHidden = !isManageTableHidden;
		
		vm.companyName = companyName;
		vm.branchName = branchName;
		vm.isManageTableHidden = isManageTableHidden;
	}
	
	$scope.$on(BROADCAST_MESSAGES.toggleMenuitem, toggleMenuitemCallback);
	
	/* ******************************
	 * Method Implementation
	 * method name: toggleMenuitemCallback()
	 * purpose: toggles menuitem's visibility
	 * ****************************** */
	function toggleMenuitemCallback(
			e, 
			args
		){
		var companyName = vm.companyName; 
		var menuName = vm.menuName;
		var isManageMenuitemHidden = vm.isManageMenuitemHidden;
		
		companyName = args.companyName;
		menuName = args.menuName;
		isManageMenuitemHidden = !isManageMenuitemHidden;
		
		vm.companyName = companyName;
		vm.menuName = menuName;
		vm.isManageMenuitemHidden = isManageMenuitemHidden;
	}
	/* ******************************
	 * Broadcast Event Handlers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End
 * ****************************** */