'use strict';

var _mainModules = [
    'Services'
    ,'Filters'
    ,'Directives'
    ,'AppConfig'
    ,'ngRoute'
    ,'ngResource'
    ,'ngAnimate'
    ,'ngTouch'
    ,'ScheduleDisplay'
    ,'SolutionList'
    ,'AlertDetails'
    ,'AlertsDisplay'
    ,'d3'
    ,'Dashboard'
    ,'ngDraggable'
    ,'snap'
    ,'ui.bootstrap'
    ,'autocomplete'
    ,'searchTyping'
    // yo:ngMainModules
];


angular.module('CrewSchedGUI', _mainModules )
    .config( function($routeProvider){
        //redirect any invalid hash to /home
        $routeProvider.otherwise({
            redirectTo: '/dashboard'
        });

        var routes = [];

        routes.push({
            name: '/schedule-display',
            params: {
                templateUrl: 'scripts/schedule-display/views/main.html',
                controller: 'mainCtrl'
            }
        });

        routes.push({
            name: '/dashboard',
            params: {
                templateUrl: 'scripts/dashboard/views/dashboard.html',
                controller: 'dashboardCtrl'
            }
        });

        routes.push({
            name: '/alerts-display',
            params: {
                templateUrl: 'scripts/alerts-display/views/alerts-display.html',
                controller: 'alertsDisplayCtrl'
            }
        });

        routes.push({
            name: '/solutions-list',
            params: {
                templateUrl: 'scripts/solutions-list/views/solutions-list.html',
                controller: 'solutionListCtrl'
            }
        });

        routes.push({
            name: '/alert-details',
            params: {
                templateUrl: 'scripts/alert-details/views/alert-details.html'
                //controller: 'alertDetailsCtrl'
            }
        });

// yo:ngRoutes

        routes.forEach(function(route){
            $routeProvider.when(route.name, route.params);
        });
    });
