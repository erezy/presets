var serverModule = angular.module('serverModule',['configModule']);

serverModule.factory('boxProvider',function(WORKSPACE_SIZE){
    function box(row,col,num){
        this.firstLocation = [row,col];
        this.location = [row,col];
        this.size = [1,1];
        this.id = num;
    }
    return{
        getNewBox: function(num){
            var row = Math.floor(num/WORKSPACE_SIZE.col);
            var col = num%WORKSPACE_SIZE.col;
            return new box(row,col,num);
        }
    }
});
serverModule.factory('workspaceServices',function(boxProvider,WORKSPACE_SIZE,storage){
   return{
       getNewWorkspace: function(){
           function workspace(){
               this.boxes = [];
               this.expiredDate = new Date((new Date()).getTime() + 24*60*60*1000);
           }
           var newWorkspace = new  workspace();
           var boxes = [];
           for(var i=0; i<WORKSPACE_SIZE.size;i++){
               boxes.push(boxProvider.getNewBox(i));
           }
           newWorkspace.boxes = boxes;
           return newWorkspace;
       },
       getAllWorkspaces: function(){
           return storage.getObj('lastWorkspaces') || [];
       },
       getLastWorkspace: function(workspaces){
           var currentWorkspace = storage.getObj('lastWorkspaceObject') || {};
           if(workspaces && currentWorkspace.name) {
               var ws;
               for (var i = 0; i < workspaces.length;i++){
                   ws = workspaces[i];
                   if(ws.name == currentWorkspace.name){
                       return ws;
                   }
               }
           }
           return {};
       }
   }
});