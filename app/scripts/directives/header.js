app.directive('header', function() {
  return {
    restrict: 'EA',
    scope:{
      sectionname: '='
    },
    replace: true,
    templateUrl: '../scripts/directives/views/header.html',
    controller: function ($scope) {
    }
  };
});
