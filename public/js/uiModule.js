var uiModule = angular.module('uiModule',['configModule','ang-drag-drop']);


uiModule.directive('workspace',function($compile,boxUtils){
    var buildWorkspace = function(scope,element){
        var workspace = scope.currWorkspace;
        if(workspace && workspace.tiles) {
            var boxes = workspace.tiles;
            var childScope,box;
            var className = "box";
            if(scope.isEdit == "true"){
                className += " flipper";
            }
            for (var i = 0; i < boxes.length; i++) {
                box = boxes[i];
                if(!box.hidden) {
                    childScope = scope.mainScope.$new();
                    childScope.box = box;
                    element.append($compile('<box class="'+className+'" />')(childScope));
                }
            }
        }
    };

    return {
        restrict: 'E',
        scope: {
            currWorkspace:'=',
            isEdit:'@type'
        },
        controller: function ($scope) {
            $scope.maps = [];
            this.chosenId = null;
            $scope.dragBox = function(boxId,droppedBoxId){
                var boxes = $scope.currWorkspace.tiles;
                boxUtils.switchBoxes(boxes,boxId,droppedBoxId);
                $scope.$emit('updateWorkspace');
            };
             $scope.collapseBox = function(boxId){
                var boxes = $scope.currWorkspace.tiles;
                boxUtils.collapseBox(boxes,boxId);
                $scope.$emit('updateWorkspace');
            };
            $scope.deleteBox = function(boxId){
               var boxes = $scope.currWorkspace.tiles;
               boxUtils.deleteBox(boxes,boxId);
               var box, isOneSet = false;
               for (var i = 0; i < boxes.length && !isOneSet; i++) {
                   box = boxes[i];
                   if(box.isSet){
                       isOneSet = true;
                   }
               }
               if(!isOneSet){
                    $scope.$emit('activateResize');
               }
               $scope.$emit('updateWorkspace');
            };

            $scope.$on('setTheChosenOne',function(event,chosenId){
                event.stopPropagation();
                this.chosenId = chosenId;
            });
            $scope.$on('expendBox',function(event,borders){
                event.stopPropagation();
                var boxes = $scope.currWorkspace.tiles;
                 var result = boxUtils.getNewBoxArray(boxes,borders,this.chosenId);
                  if(result != null){
                     $scope.$emit('updateWorkspace');
                  }
                this.chosenId = null;
            });
            $scope.$on('checkOverlap',function(event,borders){
                event.stopPropagation();
                var boxes = $scope.currWorkspace.tiles;
                $scope.$apply(function(){boxUtils.checkOverlap(boxes,borders,this.chosenId,false);});
            });

        },
        link: function (scope,element, attrs) {
            scope.$watchGroup(['currWorkspace'],function() {
                if(scope.currWorkspace){
                    boxUtils.setBoxSize(scope.currWorkspace);
                }
                if(scope.mainScope){
                    scope.mainScope.$destroy();
                }
                element.html("");
                scope.mainScope = scope.$new();
                buildWorkspace(scope,element);
            });

        }
    }
});






uiModule.directive('box',function(boxUtils,$timeout){
    return {
        require: '^workspace',
        restrict: 'E',
       link: function(scope, element, attrs, tabsCtrl) {
           scope.changeTemplate();
           scope.$on('animateBox',function(event){
                element.addClass("flipper");
                element.removeClass("flipper-leave");
           });
           scope.$on('animateLeaveBox',function(event){
               element.addClass("flipper-leave");
               element.removeClass("flipper");
           });

           var box = scope.box;
           box.overlap = false;
           var width = box.size[1]*boxUtils.width;
           var height = box.size[0]*boxUtils.height;
           var top = box.location[0]*(boxUtils.height+1);
           var left = box.location[1]*(boxUtils.width+1);
           var styles = {
               "width" : width+"px",
               "height": height+"px",
               "top":top+"px",
               "left":left+"px"
           };
           element.css(styles);
           scope.dropChannel = "active";
           if(box.size[0] > 1 || box.size[1] > 1){
               scope.collapse = true;
               scope.draggable = false;
               scope.dropChannel = "notActive";
           }
           scope.$on('$destroy',function(){
                var mapView = scope.maps[scope.box.id];
                if(mapView && !mapView.isDestroyed()){
                    scope.maps[scope.box.id].destroy();
                    scope.maps[scope.box.id] = null;
                }
           });
        },
        controller: function ($scope,$sce) {
            $scope.changeTemplate = function(){
               var box = $scope.box;
               if(box.isSet){
                    var templ =  boxUtils.getTemplateByTypeId(box.typeId,false);
                    $scope.viewContentUrl ='templates/' + templ + '.html';
                    if(templ == "types/map" && !$scope.maps[box.id]){
                        $timeout(function (){ $scope.maps[box.id] = new Cesium.Viewer('cesiumContainer'+box.id);},100);
                    }
                    $scope.editContentUrl ='templates/activeBox.html';
                    $scope.draggable = true;
               }else{
                    $scope.viewContentUrl = '';
                    $scope.editContentUrl ='templates/inactiveBox.html';
                    $scope.draggable = false;
               }
            };
            $scope.getSrc = function(){
                if($scope.box.typeId == 1){
                    return $sce.trustAsResourceUrl($scope.box.formData.url);
                }else{
                    return $sce.trustAsResourceUrl($scope.box.formData.path);
                }

            };
            $scope.onDrop = function($event,droppedBox){
               $scope.dragBox($scope.box.id,droppedBox.id);
            };

           $scope.editSave = function(form){
                $scope.$emit('disableResize');
                var box = $scope.box;
                box.isSet = true;
                box.formData = form.data;
                box.typeId = form.selectedBoxType;
                if(box.size[0] == 1 && box.size[1] == 1){
                    $scope.draggable = true;
                }
                $scope.changeTemplate();
            };

        },
        templateUrl: 'templates/box.html'
    }
});






