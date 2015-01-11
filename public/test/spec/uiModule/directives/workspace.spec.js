'use strict';

describe("uiModule", function(){
    beforeEach(module('presets'));
    describe("directives", function() {
        describe("workspace", function() {
            var $compile,$scope,elem,element,$timeout;
            beforeEach(module('templates/box.html', 'templates/activeBox.html','templates/inactiveBox.html','templates/editBox.html',
                'templates/types/workspaceStatus.html','templates/types/map.html'));
            beforeEach(inject(function(_$rootScope_,_$compile_,workspaceProvider,_$timeout_){
                $compile = _$compile_;
                $timeout = _$timeout_;
                $scope = _$rootScope_.$new();
                $scope.currentWorkspace = workspaceProvider.getNewWorkspace();
                elem = angular.element('<workspace curr-workspace="currentWorkspace" type="{{isEdit}}"  class="workspace nohover"></workspace>');
            }));

            describe("workspace view", function () {
                beforeEach(function () {
                    $scope.isEdit = false;
                    element = $compile(elem)($scope);
                    $scope.$digest();
                });
                it('20 boxes should be created', function () {
                    var contents = element.find('box');
                    expect(contents.length).toBe(20);
                });
                it('20 boxes should be inactive-box', function () {
                    var flag = true;
                    var contents = element.find('box'), str;
                    for (var i = 0; i < contents.length; i++) {
                        str = contents.eq(i).html();
                        flag = flag && (str.indexOf("inactive-box") > 0);
                    }
                    expect(flag).toBe(true);
                });
                it('flipper should NOT be added', function () {
                    expect(element.html()).not.toContain('flipper');
                });
            });
            describe("workspace edit", function () {
                var scope;
                beforeEach(function () {
                    $scope.isEdit = true;
                    var boxes = [
                        {firstLocation: [0, 0], location: [0, 0], size: [1, 1], id: 0, isSet: true, formData: {}, typeId: "3"},
                        {firstLocation: [0, 1], location: [0, 1], size: [1, 1], id: 1},
                        {firstLocation: [0, 2], location: [0, 2], size: [1, 1], id: 2},
                        {firstLocation: [1, 0], location: [1, 0], size: [1, 1], id: 3},
                        {firstLocation: [1, 1], location: [1, 1], size: [1, 1], id: 4, hidden: true, underBox: 8},
                        {firstLocation: [1, 2], location: [1, 2], size: [1, 1], id: 5, hidden: true, underBox: 8},
                        {firstLocation: [2, 0], location: [2, 0], size: [1, 1], id: 6},
                        {firstLocation: [2, 1], location: [2, 1], size: [1, 1], id: 7, hidden: true, underBox: 8},
                        {firstLocation: [2, 2], location: [1, 1], size: [2, 2], id: 8, isSet: true, formData: {}, typeId: "4"}
                    ];
                    $scope.currentWorkspace.tiles = boxes;
                    element = $compile(elem)($scope);
                    scope = element.isolateScope();
                    $scope.$digest();
                });
                it('6 boxes should be created', function () {
                    var contents = element.find('box');
                    expect(contents.length).toBe(6);
                });
                it('4 boxes should be inactive-box', function () {
                    var count = 0;
                    var contents = element.find('box'), str;
                    for (var i = 0; i < contents.length; i++) {
                        str = contents.eq(i).html();
                        if (str.indexOf("inactive-box") > 0) {
                            count++;
                        }
                    }
                    expect(count).toBe(4);
                });
                it('flipper should be added to all boxes', function () {
                    var flag = true;
                    var contents = element.find('box'), str;
                    for (var i = 0; i < contents.length; i++) {
                        str = contents.eq(i).prop('outerHTML');
                        flag = flag && (str.indexOf("flipper") > 0);
                    }
                    expect(flag).toBe(true);
                });
                describe("dragBox function", function () {
                    it('switchBoxes should be called', inject(function (boxUtils) {
                        spyOn(boxUtils, 'switchBoxes');
                        scope.dragBox(0, 1);
                        expect(boxUtils.switchBoxes).toHaveBeenCalledWith(scope.currWorkspace.tiles, 0, 1)
                    }));
                    it('scope.$emit should be called', function () {
                        spyOn(scope, '$emit');
                        scope.dragBox(0, 1);
                        expect(scope.$emit).toHaveBeenCalledWith('updateWorkspace');
                    });
                });
                describe("collapseBox function", function () {
                    it('collapseBox should be called', inject(function (boxUtils) {
                        spyOn(boxUtils, 'collapseBox');
                        scope.collapseBox(0);
                        expect(boxUtils.collapseBox).toHaveBeenCalledWith(scope.currWorkspace.tiles, 0)
                    }));
                    it('scope.$emit should be called', function () {
                        spyOn(scope, '$emit');
                        scope.collapseBox(0);
                        expect(scope.$emit).toHaveBeenCalledWith('updateWorkspace');
                    });
                });
                describe("deleteBox function", function () {
                    it('deleteBox should be called', inject(function (boxUtils) {
                        spyOn(boxUtils, 'deleteBox');
                        scope.deleteBox(0);
                        expect(boxUtils.deleteBox).toHaveBeenCalledWith(scope.currWorkspace.tiles, 0)
                    }));
                    it('scope.$emit should NOT be called with activateResize', function () {
                        spyOn(scope, '$emit');
                        scope.deleteBox(0);
                        expect(scope.$emit).not.toHaveBeenCalledWith('activateResize');
                    });
                    it('scope.$emit should be called with activateResize', function () {
                        spyOn(scope, '$emit');
                        scope.deleteBox(0);
                        scope.deleteBox(8);
                        expect(scope.$emit).toHaveBeenCalledWith('activateResize');
                    });
                    it('scope.$emit should be called with updateWorkspace', function () {
                        spyOn(scope, '$emit');
                        scope.deleteBox(0);
                        expect(scope.$emit).toHaveBeenCalledWith('updateWorkspace');
                    });
                });
                describe("events functions", function() {
                    var childScope,boxUtils;
                    beforeEach(inject(function (_boxUtils_) {
                        boxUtils  = _boxUtils_;
                        childScope = scope.$new();
                    }));
                    describe("setTheChosenOne function", function() {
                        beforeEach(function () {
                            spyOn(boxUtils, 'setHeaderHeight');
                            childScope.$emit('setTheChosenOne',8);
                        });
                        it('chosenId should be 8', function () {
                            expect(scope.chosenId).toBe(8);
                        });
                        it('setHeaderHeight should be called', function () {
                            expect(boxUtils.setHeaderHeight).toHaveBeenCalledWith(0)
                        });
                    });
                    describe("expendBox function", function() {
                        var  borders;
                        beforeEach(function () {
                            borders = {top: 0, left: 0, bottom: 0, right: 0};
                            scope.chosenId = 8;
                        });
                        it('chosenId should be null', function () {
                            childScope.$emit('expendBox',borders);
                            expect(scope.chosenId).toBe(null);
                        });
                        it('getNewBoxArray should be called', function () {
                            spyOn(boxUtils, 'getNewBoxArray');
                            childScope.$emit('expendBox',borders);
                            expect(boxUtils.getNewBoxArray).toHaveBeenCalledWith(scope.currWorkspace.tiles,borders,8)
                        });
                        it('scope.$emit should be called with updateWorkspace', function () {
                            spyOn(scope, '$emit').and.callThrough();
                            childScope.$emit('expendBox',borders);
                            expect(scope.$emit).toHaveBeenCalledWith('updateWorkspace');
                        });
                        it('scope.$emit should NOT be called with updateWorkspace', function () {
                            spyOn(boxUtils, 'getNewBoxArray').and.callFake(function() {
                                return null;
                            });
                            spyOn(scope, '$emit').and.callThrough();
                            childScope.$emit('expendBox',borders);
                            expect(scope.$emit).not.toHaveBeenCalledWith('updateWorkspace');
                        });

                    });
                    describe("checkOverlap function", function() {
                        var  borders;
                        beforeEach(function () {
                            borders = {top: 0, left: 0, bottom: 0, right: 0};
                            scope.chosenId = 8;
                        });
                        it('checkOverlap should be called', function () {
                            spyOn(boxUtils, 'checkOverlap');
                            childScope.$emit('checkOverlap',borders);
                            expect(boxUtils.checkOverlap).toHaveBeenCalledWith(scope.currWorkspace.tiles,borders,8,false);
                        });

                    });
                });
            });
        });
    });
});
