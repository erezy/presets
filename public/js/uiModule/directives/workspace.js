
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
                boxUtils.setHeaderHeight(angular.element( document.querySelector( '.controlPanel' ) )[0].clientHeight);
            });
            $scope.$on('expendBox',function(event,borders){
                event.stopPropagation();
                $scope.$apply(function() {
                    var boxes = $scope.currWorkspace.tiles;
                    var result = boxUtils.getNewBoxArray(boxes, borders, this.chosenId);
                    if (result != null) {
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

