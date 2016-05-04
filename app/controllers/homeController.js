(function () {
  'use strict';
  angular.module(destinyGhost.globals.appName)
    .controller('HomeController', function HomeController($scope) {
      $scope.testvar = 'home';
    });
})();