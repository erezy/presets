var configModule = angular.module('configModule',['ngAnimate', 'mgcrea.ngStrap']);
configModule.constant('WORKSPACE_SIZE', { row:4,col:5,size:20 } );
configModule.constant('BOX_TYPES',  [{id:'1', name:'דף אינטרנט'},
                                    {id:'2', name:'קובץ'},
                                    {id:'3', name:'מצב עבודה'},
                                    {id:'4', name:'מפה'}]
                        );
configModule.filter('boxType',function(BOX_TYPES){
    return function(typeId){
                for(key in BOX_TYPES){
                    var type = BOX_TYPES[key];
                    if(type.id){
                        if(type.id == typeId){
                            return type.name;
                        }
                    }
                }
                return "";
            }

});
configModule.service('boxUtils',function($window,WORKSPACE_SIZE,BOX_TYPES){
    this.width = Math.floor($window.innerWidth/WORKSPACE_SIZE.col) - WORKSPACE_SIZE.col*2;
    this.height = Math.floor(($window.innerHeight-45)/WORKSPACE_SIZE.row) - WORKSPACE_SIZE.col*2;
    this.headerHeight = 0;
    this.getHeaderHeight = function(){
        if(this.headerHeight == 0){
            this.headerHeight = angular.element( document.querySelector( '.controlPanel' ) )[0].clientHeight;
        }
        return this.headerHeight;
    };
    this.getBoxTypes = function(){
        return BOX_TYPES;
    };
    this.isInArea = function(box,borders){
        var top = box.location[0]*(this.height+1)+this.getHeaderHeight();
        var left = box.location[1]*(this.width+1)+15;
        var bottom = top + box.size[0]*this.height;
        var right = left + box.size[1]*this.width;
        if(top >= borders.bottom || left >= borders.right || right <= borders.left || bottom <= borders.top){
            return false;
        }
        return true;
    };
    this.getNewBoxArray = function(boxes,borders,chosenId){
        var maxRow = 0, maxCol = 0,minRow = WORKSPACE_SIZE.row, minCol = WORKSPACE_SIZE.col;
        var box;
        for (var i = 0; i < boxes.length; i++) {
            box = boxes[i];
            if (this.isInArea(box, borders)) {
                if (box.id != chosenId) {
                    if (box.isSet || (box.hidden && box.underBox != chosenId)) {
                        return null;
                    }
                }
                maxLocation = this.getMaxLocation(box);
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
                box = boxes[row*WORKSPACE_SIZE.col+col];
                if(box.id != chosenId){
                    box.hidden = true;
                    box.underBox = chosenId;
                }
            }
        }
        var chosenBox = boxes[chosenId];
        chosenBox.location = [minRow,minCol];
        chosenBox.size = [maxRow-minRow+1,maxCol-minCol+1];
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
        delete box.url;
        delete box.type;
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
configModule.config(function($datepickerProvider) {
    var tomorrow = new Date();
    angular.extend($datepickerProvider.defaults, {
        dateFormat: 'dd/MM/yyyy',
        minDate: tomorrow
    });
})
configModule.config(function($modalProvider) {
    angular.extend($modalProvider.defaults, {
        animation: 'am-fade-and-scale',
        backdrop:'static'
    });
})

configModule.factory('storage',function(){
    setObject = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    getObject = function(key) {
        var value = localStorage.getItem(key);
        return value && JSON.parse(value);
    };
    return{
        setObj: setObject,
        getObj: getObject
    }
});
