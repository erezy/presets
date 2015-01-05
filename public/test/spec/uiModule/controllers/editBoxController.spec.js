'use strict';

describe("uiModule", function(){
    beforeEach(module('uiModule'));
    describe("controllers", function() {
        describe("editBoxController", function() {
            var scope,createController,boxUtils,timeout;
            beforeEach(inject(function ($rootScope, $controller,$timeout) {
                scope = $rootScope.$new();
                timeout = $timeout;
                boxUtils = {getBoxTypes: function(){return [{id:1, name:'erez',form:"url",html:"html"},{id:2, name:'erezy',form:"url2",html:"html2"}];},
                    getTemplateByTypeId:function(typeId,isForm){if(typeId == 1 )return "erez"; else return undefined;}};
                createController = function() {
                    return $controller('EditBoxController', {
                        '$scope': scope,
                        'boxUtils':boxUtils,
                        '$timeout':timeout
                    });
                };
                spyOn(boxUtils,'getBoxTypes').and.callThrough();
                spyOn(boxUtils,'getTemplateByTypeId').and.callThrough();
            }));
            it("getBoxTypes should be called" , function(){
                var ctrl = createController();
                expect(boxUtils.getBoxTypes).toHaveBeenCalled();
            });
            describe("initBox and changeContentUrl functions", function() {
                beforeEach(function(){
                    scope.box={typeId:1,formData:"data"};
                    scope.editForm = {};

                });
                afterEach(function(){
                    timeout.verifyNoPendingTasks();
                });
                it("getTemplateByTypeId should be called", function () {
                    var ctrl = createController();
                    expect(boxUtils.getTemplateByTypeId).not.toHaveBeenCalled();
                    timeout.flush();
                    expect(boxUtils.getTemplateByTypeId).toHaveBeenCalled();
                });
                it("contentUrl should be the correct form", function () {
                    var ctrl = createController();
                    expect(scope.contentUrl).toBeUndefined();
                    timeout.flush();
                    expect(scope.contentUrl).toEqual('templates/forms/erez.html');
                });
                it("contentUrl should be empty", function () {
                    scope.box={typeId:2};
                    var ctrl = createController();
                    expect(scope.contentUrl).toBeUndefined();
                    timeout.flush();
                    expect(scope.contentUrl).toEqual('');
                });
                it("scope.editForm.selectedBoxType should be 1", function () {
                    var ctrl = createController();
                    expect(scope.editForm.selectedBoxType).toBeUndefined();
                    timeout.flush();
                    expect(scope.editForm.selectedBoxType).toEqual(1);
                });
                it("scope.editForm.selectedBoxType should be empty", function () {
                    scope.box={};
                    var ctrl = createController();
                    expect(scope.editForm.selectedBoxType).toBeUndefined();
                    timeout.flush();
                    expect(scope.editForm.selectedBoxType).toEqual('');
                });
                it("scope.editForm.data should be data", function () {
                    var ctrl = createController();
                    expect(scope.editForm.data).toBeUndefined();
                    timeout.flush();
                    expect(scope.editForm.data).toEqual('data');
                });
            });
            describe("changeForm function", function() {
                beforeEach(function(){
                    scope.editForm = {selectedBoxType:"1"};
                    scope.box={typeId:1,formData:"data"};
                    var ctrl = createController();
                    spyOn(scope,'changeContentUrl');
                    scope.changeForm();
                });
                it("scope.editForm.data should be empty object", function () {
                    expect(scope.editForm.data).toEqual({});
                });
                it("changeContentUrl should be called", function () {
                    expect(scope.changeContentUrl).toHaveBeenCalledWith("1");
                });
            });
            describe("save and close functions", function() {
                beforeEach(function(){
                    scope.editSave = function(){};
                    scope.$hide = function(){};
                    scope.editForm = "1";
                    var ctrl = createController();
                    spyOn(scope,'editSave');
                    spyOn(scope,'$hide');
                    spyOn(scope,'$destroy');
                });
                it("save - editSave should be called", function () {
                    scope.save();
                    expect(scope.editSave).toHaveBeenCalledWith("1");
                });
                it("save - $hide should be called", function () {
                    scope.save();
                    expect(scope.$hide).toHaveBeenCalled();
                });
                it("save - $destroy should be called", function () {
                    scope.save();
                    expect(scope.$destroy).toHaveBeenCalled();
                });
                it("close - editSave should be called", function () {
                    scope.close();
                    expect(scope.editForm).toEqual({});
                });
                it("close - $hide should be called", function () {
                    scope.close();
                    expect(scope.$hide).toHaveBeenCalled();
                });
                it("close - $destroy should be called", function () {
                    scope.close();
                    expect(scope.$destroy).toHaveBeenCalled();
                });
            });
        });
    });
});