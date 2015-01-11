'use strict';

describe("uiModule", function(){
    beforeEach(module('uiModule'));
    describe("directives", function() {
        describe("expended", function() {
            var $compile,$scope,element,expendElement;
            beforeEach(inject(function(_$compile_, _$rootScope_){
                $compile = _$compile_;
                $scope = _$rootScope_.$new();
                $scope.box = {id:1};
                var elm = angular.element(
                        '<div class="box">' +
                            '<div class="full-box">' +
                                '<div class="active-box">' +
                                    '<div class="drag-button"></div>' +
                                        '<div class="content">' +
                                            '<div class="info"></div>' +
                                            '<div class="options">' +
                                                '<div class="expend" expended></div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>');
                element = $compile(elm)($scope);
                expendElement = angular.element(element[0].getElementsByClassName( 'expend' )[0]);
                $scope.$digest();
                spyOn($scope,'$emit');
                expendElement.triggerHandler('mousedown');
            }));

            it('expendable DIV should be created', function() {
                expect(element.html()).toContain("expendable");
            });
            it('options addClass onselect', function() {
                var options = angular.element(element[0].getElementsByClassName('options'));
                expect(options.hasClass("onselect")).toBe(true);
            });
            it('box addClass top-box', function() {
                expect(element.hasClass("top-box")).toBe(true);
            });
            it('$scope.$emit should be called', function() {
                expect($scope.$emit).toHaveBeenCalledWith('setTheChosenOne',1);
            });
            describe("mousemove", function() {
                beforeEach(inject(function($document){
                    $document.triggerHandler('mousemove');
                }));
                it('$scope.$emit should be called', function() {
                    var borders = { top: NaN, left: NaN, bottom: NaN, right: NaN };
                    expect($scope.$emit).toHaveBeenCalledWith('checkOverlap',borders);
                });
            });
            describe("mouseup", function() {
                beforeEach(inject(function($document){
                    $document.triggerHandler('mouseup');
                }));
                it('$scope.$emit should be called', function() {
                    var borders = { top: NaN, left: NaN, bottom: NaN, right: NaN };
                    expect($scope.$emit).toHaveBeenCalledWith('expendBox',borders);
                });
                it('expendable DIV should be removed', function() {
                    expect(element.html()).not.toContain("expendable");
                });
                it('options removeClass onselect', function() {
                    var options = angular.element(element[0].getElementsByClassName('options'));
                    expect(options.hasClass("onselect")).toBe(false);
                });
                it('box removeClass top-box', function() {
                    expect(element.hasClass("top-box")).toBe(false);
                });
            });
        });
    });
});
