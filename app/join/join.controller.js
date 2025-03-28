(function () {
	'use strict';
	angular.module(destinyGhost.globals.appName)
		.controller('joinController', JoinController);

	JoinController.$inject = ['$location', '$log', 'userServices'];

	function JoinController($location, $log, userServices) {
		var vm = this;
		vm.confirmationCode = '';

		function getCurrentUser() {
			return userServices.getCurrentUser()
				.then(function (user) {
					console.log('todo')
				});
		}

		vm.$onInit = function () {
			$('#success')
				.modal('setting', 'closable', false)
				.modal('show');
		};

		vm.join = function () {
			if (vm.joinForm.$valid) {
				var params = $location.search();

				userServices.join({
					tokens: {
						emailAddress: params.emailAddress,
						phoneNumber: vm.confirmationCode
					}
				})
					.then(function (res) {
						console.log(res);
					});
				console.log(vm.confirmationCode);
			}
		};

		vm.$onInit();
	}
})();