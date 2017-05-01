(function (angular, destinyGhost) {
    'use strict';
    angular.module(destinyGhost.globals.appName, ['ngResource', 'ngRoute'])
        .config(function ($locationProvider, $routeProvider) {
            $routeProvider.when('/register',
                {
                    templateUrl: 'views/register.html',
                    controller: 'RegisterController',
                    controllerAs: 'vm'
                });
            $routeProvider.when('/signUp',
                {
                    templateUrl: 'signUp/signUp.html',
                    controller: 'signUpController',
                    controllerAs: 'su'
                });
            $routeProvider.otherwise({
                templateUrl: 'views/home.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            });
            $locationProvider.html5Mode(true);
        })
        .constant('destinyServiceBase', 'http://localhost:1100/api')
        .constant('userServiceBase', 'http://localhost:1100/api')
        .run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {
            $rootScope.$on('$stateChangeSuccess', function (event) {
                if (!$window.ga) {
                    return;
                }
                $window.ga('send', 'pageview', {page: $location.path()});
            });
        }]);
})(angular, destinyGhost);
