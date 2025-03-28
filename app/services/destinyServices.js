(function () {
    'use strict';
    angular.module(destinyGhost.globals.appName)
        .factory('destinyServices', ['$http', 'destinyServiceBase', function ($http, destinyServiceBase) {
            var serviceBase = destinyServiceBase;
            var dataFactory = {
                getGrimoireCards: function (numberOfCards) {
                    return $http({
                        method: 'GET',
                        url: serviceBase + '/destiny/grimoireCards/' + numberOfCards
                    })
                        .then(function (response) {
                            return response.data;
                        });
                },
                getProfile: function () {
	                return $http({
		                method: 'GET',
		                url: serviceBase + '/destiny2/profile',
		                withCredentials: true
	                })
		                .then(function (response) {
			                return response.data;
		                });
                },
                getSignInUrl: function () {
                    return $http({
                        method: 'GET',
                        url: serviceBase + '/destiny/signIn'
                    })
                        .then(function (response) {
                            return response.data;
                        });
                }
            };

            return dataFactory;
        }]);
})();
