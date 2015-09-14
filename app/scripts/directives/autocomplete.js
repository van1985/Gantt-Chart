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
          <ul style="columns: 2;" ng-show="completing && (flights | filter:searchFilter).length > 0" >\
            <li style="clear: both; float: left !important;border-bottom: 1px solid #EFEFEF;width: 95%;margin-left: 6px;"\
              ng-repeat="category in flights | filter:searchFilter | orderBy:\'toString()\' track by $index"\
              html="category">\
              <div class="header-section">\
              {{ category.category}}</div>\
              <ul style="float: right !important;" class="section dropSuggestions">\
                <li index="{{ $setIndex }}" class="sub-menu"\
                    ng-repeat="result in category.flights | filter:searchFilter | orderBy:\'toString()\' track by $index" suggestion>\
                    {{result.flight}}\
                </li>\
              </ul>\
              </li>\
              <li style="border-bottom: 1px solid #EFEFEF;line-height: 35px;cursor: pointer;">\
              <div style="color: #26A4E0;font-size: 12px;font-weight: bold;font-family: Clan OT;text-align: center;">View all results</div>\
              </li>\
          </ul>\
        </div>'
  };
});


app.directive('suggestion', function(){
  var suggestionsArr = [],
      selectedIndex = -1;
  return {
    restrict: 'A',
    controller: ['$scope', function($scope){

      $scope.addSuggestion = function(suggestion) {
        suggestionsArr.push(suggestion);
      };

      $scope.getSuggestionArr = function() {
        return suggestionsArr;
      };

      $scope.setIndex = function(i) {
        if(i !== undefined) {
          selectedIndex = i;
        }
      };

      $scope.getIndex = function() {
        return selectedIndex;
      };
    }],
    link: function(scope, element, attrs){

      var inputElem = element[0].parentElement.parentElement.parentElement.parentElement.childNodes[1];

      scope.addSuggestion(element[0]);

      element.bind('click', function() {
        inputElem.value = element[0].innerText;
        inputElem.focus();
      });
      
      element.bind('mouseenter', function() {
        scope.setIndex(element[0].index);
        element[0].style.backgroundColor = "#E3E5E8";
      });

      element.bind('mouseleave', function() {
        element[0].style.backgroundColor = "white";
      });


      inputElem.onkeydown = function(e) {

        //var active = document.querySelector(".hover") || document.querySelector(".dropSuggestions li"),
        var index = scope.getIndex(),
            active = scope.getSuggestionArr()[index] || document.querySelector(".dropSuggestions li");

        //active.classList.remove('hover');
        active.style.backgroundColor = "white";

        if (e.which === 40) {
          if(index < scope.getSuggestionArr().length -1) {
            if(index >= 0) {
              active = active.nextElementSibling ? active.nextElementSibling : scope.getSuggestionArr()[index + 1];
            }

            scope.setIndex(index + 1);
          }
        } else if (e.which === 38) {
          if(index > 0) {
            active = active.previousElementSibling ? active.previousElementSibling : scope.getSuggestionArr()[index - 1];
            scope.setIndex(index - 1);
          }
        }

        active.style.backgroundColor = "#E3E5E8";
        //active.classList.add('hover');


      };

    }
  };
});