'use strict';

describe("appModule", function(){
    beforeEach(module('presets'));
    describe("controllers", function() {
        describe("ControlPanelController", function() {
            var scope,createController,workspace_size,themes,workspaceProvider,workspaceServices,timeout;
            beforeEach(inject(function ($rootScope, $controller,$timeout) {
                scope = $rootScope.$new();
                timeout = $timeout;
                themes =  ['theme-1','theme-2','theme-3'] ;
                workspace_size = { row:4,col:5,sizeArray:[2,3,4,5,6] };
                workspaceProvider = {getNewWorkspace:function(){return {id:3};},changeWorkspaceSize:function(){}};
                workspaceServices = {getAllWorkspaces:function(){},getLastWorkspace:function(data){return data[0]}};
                createController = function() {
                    return $controller('ControlPanelController', {
                        '$scope': scope,
                        'WORKSPACE_SIZE':workspace_size,
                        'THEMES':themes,
                        'workspaceProvider':workspaceProvider,
                        'workspaceServices':workspaceServices,
                        '$timeout':timeout
                    });
                };
                spyOn(workspaceServices,'getAllWorkspaces');
                spyOn(workspaceServices,'getLastWorkspace').and.callThrough();
                spyOn(workspaceProvider,'getNewWorkspace').and.callThrough();
                spyOn(workspaceProvider,'changeWorkspaceSize');
            }));
            it("scope.themeOptions should be themes" , function(){
                var ctrl = createController();
                expect(scope.themeOptions).toEqual(themes);
            });
            it("scope.selectedTheme should be theme-1" , function(){
                var ctrl = createController();
                expect(scope.selectedTheme).toEqual("theme-1");
            });
            it("scope.sizeArray should be [2,3,4,5,6]" , function(){
                var ctrl = createController();
                expect(scope.sizeArray).toEqual([2,3,4,5,6]);
            });
            it("workspaceServices.getAllWorkspaces should be called" , function(){
                var ctrl = createController();
                expect(workspaceServices.getAllWorkspaces).toHaveBeenCalledWith(ctrl.setWorkspaces);
            });
            describe("setWorkspaces function", function() {
                var data;
                beforeEach(function () {
                    var ctrl = createController();
                    data = [{id:1},{id:2}];
                    ctrl.setWorkspaces(data);
                });
                it("scope.workspaces should be data", function(){
                    expect(scope.workspaces).toEqual(data);
                });
                it("workspaceServices.getLastWorkspace should be called with data" , function(){
                    expect(workspaceServices.getLastWorkspace).toHaveBeenCalledWith(data);
                });
                it("scope.currentWorkspace should be {id:1}", function(){
                    expect(scope.currentWorkspace).toEqual({id:1});
                });
            });
            describe("editWorkspace function", function() {
                beforeEach(function () {
                    var ctrl = createController();
                    scope.workspaces = [{id:1},{id:2}];
                    scope.currentWorkspace = scope.workspaces[1];
                    spyOn(scope,'$broadcast');
                    scope.editWorkspace();
                });
                it("$broadcast should be called with animateBox", function(){
                    expect(scope.$broadcast).toHaveBeenCalledWith('animateBox');
                });
                it("isEdit should be true", function(){
                    expect(scope.isEdit).toBe(true);
                });
                it("selectedIndex should be 1", function(){
                    expect(scope.selectedIndex).toBe(1);
                });
                it("lastWorkspace should be {id:2}", function(){
                    expect(scope.lastWorkspace).toEqual({id:2});
                });
            });
            describe("addWorkspace function", function() {
                beforeEach(function () {
                    var ctrl = createController();
                    scope.workspaces = [{id:1},{id:2}];
                    scope.currentWorkspace = scope.workspaces[1];
                    scope.addWorkspace();
                });
                it("lastWorkspace should be {id:2}", function(){
                    expect(scope.lastWorkspace).toEqual({id:2});
                });
                it("isEdit should be true", function(){
                    expect(scope.isEdit).toBe(true);
                });
                it("resize should be true", function(){
                    expect(scope.resize).toBe(true);
                });
                it("isNew should be true", function(){
                    expect(scope.isNew).toBe(true);
                });
                it("workspaceProvider.getNewWorkspace should be called", function(){
                    expect(workspaceProvider.getNewWorkspace).toHaveBeenCalled();
                });
                it("currentWorkspace should be {id:3}", function(){
                    expect(scope.currentWorkspace).toEqual({id:3});
                });
            });
            describe("changeWorkspaceSize function", function() {
                var ws;
                beforeEach(function () {
                    var ctrl = createController();
                    scope.workspaces = [{id:1},{id:2}];
                    scope.currentWorkspace = {id:3};
                    ws = scope.currentWorkspace;
                    scope.selectedIndex = 1;
                    scope.changeWorkspaceSize();
                });
                afterEach(function(){
                    timeout.verifyNoPendingTasks();
                });
                it("workspaceProvider.changeWorkspaceSize should be called with scope.currentWorkspace", function(){
                    expect(workspaceProvider.changeWorkspaceSize).toHaveBeenCalledWith({id:3});
                    timeout.flush();
                });
                it("rebuildWorkspace should be called", function(){
                    expect(scope.currentWorkspace).toBe(ws);
                    timeout.flush();
                    expect(scope.currentWorkspace).not.toBe(ws);
                    expect(scope.currentWorkspace).toEqual(ws);
                });
                it("selectedIndex should be currentWorkspace", function(){
                    scope.isNew = false;
                    timeout.flush();
                    expect(scope.workspaces[scope.selectedIndex]).toBe(scope.currentWorkspace);
                });
                it("selectedIndex should NOT be currentWorkspace", function(){
                    scope.isNew = true;
                    timeout.flush();
                    expect(scope.workspaces[scope.selectedIndex]).not.toBe(scope.currentWorkspace);
                });
            });
        });
    });
});