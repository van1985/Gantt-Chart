'use strict';

angular.module('ScheduleDisplay').service('ganttHelper', function($rootScope, d3Service) {
	var service = {};


	$rootScope.$on('d3Ready', function() {
		service.initializationD3Service();
	});

    var d3 = null;
	service.initializationD3Service = function() {
        //Initialize d3 variable
        d3 = d3Service.d3().$$state.value;

        InitializeGantt(d3);

		service.B = document.body;

		service.H = document.documentElement;

		service.timeDomainStart = d3.time.day.offset(new Date(),-3);

	    service.timeDomainEnd = d3.time.hour.offset(new Date(),+3);

	    service.timeDomainStartGMT = d3.time.day.offset(new Date(Date.UTC()),-3);

	    service.timeDomainEndGMT = d3.time.hour.offset(new Date(Date.UTC()),+3);

	    service.height = (Math.max( service.B.scrollHeight, service.B.offsetHeight, service.H.clientHeight, service.H.scrollHeight, service.H.offsetHeight )) - constants.margin.top - constants.margin.bottom-5;

		service.width = document.body.clientWidth - constants.margin.right - constants.margin.left-5;

		service.maxDate = constants.tasks.length > 0 ? constants.tasks[constants.tasks.length - 1].endDate : new Date();

		service.minDate = constants.tasks.length > 0 ? constants.tasks[0].startDate : new Date();

		service.lastDate = constants.tasks.length;

		service.gantt = d3.gantt().taskTypes(constants.taskNames).taskStatus(constants.taskStatus).tickFormat(constants.format);

		service.x = d3.time.scale().domain([ service.timeDomainStart, service.timeDomainEnd ]).range([ 0, service.width ]).clamp(true);

		service.xGMT = d3.time.scale().domain([ service.timeDomainStartGMT, service.timeDomainEndGMT ]).range([ 0, service.width ]).clamp(true);
		    
		service.y = d3.scale.ordinal().domain(constants.taskTypes).rangeRoundBands([ 0, service.height - constants.margin.top - constants.margin.bottom ], .1);

		service.xAxis = d3.svg.axis().scale(service.x).orient("bottom").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(true).tickSize(5).tickPadding(3);

		service.xAxisGMT = d3.svg.axis().scale(service.xGMT).orient("top").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(true).tickSize(5).tickPadding(3);

		service.yAxis = d3.svg.axis().scale(service.y).orient("left").tickSize(0);
	}

	
	
    service.viewActualTime = function() {
   		var now = new Date(),
	        actualTime = true;

	    service.defineDomain(constants.timeDomainString, now, actualTime);
	    service.gantt.redraw();
   };

   	service.addMinutes = function(actualTime, date, addMinutes) {
	    if(actualTime){
	        date.setMinutes(date.getMinutes() + addMinutes);
	    }
	};

	service.defineDomain = function(timeDomainString, date, actualTime) {
	    var range;
	    switch (timeDomainString) {

	        case '1hr':
	            constants.format = '%e %b %H:%M:%S';
	            range = 1;
	            constants.addMinutes = 60;
	            service.addMinutes(actualTime, date, constants.addMinutes);
	            service.gantt.timeDomain([ d3.time.hour.offset(date, -range), date ], constants.tasks);
	            break;

	        case '3hr':
	            constants.format = '%e %b %H:%M';
	            range = 3;
	            constants.addMinutes = 190;
	            service.addMinutes(actualTime, date, constants.addMinutes);
	            service.gantt.timeDomain([ d3.time.hour.offset(date, -range), date ], constants.tasks);
	            break;

	        case '6hr':
	            constants.format = '%e %b %H:%M';
	            range = 6;
	            constants.addMinutes = 450;
	            service.addMinutes(actualTime, date, constants.addMinutes);
	            service.gantt.timeDomain([ d3.time.hour.offset(date, -range), date ], constants.tasks);
	            break;

	        case '1day':
	            constants.format = '%e %b %H:%M';
	            range = 1;
	            constants.addMinutes = 1500;
	            service.addMinutes(actualTime, date, constants.addMinutes);
	            service.gantt.timeDomain([ d3.time.day.offset(date, -range), date ], constants.tasks);
	            break;

	        case '1week':
	            constants.format = '%e %b %H:%M';
	            range = 7;
	            constants.addMinutes = 10500;
	            service.addMinutes(actualTime, date, constants.addMinutes);
	            service.gantt.timeDomain([ d3.time.day.offset(date, -range), date ], constants.tasks);
	            break;
	    
	        default:
	            constants.format = '%H:%M';
	    }
	};


	service.zoom = function(direction) {
	    if(direction === 'left' && service.lastDate > 0){
	        service.lastDate--;
	    }
	    else if(direction === 'right' && constants.tasks.length -1 > service.lastDate){
	        service.lastDate++;
	    }
	};

	service.getLastDate = function(i) {
	    var lastDate = Date.now();
	    if (constants.tasks.length > 0) {
	    	if(i > constants.tasks.length) {	    		
	        	lastDate = constants.tasks[constants.tasks.length-1].endDate;
	    	} else if(i < constants.tasks.length) {	    	
	        	lastDate = constants.tasks[0].endDate;
	        } else {
	        	lastDate = constants.tasks[i-1].endDate;
	        }
	    }

	    return lastDate;
	};

	service.verifyDateFormat = function(flights) {
		var length = flights.length;

		for(var i = 0; i < length; i++) {
			flights[i].startDate = new Date(flights[i].startDate);
			flights[i].endDate = new Date(flights[i].endDate);
		}

		return flights;
	};

	service.getEndDate = function(){
		var lastEndDate = Date.now(),
	        tasks = constants.tasks;
	    if (tasks.length > 0) {
		   lastEndDate = tasks[tasks.length - 1].endDate;
	    }
	    return lastEndDate;
	};

	service.inRangeDate = function(dates, values) {
        return (values[0] >= dates[0] || values[1] >= dates[0]) && (values[1] <= dates[dates.length -1] || values[0] <= dates[dates.length -1]);
    };

    service.drawTimeStamp = function(line) {
        var height = service.height - constants.margin.bottom;
        
        service.drawLine(line, service.x(new Date()), service.x(new Date()), 0, height - 50, 2, "#706A6A");

        line.append("circle")
            .attr("cx", service.x(new Date()))
            .attr("cy", 0)
            .attr("r", 5)
            .attr("stroke", "#706A6A")
            .attr("fill", "#706A6A")
            .attr("stroke-width", 1);
    };

    service.drawColoredAxis = function(colorRects) {
        colorRects.selectAll("rect")
            .data(constants.taskNames)
            .enter()
            .append("rect")
                .attr("x", -120)
                .attr("y", function(d, i) { return service.y(d) - 60; })
                .attr("height", function(d, i) { return service.height; })
                .attr("stroke",'#d3d3d3')
                .attr("stroke-width",1)
                .attr("width", function(d, i) { return service.width + 155; })
                .attr("fill", function(d, i){
                    return i%2 === 0 ? "#f3f3f3" : "#E9E7E7";
                });
    };

    service.drawTimeRect = function() {
        var timeRect = d3.select("svg"),
            g = timeRect.append("g")
                .attr("class", "time-domain");        

        g.append("rect")
            //.attr("class", )          
            .attr("height", 45)
            .attr("width", service.width + 156)
            .attr("stroke", "#d3d3d3")
            .attr("stroke-width", 1)
            .attr("fill", "transparent")
            .attr("transform","translate(20,0)");
    };

    service.drawGraphBoundaries = function(svg) {
        var height = service.height - constants.margin.bottom;
        //appends text to indicate scale
        svg.append("text")
            .text("ORD")
            .style("font-weight", "bold")
            .style("fill","#565656")
            .style("font-size","12")
            .attr("x", -110)
            .attr("y", -1);

        svg.append("text")
            .text("GMT")
            .style("font-weight", "bold")
            .style("fill","#565656")
            .style("font-size","12")
            .attr("x", -110)
            .attr("y", 13);


        //append lines determine chart boundaries
        //left
        service.drawLine(svg, -120, -120, 26, height - 50, 1, "#d3d3d3");
        //right
        service.drawLine(svg, service.width + 36, service.width + 36, 26, height - 50, 1, "#d3d3d3");
        //bottom
        service.drawLine(svg, -120, service.width + 36, height - 50, height - 50, 1, "#d3d3d3");
    };

    service.drawLineSeparation = function(svg) {
        var y2 = service.height - service.margin.bottom -50;

        service.drawLine(svg, -15, -15, -12, -16, 1, "#d3d3d3");
        service.drawLine(svg, -15, -15, 24, y2, 1, "#d3d3d3");        
    };

    service.drawLine = function(svg, x1, x2, y1, y2, strokeWidth, strokeColor) {
        svg.append("line")
            .attr("x1", x1)
            .attr("x2", x2)
            .attr("y1", y1)
            .attr("y2", y2)
            .style("stroke-width", strokeWidth)
            .style("stroke", strokeColor);
    };

    service.drawDelays = function(delay) {
        var delays = delay.selectAll("rect").data(constants.tasks.filter( function(d) { return d.id%2 === 0; }));

        delays.selectAll("*").data([]).exit().remove();     
            
        delays.enter()
            .append("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("transform", function(d, i) {
                
                var start = d.startDate,
                    hs = start.getHours() > 0 ? start.getHours() -1 : 23;

                start = service.x(d.startDate) - hs;      
                var ynew = service.y(d.taskName)+28;

                return "translate(" + start + "," + ynew + ")";
            })
            .attr("height", function(d, i) { return 50; })
            .attr("width", function(d, i) {
                    
                    return (service.x(d.endDate) - service.x(d.startDate));
                })
            .attr("fill", "transparent")
            .style("stroke", "black")
            .style("stroke-width", 1.4)
            .attr("visibility", function(d) {
                var dates = service.xAxis.scale().ticks(service.xAxis.ticks()[0]);
                return service.inRangeDate(dates, [d.startDate, d.endDate]) ? "visible" : "hidden";
            });
    };

    service.drawLogoSwimlane = function(svg) {

        svg.append("svg:image")
           .attr('x',-45)
           .attr('y',52)
           .attr('width', 20)
           .attr('height', 20)
           .attr("xlink:href","../resources/images/watch-alert-preview.png");

        svg.append("svg:image")
           .attr('x',-45)
           .attr('y',124)
           .attr('width', 20)
           .attr('height', 20)
           .attr("xlink:href","../resources/images/user-alert-preview.png");
    };


    service.clearFlights = function() {
        var svg = d3.select("#gantt-chart");            

        constants.taskTypes = ["Tail#9", "Tail#10", "Tail#11", "Tail#12", "Tail#13", "Tail#14", "Tail#15", "Tail#16"];
        svg.selectAll("*").data([]).exit().remove();

        service.gantt().redraw();
    };


    
    service.pageUp = function() {
        var svg = d3.select("#gantt-chart");

        constants.taskTypes = ["Tail#1", "Tail#2", "Tail#3", "Tail#4", "Tail#5", "Tail#6", "Tail#7", "Tail#8"];
        constants.taskNames = ["Tail#1", "Tail#2", "Tail#3", "Tail#4", "Tail#5", "Tail#6", "Tail#7", "Tail#8"];
        constants.tasks = assignFlights(0, 10);
        svg.selectAll("*").data([]).exit().remove();

        service.gantt().redraw();
    };



    function assignFlights(start, end) {
        var i,
            flights = [];

        for(i = start; i < end; i++) {
            flights.push(constants.tailsTasks[i]);
        }

        return flights;
    };



    service.pageDown = function() {
        var svg = d3.select("#gantt-chart");

        constants.taskTypes = ["Tail#9", "Tail#10", "Tail#11", "Tail#12", "Tail#13", "Tail#14", "Tail#15", "Tail#16"];
        constants.taskNames = ["Tail#9", "Tail#10", "Tail#11", "Tail#12", "Tail#13", "Tail#14", "Tail#15", "Tail#16"];
        constants.tasks = assignFlights(10, 13);

        svg.selectAll("*").data([]).exit().remove();

        service.gantt().redraw(constants.tasks);
    };


    //function to draw rectangles
    service.drawRects = function(group) {
        var rect = group.selectAll("rect").data(constants.tasks, keyFunction);

        var g = rect.enter()
                .append("g")
                .style("cursor", "pointer")
                .style("stroke", "black")
                .style("stroke-width", 1.4);

            g.append("rect")
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("class", function(d){ 
                    if(constants.taskStatus[d.status] == null){ return "bar";}
                        return constants.taskStatus[d.status];
                    })
                //.transition()
                .attr("y", 28)
                .attr("transform", rectTransform)
                .attr("height", function(d, i) { return 50; })
                .attr("width", function(d) {
                        return (service.x(d.endDate) - service.x(d.startDate));
                    })
                .attr("visibility", function(d) {
                    var dates = service.xAxis.scale().ticks(service.xAxis.ticks()[0]);
                    return service.inRangeDate(dates, [d.startDate, d.endDate]) ? "visible" : "hidden";
                });


            g.append("text")            
                .text(function(d){
                    var arrow = d.id % 2 === 0 ? "\u2192" : "\u2191 ";
                    return arrow + "OUT-ONO";
                })
                .style("font-weight", "bold")
                .attr("stroke-width", 0)
                .attr("x", function(d) { return ( (service.x(d.startDate) + service.x(d.endDate)) / 2 ); })
                .attr("y", function(d) { return service.y(d.taskName) + 60; })
                .attr("text-anchor", "middle")              
                .attr("visibility", function(d){
                    var dates = service.xAxis.scale().ticks(service.xAxis.ticks()[0]);
                    return service.inRangeDate(dates, [d.startDate, d.endDate]) ? "visible" : "hidden";
                }); 

            //append ORI text
            g.append("text")
                .text("ORI")
                .style("stroke-width", 0)
                .attr("x", function(d) {                    
                    var start = d.startDate,
                        hs = start.getHours() > 0 ? start.getHours() -1 : 23,
                        start = service.x(d.startDate) - hs,
                        x = d.id%2 === 0 ? (start -30) : (service.x(d.startDate) -30);
                    return x;
                })
                .attr("y", function(d) { return service.y(d.taskName) + 60; })
                .attr("visibility", function(d){
                    var dates = service.xAxis.scale().ticks(service.xAxis.ticks()[0]);
                    return service.inRangeDate(dates, [d.startDate, d.endDate]) ? "visible" : "hidden";
                });



            //append DES text
            g.append("text")
                .text("DES")
                .style("stroke-width", 0)
                .attr("x", function(d) {
                    return service.x(d.endDate) + 10;
                })
                .attr("y", function(d) { return service.y(d.taskName) + 60; })
                .attr("visibility", function(d){
                    var dates = service.xAxis.scale().ticks(service.xAxis.ticks()[0]);
                    return service.inRangeDate(dates, [d.startDate, d.endDate]) ? "visible" : "hidden";
                });




                var div = d3.select("snap-content").append("g")
                .attr("class", "tooltip")
                .attr("ng-click","open();")
                .style("opacity", 1e-6) 
                .on("click",function(d){
                    //Change to another object with display none
                    $('.arrow-down-icon').click();
                });
                g.on("click", function(d) {   

                div.transition()        
                    .duration(400)      
                    .style("opacity", .9);      
                div .html(
                    //'formatTime(d.date)' + "<br/>"  + d.close
                    $('#tooltipDiv').html()
                    )  
                    .style("left", (d3.event.pageX - 200) + "px")     
                    .style("top", (d3.event.pageY + 22) + "px");    
                })                
                .on("blur", function() {      
                        div.transition()        
                        .duration(500)      
                        .style("opacity", 0);
                });

        function keyFunction(d) {
            return d.startDate + d.taskName + d.endDate;
        };

        function rectTransform(d) {
            return "translate(" + service.x(d.startDate) + "," + service.y(d.taskName) + ")";
        };

        rect.exit().remove();
    };





    function InitializeGantt(d3){

      //---------------------------------------------//


      d3.gantt = function() {

        /*
        if(!constants.helperLoaded) {
            constants.helperLoaded = true;
            console.log("gantt");
          angular.injector(['ng', 'ScheduleDisplay']).invoke(function (ganttHelper) {
            constants.ganttHelper = ganttHelper;
          });
        }*/

          var initTimeDomain = function(tasks) {
            var tasks = constants.tasks;
          if (constants.timeDomainMode === constants.FIT_TIME_DOMAIN_MODE) {
              if (tasks === undefined || tasks.length < 1) {
              service.timeDomainStart = d3.time.day.offset(new Date(), -3);
              service.timeDomainEnd = d3.time.hour.offset(new Date(), +3);
              return;
              }

              tasks.sort(function(a, b) {
              return a.endDate - b.endDate;
              });

              service.timeDomainEnd = tasks[tasks.length - 1].endDate;

              tasks.sort(function(a, b) {
              return a.startDate - b.startDate;
              });

              service.timeDomainStart = tasks[0].startDate;
          }
          };

        
        function pInitAxis(){
            initAxis();
        }

          var initAxis = function() {
            service.x = d3.time.scale().domain([ service.timeDomainStart, service.timeDomainEnd ]).range([ 0, service.width ]).clamp(true);
            service.xGMT = d3.time.scale().domain([ service.timeDomainStartGMT, service.timeDomainEndGMT ]).range([ 0, service.width ]).clamp(true);
            service.y = d3.scale.ordinal().domain(constants.taskTypes).rangeRoundBands([ 0, service.height - service.margin.top - service.margin.bottom ], .1);
            service.xAxis = d3.svg.axis().scale(service.x).orient("bottom").tickFormat(d3.time.format(service.tickFormat)).tickSubdivide(true).tickSize(5).tickPadding(3);
            service.xAxisGMT = d3.svg.axis().scale(service.xGMT).orient("top").tickFormat(d3.time.format(service.tickFormat)).tickSubdivide(true).tickSize(5).tickPadding(3);
            service.yAxis = d3.svg.axis().scale(service.y).orient("left").tickSize(0);
            service.stamp = d3.time.scale().domain([ new Date()]).range([ 0, service.width ]);
          };


          gantt.initGantt = function(tasks) {
            var svg = d3.select("#gantt-chart");

            svg.selectAll("*").data([]).exit().remove();
            gantt(tasks);
          };
          
          function gantt(tasks) {

          initTimeDomain(tasks);
          initAxis();

          
          //sets the svg to draw on
          var svg = d3.select("#gantt-chart")
            .append("svg")
              .attr("class", "chart")
              .attr("width", service.width + service.margin.left + service.margin.right)
              .attr("height", service.height + service.margin.top + service.margin.bottom)
            //append a group g with class gantt-chart to attach x, y axes and drawings
            .append("g")
                  .attr("class", "gantt-chart")
              .attr("width", service.width + service.margin.left + service.margin.right)
              .attr("height", service.height + service.margin.top + service.margin.bottom)
              .attr("transform", "translate(" + service.margin.left + ", " + service.margin.top + ")");


            //rect to higlight time header
            //grey white rects for checkerboard background chart
          var colorRects = svg.append("g")
              .attr("class", "colored-axis"),
            delays = svg.append("g")
              .attr("class", "delays"),
            //line indicating actual time
            line = svg.append("g")
              .attr("class", "time-stamp"),
            //append g to group data in pairs (rectangle-text)
            group = svg.append("g")
              .attr("class", "group"),
            //def with image to append to circle
            defs = svg.append("svg:defs");


          service.drawColoredAxis(colorRects);
          //call function to draw rectangles
          service.drawRects(group);
          //call function to draw line positioned at actual time
          service.drawDelays(delays);
          service.drawTimeStamp(line);
          service.drawLineSeparation(svg);
          //defineDefsSwimlane(defs);
          service.drawLogoSwimlane(svg);
          service.drawGraphBoundaries(svg);
          service.drawTimeRect();

           
          //appeng x-axis (time scale)
          svg.append("g")
            .attr("class", "x axis")
            //modify to 0, 0 to poss hour indicator to top
            .attr("transform", "translate(0, " + "0)")
            .transition()
            .call(service.xAxis);


          svg.append("g")
            .attr("class", "x axis GMT")
            //modify to 0, 0 to poss hour indicator to top
            .attr("transform", "translate(0, " + "0)")
            .transition()
            .call(service.xAxisGMT);

          
          //append y-axis (tasks)
          svg.append("g")
            .attr("class", "y axis")
            .attr("transform","translate(-50, " + "20)")
            .transition()
            .call(service.yAxis);   
           

          return gantt;
          };

          

          gantt.redraw = function(tasks) {
          initTimeDomain(tasks);
          initAxis();

          //select the svg
            var svg = d3.select("svg"),
                line = svg.selectAll(".time-stamp"),
                //select the groups (rectangles-texts) 
                group = svg.selectAll(".gantt-chart .group"),
                delays = svg.selectAll(".delays");

          //remove all data from the groups
          group.selectAll("*").data([]).exit().remove();
          line.selectAll("*").data([]).exit().remove();
          delays.selectAll("*").data([]).exit().remove();
          

              //call function to draw rectangles
          service.drawRects(group);
          //call function to draw line positioned at actual time
          service.drawDelays(delays);
          service.drawTimeStamp(line);


          svg.select(".x").transition().call(service.xAxis);
          svg.select(".GMT").transition().call(service.xAxisGMT);
          svg.select(".y").transition().call(service.yAxis);
          
          return gantt;
          };


          gantt.margin = function(value) {
          if (!arguments.length)
              return service.margin;
          service.margin = value;
          return gantt;
          };

          

          gantt.timeDomain = function(value, tasks) {
            //console.log(constants.ganttHelper);
          if (!arguments.length)
              return [ service.timeDomainStart, service.timeDomainEnd ];
          service.timeDomainStart = +value[0], service.timeDomainEnd = +value[1];
          return gantt;
          };

          /**
           * @param {string}
           *                vale The value can be "fit" - the domain fits the data or
           *                "fixed" - fixed domain.
           */
          gantt.timeDomainMode = function(value) {
          if (!arguments.length)
              return service.timeDomainMode;
            service.timeDomainMode = value;
            return gantt;

          };

          gantt.taskTypes = function(value) {
          if (!arguments.length)
              return constants.taskTypes;
          constants.taskTypes = value;
          return gantt;
          };
          
          gantt.taskStatus = function(value) {
          if (!arguments.length)
              return constants.taskStatus;
          constants.taskStatus = value;
          return gantt;
          };

          gantt.width = function(value) {
          if (!arguments.length)
              return service.width;
          service.width = +value;
          return gantt;
          };

          gantt.height = function(value) {
          if (!arguments.length)
              return service.height;
          service.height = +value;
          return gantt;
          };

          gantt.tickFormat = function(value) {
          if (!arguments.length)
              return service.tickFormat;
          service.tickFormat = value;
          return gantt;
          };


          
          return gantt;
      };

      //---------------------------------------------//
    };

	
  
  return service;
});