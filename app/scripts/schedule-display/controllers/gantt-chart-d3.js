
d3.gantt = function() {

    var initTimeDomain = function(tasks) {
    	var tasks = constants.tasks;
		if (constants.timeDomainMode === constants.FIT_TIME_DOMAIN_MODE) {
		    if (tasks === undefined || tasks.length < 1) {
				constants.timeDomainStart = d3.time.day.offset(new Date(), -3);
				constants.timeDomainEnd = d3.time.hour.offset(new Date(), +3);
				return;
	    	}

		    tasks.sort(function(a, b) {
				return a.endDate - b.endDate;
		    });

		    constants.timeDomainEnd = tasks[tasks.length - 1].endDate;

		    tasks.sort(function(a, b) {
				return a.startDate - b.startDate;
		    });

		    constants.timeDomainStart = tasks[0].startDate;
		}
    };



    var initAxis = function() {
		constants.x = d3.time.scale().domain([ constants.timeDomainStart, constants.timeDomainEnd ]).range([ 0, constants.width ]).clamp(true);
		constants.y = d3.scale.ordinal().domain(constants.taskTypes).rangeRoundBands([ 0, constants.height - constants.margin.top - constants.margin.bottom ], .7);
		constants.xAxis = d3.svg.axis().scale(constants.x).orient("bottom").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(false).tickSize(0).tickPadding(3);
		constants.xAxisGMT = d3.svg.axis().scale(constants.x).orient("top").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(false).tickSize(0).tickPadding(3);
		constants.yAxis = d3.svg.axis().scale(constants.y).orient("left").tickSize(0).tickPadding(50);
		constants.stamp = d3.time.scale().domain([ new Date()]).range([ 0, constants.width ]);

    };


    
    function gantt(tasks) {

		initTimeDomain(tasks);
		initAxis();

		if ( ( constants.height + constants.margin.top + constants.margin.bottom ) < 0 ){
			console.log('leo');
		}
		
		//sets the svg to draw on
		var svg = d3.select("#gantt-chart")
			.append("svg")
				.attr("class", "chart")
				.attr("width", constants.width + constants.margin.left + constants.margin.right)
				.attr("height", constants.height + constants.margin.top + constants.margin.bottom)
			//append a group g with class gantt-chart to attach x, y axes and drawings
			.append("g")
	    	    .attr("class", "gantt-chart")
				.attr("width", constants.width + constants.margin.left + constants.margin.right)
				.attr("height", constants.height + constants.margin.top + constants.margin.bottom)
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


		constants.service.drawColoredAxis(colorRects);
		//call function to draw rectangles
		constants.service.drawRects(group);
		//call function to draw line positioned at actual time
		constants.service.drawDelays(delays);
		constants.service.drawTimeStamp(line);
		constants.service.drawLineSeparation(svg);
		//defineDefsSwimlane(defs);
		constants.service.drawLogoSwimlane(svg);
		constants.service.drawGraphBoundaries(svg);
		constants.service.drawTimeRect();

		 
		//appeng x-axis (time scale)
		svg.append("g")
			.attr("class", "x axis")
			//modify to 0, 0 to poss hour indicator to top
			.attr("transform", "translate(0, " + "0)")
			.transition()
			.call(constants.xAxis);


		svg.append("g")
			.attr("class", "x axis GMT")
			//modify to 0, 0 to poss hour indicator to top
			.attr("transform", "translate(0, " + "0)")
			.transition()
			.call(constants.xAxisGMT);

		
		//append y-axis (tasks)
		svg.append("g").attr("class", "y axis").transition().call(constants.yAxis);		
		 

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
        constants.service.drawRects(group);        
		//call function to draw line positioned at actual time
		constants.service.drawDelays(delays);
		constants.service.drawTimeStamp(line);


		svg.select(".x").transition().call(constants.xAxis);
		svg.select(".GMT").transition().call(constants.xAxisGMT);
		svg.select(".y").transition().call(constants.yAxis);
		
		return gantt;
    };


    gantt.margin = function(value) {
		if (!arguments.length)
		    return constants.margin;
		margin = value;
		return gantt;
    };

    

    gantt.timeDomain = function(value, tasks) {
		if (!arguments.length)
		    return [ constants.timeDomainStart, constants.timeDomainEnd ];
		constants.timeDomainStart = +value[0], constants.timeDomainEnd = +value[1];
		return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
		if (!arguments.length)
		    return constants.timeDomainMode;
	    constants.timeDomainMode = value;
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
		    return constants.width;
		constants.width = +value;
		return gantt;
    };

    gantt.height = function(value) {
		if (!arguments.length)
		    return constants.height;
		constants.height = +value;
		return gantt;
    };

    gantt.tickFormat = function(value) {
		if (!arguments.length)
		    return constants.tickFormat;
		constants.tickFormat = value;
		return gantt;
    };


    
    return gantt;
};