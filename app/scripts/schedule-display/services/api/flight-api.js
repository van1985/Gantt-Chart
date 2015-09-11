'use strict';

angular.module('ScheduleDisplay').service('FlightSrvApi', function($http, $q) {

  var service = {};

  service.getFlights = function() {
    var deferred = $q.defer();

    $http({
      method: 'GET',
      url: '/scripts/schedule-display/services/api/flight.json'
      //url: '../crew-sched-gui/scripts/schedule-display/services/api/flight.json'
    })
    .success(
      function(response) {
        console.log('Get Available Flights - success');
        console.log(response);
        setDates(response);
        deferred.resolve(response);
      })
    .error(
      function(response) {
        console.log('Get Available Flights - error');
        console.log(response);
        deferred.reject(response.responseStatus.errorMessage);
      });

    return deferred.promise;
  };


  service.getNewFlightAlert = function() {
    var deferred = $q.defer();

    $http({
      method: 'GET',
      url: '/scripts/schedule-display/services/api/newAlertFlight.json'
      //url: '../crew-sched-gui/scripts/schedule-display/services/api/newAlertFlight.json'
    })
    .success(
      function(response) {
        console.log('Get Available Flights - success');
        console.log(response);
        setDates(response);
        deferred.resolve(response);
      })
    .error(
      function(response) {
        console.log('Get Available Flights - error');
        console.log(response);
        deferred.reject(response.responseStatus.errorMessage);
      });

    return deferred.promise;
  };


  function setDates(data) {
    var flights = data.global.flights,
        len = flights.length,
        startDate,
        endDate,
        start;        

    for(var i = 0; i < len; i++){
      startDate = new Date();
      endDate = new Date();

      start = startDate.getHours();      

      if(i < 7) {
        startDate.setHours(i + start + 2);
        //endDate.setHours(i + start + Math.floor((Math.random() * 7) + 6));
        endDate.setHours(i + start + 8);
      } else if(i < 10) {
        startDate.setHours(i + start + 10);
        //endDate.setHours(i + start + Math.floor((Math.random() * 7) + 16));
        endDate.setHours(i + start + 17);
      } else if(i < 13) {
        startDate.setHours(i + start + 5);
        //endDate.setHours(i + start + Math.floor((Math.random() * 7) + 16));
        endDate.setHours(i + start + 10);


      } else if(i < 18) {
        startDate.setHours(i + start -10);
        //endDate.setHours(i + start + Math.floor((Math.random() * 7) + 2));
        endDate.setHours(i + start - 4);
      } else if(i < 22) {
        startDate.setHours(i + start - 6);
        endDate.setHours(i + start);
      } else if(i < 19) {
        startDate.setHours(i + start);
        endDate.setHours(i + start + 6);
      } else if(i < 25) {
        startDate.setHours(i + start - 3);
        endDate.setHours(i + start + 6);
      } else {
        startDate.setHours(i + start - 22);
        endDate.setHours(i + start - 12);
      }

      flights[i].startDate = startDate;
      flights[i].endDate = endDate;
    }
  };

  return service;

});