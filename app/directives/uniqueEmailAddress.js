(function () {
    'use strict';
    angular.module(destinyGhost.globals.appName)
        .directive('dgUniqueEmailAddress', dgUniqueEmailAddress);

    function dgUniqueEmailAddress() {
        var directive = {
            require: 'ngModel',
            link: linkFunc,
            scope: true,
            controller: UniqueEmailAddressController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
        
        function linkFunc(scope, element, attrs, ngModel) {
            element.bind('blur', function (e) {
                if (!ngModel || !element.val()) return;
                var currentValue = element.val();
                scope.vm.isEmailAddressUnique(currentValue)
                    .then(function (unique) {
                        if (currentValue == element.val()) {
                            ngModel.$setValidity('unique', unique);
                        }
                    });
            });
        };
    }

    UniqueEmailAddressController.$inject = ['userServices'];

    function UniqueEmailAddressController(userServices) {
        var vm = this;
        vm.userServices = userServices;
        vm.isEmailAddressUnique = function (emailAddress) {
            return vm.userServices.isEmailAddressUnique(emailAddress)
                .then(function (unique) {
                    return unique;
                }, function (err) {
                    console.log(err);
                    return false;
                });
        }
    }
})();
