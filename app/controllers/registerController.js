(function () {
  'use strict';
  angular.module(destinyGhost.globals.appName)
    .controller('RegisterController', RegisterController);
    
    function RegisterController() {
      var vm = this;
      vm.user = {
        firstName: 'ddddd',
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
      vm.register = function () {
        angular.forEach(vm.registrationForm.$error.required, function (field) {
          field.$setTouched();
        });
        if (vm.registrationForm.$valid) {
          alert('valid');
        }
      };
      vm.test = false;
      vm.test2 = function () {
        vm.test = true;
      };
    }
})(angular, destinyGhost);