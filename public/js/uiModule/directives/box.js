
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

