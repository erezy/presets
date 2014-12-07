var app = angular.module('presets',['uiModule','serverModule']);
app.controller('controlPanelCtrl',['$scope','workspaceServices','$timeout',function($scope,workspaceServices,$timeout){
    this.setWorkspaces = function(data){
       $scope.workspaces = data;
       $scope.currentWorkspace = workspaceServices.getLastWorkspace($scope.workspaces);
    };
    workspaceServices.getAllWorkspaces(this.setWorkspaces);

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
    var setEditView = function(){
            $scope.isEdit = false;
    };
    var setEditViewAndPush = function(data){
        $scope.isEdit = false;
        if(data){
            $scope.currentWorkspace.id = data.id;
        }
        $scope.workspaces.push($scope.currentWorkspace);
    };
    $scope.saveWorkspace = function (){
        if($scope.isNew) {
            workspaceServices.addWorkspace(setEditViewAndPush,$scope.currentWorkspace,$scope.workspaces);
            $scope.isNew = false;
        }else{
            workspaceServices.updateWorkspace(setEditView,$scope.currentWorkspace);
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
        workspaceServices.changeWorkspace($scope.currentWorkspace);
    }
    $scope.$on('updateWorkspace',function(event){
        event.stopPropagation();
        $timeout(function(){
            $scope.currentWorkspace = angular.copy($scope.currentWorkspace);
            $scope.workspaces[$scope.selectedIndex] = $scope.currentWorkspace;
        });
    });

}]);