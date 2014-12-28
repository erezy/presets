
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
                var expendableElement;
                element.on('mousedown', function (event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    expendableElement = angular.element('<div expended class="expendable"></div>');
                    element.append(expendableElement)
                    startY = event.pageY;
                    startX = event.pageX;
                    expendableElement.css({
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
                    expendableElement.css(styles);

                    var top = startY + y - offsetY;
                    var left = startX + x - offsetX;
                    var bottom = top + expendableElement[0].clientHeight;
                    var right = left + expendableElement[0].clientWidth;
                    var borders = {top:top,left:left,bottom:bottom,right:right};
                    scope.$emit('checkOverlap',borders);
                }

                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    var top = startY + y - offsetY;
                    var left = startX + x - offsetX;
                    var bottom = top + expendableElement[0].clientHeight;
                    var right = left + expendableElement[0].clientWidth;
                    var borders = {top:top,left:left,bottom:bottom,right:right};
                    scope.$emit('expendBox',borders);
                    expendableElement.remove();
                    angular.element(document.querySelector( 'workspace' )).addClass("nohover");
                    getParentElement(element,"options").removeClass("onselect");
                    getParentElement(element,"box").removeClass("topBox");
                }
            }
    }]);
