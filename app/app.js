(function () {
  'use strict';
  angular.module(destinyGhost.globals.appName, ['ngResource', 'ngRoute'])
    .config(function ($locationProvider, $routeProvider) {
      $routeProvider.when('/register',
        {
          templateUrl: 'views/register.html',
          controller: 'RegisterController',
            controllerAs: 'vm'
        });
      $routeProvider.otherwise({
          templateUrl: 'views/home.html',
          controller: 'HomeController',
          controllerAs: 'vm'
      });
      $locationProvider.html5Mode(true);
    })
    .constant('destinyServiceBase', 'http://18d212d1.ngrok.io/api')
    .constant('userServiceBase', 'http://18d212d1.ngrok.io/api')
})();
