/**
 * The following features are still outstanding: popup delay, animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html popovers, and selector delegatation.
 */
angular.module( 'Directives', [ 'ui.bootstrap' ] )
.directive("popoverHtmlUnsafePopup", function () {
      return {
        restrict: "EA",
        replace: true,
        scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
        templateUrl: "scripts/directives/views/popover-html-unsafe-popup.html"
      };
    })

    .directive("popoverHtmlUnsafe", [ "$tooltip", function ($tooltip) {
      return $tooltip("popoverHtmlUnsafe", "popover", "click");
    }]);