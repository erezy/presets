
'use strict';

describe("serverModule", function(){
    beforeEach(module('serverModule'));
    describe("services", function() {
        var service;
        beforeEach(inject(function(storage){
            service = storage;
        }));

        describe("storage", function() {

            it("should get the same stored object", function () {
                service.setObj(5,{name:"moshe",age:36});
                var obj = service.getObj(5);
                expect(obj).toEqual({name:"moshe",age:36});
            });

        });
    });
});