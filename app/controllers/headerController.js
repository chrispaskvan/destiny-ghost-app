(function (angular, destinyGhost) {
	'use strict';
	angular.module(destinyGhost.globals.appName)
		.controller('HeaderController', HeaderController);

	HeaderController.$inject = ['$location', '$scope', '$window', 'destinyServices', 'userServices'];

	function HeaderController($location, $scope, $window, destinyServices, userServices) {
		var vm = this;

		vm.isLoading = true;

		this.$onInit = function () {
			var params = $location.search();

			if (params.code) {
				return userServices.signIn(params)
					.then(function (res) {
						$log.log(res);
					});
			}

			userServices.getCurrentUser()
				.then(function (user) {
					vm.user = user;
					if (!user.dateRegistered) {
						if (params.emailAddress) {
							$location.path('/join');
						} else {
							$location.path('/signUp');
						}
					}
				})
				.catch(function () {
					destinyServices.getSignInUrl()
						.then(function (url) {
							vm.signInUrl = url;
							$location.path('/');
						});
				})
				.finally(function () {
					vm.isLoading = false;
				});
		};

		vm.getBungieMembershipType = function () {
			switch (vm.user.membershipType) {
				case 1:
					return 'Xbox Live';
				case 2:
					return 'PlayStation Network';
				case 4:
					return 'Battle.net';
				case 10:
					return 'Demon';
				case 254:
					return 'Bungie Next';
				case -1:
					return 'All';
				default:
					return '';
			}
		};

		vm.getProfilePictureUrl = function () {
			return 'https://www.bungie.net' + vm.user.profilePicturePath;
		};

		vm.signOut = function () {
			userServices.signOut()
				.finally(function () {
					$window.location.href = '/';
				});
		};
	}
})(angular, destinyGhost);
