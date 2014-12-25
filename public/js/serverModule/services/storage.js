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