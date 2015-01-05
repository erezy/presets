
'use strict';

describe("serverModule", function(){
    beforeEach(module('serverModule'));
    describe("services", function() {
        var $httpBackend,service,call;
        beforeEach(inject(function(workspaceServices,_$httpBackend_){
            $httpBackend = _$httpBackend_;
            service = workspaceServices;
            call = {
                callback: function() {}
            };
            spyOn(call,'callback');
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe("workspaceServices", function() {
            describe("getAllWorkspaces", function() {
                it("should call the GET http request with callback function",function(){
                    $httpBackend.expectGET('api/workspaces').respond({});
                    service.getAllWorkspaces(call.callback);
                    $httpBackend.flush();
                    expect(call.callback).toHaveBeenCalled();
                });
            });
            describe("getLastWorkspace", function() {
                var workspaces;
                beforeEach(function (){
                    workspaces = [];
                    for(var i = 0;i < 10;i++){
                        workspaces.push({id:i});
                    }
                });
                it("should get the last workspace from storage", inject(function (storage) {
                    spyOn(storage,'getObj').and.returnValue({name:"erez", id:2});
                    var ws = service.getLastWorkspace(workspaces);
                    expect(ws.id).toBe(2);
                }));
                it("should get the first workspace from server", inject(function (storage) {
                    spyOn(storage,'getObj').and.returnValue({});
                    var ws = service.getLastWorkspace(workspaces);
                    expect(ws.id).toBe(0);
                }));
                it("should get no workspace", inject(function (storage) {
                    workspaces = [];
                    var ws = service.getLastWorkspace(workspaces);
                    expect(ws).toEqual({});
                }));
            });
            describe("addWorkspace", function() {
                var workspaces;
                beforeEach(inject(function (storage) {
                    spyOn(storage,'setObj');
                    workspaces = [];
                    for(var i = 0;i < 10;i++){
                        workspaces.push({id:i,expired: new Date()});
                    }
                }));
                it("should call addWorkspace success", inject(function (storage) {
                    $httpBackend.expectPOST('api/workspaces',workspaces[0]).respond({});
                    service.addWorkspace(call.callback,workspaces[0],workspaces);
                    expect(storage.setObj).toHaveBeenCalledWith('lastWorkspaceObject',workspaces[0]);
                    expect(storage.setObj).toHaveBeenCalledWith('lastWorkspaces',workspaces);
                    expect(typeof workspaces[0].expired).toBe('number');
                    $httpBackend.flush();
                    expect(call.callback).toHaveBeenCalled();
                }));
                it("should call addWorkspace failed", inject(function (storage) {
                    $httpBackend.expectPOST('api/workspaces',workspaces[0]).respond(401);
                    service.addWorkspace(call.callback,workspaces[0],workspaces);
                    $httpBackend.flush();
                    expect(call.callback).not.toHaveBeenCalled();
                }));
            });
            describe("updateWorkspace", function() {
                var workspace;
                beforeEach(inject(function (storage) {
                    workspace = {id:0,expired: new Date()};
                }));
                it("should call addWorkspace success", inject(function (storage) {
                    $httpBackend.expectPUT('api/workspaces',workspace).respond({});
                    service.updateWorkspace(call.callback,workspace);
                    expect(typeof workspace.expired).toBe('number');
                    $httpBackend.flush();
                    expect(call.callback).toHaveBeenCalled();
                }));
                it("should call addWorkspace failed", inject(function (storage) {
                    $httpBackend.expectPUT('api/workspaces',workspace).respond(401);
                    service.updateWorkspace(call.callback,workspace);
                    $httpBackend.flush();
                    expect(call.callback).not.toHaveBeenCalled();
                }));
            });
            describe("changeWorkspace", function() {
                var workspace;
                beforeEach(inject(function (storage) {
                    spyOn(storage,'setObj');
                    workspace = {id:0,expired: new Date()};
                }));
                it("should call storage.setObj in changeWorkspace", inject(function (storage) {
                    service.changeWorkspace(workspace);
                    expect(storage.setObj).toHaveBeenCalledWith('lastWorkspaceObject',workspace);
                }));
            });
        });
    });
});