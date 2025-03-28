(function (angular, destinyGhost) {
	'use strict';
	angular.module(destinyGhost.globals.appName)
		.directive('dgSemanticFadeUp', dgSemanticFadeUp);

	function dgSemanticFadeUp() {
		var directive = {
			restrict: 'A',
			link: linkFunc
		};

		return directive;

		function linkFunc(scope, element, attrs) {
			$(element).transition('fade up');
		}
	}
})(angular, destinyGhost);
