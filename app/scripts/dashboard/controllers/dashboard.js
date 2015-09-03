'use strict';

angular.module('Dashboard').controller('dashboardCtrl', function (searchTyping, $scope, $location) {

		$scope.centerAnchor = true;
        $scope.toggleCenterAnchor = function () {$scope.centerAnchor = !$scope.centerAnchor}
        $scope.draggableObjects = [{name:'Lorep ipsum ...'}, {name:'Lorep ipsum dolor sit ...'}, {name:'Lorep ipsum dolor sit ...'}, {name:'Lorep ipsum dolor sit ...'} ];
        $scope.droppedObjects1 = [];
        $scope.droppedObjects2= [];
        $scope.droppedObjects3= [];
        $scope.droppedObjects4= [];
        $scope.droppedObjectsDone= [];

        //Init
        $scope.droppedObjects1.push( $scope.draggableObjects[0]);
        $scope.droppedObjects2.push( $scope.draggableObjects[1]);
        $scope.droppedObjects3.push( $scope.draggableObjects[2]);
        $scope.droppedObjects4.push( $scope.draggableObjects[3]);

        $scope.droppedObjectsDone.push($scope.draggableObjects[3]);




        $scope.onDropComplete1=function(data,evt){

            var getActualData = $scope.droppedObjects1[0];
            var emptyContainer = getEmptyDropObjects();
            emptyContainer.push(getActualData);

            $scope.droppedObjects1 = [];

            var index = $scope.droppedObjects1.indexOf(data);
            if (index == -1)
            $scope.droppedObjects1.push(data);
        }
        $scope.onDragSuccess1=function(data,evt){
            console.log("133","$scope","onDragSuccess1", "", evt);
            var index = $scope.droppedObjects1.indexOf(data);
            if (index > -1) {
                $scope.droppedObjects1.splice(index, 1);
            }
        }
        $scope.onDragSuccess2=function(data,evt){

            var index = $scope.droppedObjects2.indexOf(data);
            if (index > -1) {
                $scope.droppedObjects2.splice(index, 1);
            }

        }
        $scope.onDropComplete2=function(data,evt){

            var getActualData = $scope.droppedObjects2[0];
            var emptyContainer = getEmptyDropObjects();
            emptyContainer.push(getActualData);

            $scope.droppedObjects2 = [];
            var index = $scope.droppedObjects2.indexOf(data);
            if (index == -1) {
                $scope.droppedObjects2.push(data);
            }

        }
        $scope.onDragSuccess3=function(data,evt){
            var index = $scope.droppedObjects3.indexOf(data);
            if (index > -1) {
                $scope.droppedObjects3.splice(index, 1);
            }
        }
        $scope.onDropComplete3=function(data,evt){

            var getActualData = $scope.droppedObjects3[0];
            var emptyContainer = getEmptyDropObjects();
            emptyContainer.push(getActualData);

            $scope.droppedObjects3 = [];

            var index = $scope.droppedObjects3.indexOf(data);
            if (index == -1) {
                $scope.droppedObjects3.push(data);
            }
        }
        $scope.onDragSuccess4=function(data,evt){
            var index = $scope.droppedObjects4.indexOf(data);
            if (index > -1) {
                $scope.droppedObjects4.splice(index, 1);
            }
        }
        $scope.onDropComplete4=function(data,evt){

            var getActualData = $scope.droppedObjects4[0];
            var emptyContainer = getEmptyDropObjects();
            emptyContainer.push(getActualData);

            $scope.droppedObjects4 = [];

            var index = $scope.droppedObjects4.indexOf(data);
            if (index == -1) {
                $scope.droppedObjects4.push(data);
            }
        }


        function getEmptyDropObjects() {
            if ( $scope.droppedObjects1.length === 0)
                return $scope.droppedObjects1;

            if ( $scope.droppedObjects2.length === 0)
                return $scope.droppedObjects2;

            if ( $scope.droppedObjects3.length === 0)
                return $scope.droppedObjects3;

            if ( $scope.droppedObjects4.length === 0)
                return $scope.droppedObjects4;

        };


        var inArray = function(array, obj) {
            var index = array.indexOf(obj);
        }

        // COLLAPSE =====================
        $scope.isCollapsed = false;

        //Donut Chart
        $scope.donutAlertStatusHeight =225; 
        $scope.donutPairingStatusHeight =225;
        $scope.pairingStatusData = [
                                                
                                                {  y: 25, indexLabel: "", color: "#b9e9df", indexLabelLineColor: "#b9e9df " },         
                                                {  y: 25, indexLabel: "", color: "#fed99f", indexLabelLineColor: "#fed99f" },
                                                {  y: 50, indexLabel: "",color: "#b6b6b6", indexLabelLineColor: "#b6b6b6" }
                                          ];
        $scope.AlertStatusData = [
                                                
                                                {  y: 25, indexLabel: "", color: "#fd7145", indexLabelLineColor: "#fd7145 " },         
                                                {  y: 25, indexLabel: "", color: "#f4c138", indexLabelLineColor: "#f4c138" },
                                                {  y: 25, indexLabel: "",color: "#1fc3b4", indexLabelLineColor: "#1fc3b4" },
                                                {  y: 25, indexLabel: "",color: "#71b5f5", indexLabelLineColor: "#71b5f5" },
                                                {  y: 25, indexLabel: "",color: "#aaaaaa", indexLabelLineColor: "#aaaaaa" }
                                          ];
        $scope.navigateTo = function(view){
            if (view==='dashboard'){
                $location.path('/dashboard')
            }
            if (view ==='schedule'){
                $location.path('/schedule-display')
            }
        };


        $scope.searchType = function(typed) {
            $scope.flights = searchTyping.getFlights(typed);
        };


        $scope.searchSelected = function(selected) {
            if(!searchTyping.selectedIsCategory(selected)) {
                console.log(selected);
            }
        };
});