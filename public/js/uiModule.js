var uiModule = angular.module('uiModule',['configModule','ang-drag-drop']);


uiModule.directive('workspace',function($compile,boxUtils){
    var buildViewWorkspace = function(scope,element){
        var workspace = scope.currWorkspace;
        if(workspace.boxes) {
            var boxes = workspace.boxes;
            var childScope,box;
            for (var i = 0; i < boxes.length; i++) {
                box = boxes[i];
                if(box.isSet) {
                    childScope = scope.$new();
                    childScope.wsData = workspace.data;
                    childScope.box = box;
                    childScope.templ = boxUtils.getTemplateByTypeId(box.type,false);
                    element.append($compile('<box class="box" />')(childScope));
                }
            }
        }
    };
    var buildEditWorkspace = function(scope,element){
        var workspace = scope.currWorkspace;
        if(workspace.boxes) {
            var boxes = workspace.boxes;
            var childScope,box;
            for (var i = 0; i < boxes.length; i++) {
                box = boxes[i];
                if(!box.hidden) {
                    childScope = scope.$new();
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
            this.chosenId = null;
            $scope.$on('setTheChosenOne',function(event,chosenId){
                event.stopPropagation();
                this.chosenId = chosenId;
            });
            $scope.$on('dragBox',function(event,boxId,droppedBoxId){
                event.stopPropagation();
                var boxes = $scope.currWorkspace.boxes;
                boxUtils.switchBoxes(boxes,boxId,droppedBoxId);
                console.log("dragBox",boxes);
                $scope.$emit('updateWorkspace',boxes);
            });
            $scope.$on('expendBox',function(event,borders){
                event.stopPropagation();
                var boxes = $scope.currWorkspace.boxes;
                var result = boxUtils.getNewBoxArray(boxes,borders,this.chosenId);
                if(result == null){
                    alert("אזור חופף");
                }else{
                    $scope.$emit('updateWorkspace',boxes);
                }
                this.chosenId = null;
            });
            $scope.$on('deleteBox',function(event,boxId) {
                event.stopPropagation();
                var boxes = $scope.currWorkspace.boxes;
                boxUtils.deleteBox(boxes,boxId);
                $scope.$emit('updateWorkspace',boxes);
            });
            $scope.$on('collapseBox',function(event,boxId) {
                event.stopPropagation();
                var boxes = $scope.currWorkspace.boxes;
                boxUtils.collapseBox(boxes,boxId);
                $scope.$emit('updateWorkspace',boxes);
            });

        },
        link: function link(scope,element, attrs) {
            scope.$watchGroup(['currWorkspace','isEdit'],function() {
                console.log("link",scope.isEdit);
                element.html("");
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
                   $timeout(function (){ var viewer = new Cesium.Viewer('cesiumContainer');console.log(viewer);},100);

               }
           });

           var box = scope.box;
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
           if(box.size[0] > 1 || box.size[1] > 1){
               scope.resize = true;
               scope.draggable = false;
           }

        },
        controller: function ($scope,$timeout,$sce) {
            $scope.getSrc = function(){
                return $sce.trustAsResourceUrl($scope.box.formData.url);
            }
            $scope.collapseBox = function(){
                $scope.$emit('collapseBox',$scope.box.id);
            }
            $scope.deleteBox = function(){
                $scope.$emit('deleteBox',$scope.box.id);
            }

            $scope.onDrop = function($event,droppedBox){
                console.log("onDrop",$event,droppedBox);
                var box = $scope.box;
                if(box.size[0] > 1 || box.size[1] > 1) {
                    alert("לא ניתן להעביר אריחים גדולים");
                    return false;
                }
                $scope.$emit('dragBox',box.id,droppedBox.id);
            };

            $scope.$on('editStart', function(event) {
                event.stopPropagation();
                var box = $scope.box;
                if(box.isSet){
                    $timeout(function(){$scope.$broadcast('initBox',box)},500);
                }
             });
            $scope.$on('editSave', function(event,form) {
                event.stopPropagation();
               var box = $scope.box;
                $scope.templ = "activeBox";
                box.isSet = true;
                box.formData = form.data;
                box.type = form.selectedBoxType;

            });
            $scope.$on('theChosenOne', function(event) {
                event.stopPropagation();
                var box = $scope.box;
                $scope.$emit('setTheChosenOne',box.id);
            });
        },
        templateUrl: 'templates/box.html'
    }
});

uiModule.controller('editBoxCtrl',function($scope,boxUtils){
    $scope.boxTypes = boxUtils.getBoxTypes();
   $scope.title = "חלון עבודה" ;
    $scope.$watch("formTempl",function(templ){
        $scope.contentUrl = "";
        if(templ) {
            $scope.contentUrl = 'templates/forms/' + templ + '.html';
        }
    });
    $scope.$emit('editStart');

    var unbind = $scope.$on('initBox',function(event,box){
        $scope.formTempl = boxUtils.getTemplateByTypeId(box.type,true);
        $scope.editForm.selectedBoxType = box.type;
        $scope.editForm.data = box.formData;
    });
    $scope.$on('$destroy',unbind);
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
                        backgroundColor: 'rgba(0,0,0,.5)',
                        margin:'0px',
                        width: '1px',
                        height: '1px',
                        position: 'fixed',
                        top: startY+'px',
                        left: startX+'px'
                    });
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                    scope.$emit('theChosenOne');
                });

                function mousemove(event) {
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
                                backgroundColor: 'rgba(0,0,0,0)',
                                position: 'absolute',
                                marginTop: '-26px',
                                marginLeft: '-12px',
                                top: 'initial',
                                left: 'initial',
                                zIndex:'1000'
                            };
                    element.css(styles);
                }
            }
    }]);
