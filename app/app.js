(function (angular, destinyGhost) {
    'use strict';
    angular.module(destinyGhost.globals.appName, ['ngResource', 'ngRoute', 'ngSanitize'])
	    .provider('download', function DownloadProvider() {
		    var configurableSetting = false;

		    this.setConfigurableSetting = function(value) {
			    configurableSetting = !!value;
		    };

		    this.$get = ["customArgument", function addDownload(customArgument) {

			    return new Download(customArgument, configurableSetting);
		    }];
	    })
        .config(function ($locationProvider, $routeProvider) {
            $routeProvider.when('/join',
                {
                    templateUrl: 'join/join.html',
                    controller: 'joinController',
                    controllerAs: 'vm'
                });
            $routeProvider.when('/signUp',
                {
                    templateUrl: 'signUp/signUp.html',
                    controller: 'signUpController',
                    controllerAs: 'vm'
                });
            $routeProvider.otherwise({
                templateUrl: 'views/home.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            });
            $locationProvider.html5Mode(true);
        })
        .constant('destinyServiceBase', 'http://app2.destiny-ghost.com:1100')
        .constant('userServiceBase', 'http://app2.destiny-ghost.com:1100')
        .run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {
            $rootScope.$on('$stateChangeSuccess', function (event) {
                if (!$window.ga) {
                    return;
                }
                $window.ga('send', 'pageview', {
                    page: $location.path()
                });
            });
        }]);
})(angular, destinyGhost);
