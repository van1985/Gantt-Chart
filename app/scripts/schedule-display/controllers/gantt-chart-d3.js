
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
		constants.xAxis = d3.svg.axis().scale(constants.x).orient("bottom").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(false).tickSize(0).tickPadding(3);
		constants.xAxisGMT = d3.svg.axis().scale(constants.x).orient("top").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(false).tickSize(0).tickPadding(3);
		constants.yAxis = d3.svg.axis().scale(constants.y).orient("left").tickSize(0).tickPadding(50);
		constants.stamp = d3.time.scale().domain([ new Date()]).range([ 0, constants.width ]);

    };


    //function to draw rectangles
    function drawRects(group) {
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
				.attr("y", function(d) { return constants.y(d.taskName) + 15; })
		       	.attr("text-anchor", "middle")		       	
				.attr("visibility", function(d){
					var dates = constants.xAxis.scale().ticks(constants.xAxis.ticks()[0]);
					return constants.service.inRangeDate(dates, [d.startDate, d.endDate]) ? "visible" : "hidden";
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

		constants.service.drawLogo();

		rect.exit().remove();
    };



    
    




    function drawTimeStamp(line) {
		line.append("line")
			.attr("x1", constants.x( new Date()) )
			.attr("x2", constants.x( new Date()) )
			.attr("y1", 0)
			.attr("y2", constants.height - constants.margin.bottom -50)
			.attr("stroke-width", 2)
			.attr("stroke", "#706A6A")			
			.attr("height", constants.height);

		line.append("circle")
			.attr("cx", constants.x( new Date()))
		    .attr("cy", 0)
		    .attr("r", 5)
		    .attr("stroke", "#706A6A")
		    .attr("fill", "#706A6A")
			.attr("stroke-width", 1);
    };



    function drawColoredAxis(colorRects) {
    	colorRects.selectAll("rect")
    		.data(constants.taskNames)
    		.enter()
    		.append("rect")
    			.attr("x", -120)
    			.attr("y", function(d, i) { return constants.y(d) - 100; })
    			.attr("height", function(d, i) { return constants.height; })
    			.attr("stroke",'#d3d3d3')
    			.attr("stroke-width",1)
    			.attr("width", function(d, i) { return constants.width + 155; })
    			.attr("fill", function(d, i){
    				return i%2 === 0 ? "#f3f3f3" : "#E9E7E7";
    			});
    };



    function drawTimeRect(timeRect) {
    	var g = timeRect.append("g")
					.attr("class", "time-domain");


		g.append("rect")
			//.attr("class", )			
			.attr("height", 45)
			.attr("width", constants.width + 156)
			.attr("stroke", "#d3d3d3")
			.attr("stroke-width", 1)
			.attr("fill", "transparent")
			.attr("transform","translate(20,0)");
    };



    function drawGraphComponents(svg) {
    	svg.append("text")
			.text("ORD")
			.style("font-weight", "bold")
			.style("fill","#565656")
			.style("font-size","12")
			.attr("x", -110)
			.attr("y", -1)



		svg.append("text")
			.text("GMT")
			.style("font-weight", "bold")
			.style("fill","#565656")
			.style("font-size","12")
			.attr("x", -110)
			.attr("y", 13)


		//left
		svg.append("line")
			.attr("x1", -120)
			.attr("x2", -120)
			.attr("y1", 26)
			.attr("y2", constants.height - constants.margin.bottom -50)
			.attr("stroke-width", 1)
			.attr("stroke", "#d3d3d3")
			.attr("height", constants.height);


		//right
		svg.append("line")
			.attr("x1", constants.width + 36)
			.attr("x2", constants.width + 36)
			.attr("y1", 26)
			.attr("y2", constants.height - constants.margin.bottom -50)
			.attr("stroke-width", 0)
			.attr("stroke", "#d3d3d3")
			.attr("height", constants.height);


		//bottom
		svg.append("line")
			.attr("x1", -120)
			.attr("x2", constants.width + 36)
			.attr("y1", constants.height - constants.margin.bottom -50	)
			.attr("y2", constants.height - constants.margin.bottom -50)
			.attr("stroke-width", 1)
			.attr("stroke", "#d3d3d3")
			.attr("height", constants.height);
    };



    function drawLineSeparation(svg) {
    	svg.append("line")
			.attr("x1", -15)
			.attr("x2", -15)
			.attr("y1", -12)
			.attr("y2", 16)
			.attr("stroke-width", 1)
			.attr("stroke", "#d3d3d3")			
			.attr("height", constants.height);


		svg.append("line")
			.attr("x1", -15)
			.attr("x2", -15)
			.attr("y1", 24)
			.attr("y2", constants.height - constants.margin.bottom -50)
			.attr("stroke-width", 1)
			.attr("stroke", "#d3d3d3")			
			.attr("height", constants.height);
	};


	/*
	function defineDefsSwimlane(defs) {
		defs.append("svg:pattern")
				.attr("id", "watch-background")
				.attr("height", 20)
				.attr("width", 20)
				.append("svg:image")
					.attr("xlink:href", "../resources/images/watch-alert-preview.png")
					.attr("height", 20)
					.attr("width", 20);


		defs.append("svg:pattern")
				.attr("id", "user-background")
				.attr("height", 20)
				.attr("width", 20)
				.append("svg:image")
					.attr("xlink:href", "../resources/images/user-alert-preview.png")
					.attr("height", 20)
					.attr("width", 20);
	};
	*/



	function drawLogoSwimlane(svg) {

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
   /*
		svg.append("circle")
            .attr("rx", -32)
            .attr("ry", 80)
            .attr("r", 10)           
            .attr("fill", "url(#user-background)")
            .attr("stroke", "d3d3d3")
            .attr("stroke-width", 0);



     	svg.append("circle")
            .attr("cx", -32)
            .attr("cy", 155)
            .attr("r", 10)           
            .attr("fill", "url(#watch-background)")
            .attr("stroke", "black")
            .attr("stroke-width", 1);
            */
	};



	function drawDelays(delay) {
		var delays = delay.selectAll("rect").data(constants.tasks.filter( function(d) { return d.id%2 === 0; }));

			console.log(delays);
		delays.selectAll("*").data([]).exit().remove();
		
			
		delays.enter()
			.append("rect")
			.attr("rx", 5)
	    	.attr("ry", 5)
			.attr("transform", function(d, i) {
				
				var start = d.startDate,
					hs = start.getHours() > 0 ? start.getHours() -1 : 23;

				start = constants.x(d.startDate) - hs;
				
				

				return "translate(" + start + "," + constants.y(d.taskName) + ")";
			})
			.attr("height", function(d, i) { return constants.y.rangeBand(); })
			.attr("width", function(d, i) {
					
			    	return (constants.x(d.endDate) - constants.x(d.startDate));
			    })
			.attr("fill", "transparent")
			.style("stroke", "black")
			.style("stroke-width", 1.4)
			.attr("visibility", function(d) {
				var dates = constants.xAxis.scale().ticks(constants.xAxis.ticks()[0]);
				return constants.service.inRangeDate(dates, [d.startDate, d.endDate]) ? "visible" : "hidden";
			});
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
		var timeRect = d3.select("svg"),
			//grey white rects for checkerboard background chart
			colorRects = svg.append("g")
				.attr("class", "colored-axis"),
			delays = svg.append("g")
				.attr("class", "delays"),
			//line indicating actual time
			//append g to group data in pairs (rectangle-text)
			line = svg.append("g")
				.attr("class", "time-stamp"),
			group = svg.append("g")
				.attr("class", "group"),
			//def with image to append to circle
			defs = svg.append("svg:defs");



		/*

		defs.append("svg:pattern")
				.attr("id", "pending-background")
				.attr("height", 20)
				.attr("width", 20)					
					.append("svg:image")
					.attr("xlink:href", "../resources/imgs/pending.png")
					.attr("height", 20)
					.attr("width", 20);
		
		defs.append("svg:pattern")
				.attr("id", "process-background")
				.attr("height", 20)
				.attr("width", 20)					
					.append("svg:image")
					.attr("xlink:href", "../resources/imgs/process.png")
					.attr("height", 15)
					.attr("width", 16);
		*/

		

		drawColoredAxis(colorRects);
		//call function to draw rectangles
		drawRects(group);
		//call function to draw line positioned at actual time
		drawDelays(delays);
		drawTimeStamp(line);
		drawTimeRect(timeRect);
		drawLineSeparation(svg);
		//defineDefsSwimlane(defs);
		drawLogoSwimlane(svg);
		drawGraphComponents(svg);


		 
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

		var delays = svg.selectAll(".delays");

		//remove all data from the groups
		group.selectAll("*").data([]).exit().remove();
		line.selectAll("*").data([]).exit().remove();
		delays.selectAll("*").data([]).exit().remove();
		

        //call function to draw rectangles
        drawRects(group);        
		//call function to draw line positioned at actual time
		drawDelays(delays);
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