uiModule.controller('EditBoxController',function($scope,boxUtils,$timeout){
    $scope.boxTypes = boxUtils.getBoxTypes();
   $scope.title = "חלון עבודה" ;
    $scope.$watch("formTempl",function(templ){
        $scope.contentUrl = "";
        if(templ) {
            $scope.contentUrl = 'templates/forms/' + templ + '.html';
        }
    });

    var initBox = function(box){
        $scope.formTempl = boxUtils.getTemplateByTypeId(box.typeId,true);
        $scope.editForm.selectedBoxType = box.typeId ? $scope.boxTypes[box.typeId-1].id : "";
        $scope.editForm.data = box.formData;
    };
    $timeout(function(){initBox($scope.box)},500);

    $scope.changeForm = function(){
        $scope.editForm.data = {};
        $scope.formTempl = boxUtils.getTemplateByTypeId($scope.editForm.selectedBoxType,true);

    };
    $scope.save = function(){
        $scope.editSave($scope.editForm);
        $scope.$hide();
        $scope.$destroy();
    };
    $scope.close = function(){
        $scope.editForm = {};
        $scope.$hide();
        $scope.$destroy();
    };

});






uiModule.directive('expended', ['$document', function($document) {
        var getParentElement = function(element,className){
                                    if(element){
                                        if(element.hasClass(className)){
                                            return element;
                                        }
                                        return getParentElement(element.parent(),className);
                                    }
                                    return null;
                                };
        return function (scope, element, attr) {
                var startX = 0, startY = 0, x = 0, y = 0, styles = {};
                var offsetY = 16, offsetX = 22;
                element.on('mousedown', function (event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    startY = event.pageY;
                    startX = event.pageX;
                    element.css({
                        opacity: '0.5',
                        margin:'0px',
                        width: '1px',
                        height: '1px',
                        position: 'absolute',
                        top: startY + 'px',
                        left: startX + 'px'
                    });
                    angular.element(document.querySelector( 'workspace' )).removeClass("nohover");
                    getParentElement(element,"options").addClass("onselect");
                    getParentElement(element,"box").addClass("topBox");

                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                    scope.$emit('setTheChosenOne',scope.box.id);
                });

                function mousemove(event) {
                event.preventDefault();
                    y = event.pageY - startY;
                    x = event.pageX - startX;
                    if(y > 0){
                        y1 = y;
                        y = offsetY;
                    }else{
                        y1 = -y;
                        y += offsetY;
                    }
                    if(x > 0){
                        x1 = x;
                        x = offsetX;
                    }else{
                        x1 = -x;
                        x += offsetX;
                    }

                    styles = {
                        top: y + 'px',
                        left: x + 'px',
                        width: x1 + 'px',
                        height: y1 + 'px'
                    };
                    element.css(styles);

                    var top = startY + y - offsetY;
                    var left = startX + x - offsetX;
                    var bottom = top + element[0].clientHeight;
                    var right = left + element[0].clientWidth;
                    var borders = {top:top,left:left,bottom:bottom,right:right};
                    scope.$emit('checkOverlap',borders);
                }

                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    var top = startY + y - offsetY;
                    var left = startX + x - offsetX;
                    var bottom = top + element[0].clientHeight;
                    var right = left + element[0].clientWidth;
                    var borders = {top:top,left:left,bottom:bottom,right:right};
                    scope.$emit('expendBox',borders);
                    var styles =  {
                                width: '100%',
                                height: '100%',
                                opacity:'0',
                                position: 'absolute',
                                marginTop: '-30px',
                                marginLeft: '-12px',
                                top: 'initial',
                                left: 'initial',
                                zIndex:'20'
                            };
                    element.css(styles);
                    angular.element(document.querySelector( 'workspace' )).addClass("nohover");
                    getParentElement(element,"options").removeClass("onselect");
                    getParentElement(element,"box").removeClass("topBox");
                }
            }
    }]);
