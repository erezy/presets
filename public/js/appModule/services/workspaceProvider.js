/**
 * Created by erezy on 12/25/2014.
 */
app.factory('workspaceProvider',function(WORKSPACE_SIZE,boxProvider){
    return{
        getNewWorkspace: function(){
            function workspace(){
                this.tiles = [];
                this.rows = WORKSPACE_SIZE.row;
                this.cols = WORKSPACE_SIZE.col;
                this.expired = new Date((new Date()).getTime() + 24*60*60*1000);
            }
            var newWorkspace = new  workspace();
            var boxes = [];
            var size = WORKSPACE_SIZE.row * WORKSPACE_SIZE.col;
            for(var i=0; i<size;i++){
                boxes.push(boxProvider.getNewBox(i,newWorkspace.cols));
            }
            newWorkspace.tiles = boxes;
            return newWorkspace;
        },
        changeWorkspaceSize: function(workspace){
            var size = workspace.rows * workspace.cols;
            var boxes = [];
            for(var i=0; i< size;i++){
                boxes.push(boxProvider.getNewBox(i,workspace.cols));
            }
            workspace.tiles = boxes;
        }
    }
});