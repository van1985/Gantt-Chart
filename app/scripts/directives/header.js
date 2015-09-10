app.directive('header', function() {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: '../scripts/directives/views/header.html',
    link: function(scope, elem, attrs) {
      elem.bind('click', function() {
        scope.$apply(function() {
        });
      });
      elem.bind('mouseover', function() {
        elem.css('cursor', 'pointer');
      });
    }
  };
});
