var uiModule = angular.module('uiModule',['ngAnimate', 'mgcrea.ngStrap','ang-drag-drop']);
uiModule.constant('BOX_TYPES',  [{id:1, name:'דף אינטרנט',form:"url",html:"types/iframe"},
        {id:2, name:'קובץ',form:"file",html:"types/iframe"},
        {id:3, name:'מצב עבודה',form:"",html:"types/workspaceStatus"},
        {id:4, name:'מפה',form:"",html:"types/map"}]
);
uiModule.config(function($datepickerProvider) {
    var tomorrow = new Date();
    angular.extend($datepickerProvider.defaults, {
        dateFormat: 'dd/MM/yyyy',
        minDate: tomorrow,
        iconRight: 'glyphicon glyphicon-chevron-left',
        iconLeft: 'glyphicon glyphicon-chevron-right'
    });
})
uiModule.config(function($modalProvider) {
    angular.extend($modalProvider.defaults, {
        animation: 'am-fade-and-scale',
        backdrop:'static',
        container: 'body'
    });
})
