app.directive('header', function($location) {
  return {
    restrict: 'E',
    scope:{
      sectionname: '=',
      name: '='
    },
    replace: true,
    templateUrl: '../scripts/directives/views/header.html',
    controller: function ($scope,$location) {
      $scope.navigate = function(page){
        if (page === 'alert details'){
          $location.path('/alert-details');
        }
        if (page === 'solution list'){
          $location.path('/solutions-list');
        }
      };
    }
  };
});
