app.controller('ControlPanelController',['$scope','WORKSPACE_SIZE','THEMES','workspaceProvider','workspaceServices','$timeout',function($scope,WORKSPACE_SIZE,THEMES,workspaceProvider,workspaceServices,$timeout){
    $scope.themeOptions = THEMES;
    $scope.selectedTheme = $scope.themeOptions[0];
    $scope.lastWorkspace = {};
    $scope.isEdit = false;
    $scope.isNew = false;
    $scope.resize = false;
    $scope.sizeArray = WORKSPACE_SIZE.sizeArray;

    this.setWorkspaces = function(data){
       $scope.workspaces = data;
       $scope.currentWorkspace = workspaceServices.getLastWorkspace(data);
    };
    workspaceServices.getAllWorkspaces(this.setWorkspaces);

    $scope.editWorkspace = function (){
        $scope.$broadcast('animateBox');
        $scope.isEdit = true;
        $scope.selectedIndex = $scope.workspaces.indexOf($scope.currentWorkspace);
        $scope.lastWorkspace = angular.copy($scope.currentWorkspace);
    };
    $scope.addWorkspace = function (){
        $scope.isEdit = true;
        $scope.resize = true;
        $scope.lastWorkspace = $scope.currentWorkspace;
        $scope.currentWorkspace = workspaceProvider.getNewWorkspace();
        $scope.isNew = true;
    };
    $scope.changeWorkspaceSize = function(){
        workspaceProvider.changeWorkspaceSize($scope.currentWorkspace);
        rebuildWorkspace();
    }

    $scope.removeWorkspace = function (){
        $scope.isEdit = false;
        $scope.currentWorkspace = $scope.lastWorkspace;
        if($scope.isNew){
            $scope.isNew = false;
        }else{
            $scope.workspaces[$scope.selectedIndex] = $scope.currentWorkspace;
        }
    };
    $scope.changeWorkspace = function(){
        console.log("change");
        workspaceServices.changeWorkspace($scope.currentWorkspace);
    }

    var setEditView = function(){
            $scope.isEdit = false;
             $scope.$broadcast('animateLeaveBox');
    };
    var setEditViewAndPush = function(data){
        $scope.isEdit = false;
         $scope.$broadcast('animateLeaveBox');
        if(data){
            $scope.currentWorkspace.id = data.id;
            workspaceServices.changeWorkspace($scope.currentWorkspace);
        }
        $scope.workspaces.push($scope.currentWorkspace);
    };
    $scope.saveWorkspace = function (){
        $scope.currentWorkspace.modified = new Date();
        if($scope.isNew) {
            workspaceServices.addWorkspace(setEditViewAndPush,$scope.currentWorkspace,$scope.workspaces);
            $scope.isNew = false;
        }else{
            workspaceServices.updateWorkspace(setEditView,$scope.currentWorkspace);
        }

    };

    var rebuildWorkspace = function(){
        $timeout(function(){
            $scope.currentWorkspace = angular.copy($scope.currentWorkspace);
            if(!$scope.isNew){
                $scope.workspaces[$scope.selectedIndex] = $scope.currentWorkspace;
            }
        });
    };
    $scope.$on('updateWorkspace',function(event){
        event.stopPropagation();
        rebuildWorkspace();
    });
    $scope.$on('disableResize',function(event){
        event.stopPropagation();
        $scope.resize = false;
    });
    $scope.$on('activateResize',function(event){
        event.stopPropagation();
        $scope.resize = true;
    });
}]);