
uiModule.service('boxUtils',function($window,BOX_TYPES){
    this.width = 0;
    this.height = 0;
    this.cols = 0;
    this.rows = 0;
    this.headerHeight = 0;
    this.setHeaderHeight = function(height){
        this.headerHeight = height;
    };
    this.setBoxSize = function(workspace){
        this.cols = workspace.cols;
        this.rows = workspace.rows;
        this.width = Math.floor($window.innerWidth/this.cols) - 24/this.cols;
        this.height = Math.floor(($window.innerHeight-45)/this.rows) - 48/this.rows;
        //console.log("wh",this.width,this.height,this.headerHeight,$window.innerWidth,$window.innerHeight);
    };
    this.getBoxTypes = function(){
        return BOX_TYPES;
    };
    this.switchBoxes = function(boxes,boxId,droppedBoxId){
        var dest = boxes[boxId];
        var origin = boxes[droppedBoxId];
        dest.id = droppedBoxId;
        origin.id = boxId;
        dest.location = origin.location;
        origin.location = dest.firstLocation;
        dest.firstLocation = dest.location;
        origin.firstLocation = origin.location;
        boxes[droppedBoxId] = dest;
        boxes[boxId] = origin;
    }
    this.getTemplateByTypeId = function(typeId,isForm){
        for (key in BOX_TYPES){
            if(BOX_TYPES[key].id == typeId){
                if(isForm) {
                    return BOX_TYPES[key].form;
                }else{
                    return BOX_TYPES[key].html;
                }
            }
        }
        return "";
    };
    this.isInArea = function(box,borders){
        var top = box.location[0]*(this.height+1)+this.headerHeight;
        var left = box.location[1]*(this.width+1)+15;
        var bottom = top + box.size[0]*this.height;
        var right = left + box.size[1]*this.width;
        if(top >= borders.bottom || left >= borders.right || right <= borders.left || bottom <= borders.top){
            return false;
        }
        return true;
    };
    this.getNewBoxArray = function(boxes,borders,chosenId){
        return this.checkOverlap(boxes,borders,chosenId,true);
    };
    this.checkOverlap = function(boxes,borders,chosenId,mouseUp){
        var maxRow = 0, maxCol = 0,minRow = this.rows, minCol = this.cols;
        var box;
        for (var i = 0; i < boxes.length; i++) {
                    box = boxes[i];
                    box.overlap = false;
        }
        for (var i = 0; i < boxes.length; i++) {
            box = boxes[i];
            if (this.isInArea(box, borders)) {
                if (box.id != chosenId) {
                    if (box.isSet || (box.hidden && box.underBox != chosenId)) {
                        if(!mouseUp) {
                           if(box.hidden){
                               box = boxes[box.underBox];
                           }
                           box.overlap = true;
                        }
                        return null;
                    }
                }
                var maxLocation = this.getMaxLocation(box);
                if(box.location[0] < minRow){
                    minRow = box.location[0];
                }
                if(maxLocation[0] > maxRow){
                    maxRow = maxLocation[0];
                }
                if(box.location[1] < minCol){
                    minCol = box.location[1];
                }
                if(maxLocation[1] > maxCol){
                    maxCol = maxLocation[1];
                }
            }
        }
        for (var row = minRow; row <= maxRow; row++) {
            for (var col = minCol; col <= maxCol; col++) {
                box = boxes[row*this.cols+col];
                if ((box.isSet && box.id != chosenId) || (box.hidden && box.underBox != chosenId)) {
                    if(!mouseUp) {
                        if(box.hidden){
                           box = boxes[box.underBox];
                        }
                        box.overlap = true;
                    }
                    return null;
                }
            }
        }
        if(mouseUp){
            for (var row = minRow; row <= maxRow; row++) {
                for (var col = minCol; col <= maxCol; col++) {
                    box = boxes[row*this.cols+col];
                    if(box.id != chosenId && mouseUp){
                        box.hidden = true;
                        box.underBox = chosenId;
                    }
                }
            }
            var chosenBox = boxes[chosenId];
            chosenBox.location = [minRow,minCol];
            chosenBox.size = [maxRow-minRow+1,maxCol-minCol+1];
        }
        return boxes;
    };
    this.getMaxLocation = function(box){
        var maxRow = box.location[0]+box.size[0]-1;
        var maxCol = box.location[1]+box.size[1]-1;
        return [maxRow,maxCol];
    };
    this.deleteBox = function(boxes,boxId){
        this.collapseBox(boxes,boxId);
        var box = boxes[boxId];
        delete box.typeId;
        delete box.isSet;
    };
    this.collapseBox = function(boxes,boxId){
        var box;
        for (var i = 0; i < boxes.length; i++) {
            box = boxes[i];
            if(box.hidden && box.underBox == boxId){
                box.hidden = false;
                box.underBox = "";
            }
        }
        box = boxes[boxId];
        box.location = box.firstLocation;
        box.size = [1,1];
    };
});



