/**
 * Created by chris on 4/25/16.
 */
'use strict';
describe('RegisterController', function(){
    var $controllerConstructor;

    beforeEach(module(destinyGhost.globals.appName));

    beforeEach(inject(function($controller) {
        $controllerConstructor = $controller;
    }));
    it('should ....', inject(function() {
        var ctrl = $controllerConstructor('RegisterController');
        expect(JSON.stringify(ctrl.user)).to.equal(JSON.stringify({
            firstName: '',
            gamerTag: '',
            lastName: '',
            membershipType: undefined,
            membershipTypes: [{
                text: 'Playstation',
                value: 2
            }, {
                text: 'Xbox',
                value: 1
            }]
        }));
    }));
    it('should ....', inject(function() {
        var ctrl = $controllerConstructor('RegisterController');
        ctrl.test2();
        expect(ctrl.test).to.equal(true);
    }));
});