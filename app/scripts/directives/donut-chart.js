'use strict';

angular.module('Directives')
      .directive('donutChart', function(d3Service, $window) {
            return {
            restrict: 'EA',
            scope: {},
            link: function (scope, ele, attrs) {

                        d3Service.d3().then(function(d3) {

                            var svg = d3.select(ele[0])
                                .append("svg:svg");

                            // Browser onresize event
                            window.onresize = function() {
                              scope.$apply();
                            };

                              scope.dataset = [
                                  {name: "A", val: 11975},  
                                  {name: "B", val: 5871}, 
                                  {name: "C", val: 8916}
                              ];

                                  // Watch for resize event
                            scope.$watch(function() {
                              return angular.element($window)[0].innerWidth;
                            }, function() {
                              scope.render(scope.dataset);
                            });

                        scope.render = function(data) {

                              svg.selectAll('*').remove();

                              var w = 300,
                                  h = 300,
                                  r = Math.min(w, h) / 2,
                                  labelr = r + 30, // radius for label anchor
                                  color = d3.scale.category20(),
                                  donut = d3.layout.pie(),
                                  arc = d3.svg.arc().innerRadius(r * .6).outerRadius(r);

                              svg = d3.select("svg")
                                  .data([data])
                                  .attr("width", w + 150)
                                  .attr("height", h);

                              var arcs = svg.selectAll("g.arc")
                                  .data(donut.value(function(d) { return d.val }))
                                .enter().append("svg:g")
                                  .attr("class", "arc")
                                  .attr("transform", "translate(" + (r + 30) + "," + r + ")");

                              arcs.append("svg:path")
                                  .attr("fill", function(d, i) { return color(i); })
                                  .attr("d", arc);

                              arcs.append("svg:text")
                                  .attr("transform", function(d) {
                                      var c = arc.centroid(d),
                                          x = c[0],
                                          y = c[1],
                                          // pythagorean theorem for hypotenuse
                                          h = Math.sqrt(x*x + y*y);
                                      return "translate(" + (x/h * labelr) +  ',' +
                                         (y/h * labelr) +  ")"; 
                                  })
                                  .attr("dy", ".35em")
                                  .attr("text-anchor", function(d) {
                                      // are we past the center?
                                      return (d.endAngle + d.startAngle)/2 > Math.PI ?
                                          "end" : "start";
                                  })
                                  .text(function(d, i) { return d.value.toFixed(2); });


                          
                        }

                        });
                  }
            };
      });