var app = angular.module('presets',['uiModule','serverModule']);
app.controller('controlPanelCtrl',['$scope','workspaceServices','storage','$timeout',function($scope,workspaceServices,storage,$timeout){
    $scope.workspaces = workspaceServices.getAllWorkspaces();
    $scope.currentWorkspace = workspaceServices.getLastWorkspace($scope.workspaces);
    $scope.lastWorkspace = {};
    $scope.isEdit = false;
    $scope.isNew = false;

    $scope.editWorkspace = function (){
        $scope.isEdit = true;
        $scope.selectedIndex = $scope.workspaces.indexOf($scope.currentWorkspace);
        $scope.lastWorkspace = angular.copy($scope.currentWorkspace);
    };
    $scope.addWorkspace = function (){
        $scope.isEdit = true;
        $scope.lastWorkspace = $scope.currentWorkspace;
        $scope.currentWorkspace = workspaceServices.getNewWorkspace();
        $scope.isNew = true;
    };
    $scope.saveWorkspace = function (){
        $scope.isEdit = false;
        storage.setObj('lastWorkspaceObject',$scope.currentWorkspace);
        storage.setObj('lastWorkspaces',$scope.workspaces);
        if($scope.isNew) {
            $scope.workspaces.push($scope.currentWorkspace);
            $scope.isNew = false;
        }
    };
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
        storage.setObj('lastWorkspaceObject',$scope.currentWorkspace);
    }
    $scope.$on('updateWorkspace',function(event,boxes){
        event.stopPropagation();
        $timeout(function(){
            $scope.currentWorkspace = angular.copy($scope.currentWorkspace);
            $scope.workspaces[$scope.selectedIndex] = $scope.currentWorkspace;
        });
        console.log($scope.currentWorkspace);
    });

}]);