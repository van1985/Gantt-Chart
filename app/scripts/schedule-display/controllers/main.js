'use strict';

angular.module('ScheduleDisplay').controller('mainCtrl', function ($scope, FlightSrvApi,ganttHelper,$modal, $interval) {


FlightSrvApi.getFlights().
	then(function(data){
		constants.tasks=ganttHelper.verifyDateFormat(data.global.flights);

		constants.tasks.sort(function(a, b) {
		    return a.endDate - b.endDate;
		});


		constants.tasks.sort(function(a, b) {
		    return a.startDate - b.startDate;
		});

		constants.gantt.margin(constants.margin);

		constants.gantt.timeDomainMode("fixed");
		$scope.changeTimeDomain(constants.timeDomainString);

		ganttHelper.viewActualTime();

		constants.gantt(constants.tasks);

	});


$scope.changeTimeDomain = function(timeDomainString, direction) {
    var endDate = !direction ? ganttHelper.getEndDate() : ganttHelper.getLastDate(constants.lastDate),
        dates = constants.xAxis.scale().ticks(constants.xAxis.ticks()[0]),
        nextDate = dates[dates.length-1];

    if(direction) {
        if(timeDomainString === '1week') {
            nextDate = direction === 'left' ? nextDate.setHours(nextDate.getHours() - 3) : nextDate.setHours(nextDate.getHours() + 12);        
            endDate = timeDomainString === '1week' ? nextDate : nextDate + 100000;
        } else {
            nextDate = direction === 'left' ? nextDate.setHours(nextDate.getHours() - 3) : nextDate.setHours(nextDate.getHours() + 3);
            endDate = nextDate;            
        }

    }


    constants.timeDomainString = timeDomainString;
    ganttHelper.defineDomain(timeDomainString, endDate);
    
    constants.gantt.tickFormat(constants.format);

    constants.service.hideElement($('.button-assign'));
    constants.service.hideElement($('.button-process'));
    constants.service.hideElement($('.button-resolve'));

    constants.gantt.redraw(constants.tasks);
}


$scope.addTask = function(flight) {

    var lastEndDate = ganttHelper.getEndDate();
    var taskStatusKeys = Object.keys(constants.taskStatus);
    var taskStatusName = taskStatusKeys[Math.floor(Math.random() * taskStatusKeys.length)];
    var taskName = constants.taskNames[Math.floor(Math.random() * constants.taskNames.length)];

    constants.tasks.push({
    "task": flight.task,
  	"startDate" : flight.startDate,//d3.time.hour.offset(lastEndDate, Math.ceil(1 * Math.random())),
  	"endDate" : flight.endDate,//d3.time.hour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
  	"taskName" : flight.taskName,
  	"status" : flight.status,
    "statusAlert" : flight.statusAlert
    });

    constants.lastDate++;
    //constants.gantt.redraw(constants.tasks);
    //$scope.changeTimeDomain(constants.timeDomainString);
};



$scope.removeTask = function() {
    if(constants.lastDate >= 0)
        constants.lastDate--;
    constants.tasks.pop();
    $scope.changeTimeDomain(constants.timeDomainString);
};



$scope.zoom = function(direction) {
    ganttHelper.zoom(direction);
    $scope.changeTimeDomain(constants.timeDomainString, direction);
};



$scope.viewActualTime = function() {
    ganttHelper.viewActualTime();
};



$scope.assignFlight = function() {
    constants.service.assignFlight();
};



$scope.processFlight = function() {
    constants.service.processFlight();
};



$scope.resolveFlight = function() {
    constants.service.resolveFlight();
};

$scope.showAlertTotals = false;
$scope.showAlertTotalsView = function(){
    $scope.showAlertTotals = !$scope.showAlertTotals;
}


$scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      //templateUrl: '../crew-sched-gui/scripts/schedule-display/views/flight-information.html',
      templateUrl: '../scripts/schedule-display/views/flight-information.html',
      controller: 'ModalFlightInformationCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

    $scope.showTitle=true;
  $scope.change = function(){
    $scope.showTitle = !$scope.showTitle;
  };


//TODO: Change to underscore
function removeArrayElement(array, task){


  for (var i = 0; i < array.length; i++) {
    var object = array[i];
    if (object.task === task){
        array.splice(i,1);
        return true;
    }    
}
  return false;
};

$interval(function(){
  FlightSrvApi.getNewFlightAlert().
  then(function(data){
    var flight=ganttHelper.verifyDateFormat(data.global.flights);
    if (!removeArrayElement(constants.tasks,flight[0].task)){
        $scope.addTask(flight[0]);
    }
    constants.gantt.redraw(constants.tasks);
  });
}, 5000);


$interval(function(){

    if ( constants.tasks[0].status!=='DELAY'){
        constants.tasks[0].status='DELAY';
    }
    else{
        constants.tasks[0].status='TAXI'; 
    }
    constants.gantt.redraw(constants.tasks);
}, 7000);


});