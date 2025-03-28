(function () {
    'use strict';
    angular.module(destinyGhost.globals.appName)
        .controller('signUpController', SignUpController);

	SignUpController.$inject = ['$location', '$log', 'userServices'];

    function SignUpController($location, $log, userServices) {
        var vm = this;

        vm.user = {
            emailAddress: '',
            firstName: '',
            lastName: '',
            phoneNumber: ''
        };
        vm.phoneNumberRegExp = /^1?[-\. ]?(\(\d{3}\)?[-\. ]?|\d{3}?[-\. ]?)?\d{3}?[-\. ]?\d{4}$/;

        function getCurrentUser() {
	        return userServices.getCurrentUser()
		        .then(function (user) {
			        if (user.dateRegistered) {
				        $location.path('/');
			        }
		        });
        }

        vm.$onInit = function () {
        	getCurrentUser()
		        .then(function () {
			        var params = $location.search();

			        if (params.code) {
				        userServices.signIn(params)
					        .then(function (res) {
						        $log.log(res);
								getCurrentUser();
					        });
			        }
		        });
        };

        vm.signUp = function () {
            angular.forEach(vm.signUpForm.$error.required, function (field) {
                field.$setTouched();
            });
            if (vm.signUpForm.$valid) {
                userServices.signUp(vm.user)
                    .then(function (success) {
                        if (success) {
	                        $('#success')
		                        .modal('setting', 'closable', false)
		                        .modal('show');
                        } else {
	                        $('#failure')
		                        .modal('setting', 'closable', false)
		                        .modal('show');
                        }
                    });
                console.log(vm.user);
            }
        };

	    vm.$onInit();
    }
})();