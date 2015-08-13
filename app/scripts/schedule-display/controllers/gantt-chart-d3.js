
d3.gantt = function() {


    var keyFunction = function(d) {
		return d.startDate + d.taskName + d.endDate;
    };



    var rectTransform = function(d) {
		return "translate(" + constants.x(d.startDate) + "," + constants.y(d.taskName) + ")";
    };



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
		constants.xAxis = d3.svg.axis().scale(constants.x).orient("bottom").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(true).tickSize(5).tickPadding(3);
		constants.xAxisGMT = d3.svg.axis().scale(constants.x).orient("top").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(true).tickSize(5).tickPadding(3);
		constants.yAxis = d3.svg.axis().scale(constants.y).orient("left").tickSize(0);
		constants.stamp = d3.time.scale().domain([ new Date()]).range([ 0, constants.width ]);

    };


    //function to draw rectangles
    function drawRects(group) {
    	var rect = group.selectAll("rect").data(constants.tasks, keyFunction);    	

		var g = rect.enter()
				.append("g")
				.on("click", function(d) {
					console.log(d);
					d3.select(".selected").classed("selected", false);
	            	d3.select(this).classed("selected", true);
	            	constants.actualSelection = d;
	                //TODO: REMOVE THIS TO GANTT HELPER FILE
	                constants.service.showButton(d);
				});
				
			g.append("rect")
				.attr("rx", 5)
		    	.attr("ry", 5)
				.attr("class", function(d){ 
				    if(constants.taskStatus[d.status] == null){ return "bar";}
					    return constants.taskStatus[d.status];
				    })
				//.transition()
				.attr("y", 0)
				.attr("transform", rectTransform)
				.attr("height", function(d, i) { return constants.y.rangeBand(); })
				.attr("width", function(d) {
				    	return (constants.x(d.endDate) - constants.x(d.startDate));
				    })
				.attr("visibility", function(d) {
					var dates = constants.xAxis.scale().ticks(constants.xAxis.ticks()[0]);
					return constants.service.inRangeDate(dates, [d.startDate, d.endDate]) ? "visible" : "hidden";
				});


			g.append("text")			
				.text(function(d){
					var arrow = d.id % 2 === 0 ? "\u2192" : "\u2191 ";
					return arrow + "OUT-ONO";
				})
				.style("font-weight", "bold")
				.attr("stroke-width", 0)
				.attr("x", function(d) { return ( (constants.x(d.startDate) + constants.x(d.endDate)) / 2 ); })
				.attr("y", function(d) { return constants.y(d.taskName) + 25; })
		       	.attr("text-anchor", "middle")
		       	.style("cursor", "default")
				.attr("visibility", function(d){
					var dates = constants.xAxis.scale().ticks(constants.xAxis.ticks()[0]);
					return constants.service.inRangeDate(dates, [d.startDate, d.endDate]) ? "visible" : "hidden";
				});

		constants.service.drawLogo();

		rect.exit().remove();
    };



    
    




    function drawTimeStamp(line) {
		line.append("line")
			.attr("x1", constants.x( new Date()) )
			.attr("x2", constants.x( new Date()) )
			.attr("y1", 0)
			.attr("y2", constants.height - constants.margin.bottom)
			.attr("stroke-width", 2)
			.attr("stroke", "black")
			.attr("height", constants.height);

		line.append("circle")
			.attr("cx", constants.x( new Date()))
		    .attr("cy", 0)
		    .attr("r", 5)
		    .attr("stroke", "black")
			.attr("stroke-width", 1);
    };



    function drawColoredAxis(colorRects) {
    	colorRects.selectAll("rect")
    		.data(constants.taskNames)
    		.enter()
    		.append("rect")
    			.attr("y", function(d, i) { return constants.y(d) - 45; })
    			.attr("height", function(d, i) { return constants.height; })
    			.attr("width", function(d, i) { return constants.width; })
    			.attr("fill", function(d, i){
    				return i%2 === 0 ? "#E9E7E7" : "#FAFAFA";
    			});
    };








    
    function gantt(tasks) {

		initTimeDomain(tasks);
		initAxis();

		if ( ( constants.height + constants.margin.top + constants.margin.bottom ) < 0 ){
			console.log('leo');
		}
		
		//sets the svg to draw on
		var svg = d3.select("body")
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


		var colorRects = svg.append("g")
			.attr("class", "colored-axis");


		var line = svg.append("g")
			.attr("class", "time-stamp");			


		//append g to group data in pairs (rectangle-text)
		var group = svg.append("g")
			.attr("class", "group");

		
		var defs = svg.append("svg:defs");
		
		//define a def with pending image to append to circle
		defs.append("svg:pattern")
				.attr("id", "pending-background")
				.attr("height", 20)
				.attr("width", 20)					
					.append("svg:image")
					.attr("xlink:href", "../resources/imgs/pending.png")
					.attr("height", 20)
					.attr("width", 20);

		//define a def with process image to append to circle
		defs.append("svg:pattern")
				.attr("id", "process-background")
				.attr("height", 20)
				.attr("width", 20)					
					.append("svg:image")
					.attr("xlink:href", "../resources/imgs/process.png")
					.attr("height", 15)
					.attr("width", 16);


		

		drawColoredAxis(colorRects);
		//call function to draw rectangles
		drawRects(group);		
		//call function to draw line positioned at actual time
		drawTimeStamp(line);		




		 
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
        var svg = d3.select("svg");
        //
        var line = svg.selectAll(".time-stamp");
        //select the groups (rectangles-texts) 
		var group = svg.selectAll(".gantt-chart .group");

		//remove all data from the groups
		group.selectAll("*").data([]).exit().remove();
		line.selectAll("*").data([]).exit().remove();
		

        //call function to draw rectangles
        drawRects(group);        
		//call function to draw line positioned at actual time
		drawTimeStamp(line);


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
