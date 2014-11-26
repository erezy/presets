var uiModule = angular.module('uiModule',['configModule']);


uiModule.directive('workspace',function($compile,boxUtils){
    var buildViewWorkspace = function(scope,element){
        var workspace = scope.currWorkspace;

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
                        childScope.templ = "active";
                    }else{
                        childScope.templ = "inactive";
                    }
                    element.append($compile('<box class="box"/>')(childScope));
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

uiModule.directive('box',function(boxUtils){
    return {
        require: '^workspace',
        restrict: 'E',
       link: function(scope, element, attrs, tabsCtrl) {
           scope.contentUrl = 'templates/' + scope.templ + 'Box.html';
           scope.$watch("templ",function(templ){
               scope.contentUrl = 'templates/' + templ + 'Box.html';
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
           }
        },
        controller: function ($scope,$timeout) {
            $scope.collapseBox = function(){
                $scope.$emit('collapseBox',$scope.box.id);
            }
            $scope.deleteBox = function(){
                $scope.$emit('deleteBox',$scope.box.id);
            }
            $scope.$on('editStart', function(event) {
                event.stopPropagation();
                var form = {};
                var box = $scope.box;
                if(box.isSet){
                    form.selectedBoxType = box.type;
                    form.url = box.url;
                    $timeout(function(){$scope.$broadcast('initBox',form)},500);
                }
             });
            $scope.$on('editSave', function(event,form) {
                event.stopPropagation();
               var box = $scope.box;
                $scope.templ = "active";
                box.isSet = true;
                box.type = form.selectedBoxType;
                box.url = form.url;
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
    $scope.optionalField = false;
    var unbind = $scope.$on('initBox',function(event,form){
        $scope.editForm.selectedBoxType = form.selectedBoxType;
        $scope.editForm.url = form.url;
        $scope.handleOptionalFields();
    });
    $scope.$on('$destroy',unbind);
    $scope.$emit('editStart');
    $scope.handleOptionalFields = function(){
        if($scope.editForm.selectedBoxType == '1' || $scope.editForm.selectedBoxType == '2'){
            $scope.optionalField = true;
        }else{
            $scope.optionalField = false;
        }
    };
    $scope.changeForm = function(){
        $scope.handleOptionalFields();
        $scope.editForm.url = null;
    };
    $scope.save = function(){
        $scope.$emit('editSave',$scope.editForm);
        $scope.$hide();
        $scope.$destroy();
    };
    $scope.close = function(){
        $scope.$hide();
        $scope.$destroy();
    };

});

uiModule.directive('myDraggable', ['$document', function($document) {
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