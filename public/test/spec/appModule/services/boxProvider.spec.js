
'use strict';

describe("appModule", function(){
    beforeEach(module('presets'));
    describe("services", function() {
        var service;
        beforeEach(inject(function(boxProvider){
            service = boxProvider;
        }));

        describe("boxProvider", function() {

            it("should be box class", function () {
                var newBox = service.getNewBox(25,5);
                expect(newBox.constructor.name).toBe('box');
            });
            it("box.size should be [1,1]", function () {
                var newBox = service.getNewBox(20,4);
                expect(newBox.size).toEqual([1,1]);
            });
            it("box.id should be 0", function () {
                var newBox = service.getNewBox(0,4);
                expect(newBox.id).toEqual(0);
            });
            it("box.location should be [3,2]", function () {
                var newBox = service.getNewBox(17,5);
                expect(newBox.location).toEqual([3,2]);
            });
        });
    });
});