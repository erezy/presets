
'use strict';

describe("appModule", function(){
    beforeEach(module('presets'));
    describe("services", function() {
        var service;
        var newWorkspace;
        beforeEach(function(){
            var workspaceSize = {row:4,col:5};
            module(function ($provide) {
                $provide.constant('WORKSPACE_SIZE', workspaceSize);
            });

        });
        beforeEach(inject(function(workspaceProvider){
            service = workspaceProvider;
            newWorkspace = service.getNewWorkspace();
        }));

        describe("workspaceProvider", function() {
            describe("getNewWorkspace", function() {
                it("should be workspace class", function () {
                    expect(newWorkspace.constructor.name).toBe('workspace');
                });
                it("tiles length should be 20", function () {
                    expect(newWorkspace.tiles.length).toEqual(20);
                });
                it("tiles should contain 'box' objects", function () {
                    var flag = true;
                    for (var key in newWorkspace.tiles){
                        flag = flag && (newWorkspace.tiles[key].constructor.name == 'box');
                    }
                    expect(flag).toBe(true);
                });
                it("rows should be 4", function () {
                    expect(newWorkspace.rows).toEqual(4);
                });
                it("cols should be 5", function () {
                    expect(newWorkspace.cols).toEqual(5);
                });
                it("expired should be date", function () {
                    expect(newWorkspace.expired.constructor.name).toBe('Date');
                });
                it("expired should be tomorrow", function () {
                    var today = new Date();
                    var millisecondsPerDay = 1000 * 60 * 60 * 24;
                    var millisBetween = newWorkspace.expired.getTime() - today.getTime();
                    var days = millisBetween / millisecondsPerDay;
                    days = Math.floor(days);
                    expect(days).toBe(1);
                });
            });

            describe("changeWorkspaceSize", function() {
                beforeEach(function() {
                    newWorkspace.rows = 5;
                    newWorkspace.cols = 7;
                    service.changeWorkspaceSize(newWorkspace);
                });
                it("tiles length should be 35", function () {
                    expect(newWorkspace.tiles.length).toEqual(35);
                });
                it("tiles should contain 'box' objects", function () {
                    var flag = true;
                    for (var key in newWorkspace.tiles){
                        flag = flag && (newWorkspace.tiles[key].constructor.name == 'box');
                    }
                    expect(flag).toBe(true);
                });
            });
        });
    });
});