app.directive('alertdetail', function($location) {
  return {
    restrict: 'E',
    scope:{
      sectionname: '=',
      name: '='
    },
    replace: true,
    templateUrl: '../scripts/directives/views/alertdetail.html'
  };
});
