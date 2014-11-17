var app = angular.module('presets',['uiModule']);
app.controller('controlPanelCtrl',function($scope){
    $scope.editWorkBransh = function (){
                                console.log("edit")
                            };
    $scope.addWorkBransh = function (){
        console.log("add")
    };
});