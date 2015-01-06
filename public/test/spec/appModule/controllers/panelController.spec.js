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
                workspaceServices = {getAllWorkspaces:function(){},getLastWorkspace:function(data){return data[0]},changeWorkspace:function(){},
                                     addWorkspace:function(callback,currentWorkspace,workspaces){callback({id:5});},
                                     updateWorkspace:function (callback,currentWorkspace){callback();}
                                    };
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
                spyOn(workspaceServices,'changeWorkspace');
                spyOn(workspaceProvider,'getNewWorkspace').and.callThrough();
                spyOn(workspaceProvider,'changeWorkspaceSize');
                spyOn(scope,'$broadcast');
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
            describe("removeWorkspace function", function() {
               beforeEach(function () {
                    var ctrl = createController();
                    scope.workspaces = [{id:1},{id:2}];
                    scope.currentWorkspace = scope.workspaces[0];
                    scope.lastWorkspace = {id:3};
                    scope.selectedIndex = 1;
                    scope.isEdit = true;
                });
                it("currentWorkspace should be lastWorkspace", function(){
                   scope.removeWorkspace();
                   expect(scope.currentWorkspace).toBe(scope.lastWorkspace);
                });
                it("isEdit should be false", function(){
                    scope.removeWorkspace();
                    expect(scope.isEdit).toBe(false);
                });
                it("idNew should be false", function(){
                    scope.isNew = true;
                    scope.removeWorkspace();
                    expect(scope.isNew).toBe(false);
                    expect(scope.workspaces[scope.selectedIndex]).not.toBe(scope.currentWorkspace);
                });
                it("scope.workspaces[scope.selectedIndex] should be currentWorkspace", function(){
                    scope.isNew = false;
                    scope.removeWorkspace();
                    expect(scope.isNew).toBe(false);
                    expect(scope.workspaces[scope.selectedIndex]).toBe(scope.currentWorkspace);
                });
            });
            describe("changeWorkspace function", function() {
                beforeEach(function () {
                    var ctrl = createController();
                    scope.currentWorkspace = {id:3};
                    scope.changeWorkspace();
                });
                it("workspaceServices.changeWorkspace should be called with scope.currentWorkspace", function(){
                    expect(workspaceServices.changeWorkspace).toHaveBeenCalledWith({id:3});
                });
            });
            describe("saveWorkspace function", function() {
                beforeEach(function () {
                    scope.workspaces = [{id:1},{id:2}];
                    scope.currentWorkspace = {id:3};
                    spyOn(workspaceServices,'addWorkspace').and.callThrough();
                    spyOn(workspaceServices,'updateWorkspace').and.callThrough();
                    var ctrl = createController();
                });
                it("scope.currentWorkspace.modified should be Date", function(){
                    scope.saveWorkspace();
                    expect(scope.currentWorkspace.modified.constructor.name).toBe('Date');
                });
                describe("addWorkspace function", function() {
                    beforeEach(function () {
                        scope.isNew = true;
                        scope.saveWorkspace();
                    });
                    it("addWorkspace should be called", function(){
                        expect(workspaceServices.addWorkspace).toHaveBeenCalled();
                    });
                    it("idNew should be false", function(){
                        expect(scope.isNew).toBe(false);
                    });
                    describe("setEditViewAndPush function", function() {
                        it("isEdit should be false", function(){
                            expect(scope.isEdit).toBe(false);
                        });
                        it("scope.$broadcast should be called", function(){
                            expect(scope.$broadcast).toHaveBeenCalledWith('animateLeaveBox');
                        });
                        it("scope.currentWorkspace.id should be 5",function(){
                            expect(scope.currentWorkspace.id).toBe(5);
                        });
                        it("workspaceServices.changeWorkspace should be called with scope.currentWorkspace", function(){
                            expect(workspaceServices.changeWorkspace).toHaveBeenCalledWith(scope.currentWorkspace);
                        });
                        it("scope.workspaces should be [{id:1},{id:2},{id:5}]", function(){
                            var flag = false;
                            for(var key in scope.workspaces){
                                if(scope.workspaces[key] === scope.currentWorkspace){
                                    flag = true;
                                    break;
                                }
                            }
                            expect(flag). toBe(true);
                        });
                        it("scope.currentWorkspace.id should be 3",function(){
                            workspaceServices.addWorkspace = function(callback,currentWorkspace,workspaces){callback()};
                            scope.currentWorkspace = {id:3};
                            scope.saveWorkspace();
                            expect(scope.currentWorkspace.id).toBe(3);
                        });
                        it("workspaceServices.changeWorkspace should NOT be called", function(){
                            workspaceServices.addWorkspace = function(callback,currentWorkspace,workspaces){callback()};
                            workspaceServices.changeWorkspace.calls.reset();
                            scope.saveWorkspace();
                            expect(workspaceServices.changeWorkspace).not.toHaveBeenCalled();
                        });
                    });
                });
                describe("updateWorkspace function", function() {
                    beforeEach(function () {
                        scope.isNew = false;
                        scope.saveWorkspace();
                    });
                    it("updateWorkspace should be called", function(){
                        expect(workspaceServices.updateWorkspace).toHaveBeenCalled();
                    });
                    describe("setEditView function", function() {
                        it("isEdit should be false", function(){
                            expect(scope.isEdit).toBe(false);
                        });
                        it("scope.$broadcast should be called", function(){
                            expect(scope.$broadcast).toHaveBeenCalledWith('animateLeaveBox');
                        });
                    });
                });
            });
            describe("events functions", function() {
                var childScope,ws;
                beforeEach(function () {
                    scope.workspaces = [{id:1},{id:2}];
                    scope.currentWorkspace = scope.workspaces[0];
                    ws = scope.currentWorkspace;
                    scope.selectedIndex = 1;
                    var ctrl = createController();
                    childScope = scope.$new();
                });
                afterEach(function(){
                    timeout.verifyNoPendingTasks();
                });
                it("updateWorkspace event should be called", function(){
                    childScope.$emit('updateWorkspace');
                    expect(ws).toBe(scope.currentWorkspace);
                    timeout.flush();
                    expect(ws).not.toBe(scope.currentWorkspace);
                    expect(ws).toEqual(scope.currentWorkspace);
                    expect(scope.workspaces[scope.selectedIndex]).toBe(scope.currentWorkspace);
                });
                it("disableResize event should be called", inject(function($rootScope){
                    scope.resize = true;
                    childScope.$emit('disableResize');
                    expect(scope.resize).toBe(false);
                }));
                it("activateResize event should be called", function(){
                    scope.resize = false;
                    childScope.$emit('activateResize');
                    expect(scope.resize).toBe(true);
                });
            });
        });
    });
});