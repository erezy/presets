var app = angular.module('presets',['uiModule','serverModule']);
app.constant('THEMES',  ['theme-1','theme-2','theme-3'] );
app.constant('WORKSPACE_SIZE', { row:4,col:5,sizeArray:[2,3,4,5,6] } );