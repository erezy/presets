var uiModule = angular.module('uiModule',['configModule','ang-drag-drop']);


uiModule.directive('workspace',function($compile,boxUtils){
    var buildViewWorkspace = function(scope,element){
        var workspace = scope.currWorkspace;
        if(workspace && workspace.tiles) {
            var boxes = workspace.tiles;
            var childScope,box;
            for (var i = 0; i < boxes.length; i++) {
                box = boxes[i];
                if(box.isSet) {
                    childScope = scope.mainScope.$new();
                    childScope.box = box;
                    childScope.templ = boxUtils.getTemplateByTypeId(box.typeId,false);
                    element.append($compile('<box class="box" />')(childScope));
                }
            }
        }
    };
    var buildEditWorkspace = function(scope,element){
        var workspace = scope.currWorkspace;
        if(workspace.tiles) {
            var boxes = workspace.tiles;
            var childScope,box;
            for (var i = 0; i < boxes.length; i++) {
                box = boxes[i];
                if(!box.hidden) {
                    childScope = scope.mainScope.$new();
                    childScope.box = box;
                    if(box.isSet){
                        childScope.templ = "activeBox";
                        childScope.draggable = true;
                    }else{
                        childScope.templ = "inactiveBox";
                        childScope.draggable = false;
                    }
                    element.append($compile('<box class="box" />')(childScope));
                }
            }
        }
    }
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
                   if(box.is Set){
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
                 $scope.$apply(function(){
                     var result = boxUtils.getNewBoxArray(boxes,borders,this.chosenId);
                     if(result != null){
                        $scope.$emit('updateWorkspace');
                     }
                 });
                this.chosenId = null;
            });
            $scope.$on('checkOverlap',function(event,borders){
                event.stopPropagation();
                var boxes = $scope.currWorkspace.tiles;
                $scope.$apply(function(){boxUtils.checkOverlap(boxes,borders,this.chosenId,false);});
            });

        },
        link: function link(scope,element, attrs) {
            scope.$watchGroup(['currWorkspace','isEdit'],function() {
                if(scope.currWorkspace){
                    boxUtils.setBoxSize(scope.currWorkspace);
                }
                if(scope.mainScope){
                    scope.mainScope.$destroy();
                }
                element.html("");
                scope.mainScope = scope.$new();
                if(scope.isEdit == "true"){
                    buildEditWorkspace(scope,element);
                }else{
                    buildViewWorkspace(scope,element);
                }
            });
        }
    }
});






uiModule.directive('box',function(boxUtils,$timeout){
    return {
        require: '^workspace',
        restrict: 'E',
       link: function(scope, element, attrs, tabsCtrl) {
           scope.contentUrl = 'templates/' + scope.templ + '.html';
           scope.$watch("templ",function(templ){
               scope.contentUrl = 'templates/' + templ + '.html';
               if(templ == "types/map"){
                   $timeout(function (){ scope.maps[scope.box.id] = new Cesium.Viewer('cesiumContainer'+scope.box.id);},100);

               }
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
            $scope.getSrc = function(){
                if($scope.box.typeId == 1){
                    return $sce.trustAsResourceUrl($scope.box.formData.url);
                }else{
                    return $sce.trustAsResourceUrl($scope.box.formData.path);
                }

            }
            $scope.onDrop = function($event,droppedBox){
               $scope.dragBox($scope.box.id,droppedBox.id);
            };

            $scope.$on('editSave', function(event,form) {
                event.stopPropagation();
                $scope.$emit('disableResize');
                var box = $scope.box;
                $scope.templ = "activeBox";
                box.isSet = true;
                box.formData = form.data;
                box.typeId = form.selectedBoxType;
                if(box.size[0] == 1 && box.size[1] == 1){
                  $scope.draggable = true;
                }
            });

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
        $scope.$emit('editSave',$scope.editForm);
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
        return function (scope, element, attr) {
                var startX = 0, startY = 0, x = 0, y = 0, styles = {};

                element.on('mousedown', function (event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    startX = event.pageX;
                    startY = event.pageY;
                    element.css({
                        opacity: '0.5',
                        margin:'0px',
                        width: '1px',
                        height: '1px',
                        position: 'fixed',
                        top: startY+'px',
                        left: startX+'px'
                    });
                    angular.element(document.querySelector( 'workspace' )).removeClass("nohover");
                    angular.element(element).parent().parent().addClass("onselect");

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
                        y = 0;
                    }else{
                        y1 = -y;
                    }
                    if(x > 0){
                        x1 = x;
                        x = 0;
                    }else{
                        x1 = -x;
                    }

                    styles = {
                        top: (startY + y) + 'px',
                        left: (startX + x) + 'px',
                        width: x1 + 'px',
                        height: y1 + 'px'
                    };
                    element.css(styles);
                    var top = startY + y;
                    var left = startX + x;
                    var bottom = top + element[0].clientHeight;
                    var right = left + element[0].clientWidth;
                    var borders = {top:top,left:left,bottom:bottom,right:right};
                    scope.$emit('checkOverlap',borders);
                }

                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    var top = startY + y;
                    var left = startX + x;
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
                                zIndex:'1000'
                            };
                    element.css(styles);
                    angular.element(document.querySelector( 'workspace' )).addClass("nohover");
                    angular.element(element).parent().parent().removeClass("onselect");
                }
            }
    }]);
