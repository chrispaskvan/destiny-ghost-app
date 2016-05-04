(function () {
    'use strict';
    angular.module(destinyGhost.globals.appName)
        .factory('userServices', ['$http', 'userServiceBase', function ($http, userServiceBase) {
            var serviceBase = userServiceBase;
            var dataFactory = {};

            dataFactory.isEmailAddressUnique = function (emailAddress) {
                return $http({
                    method: 'GET',
                    url: serviceBase + '/users/' + emailAddress + '/emailAddress/'
                })
                    .then(function () {
                        return false;
                    }, function () {
                        return true;
                    });
            };
            return dataFactory;
        }]);
})();