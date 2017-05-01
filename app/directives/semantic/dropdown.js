(function (angular, destinyGhost) {
    'use strict';
    angular.module(destinyGhost.globals.appName)
        .directive('dgSemanticDropdown', dgSemanticDropdown);

    function dgSemanticDropdown($parse) {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };
        return directive;
        function linkFunc(scope, element, attrs) {
            var modelAccessor = $parse(attrs.ngModel);
            $(element).dropdown({
                onChange: function (val) {
                    scope.$apply(function (scope) {
                        modelAccessor.assign(scope, val);
                    });
                }
            });
        }
    }
})(angular, destinyGhost);
