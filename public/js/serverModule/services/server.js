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