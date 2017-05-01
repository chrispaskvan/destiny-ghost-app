(function () {
    'use strict';
    angular.module(destinyGhost.globals.appName)
        .controller('signUpController', SignUpController);

    function SignUpController() {
        var vm = this;
        vm.user = {
            firstName: '',
            gamerTag: '',
            lastName: '',
            membershipType: undefined,
            membershipTypes: [{
                text: 'Playstation',
                value: 2
            }, {
                text: 'Xbox',
                value: 1
            }]
        };
        vm.phoneNumberRegExp = /^1?[-\. ]?(\(\d{3}\)?[-\. ]?|\d{3}?[-\. ]?)?\d{3}?[-\. ]?\d{4}$/;
        vm.signUp = function () {
            angular.forEach(vm.signUpForm.$error.required, function (field) {
                field.$setTouched();
            });
            if (vm.signUpForm.$valid) {
                alert('valid');
            }
        };
    }
})();