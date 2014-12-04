var serverModule = angular.module('serverModule',['configModule']);

serverModule.factory('storage',function(){
    setObject = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    getObject = function(key) {
        var value = localStorage.getItem(key);
        return value && JSON.parse(value);
    };
    return{
        setObj: setObject,
        getObj: getObject
    }
});

serverModule.service('server',function($http){
    this.getAllWorkspaces = function() {
        return $http({ method: 'GET', url: 'api/workspaces' });
     }
    this.addWorkspace = function(workspace) {
        return $http({ method: 'POST', url: 'api/workspaces', data: angular.toJson(workspace) });
    }
    this.updateWorkspace = function(workspace) {
        return $http({ method: 'PUT', url: 'api/workspaces', data: angular.toJson(workspace) });
    }

});

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
serverModule.factory('workspaceServices',function(boxProvider,WORKSPACE_SIZE,storage,server){
    var fromServer = true;
    var getDateAsLong = function(expired){
                           if(!(expired instanceof Date)){
                              expired = new Date(expired);
                           }
                           return expired.getTime();
                       };
   return{
       getNewWorkspace: function(){
            function workspace(){
               this.tiles = [];
               this.expired = new Date((new Date()).getTime() + 24*60*60*1000);
            }
            var newWorkspace = new  workspace();
            var boxes = [];
            for(var i=0; i<WORKSPACE_SIZE.size;i++){
               boxes.push(boxProvider.getNewBox(i));
            }
            newWorkspace.tiles = boxes;
            return newWorkspace;
       },
       getAllWorkspaces: function(callback){
            if(fromServer){
                server.getAllWorkspaces().success(callback);
            }else{
               callback(storage.getObj('lastWorkspaces'));
            }
       },
       getLastWorkspace: function(workspaces){
            var currentWorkspace = storage.getObj('lastWorkspaceObject') || {};
            if(workspaces.length > 0 && currentWorkspace.name) {
               var ws;
               for (var i = 0; i < workspaces.length;i++){
                   ws = workspaces[i];
                   if(ws.name == currentWorkspace.name){
                       return ws;
                   }
               }
               return workspaces[0];
            }
           return {};
       },
       addWorkspace: function(callback,workspace,workspaces){
            storage.setObj('lastWorkspaceObject',workspace);
            storage.setObj('lastWorkspaces',workspaces);
            if(fromServer){
               workspace.expired = getDateAsLong(workspace.expired);
               server.addWorkspace(workspace).success(callback).error(function(){alert("שגיאה  - לא ניתן לשמור");});
            }else{
               callback();
            }
       },
       updateWorkspace: function(callback,workspace){
           if(fromServer){
              workspace.expired = getDateAsLong(workspace.expired);
              server.updateWorkspace(workspace).success(callback).error(function(){alert("שגיאה  - לא ניתן לעדכן");});
           }else{
              callback();
           }
       },
       changeWorkspace: function(workspace){
           storage.setObj('lastWorkspaceObject',workspace);
       }

   }
});