'use strict';

describe("uiModule", function(){
    beforeEach(module('uiModule'));
    describe("services", function() {
        describe("boxUtils", function() {
            var boxTypes,window,utils,workspace;
            beforeEach(function () {
                boxTypes = [{id:1, name:'erez',form:"form1",html:"html1"},
                            {id:2, name:'moshe',form:"form2",html:"html2"}];
                window = {innerWidth:1920,innerHeight:775};
                workspace = {rows:4,cols:6};
                module(function ($provide) {
                    $provide.constant('BOX_TYPES', boxTypes);
                    $provide.value('$window', window);
                });
            });
            beforeEach(inject(function (boxUtils) {
                utils = boxUtils;
                utils.setHeaderHeight(75);
                utils.setBoxSize(workspace);
            }));
            describe("setBoxSize", function() {
                it("should initiate properties correctly", function(){
                    expect(utils.rows).toEqual(4);
                    expect(utils.cols).toEqual(6);
                    expect(utils.width).toEqual(316);
                    expect(utils.height).toEqual(170);
                });
            });
            describe("switchBoxes", function() {
                var boxes,boxId,droppedBoxId;
                beforeEach(function () {
                    boxes = [{id:0,location:[0,0],firstLocation:[0,0],typeId:3},
                             {id:1,location:[0,1],firstLocation:[0,1],typeId:4}];
                    boxId = 0;
                    droppedBoxId = 1;
                });
                it("should switch between boxes", function () {
                    utils.switchBoxes(boxes,boxId,droppedBoxId);
                    expect(boxes[0].id).toEqual(0);
                    expect(boxes[0].location).toEqual([0,0]);
                    expect(boxes[0].firstLocation).toEqual([0,0]);
                    expect(boxes[0].typeId).toEqual(4);
                    expect(boxes[1].id).toEqual(1);
                    expect(boxes[1].location).toEqual([0,1]);
                    expect(boxes[1].firstLocation).toEqual([0,1]);
                    expect(boxes[1].typeId).toEqual(3);
                });

            });
            describe("getTemplateByTypeId", function() {
                it("should return the correct form", function () {
                    var result = utils.getTemplateByTypeId(1,true);
                    expect(result).toEqual("form1");
                });
                it("should return the correct html", function () {
                    var result = utils.getTemplateByTypeId(2,false);
                    expect(result).toEqual("html2");
                });
            });
            describe("isInArea", function() {
                var borders;
                beforeEach(function () {
                    borders = {top:350,left:500,bottom:500,right:1000};
                });
                it("should be outside - up", function () {
                    var box = {id:0,location:[0,0],size:[1,4],firstLocation:[0,0]};
                    var result = utils.isInArea(box,borders);
                    expect(result).toBe(false);
                });
                it("should be outside - down", function () {
                    var box = {id:0,location:[3,0],size:[1,4],firstLocation:[3,0]};
                    var result = utils.isInArea(box,borders);
                    expect(result).toBe(false);
                });
                it("should be outside - left", function () {
                    var box = {id:0,location:[0,0],size:[4,1],firstLocation:[0,0]};
                    var result = utils.isInArea(box,borders);
                    expect(result).toBe(false);
                });
                it("should be outside - right", function () {
                    var box = {id:0,location:[0,4],size:[4,1],firstLocation:[0,4]};
                    var result = utils.isInArea(box,borders);
                    expect(result).toBe(false);
                });
                it("should be inside", function () {
                    var box = {id:0,location:[2,2],size:[1,1],firstLocation:[2,2]};
                    var result = utils.isInArea(box,borders);
                    expect(result).toBe(true);
                });
            });
           describe("getMaxLocation", function() {
                var box;
                beforeEach(function () {
                    box = {id:0,location:[1,2],firstLocation:[1,2],size:[3,2]};
                });
                it("should return max row and max col", function () {
                    var result = utils.getMaxLocation(box);
                    expect(result).toEqual([3,3.]);
                });
            });
            describe("deleteBox", function() {
                var boxes,result;
                beforeEach(function () {
                    boxes = [{id:0,location:[0,0],firstLocation:[0,0],typeId:3,isSet:true},
                        {id:1,location:[0,1],firstLocation:[0,1],typeId:4,isSet:false}];
                    result = utils.deleteBox(boxes,1);
                });
                it("typeId should be removed", function () {
                    expect(boxes[1].typeId).toBeUndefined();
                });
                it("isSet should be removed", function () {
                    expect(boxes[1].isSet).toBeUndefined();
                });
            });
            describe("collapseBox", function() {
                var boxes,result;
                beforeEach(function () {
                    boxes = [{id:0,location:[0,2],firstLocation:[0,3],size:[1,2],isSet:true},
                        {id:1,location:[0,2],firstLocation:[0,2],size:[1,1],hidden:true,underBox:0,isSet:false}];
                    result = utils.collapseBox(boxes,0);
                });
                it("hidden should be removed", function () {
                    expect(boxes[1].hidden).toBe(false);
                });
                it("underBox should be removed", function () {
                    expect(boxes[1].underBox).toEqual("");
                });
                it("location should be firstLocation", function () {
                    expect(boxes[0].location).toEqual([0,3]);
                });
                it("size should be [1.1]", function () {
                    expect(boxes[0].size).toEqual([1,1]);
                });
            });
            describe("checkOverlap", function() {
                describe("checkOverlap - success", function() {
                    var boxes, borders, result, chosenId;
                    beforeEach(function () {
                        boxes = [
                            {firstLocation: [0, 0], location: [0, 0], size: [1, 1], id: 0},
                            {firstLocation: [0, 1], location: [0, 1], size: [1, 1], id: 1},
                            {firstLocation: [0, 2], location: [0, 2], size: [1, 1], id: 2},
                            {firstLocation: [1, 0], location: [1, 0], size: [1, 1], id: 3},
                            {firstLocation: [1, 1], location: [1, 1], size: [1, 1], id: 4, hidden: true, underBox: 8},
                            {firstLocation: [1, 2], location: [1, 2], size: [1, 1], id: 5, hidden: true, underBox: 8},
                            {firstLocation: [2, 0], location: [2, 0], size: [1, 1], id: 6},
                            {firstLocation: [2, 1], location: [2, 1], size: [1, 1], id: 7, hidden: true, underBox: 8},
                            {firstLocation: [2, 2], location: [1, 1], size: [2, 2], id: 8, isSet: true, formData: {}, typeId: "3"}
                        ];
                        borders = {top: 250, left: 500, bottom: 350, right: 800};
                        chosenId = 8;
                        workspace = {rows: 3, cols: 3};
                        utils.setBoxSize(workspace);
                        result = utils.checkOverlap(boxes, borders, chosenId, true);
                    });
                    it("hidden should be in all boxes except of the chosen box", function () {
                        var flag = true;
                        for (var key in result) {
                            if (key != chosenId) {
                                flag = flag && result[key].hidden;
                            }
                        }
                        expect(flag).toBe(true);
                        expect(result[chosenId].hidden).not.toBeDefined();
                    });
                    it("underBox should be the chosenId in all boxes except of the chosen box", function () {
                        for (var key in result) {
                            if (key != chosenId) {
                                expect(result[key].underBox).toBe(chosenId);
                            }
                        }
                        expect(result[chosenId].underBox).not.toBeDefined();
                    });
                    it("overlap should be false in all boxes", function () {
                        var flag = false;
                        for (var key in result) {
                            if (key != chosenId) {
                                flag = flag || result[key].overlap;
                            }
                        }
                        expect(flag).toBe(false);
                    });
                    it("loacation of chosen box should be [0,0]", function () {
                        expect(result[chosenId].location).toEqual([0, 0]);
                    });
                    it("size of chosen box should be [3,3]", function () {
                        expect(result[chosenId].size).toEqual([3, 3]);
                    });
                });
                describe("checkOverlap - failure inside borders", function() {
                    var boxes, borders, result, chosenId;
                    beforeEach(function () {
                        boxes = [
                            {firstLocation: [0, 0], location: [0, 0], size: [1, 1], id: 0},
                            {firstLocation: [0, 1], location: [0, 1], size: [1, 1], id: 1},
                            {firstLocation: [0, 2], location: [0, 2], size: [1, 1], id: 2},
                            {firstLocation: [1, 0], location: [1, 0], size: [1, 1], id: 3, hidden: true, underBox: 6},
                            {firstLocation: [1, 1], location: [1, 1], size: [1, 1], id: 4, hidden: true, underBox: 8},
                            {firstLocation: [1, 2], location: [1, 2], size: [1, 1], id: 5, hidden: true, underBox: 8},
                            {firstLocation: [2, 0], location: [2, 0], size: [1, 1], id: 6, isSet: true, formData: {}, typeId: "4"},
                            {firstLocation: [2, 1], location: [2, 1], size: [1, 1], id: 7, hidden: true, underBox: 8},
                            {firstLocation: [2, 2], location: [1, 1], size: [2, 2], id: 8, isSet: true, formData: {}, typeId: "3"}
                        ];
                        borders = {top: 250, left: 500, bottom: 350, right: 800};
                        chosenId = 8;
                        workspace = {rows: 3, cols: 3};
                        utils.setBoxSize(workspace);
                    });
                    it("result should be null - mouseup", function () {
                        result = utils.checkOverlap(boxes, borders, chosenId, true);
                        expect(result).toBe(null);
                    });
                    it("result should be null - onmove", function () {
                        result = utils.checkOverlap(boxes, borders, chosenId, false);
                        expect(result).toBe(null);
                    });
                    it("overlap should be true - onmove", function () {
                        result = utils.checkOverlap(boxes, borders, chosenId, false);
                        expect(boxes[6].overlap).toBe(true);
                    });
                });
                describe("checkOverlap - failure outside borders", function() {
                    var boxes, borders, result, chosenId;
                    beforeEach(function () {
                        boxes = [
                            {firstLocation: [0, 0], location: [0, 0], size: [1, 1], id: 0},
                            {firstLocation: [0, 1], location: [0, 1], size: [1, 1], id: 1},
                            {firstLocation: [0, 2], location: [0, 2], size: [1, 1], id: 2, isSet: true, formData: {}, typeId: "2"},
                            {firstLocation: [1, 0], location: [1, 0], size: [1, 1], id: 3},
                            {firstLocation: [1, 1], location: [1, 1], size: [1, 1], id: 4, hidden: true, underBox: 8},
                            {firstLocation: [1, 2], location: [1, 2], size: [1, 1], id: 5, hidden: true, underBox: 8},
                            {firstLocation: [2, 0], location: [2, 0], size: [1, 1], id: 6},
                            {firstLocation: [2, 1], location: [2, 1], size: [1, 1], id: 7, hidden: true, underBox: 8},
                            {firstLocation: [2, 2], location: [1, 1], size: [2, 2], id: 8, isSet: true, formData: {}, typeId: "3"}
                        ];
                        borders = {top: 250, left: 500, bottom: 350, right: 800};
                        chosenId = 8;
                        workspace = {rows: 3, cols: 3};
                        utils.setBoxSize(workspace);
                    });
                    it("result should be null - mouseup", function () {
                        result = utils.checkOverlap(boxes, borders, chosenId, true);
                        expect(result).toBe(null);
                    });
                    it("result should be null - onmove", function () {
                        result = utils.checkOverlap(boxes, borders, chosenId, false);
                        expect(result).toBe(null);
                    });
                    it("overlap should be true - onmove", function () {
                        result = utils.checkOverlap(boxes, borders, chosenId, false);
                        expect(boxes[2].overlap).toBe(true);
                    });
                });
            });
        });
    });
});