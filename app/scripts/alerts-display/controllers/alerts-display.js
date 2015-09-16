'use strict';

angular.module('AlertsDisplay').controller('alertsDisplayCtrl', function ($scope, $location) {

$scope.name = 'Alerts display';

$scope.navigate = function (view) {
	if (view === 'view solutions'){
		$location.path('/solutions-list');
	}
}
});