(function () {
    'use strict';
    angular.module(destinyGhost.globals.appName)
        .factory('userServices', ['$http', 'userServiceBase', function ($http, serviceBase) {
            var dataFactory = {
            	join: function (user) {
		            var data = JSON.stringify(user);

            		return $http({
			            data: data,
			            headers: {'Content-Type': 'application/json'},
			            method: 'POST',
			            url: serviceBase + '/users/join',
			            withCredentials: true
		            })
			            .then(function () {
				            return true;
			            })
			            .catch(function (err) {
				            console.log(err);
				            return false;
			            });
	            },
            	signIn: function (params) {
		            return $http({
			            method: 'GET',
			            params: params,
			            url: serviceBase + '/users/signIn/Bungie'
		            })
			            .then(function (response) {
				            return response.data;
			            });
	            },
	            signOut: function (params) {
		            return $http({
			            method: 'GET',
			            params: params,
			            url: serviceBase + '/users/signOut',
			            withCredentials: true
		            });
	            },
                signUp: function (user) {
                	var data = JSON.stringify(user);

                    return $http({
	                    data: data,
	                    headers: {'Content-Type': 'application/json'},
	                    method: 'POST',
                        url: serviceBase + '/users/signUp',
	                    withCredentials: true
                    })
	                    .then(function () {
		                    return true;
	                    })
                        .catch(function (err) {
                        	console.log(err);
                            return false;
                        });
                },
                getCurrentUser: function () {
                    return $http({
                        method: 'GET',
                        url: serviceBase + '/users/current',
	                    withCredentials: true
                    })
                        .then(function (response) {
                            return response.data;
                        });
                }
            };

            return dataFactory;
        }]);
})();
