var constants = {

    "tasks" : [],

    "taskStatus" : {
        "CANCELLATION" : "bar-cancellation height-flight",
        "FAR" : "bar-far height-flight",
        "UNASSIGNEDBOUND" : "bar-unassigned-bound height-flight",
        "TAXI" : "bar-taxi height-flight",
        "DELAY" : "bar-delay height-flight",
        "MISCONNECTION": "bar-misconnection height-flight",
        "UASTAFFING" : "bar-ua-staffing height-flight",
        "CREWREST" : "bar-crew-rest height-flight",
        "FLIGHTONTIME" : "bar-flight-on-time height-flight"
    },

    "margin" : {
        top : 20,
        right : 90,
        bottom : 20,
        left : 140
    },

    "elementSpacing" : {
        top : 20,
        start : 20,
        end : 20
    },

    "actualSelection" : {},

    "selectedFlights" : [],

    "taskNames" : [
        "Tail#1", "Tail#2", "Tail#3", "Tail#4", "Tail#5", "Tail#6", "Tail#7", "Tail#8"
    ],    

    "addMinutes" : 25,

    "format" : "%H:%M",

    "timeDomainString" : "1day",

    "FIT_TIME_DOMAIN_MODE" : "fit",

    "FIXED_TIME_DOMAIN_MODE" : "fixed",

    "timeDomainStart" : d3.time.day.offset(new Date(),-3),

    "timeDomainEnd" : d3.time.hour.offset(new Date(),+3),

    "timeDomainStartGMT" : d3.time.day.offset(new Date(Date.UTC()),-3),

    "timeDomainEndGMT" : d3.time.hour.offset(new Date(Date.UTC()),+3),

    "taskTypes" : [],

    "tickFormat" : "%H:%M"
},
B = document.body,
H = document.documentElement,
height;



constants.height = (Math.max( B.scrollHeight, B.offsetHeight,H.clientHeight, H.scrollHeight, H.offsetHeight )) - constants.margin.top - constants.margin.bottom-5;

constants.width = document.body.clientWidth - constants.margin.right - constants.margin.left-5;

constants.maxDate = constants.tasks.length > 0 ? constants.tasks[constants.tasks.length - 1].endDate : new Date();

constants.minDate = constants.tasks.length > 0 ? constants.tasks[0].startDate : new Date();

constants.lastDate = constants.tasks.length;

constants.gantt = d3.gantt().taskTypes(constants.taskNames).taskStatus(constants.taskStatus).tickFormat(constants.format);

constants.x = d3.time.scale().domain([ constants.timeDomainStart, constants.timeDomainEnd ]).range([ 0, constants.width ]).clamp(true);

constants.xGMT = d3.time.scale().domain([ constants.timeDomainStartGMT, constants.timeDomainEndGMT ]).range([ 0, constants.width ]).clamp(true);
    
constants.y = d3.scale.ordinal().domain(constants.taskTypes).rangeRoundBands([ 0, constants.height - constants.margin.top - constants.margin.bottom ], .1);

constants.xAxis = d3.svg.axis().scale(constants.x).orient("bottom").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(true).tickSize(5).tickPadding(3);

constants.xAxisGMT = d3.svg.axis().scale(constants.xGMT).orient("top").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(true).tickSize(5).tickPadding(3);

constants.yAxis = d3.svg.axis().scale(constants.y).orient("left").tickSize(0);

