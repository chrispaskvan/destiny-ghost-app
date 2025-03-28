(function (angular, destinyGhost) {
  'use strict';
  angular.module(destinyGhost.globals.appName)
    .controller('HomeController', HomeController);

    HomeController.$inject = ['destinyServices', 'userServices'];

    function HomeController(destinyServices, userServices) {
        var vm = this;

        this.$onInit = function () {
	        destinyServices.getGrimoireCards(6)
                .then(function (grimoireCards) {
                    vm.grimoireCards = grimoireCards || [];
                });
        };

        vm.$onInit();
    }
})(angular, destinyGhost);