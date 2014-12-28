/**
 * Created by erezy on 12/25/2014.
 */

uiModule.controller('EditBoxController',function($scope,boxUtils,$timeout){
    $scope.boxTypes = boxUtils.getBoxTypes();
    $scope.title = "חלון עבודה" ;

    var initBox = function(box){
        $scope.changeContentUrl(box.typeId);
        $scope.editForm.selectedBoxType = box.typeId ? $scope.boxTypes[box.typeId-1].id : "";
        $scope.editForm.data = box.formData;
    };
    $timeout(function(){initBox($scope.box)},500);

    $scope.changeForm = function(){
        $scope.editForm.data = {};
        $scope.changeContentUrl($scope.editForm.selectedBoxType);
    };
    $scope.changeContentUrl = function(boxType){
        $scope.contentUrl = "";
        var templ = boxUtils.getTemplateByTypeId(boxType,true);
        if(templ) {
            $scope.contentUrl = 'templates/forms/' + templ + '.html';
        }
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

