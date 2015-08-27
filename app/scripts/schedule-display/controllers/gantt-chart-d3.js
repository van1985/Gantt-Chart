
d3.gantt = function() {

	if(!constants.helperLoaded) {
			constants.helperLoaded = true;
			console.log("gantt");
		angular.injector(['ng', 'ScheduleDisplay']).invoke(function (ganttHelper) {
			constants.ganttHelper = ganttHelper;
		});
	}

    var initTimeDomain = function(tasks) {
    	var tasks = constants.tasks;
		if (constants.ganttHelper.timeDomainMode === constants.ganttHelper.FIT_TIME_DOMAIN_MODE) {
		    if (tasks === undefined || tasks.length < 1) {
				constants.ganttHelper.timeDomainStart = d3.time.day.offset(new Date(), -3);
				constants.ganttHelper.timeDomainEnd = d3.time.hour.offset(new Date(), +3);
				return;
	    	}

		    tasks.sort(function(a, b) {
				return a.endDate - b.endDate;
		    });

		    constants.ganttHelper.timeDomainEnd = tasks[tasks.length - 1].endDate;

		    tasks.sort(function(a, b) {
				return a.startDate - b.startDate;
		    });

		    constants.ganttHelper.timeDomainStart = tasks[0].startDate;
		}
    };



    var initAxis = function() {
		constants.ganttHelper.x = d3.time.scale().domain([ constants.ganttHelper.timeDomainStart, constants.ganttHelper.timeDomainEnd ]).range([ 0, constants.ganttHelper.width ]).clamp(true);
		constants.ganttHelper.y = d3.scale.ordinal().domain(constants.taskTypes).rangeRoundBands([ 0, constants.ganttHelper.height - constants.margin.top - constants.margin.bottom ], .7);
		constants.ganttHelper.xAxis = d3.svg.axis().scale(constants.ganttHelper.x).orient("bottom").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(false).tickSize(0).tickPadding(3);
		constants.ganttHelper.xAxisGMT = d3.svg.axis().scale(constants.ganttHelper.x).orient("top").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(false).tickSize(0).tickPadding(3);
		constants.ganttHelper.yAxis = d3.svg.axis().scale(constants.ganttHelper.y).orient("left").tickSize(0).tickPadding(50);
		constants.ganttHelper.stamp = d3.time.scale().domain([ new Date()]).range([ 0, constants.ganttHelper.width ]);
    };


    
    function gantt(tasks) {

		initTimeDomain(tasks);
		initAxis();

		if ( ( constants.ganttHelper.height + constants.margin.top + constants.margin.bottom ) < 0 ){
			console.log('leo');
		}
		
		//sets the svg to draw on
		var svg = d3.select("#gantt-chart")
			.append("svg")
				.attr("class", "chart")
				.attr("width", constants.ganttHelper.width + constants.margin.left + constants.margin.right)
				.attr("height", constants.ganttHelper.height + constants.margin.top + constants.margin.bottom)
			//append a group g with class gantt-chart to attach x, y axes and drawings
			.append("g")
	    	    .attr("class", "gantt-chart")
				.attr("width", constants.ganttHelper.width + constants.margin.left + constants.margin.right)
				.attr("height", constants.ganttHelper.height + constants.margin.top + constants.margin.bottom)
				.attr("transform", "translate(" + constants.margin.left + ", " + constants.margin.top + ")");


			//rect to higlight time header
			//grey white rects for checkerboard background chart
		var	colorRects = svg.append("g")
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


		constants.ganttHelper.drawColoredAxis(colorRects);
		//call function to draw rectangles
		constants.ganttHelper.drawRects(group);
		//call function to draw line positioned at actual time
		constants.ganttHelper.drawDelays(delays);
		constants.ganttHelper.drawTimeStamp(line);
		constants.ganttHelper.drawLineSeparation(svg);
		//defineDefsSwimlane(defs);
		constants.ganttHelper.drawLogoSwimlane(svg);
		constants.ganttHelper.drawGraphBoundaries(svg);
		constants.ganttHelper.drawTimeRect();

		 
		//appeng x-axis (time scale)
		svg.append("g")
			.attr("class", "x axis")
			//modify to 0, 0 to poss hour indicator to top
			.attr("transform", "translate(0, " + "0)")
			.transition()
			.call(constants.ganttHelper.xAxis);


		svg.append("g")
			.attr("class", "x axis GMT")
			//modify to 0, 0 to poss hour indicator to top
			.attr("transform", "translate(0, " + "0)")
			.transition()
			.call(constants.ganttHelper.xAxisGMT);

		
		//append y-axis (tasks)
		svg.append("g").attr("class", "y axis").transition().call(constants.ganttHelper.yAxis);		
		 

		return gantt;
    };

    

    gantt.redraw = function(tasks) {
		initTimeDomain(tasks);
		initAxis();

		//select the svg
        var svg = d3.select("svg"),        //
        	line = svg.selectAll(".time-stamp"),
        	//select the groups (rectangles-texts) 
			group = svg.selectAll(".gantt-chart .group"),
			delays = svg.selectAll(".delays");

		//remove all data from the groups
		group.selectAll("*").data([]).exit().remove();
		line.selectAll("*").data([]).exit().remove();
		delays.selectAll("*").data([]).exit().remove();
		

        //call function to draw rectangles
        constants.ganttHelper.drawRects(group);        
		//call function to draw line positioned at actual time
		constants.ganttHelper.drawDelays(delays);
		constants.ganttHelper.drawTimeStamp(line);


		svg.select(".x").transition().call(constants.ganttHelper.xAxis);
		svg.select(".GMT").transition().call(constants.ganttHelper.xAxisGMT);
		svg.select(".y").transition().call(constants.ganttHelper.yAxis);
		
		return gantt;
    };


    gantt.margin = function(value) {
		if (!arguments.length)
		    return constants.margin;
		margin = value;
		return gantt;
    };

    

    gantt.timeDomain = function(value, tasks) {
    	//console.log(constants.ganttHelper);
		if (!arguments.length)
		    return [ constants.ganttHelper.timeDomainStart, constants.ganttHelper.timeDomainEnd ];
		constants.ganttHelper.timeDomainStart = +value[0], constants.ganttHelper.timeDomainEnd = +value[1];
		return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
		if (!arguments.length)
		    return constants.ganttHelper.timeDomainMode;
	    constants.timeDomainMode = value;
	    return gantt;

    };

    gantt.taskTypes = function(value) {
		if (!arguments.length)
		    return constants.ganttHelper.taskTypes;
		constants.taskTypes = value;
		return gantt;
    };
    
    gantt.taskStatus = function(value) {
		if (!arguments.length)
		    return constants.ganttHelper.taskStatus;
		constants.taskStatus = value;
		return gantt;
    };

    gantt.width = function(value) {
		if (!arguments.length)
		    return constants.ganttHelper.width;
		constants.ganttHelper.width = +value;
		return gantt;
    };

    gantt.height = function(value) {
		if (!arguments.length)
		    return constants.ganttHelper.height;
		constants.ganttHelper.height = +value;
		return gantt;
    };

    gantt.tickFormat = function(value) {
		if (!arguments.length)
		    return constants.ganttHelper.tickFormat;
		constants.tickFormat = value;
		return gantt;
    };


    
    return gantt;
};