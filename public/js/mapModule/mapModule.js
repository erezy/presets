var mapModule = angular.module('mapModule', []);
mapModule.factory('Scene',function(){
    var viewer = new Cesium.Viewer('cesiumContainer');
    var scene = viewer.scene;
    var billboards,labels;
    var planes = [];
    var ids = [];
    var lons = [];
    var lans = [];
    var imgColors =  [Cesium.Color.LIME,Cesium.Color.BLUE,Cesium.Color.YELLOW,Cesium.Color.RED];
    var translucency = new Cesium.NearFarScalar(1.5e3, 1.0, 1.5e6, 0.0);
    var labelMark;
    var markedId;

    function markPlane(planeId){
        markedId = planeId;
        labelMark.show = true;

    }
    function flyToLocation(){
        var west = -76.0;
        var south = 39;
        var east = -74.0;
        var north = 41;

        scene.camera.flyToRectangle({
            destination : Cesium.Rectangle.fromDegrees(west, south, east, north)
        });
    }
    function createPlane(plane){
    var location = Cesium.Cartesian3.fromDegrees(plane.longitude, plane.latitude);

       planes[plane.id] = billboards.add({
                                            image : plane.shape,
                                            imageSubRegion : new Cesium.BoundingRectangle(67, 80, 14, 14),
                                            position : location,
                                            color : imgColors[plane.colorId]
                                        });
       ids[plane.id]    = labels.add({
                                  position :location,
                                  text     : plane.id,
                                  font :'16px Arial',
                                  translucencyByDistance : translucency,
                                  pixelOffset : new Cesium.Cartesian2(-20, -8)
                              });
       lons[plane.id]    = labels.add({
                                    position :location,
                                    text     : 'LON: '+plane.longitude,
                                    font :'16px Arial',
                                    translucencyByDistance : translucency,
                                    pixelOffset : new Cesium.Cartesian2(-40, 20)
                                });
       lans[plane.id]    = labels.add({
                                   position :location,
                                   text     : 'LAN: '+plane.latitude,
                                   font :'16px Arial',
                                   translucencyByDistance : translucency,
                                   pixelOffset : new Cesium.Cartesian2(-40, 36)
                               });
    }
    function movePlane(plane){
        var location = Cesium.Cartesian3.fromDegrees(plane.longitude, plane.latitude);
      planes[plane.id].position = location;
      ids[plane.id].position = location;
      lons[plane.id].position = location;
      lons[plane.id].text = 'LON: '+plane.longitude;
      lans[plane.id].position = location;
      lans[plane.id].text = 'LAN: '+plane.latitude;
      if(labelMark.show && plane.id == markedId){
        labelMark.position = location;
      }
    }

    return{
        handelPlane: function(plane){
            if (planes[plane.id]){
               movePlane(plane);
           }else{
               createPlane(plane);
           }
        },
        clear: function(){
            billboards = scene.primitives.add(new Cesium.BillboardCollection());
            labels = scene.primitives.add(new Cesium.LabelCollection());
            flyToLocation();
            if(!labelMark){
                labelMark = billboards.add({
                                                image : '../Apps/Sandcastle/images/whiteShapes.png',
                                                imageSubRegion : new Cesium.BoundingRectangle(49, 43, 18, 18),
                                                color : Cesium.Color.RED,
                                                scale: 2.0,
                                                pixelOffset : new Cesium.Cartesian2(0.0, 50)
                                            });
                labelMark.show = false;
            }
        },
        mark: markPlane
    }
});