constants.service = {

    showButton : function(d) {
        var status = d.statusAlert,
            buttonAssign = $('.button-assign'),
            buttonProcess = $('.button-process'),
            buttonResolve = $('.button-resolve');

        constants.elementSpacing.top = constants.y(d.taskName) + 25;
        constants.elementSpacing.start = constants.x(d.startDate) + 70;
        constants.elementSpacing.end = constants.x(d.endDate) + 70;

        constants.service.hideElement(buttonAssign);
        constants.service.hideElement(buttonProcess);
        constants.service.hideElement(buttonResolve);

        switch(status){
            case 'none':
                constants.service.positionButton(buttonAssign);
                constants.service.showElement(buttonAssign);
                break;

            case 'pending':
                constants.service.positionButton(buttonProcess);
                constants.service.showElement(buttonProcess);
                break;

            case 'process':
                constants.service.positionButton(buttonResolve);
                constants.service.showElement(buttonResolve);
                break;
        }        
    },

    positionButton : function(button) {
        button.css("left", constants.elementSpacing.start)
            .css("top", constants.elementSpacing.top);
    },

    showElement : function(element) {
        element.removeClass('hide-element')
            .addClass('show-element');
    },

    hideElement : function(element) {
        element.removeClass('show-element')
            .addClass('hide-element');
    },

    drawLogo : function() {
        var flights = d3.selectAll(".group g").filter( function(d) { return d.statusAlert !== 'none' } );
        

        //remove circle imageStatus to re append new image
        flights.selectAll("circle").remove();

        flights.append("circle")
            .attr("cx", function(d) { return constants.x(d.endDate) })
            .attr("cy", function(d) { return constants.y(d.taskName) })
            .attr("r", 10)
            .attr("fill", "#fff")
            .attr("visibility", function(d) {
                var dates = constants.xAxis.scale().ticks(constants.xAxis.ticks()[0]);
                return constants.service.inRangeDate(dates, [d.startDate, d.endDate]) ? "visible" : "hidden";
            })
            .attr("fill", function(d) {
                var status = d.statusAlert,
                    url = "url(#pending-background)";

                //determine wath image should be attached to circle
                if(status === 'process')
                        url = "url(#process-background)";

                return url; 
            } )
            .attr("stroke", "black")
            .attr("stroke-width", 1);
    },

    inRangeDate : function(dates, values) {
        return (values[0] >= dates[0] || values[1] >= dates[0]) && (values[1] <= dates[dates.length -1] || values[0] <= dates[dates.length -1]);
    },

    assignFlight : function() {
        constants.actualSelection.statusAlert = "pending";

        var flight = constants.actualSelection;

        constants.selectedFlights.push(flight);

        constants.service.hideElement($('.button-assign'));
        constants.service.showButton(flight);

        constants.service.drawLogo();
    },

    processFlight : function () {
        constants.actualSelection.statusAlert = "process";
        constants.service.drawLogo();

        constants.service.hideElement($('.button-process'));
        constants.service.showButton(constants.actualSelection);        
    },

    resolveFlight : function() {        
        constants.service.hideElement($('.button-resolve'));
        var selection = d3.select(".selected"),
            flight = selection[0][0].__data__,
            index = $.inArray(flight, constants.tasks);

        if(index >= 0){
            constants.tasks.splice(index, 1);
            constants.gantt.redraw();
        }
    },

    flightIsAssigned : function(d) {
        var length = constants.selectedFlights.length;

        for(var i = 0; i < length; i++) {
            if(constants.selectedFlights[i].startDate === d.startDate)
                return true
        }

        return false;
    },

    drawTimeStamp : function(line) {
        var height = constants.height - constants.margin.bottom;
        
        constants.service.drawLine(line, constants.x( new Date()), constants.x( new Date()), 0, height - 50, 2, "#706A6A");        

        line.append("circle")
            .attr("cx", constants.x( new Date()))
            .attr("cy", 0)
            .attr("r", 5)
            .attr("stroke", "#706A6A")
            .attr("fill", "#706A6A")
            .attr("stroke-width", 1);
    },

    drawColoredAxis : function(colorRects) {
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
    },

    drawTimeRect : function() {
        var timeRect = d3.select("svg"),
            g = timeRect.append("g")
                .attr("class", "time-domain");        

        g.append("rect")
            //.attr("class", )          
            .attr("height", 45)
            .attr("width", constants.width + 156)
            .attr("stroke", "#d3d3d3")
            .attr("stroke-width", 1)
            .attr("fill", "transparent")
            .attr("transform","translate(20,0)");
    },

    drawGraphBoundaries : function(svg) {
        var height = constants.height - constants.margin.bottom;
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
        constants.service.drawLine(svg, -120, -120, 26, height - 50, 1, "#d3d3d3");

        //right
        constants.service.drawLine(svg, constants.width + 36, constants.width + 36, 26, height - 50, 1, "#d3d3d3");

        //bottom
        constants.service.drawLine(svg, -120, constants.width + 36, height - 50, height - 50, 1, "#d3d3d3");
    },

    drawLineSeparation : function(svg) {
        var y2 = constants.height - constants.margin.bottom -50;

        constants.service.drawLine(svg, -15, -15, -12, -16, 1, "#d3d3d3");
        constants.service.drawLine(svg, -15, -15, 24, y2, 1, "#d3d3d3");        
    },

    drawLine : function(svg, x1, x2, y1, y2, strokeWidth, strokeColor) {
        svg.append("line")
            .attr("x1", x1)
            .attr("x2", x2)
            .attr("y1", y1)
            .attr("y2", y2)
            .style("stroke-width", strokeWidth)
            .style("stroke", strokeColor);
    },

    drawDelays : function(delay) {
        var delays = delay.selectAll("rect").data(constants.tasks.filter( function(d) { return d.id%2 === 0; }));

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
    },

    drawLogoSwimlane : function(svg) {

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
    },

    //function to draw rectangles
    drawRects : function(group) {
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

            //append ORI text
            g.append("text")
                .text("ORI")
                .style("stroke-width", 0)
                .attr("x", function(d) {                    
                    var start = d.startDate,
                        hs = start.getHours() > 0 ? start.getHours() -1 : 23,
                        start = constants.x(d.startDate) - hs,
                        x = d.id%2 === 0 ? (start -30) : (constants.x(d.startDate) -30);
                    return x;
                })
                .attr("y", function(d) { return constants.y(d.taskName) + 15; })
                .attr("visibility", function(d){
                    var dates = constants.xAxis.scale().ticks(constants.xAxis.ticks()[0]);
                    return constants.service.inRangeDate(dates, [d.startDate, d.endDate]) ? "visible" : "hidden";
                });



            //append DES text
            g.append("text")
                .text("DES")
                .style("stroke-width", 0)
                .attr("x", function(d) {
                    return constants.x(d.endDate) + 10;
                })
                .attr("y", function(d) { return constants.y(d.taskName) + 15; })
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

        function keyFunction(d) {
            return d.startDate + d.taskName + d.endDate;
        };

        function rectTransform(d) {
            return "translate(" + constants.x(d.startDate) + "," + constants.y(d.taskName) + ")";
        };

        constants.service.drawLogo();

        rect.exit().remove();
    }
};