serverModule.factory('workspaceServices',function(storage,server){
    var fromServer = true;
    var getDateAsLong = function(expired){
        if(!(expired instanceof Date)){
            expired = new Date(expired);
        }
        return expired.getTime();
    };
    return{
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
                    if(fromServer){
                        if(ws.id == currentWorkspace.id){
                            return ws;
                        }
                    }else{
                        if(ws.name == currentWorkspace.name){
                            return ws;
                        }
                    }
                }
            }
            if(workspaces.length > 0){
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