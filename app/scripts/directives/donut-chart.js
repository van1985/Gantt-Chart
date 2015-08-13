'use strict';

angular.module('Directives')
      .directive('donutChart', function() {
            return {
            restrict: 'A',
            scope:{
              data: '=data',
              height: '=height'
            },
            controller: function ($scope, $attrs) {

                        $scope.chart = new CanvasJS.Chart($attrs.id, {
                              theme: 'theme2',
                              height: $scope.height,
                              width: 320,
                              backgroundColor: null,
                        animationEnabled: true,
                        axisY: {
                            tickThickness: 0,
                            lineThickness: 0,
                            valueFormatString: " ",
                            gridThickness: 0                 
                        },
                        axisX: {
                            tickThickness: 0,
                            lineThickness: 0,
                            labelFontSize: 10,
                            labelFontColor: "Peru",
                            interval: 1
                        },
                        data: [
                                    {
                                          type: "doughnut",
                                          fillOpacity: "1",
                                          startAngle: 60,
                                          indexLabelFontSize: 16,
                                      indexLabelFontFamily: "helvetica",
                                      indexLabelFontColor: "#999999",
                                      indexLabelFontWeight: "normal",
                                      indexLabelFontStyle: "normal",
                                          dataPoints: $scope.data
                                    }
                              ]
                        });
              
                        $scope.chart.render(); //render the chart for the first time
                        //Delete canvasjs credit
                        $('.canvasjs-chart-credit').remove();
                  }
            };
      });
/*
'use strict';

angular.module('storeManagerApp')
  .directive('donutChart', function() {
    return {
            restrict: 'A',
            scope: {
              stats: '='
            },
            controller: function ($scope, $attrs) {

              $scope.$watch('stats', function() {
                if ($scope.stats) {
                  $scope.chartData = $scope.stats;
                  initializeChart();
                }
              });

              var initializeChart = function() {
                var dataPoints = [];

                for (var i = 0; i < $scope.chartData.length; i++) {
                  var dataPoint = {
                    y: $scope.chartData[i].callsAmount,
                    indexLabel: $scope.chartData[i].departmentId,
                    indexLabelMaxWidth: 120
                  };

                  var color;
                  switch (i%4) {
                    case 0:
                      color = "66CCCC";
                      break;
                    case 1:
                      color = "339966";
                      break;
                    case 2:
                      color = "666666";
                      break;
                    default:
                      color = "99CC66";
                  }

                  dataPoint.color = "#" + color;
                  dataPoint.indexLabelLineColor = color;

                  dataPoints.push(dataPoint);
                }

          $scope.chart = new CanvasJS.Chart($attrs.id, {
            backgroundColor: null,
                  animationEnabled: true,
                  data: [
              {
                type: "doughnut",
                indexLabelFontSize: 13,
                    indexLabelFontFamily: "helvetica",
                    indexLabelFontColor: "#999999",
                    indexLabelFontWeight: "normal",
                    indexLabelFontStyle: "normal",
                dataPoints: dataPoints
              }
            ]
          });

          $scope.chart.render(); //render the chart for the first time
        }
      }
    };
  });
*/