(function (angular, destinyGhost) {
    'use strict';
    angular.module(destinyGhost.globals.appName)
        .directive('dgSemanticPopup', dgSemanticPopup);

    function dgSemanticPopup() {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            $(element).popup();
        }
    }
})(angular, destinyGhost);
