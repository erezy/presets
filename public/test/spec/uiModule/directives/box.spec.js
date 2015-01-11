'use strict';

describe("uiModule", function(){
    beforeEach(module('presets'));
    describe("directives", function() {
        describe("box", function() {
            var $compile,$scope,scope,elem,element,$timeout;
            beforeEach(module('templates/box.html', 'templates/activeBox.html','templates/inactiveBox.html','templates/editBox.html',
                'templates/types/workspaceStatus.html','templates/types/map.html','templates/types/iframe.html'));
            beforeEach(inject(function(_$rootScope_,_$compile_,workspaceProvider,_$timeout_){
                $compile = _$compile_;
                $timeout = _$timeout_;
                $scope = _$rootScope_.$new();
                $scope.currentWorkspace = workspaceProvider.getNewWorkspace();
                elem = angular.element('<workspace curr-workspace="currentWorkspace" type="{{isEdit}}"  class="workspace nohover"></workspace>');
                $scope.isEdit = true;
                var boxes = [
                    {firstLocation: [0, 0], location: [0, 0], size: [1, 1], id: 0, isSet: true, formData: {}, typeId: "3"},
                    {firstLocation: [0, 1], location: [0, 1], size: [1, 1], id: 1},
                    {firstLocation: [0, 2], location: [0, 2], size: [1, 1], id: 2, isSet: true, formData: {path:'www.google.com/file.pdf'}, typeId: "2"},
                    {firstLocation: [1, 0], location: [1, 0], size: [1, 1], id: 3, isSet: true, formData: {url:'www.google.com'}, typeId: "1"},
                    {firstLocation: [1, 1], location: [1, 1], size: [1, 1], id: 4, hidden: true, underBox: 8},
                    {firstLocation: [1, 2], location: [1, 2], size: [1, 1], id: 5, hidden: true, underBox: 8},
                    {firstLocation: [2, 0], location: [2, 0], size: [1, 1], id: 6},
                    {firstLocation: [2, 1], location: [2, 1], size: [1, 1], id: 7, hidden: true, underBox: 8},
                    {firstLocation: [2, 2], location: [1, 1], size: [2, 2], id: 8, isSet: true, formData: {}, typeId: "4"}
                ];
                $scope.currentWorkspace.tiles = boxes;
                element = $compile(elem)($scope);
                $scope.$digest();
            }));

            describe("inactive box", function () {
                beforeEach(function(){
                    scope = angular.element(element.find('box')[1]).scope();
                });
                it('scope.box.overlap should be false', function () {
                    expect(scope.box.overlap).toBe(false);
                });
                it('scope.collapse should be undefined', function () {
                    expect(scope.collapse).toBeUndefined();
                });
                it('scope.dropChannel should be "active"', function () {
                    expect(scope.dropChannel).toEqual("active");
                });
                it('scope.viewContentUrl should be empty', function () {
                    expect(scope.viewContentUrl).toEqual('');
                });
                it('scope.editContentUrl should be "templates/inactiveBox.html"', function () {
                    expect(scope.editContentUrl).toEqual('templates/inactiveBox.html');
                });
                it('scope.draggable should be undefined', function () {
                    expect(scope.draggable).toBe(false);
                });
            });
            describe("active box - large", function () {
                beforeEach(function(){
                    scope = angular.element(element.find('box')[5]).scope();
                });
                it('scope.box.overlap should be false', function () {
                    expect(scope.box.overlap).toBe(false);
                });
                it('scope.collapse should be true', function () {
                    expect(scope.collapse).toBe(true);
                });
                it('scope.dropChannel should be "notActive"', function () {
                    expect(scope.dropChannel).toEqual("notActive");
                });
                it('scope.viewContentUrl should be map.html', function () {
                    expect(scope.viewContentUrl).toEqual('templates/types/map.html');
                });
                it('scope.editContentUrl should be "templates/activeBox.html"', function () {
                    expect(scope.editContentUrl).toEqual('templates/activeBox.html');
                });
                it('scope.draggable should be undefined', function () {
                    expect(scope.draggable).toBe(false);
                });
            });
            describe("active box - small", function () {
                beforeEach(function(){
                    scope = angular.element(element.find('box')[0]).scope();
                });
                it('scope.box.overlap should be false', function () {
                    expect(scope.box.overlap).toBe(false);
                });
                it('scope.collapse should be true', function () {
                    expect(scope.collapse).toBeUndefined();
                });
                it('scope.dropChannel should be "active"', function () {
                    expect(scope.dropChannel).toEqual("active");
                });
                it('scope.viewContentUrl should be workspaceStatus.html', function () {
                    expect(scope.viewContentUrl).toEqual('templates/types/workspaceStatus.html');
                });
                it('scope.editContentUrl should be "templates/activeBox.html"', function () {
                    expect(scope.editContentUrl).toEqual('templates/activeBox.html');
                });
                it('scope.draggable should be true', function () {
                    expect(scope.draggable).toBe(true);
                });
            });
            describe("getSrc function", function(){
                var $sce;
                beforeEach(inject(function(_$sce_){
                    $sce = _$sce_;
                    spyOn($sce,'trustAsResourceUrl');
                }));
                it('path should be "www.google.com/file.pdf"', function () {
                    scope = angular.element(element.find('box')[2]).scope();
                    var result = scope.getSrc();
                    expect($sce.trustAsResourceUrl).toHaveBeenCalledWith('www.google.com/file.pdf');
                });
                it('url should be "www.google.com"', function () {
                    scope = angular.element(element.find('box')[3]).scope();
                    var result = scope.getSrc();
                    expect($sce.trustAsResourceUrl).toHaveBeenCalledWith('www.google.com');
                });
            });
            describe("onDrop function", function(){
               it('dragBox should be called', function () {
                   var isolateScope = element.isolateScope();
                    spyOn(isolateScope,'dragBox')
                    scope = angular.element(element.find('box')[2]).scope();
                    var droppedBox = angular.element(element.find('box')[3]).scope().box;
                    scope.onDrop({},droppedBox);
                    expect(isolateScope.dragBox).toHaveBeenCalledWith(2,3);
                });
            });
            describe("editSave function", function(){
                var form;
                beforeEach(function(){
                    form = {data:{url:"www.cvs.com"},selectedBoxType:1};
                    scope = angular.element(element.find('box')[2]).scope();
                    spyOn(scope,'$emit');
                    spyOn(scope,'changeTemplate');
                    scope.editSave(form);
                });
                it('scope.$emit should be called', function () {
                    expect(scope.$emit).toHaveBeenCalledWith('disableResize');
                });
                it('isSet should be true', function () {
                    expect(scope.box.isSet).toBe(true);
                });
                it('formData should be form.data', function () {
                    expect(scope.box.formData).toBe(form.data);
                });
                it('typeId should be selectedBoxType', function () {
                    expect(scope.box.typeId).toBe(1);
                });
                it('draggable should be true', function () {
                    expect(scope.draggable).toBe(true);
                });
                it('draggable should be false', function () {
                    scope = angular.element(element.find('box')[5]).scope();
                    scope.editSave(form);
                    expect(scope.draggable).toBe(false);
                });
                it('scope.changeTemplate should be called', function () {
                    expect(scope.changeTemplate).toHaveBeenCalled();
                });
            });
            describe('animateBox event',function(){
                it('flipper class should be added', function () {
                    $scope.$broadcast('animateBox');
                    expect(angular.element(element.find('box')[2]).hasClass('flipper')).toBe(true);
                });
                it('flipper-leave class should be removed', function () {
                    $scope.$broadcast('animateBox');
                    expect(angular.element(element.find('box')[2]).hasClass('flipper-leave')).toBe(false);
                });
            });
            describe('animateLeaveBox event',function(){
                it('flipper-leave class should be added', function () {
                    $scope.$broadcast('animateLeaveBox');
                    expect(angular.element(element.find('box')[2]).hasClass('flipper-leave')).toBe(true);
                });
                it('flipper class should be removed', function () {
                    $scope.$broadcast('animateLeaveBox');
                    expect(angular.element(element.find('box')[2]).hasClass('flipper')).toBe(false);
                });
            });
        });
    });
});
