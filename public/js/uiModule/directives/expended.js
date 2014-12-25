
uiModule.directive('expended', ['$document', function($document) {
        var getParentElement = function(element,className){
                                    if(element){
                                        if(element.hasClass(className)){
                                            return element;
                                        }
                                        return getParentElement(element.parent(),className);
                                    }
                                    return null;
                                };
        return function (scope, element, attr) {
                var startX = 0, startY = 0, x = 0, y = 0, styles = {};
                var offsetY = 16, offsetX = 22;
                element.on('mousedown', function (event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    startY = event.pageY;
                    startX = event.pageX;
                    element.css({
                        opacity: '0.5',
                        margin:'0px',
                        width: '1px',
                        height: '1px',
                        position: 'absolute',
                        top: startY + 'px',
                        left: startX + 'px'
                    });
                    angular.element(document.querySelector( 'workspace' )).removeClass("nohover");
                    getParentElement(element,"options").addClass("onselect");
                    getParentElement(element,"box").addClass("topBox");

                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                    scope.$emit('setTheChosenOne',scope.box.id);
                });

                function mousemove(event) {
                event.preventDefault();
                    y = event.pageY - startY;
                    x = event.pageX - startX;
                    if(y > 0){
                        y1 = y;
                        y = offsetY;
                    }else{
                        y1 = -y;
                        y += offsetY;
                    }
                    if(x > 0){
                        x1 = x;
                        x = offsetX;
                    }else{
                        x1 = -x;
                        x += offsetX;
                    }

                    styles = {
                        top: y + 'px',
                        left: x + 'px',
                        width: x1 + 'px',
                        height: y1 + 'px'
                    };
                    element.css(styles);

                    var top = startY + y - offsetY;
                    var left = startX + x - offsetX;
                    var bottom = top + element[0].clientHeight;
                    var right = left + element[0].clientWidth;
                    var borders = {top:top,left:left,bottom:bottom,right:right};
                    scope.$emit('checkOverlap',borders);
                }

                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    var top = startY + y - offsetY;
                    var left = startX + x - offsetX;
                    var bottom = top + element[0].clientHeight;
                    var right = left + element[0].clientWidth;
                    var borders = {top:top,left:left,bottom:bottom,right:right};
                    scope.$emit('expendBox',borders);
                    var styles =  {
                                width: '100%',
                                height: '100%',
                                opacity:'0',
                                position: 'absolute',
                                marginTop: '-30px',
                                marginLeft: '-12px',
                                top: 'initial',
                                left: 'initial',
                                zIndex:'20'
                            };
                    element.css(styles);
                    angular.element(document.querySelector( 'workspace' )).addClass("nohover");
                    getParentElement(element,"options").removeClass("onselect");
                    getParentElement(element,"box").removeClass("topBox");
                }
            }
    }]);
