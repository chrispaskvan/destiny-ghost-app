/**
 * @description {link:https://github.com/MarkPieszak/ngForm-handle-Enter-Keypress}
 */
(function () {
    'use strict';
    angular.module(destinyGhost.globals.appName)
        .directive('ngForm', function ($parse, $timeout) {
            return {
                link: linkFunction
            };

            function linkFunction($scope, $element, $attrs) {
                var $submit_button = findSubmitButton();
                $element.bind('keydown', function (e) {
                    var keyCode = e.keyCode || e.which;
                    if (keyCode === 13) {
                        if ($attrs.ngSubmit) {
                            $parse($attrs.ngSubmit)($scope);
                            e.stopPropagation();
                        } else if ($submit_button) {
                            $submit_button.click();
                            e.stopPropagation();
                        }
                        $scope.$apply();
                    }
                });

                angular.element($submit_button).bind('click', function (e) {
                    if ($attrs.ngSubmit && angular.element(this).attr('ng-click') === undefined) {
                        $parse($attrs.ngSubmit)($scope);
                        e.stopPropagation();

                        $timeout(function () {
                            var ngForm = $scope[$attrs.ngForm];
                            if (ngForm) {
                                ngForm.$submitted = true;
                            }
                            $element.addClass('ng-submitted');
                        });
                    }
                });

                function findSubmitButton() {
                    var $buttons = [$element.find('button'), $element.find('input')];
                    for (var i = 0; i < $buttons.length; i++) {
                        for (var n = 0; n < $buttons[i].length; n++) {
                            var $current = $buttons[i][n];
                            if ($current.getAttribute('type') && $current.getAttribute('type').toLowerCase() === 'submit') {
                                return $current;
                            }
                        }
                    }
                }
            }
        });
})();
