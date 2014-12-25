/**
 * Created by erezy on 12/25/2014.
 */
uiModule.filter('boxType',function(BOX_TYPES){
    return function(typeId){
        for(key in BOX_TYPES){
            var type = BOX_TYPES[key];
            if(type.id){
                if(type.id == typeId){
                    return type.name;
                }
            }
        }
        return "";
    }
});