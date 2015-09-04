var app = angular.module('autocomplete', []);

app.directive('autocomplete', function() {
  var index = -1;

  return {
    restrict: 'E',
    scope: {
      searchParam: '=ngModel',
      onType: '=onType',
      onSelect: '=onSelect',
      autocompleteRequired: '=',
      flights: '=flights',
    },
    controller: ['$scope', function($scope){
      var key = {left: 37, up: 38, right: 39, down: 40 , enter: 13, esc: 27, tab: 9};
      // the index of the suggestions that's currently selected
      $scope.selectedIndex = -1;

      $scope.initLock = true;

      // set new index
      $scope.setIndex = function(i){
        $scope.selectedIndex = parseInt(i);
      };

      this.setIndex = function(i){
        $scope.setIndex(i);
        $scope.$apply();
      };

      $scope.getIndex = function(i){
        return $scope.selectedIndex;
      };

      // watches if the parameter filter should be changed
      var watching = true;

      // autocompleting drop down on/off
      $scope.completing = false;

      // starts autocompleting on typing in something
      $scope.$watch('searchParam', function(newValue, oldValue){

        if (oldValue === newValue || (!oldValue && $scope.initLock)) {
          return;
        }

        if(watching && typeof $scope.searchParam !== 'undefined' && $scope.searchParam !== null) {
          $scope.completing = true;
          $scope.searchFilter = $scope.searchParam;
          $scope.selectedIndex = -1;
        }

        // function thats passed to on-type attribute gets executed
        if($scope.onType)
          $scope.onType($scope.searchParam);
      });

      // for hovering over suggestions
      this.preSelect = function(suggestion){

        watching = false;

        // this line determines if it is shown
        // in the input field before it's selected:
        //$scope.searchParam = suggestion;

        $scope.$apply();
        watching = true;

      };

      $scope.preSelect = this.preSelect;

      this.preSelectOff = function(){
        watching = true;
      };

      $scope.preSelectOff = this.preSelectOff;

      // selecting a suggestion with RIGHT ARROW or ENTER
      $scope.select = function(suggestion){
        if(suggestion){
          $scope.searchParam = suggestion;
          $scope.searchFilter = suggestion;
          if($scope.onSelect)
            $scope.onSelect(suggestion);
        }
        watching = false;
        $scope.completing = false;
        setTimeout(function(){watching = true;},1000);
        $scope.setIndex(-1);
      };


      document.addEventListener("keydown", function(e){
        var keycode = e.keyCode || e.which;            

        switch (keycode){
          case key.esc:
            // disable suggestions on escape
            $scope.select();
            $scope.setIndex(-1);
            $scope.$apply();
            e.preventDefault();
        }
      }, true);



      $scope.keyPressed = function(e, l) {
        var keycode = e.keyCode || e.which;

        // this allows submitting forms by pressing Enter in the autocompleted field
        //if(!scope.completing || l == 0) return;

        // implementation of the up and down movement in the list of suggestions
        switch (keycode){
          case key.up:

            index = $scope.getIndex()-1;
            if(index<-1){
              index = l-1;
            } else if (index >= l ){
              index = -1;
              $scope.setIndex(index);
              $scope.preSelectOff();
              break;
            }
            $scope.setIndex(index);

            if(index!==-1)
              $scope.preSelect(angular.element(angular.element(l).find('li')[index]).text());

            $scope.$apply();

            break;
          case key.down:
            index = $scope.getIndex()+1;
            if(index<-1){
              index = l-1;
            } else if (index >= l ){
              index = -1;
              $scope.setIndex(index);
              $scope.preSelectOff();
              $scope.$apply();
              break;
            }
            $scope.setIndex(index);

            if(index!==-1) {
              $scope.preSelect(angular.element(angular.element(l).find('li')[index]).text());
            }

            break;
          case key.left:
            break;
          //case key.right:
          case key.enter:

            index = $scope.getIndex();
            // scope.preSelectOff();
            if(index !== -1) {
              $scope.select(angular.element(angular.element(l).find('li')[index]).text().trim());
              if(keycode == key.enter) {
                e.preventDefault();
              }
            } else {
              if(keycode == key.enter) {
                $scope.select();
              }
            }
            $scope.setIndex(-1);
            $scope.$apply();

            break;
          case key.esc:
            // disable suggestions on escape
            $scope.select();
            $scope.setIndex(-1);
            $scope.$apply();
            e.preventDefault();
            break;
          default:
            return;
        }
      };





    }],
    link: function(scope, element, attrs){

      setTimeout(function() {
        scope.initLock = false;
        scope.$apply();
      }, 250);

      var attr = '',
          key = {left: 37, up: 38, right: 39, down: 40 , enter: 13, esc: 27, tab: 9};

      // Default atts
      scope.attrs = {
        "placeholder": "start typing...",
        "class": "",
        "id": "",
        "inputclass": "",
        "inputid": ""
      };

      for (var a in attrs) {
        attr = a.replace('attr', '').toLowerCase();
        // add attribute overriding defaults
        // and preventing duplication
        if (a.indexOf('attr') === 0) {
          scope.attrs[attr] = attrs[a];
        }
      }

      if (attrs.clickActivation) {
        element[0].onclick = function(e){
          if(!scope.searchParam){
            setTimeout(function() {
              scope.completing = true;
              scope.$apply();
            }, 200);
          }
        };
      }


      


      document.addEventListener("blur", function(e){
        // disable suggestions on blur
        // we do a timeout to prevent hiding it before a click event is registered
        setTimeout(function() {
          scope.select();
          scope.setIndex(-1);
          scope.$apply();
        }, 150);
      }, true);


      document.addEventListener("focus", function(e) {
        scope.completing = true;
        scope.$apply();
      }, true);



      element[0].addEventListener("keydown",function (e){
        var l = angular.element(this).find('li');
        scope.keyPressed(e, l);
      });
    },
    template: '\
        <div class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}">\
          <input ng-model="searchParam"\
            type="text" placeholder="{{ attrs.placeholder }}"\
            class="{{ attrs.inputclass }} search-box"\
            id="autocomplete1"\
            ng-required="{{ autocompleteRequired }}">\
             <label for="search-box"><span class="glyphicon glyphicon-search search-icon"></span></label>\
            </input>\
          <ul   ng-show="completing && (flights | filter:searchFilter).length > 0" >\
            <li\
              ng-repeat="category in flights | filter:searchFilter | orderBy:\'toString()\' track by $index"\
              ng-class="{ active: ($index === selectedIndex) }"\
              html="category">\
              <div class="header-section">\
              {{ category.category}}</div>\
              <ul class="section">\
                <li index="{{ $index }}" class="sub-menu"\
                    ng-repeat="result in category.flights | filter:searchFilter | orderBy:\'toString()\' track by $index" suggestion>\
                    {{result.flight}}\
                </li>\
              </ul>\
              </li>\
          </ul>\
        </div>'
  };
});


app.directive('suggestion', function(){
  return {
    restrict: 'A',
    require: '^autocomplete', // ^look for controller on parents element  
    link: function(scope, element, attrs, autoCtrl){

      var inputElem = element[0].parentElement.parentElement.parentElement.parentElement.childNodes[1];

      element.bind('click', function() {
        inputElem.value = element[0].innerText;
        inputElem.focus();
      });
      
      element.bind('mouseenter', function() {
        element[0].style.backgroundColor = "#9AD4E9";
      });

      element.bind('mouseleave', function() {
        element[0].style.backgroundColor = "white";
      });


      inputElem.onkeydown = function(e) {
        var l = angular.element(element);
        //should call scope.keyPressed but not available in autoCtrl
        //autoCtrl.preSelect(element[0].parentElement.parentElement.parentElement.parentElement.childNodes[1].value);
      };

    }
  };
});