/**
 * Created by erezy on 12/25/2014.
 */
app.factory('boxProvider',function(){
    function box(row,col,num){
        this.firstLocation = [row,col];
        this.location = [row,col];
        this.size = [1,1];
        this.id = num;
    }
    return{
        getNewBox: function(num,numOfCols){
            var row = Math.floor(num/numOfCols);
            var col = num%numOfCols;
            return new box(row,col,num);
        }
    }
});