angular
.module('starter')
.controller(
		'manageNavigationController', 
		manageNavigationController
		);

manageNavigationController.$inject = [
	'BROADCAST_MESSAGES', 
	'$localStorage', 
	'$scope', 
	'$state'
	];

function manageNavigationController(
		BROADCAST_MESSAGES, 
		$localStorage, 
		$scope, 
		$state
		){
	var vm = this;
	vm.isManageBranchHidden = true;
	vm.isManageMenuHidden = true;
	vm.isManageTableHidden = true;
	vm.isManageMenuitemHidden = true;
	
	if(!(null == localStorage.getItem('User'))){
		vm.user = localStorage.getItem('User');
		vm.user= JSON.parse(vm.user);
		}
	
	vm.customerUsername = vm.user.username;
	
	//controller_method
	vm.initDom = initDom;
	
	function initDom(){
		const SELECTOR_USERMENU = 'ul.nav.nav-list > li > a';
		
		$(SELECTOR_USERMENU).each(
				function(){
					$(this).click(clickCallback);
				
					function clickCallback(){
						const CLASS_ACTIVE = 'active';
						
						//resets class attributes of usermenu
						$(SELECTOR_USERMENU).each(
								function(){	$(this).removeClass(CLASS_ACTIVE);
								}
								);
						
						//adds 'active' on class attribute of usermenu
						$(this).addClass(CLASS_ACTIVE);
						
						//hides inner nodes
						$(this).parent().find(SELECTOR_USERMENU).each(
								function(){
									var innerText = $(this).text();
									hideUsermenu(innerText);
									}
								);
						
						//hide sibling nodes
						$(this).parent().siblings('li').find(SELECTOR_USERMENU).each(
								function(){
									var innerText = $(this).text();
									hideUsermenu(innerText);
									}
								);
						
						function hideUsermenu(innerText){
							if(0 < innerText.indexOf('Branch')){	vm.isManageBranchHidden = true;
							} else if(0 < innerText.indexOf('Menuitem')){	vm.isManageMenuitemHidden = true;
							} else if(0 < innerText.indexOf('Table')){	vm.isManageTableHidden = true;
							} else if(0 < innerText.indexOf('Menu')){	vm.isManageMenuHidden = true;
							}
							}
						}
					}
				);
		}
	
	$scope.$on(BROADCAST_MESSAGES.toggleBranch, toggleBranchCallback);
	
	function toggleBranchCallback(
			e, 
			args
			){
		vm.companyName = args.companyName;
		vm.isManageBranchHidden = !vm.isManageBranchHidden;
		}
	
	$scope.$on(BROADCAST_MESSAGES.toggleMenu, toggleMenuCallback);
	
	function toggleMenuCallback(
			e, 
			args
			){
		vm.companyName = args.companyName;
		vm.isManageMenuHidden = !vm.isManageMenuHidden;
		}
	
	$scope.$on(BROADCAST_MESSAGES.toggleTable, toggleTableCallback);
	
	function toggleTableCallback(
			e, 
			args
			){
		vm.companyName = args.companyName;
		vm.branchName = args.branchName;
		vm.isManageTableHidden = !vm.isManageTableHidden;
		}
	
	$scope.$on(BROADCAST_MESSAGES.toggleMenuitem, toggleMenuitemCallback);
	
	function toggleMenuitemCallback(
			e, 
			args
			){
		vm.companyName = args.companyName;
		vm.menuName = args.menuName;
		vm.isManageMenuitemHidden = !vm.isManageMenuitemHidden;
		}
	}