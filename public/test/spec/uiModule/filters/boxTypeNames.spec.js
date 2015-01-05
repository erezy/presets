'use strict';

describe("uiModule", function(){
    beforeEach(module('uiModule'));
    describe("filters", function() {
        describe("boxType", function() {
            var filter,boxTypes;
            beforeEach(function () {
                boxTypes = [{id:1, name:'erez'},{id:2, name:'moshe'}];

                module(function ($provide) {
                    $provide.constant('BOX_TYPES', boxTypes);
                });
            });
            beforeEach(inject(function (boxTypeFilter) {
                filter = boxTypeFilter;
            }));
            it("should return type name by id", function(){
                expect(filter(1)).toEqual("erez");
            });
            it("should return empty string when match not found", function(){
                expect(filter(0)).toEqual("");
            });
        });
    });
});