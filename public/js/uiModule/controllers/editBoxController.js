/**
 * Created by erezy on 12/25/2014.
 */

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

