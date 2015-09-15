'use strict';

angular.module('SolutionList').controller('solutionListCtrl', function ($scope) {

console.log("solution list");

$scope.showMoreLineHoldersButton = true;
$scope.moreLineHolders = function(){
	if ($scope.showMoreLineHoldersButton)
	{
		$('#collapseLineHolders').slideDown('slow');
		$scope.showMoreLineHoldersButton = false;
	}
	else
	{
		$('#collapseLineHolders').slideUp('slow');
		$scope.showMoreLineHoldersButton = true;	
	}
}

$scope.showMoreReservesButton = true;
$scope.moreReserve = function(){
	if ($scope.showMoreReservesButton)
	{
		$('#collapseReserves').slideDown('slow');
		$scope.showMoreReservesButton = false;
	}
	else
	{
		$('#collapseReserves').slideUp('slow');
		$scope.showMoreReservesButton = true;	
	}
}

});