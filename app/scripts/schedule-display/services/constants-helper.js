var constants = {

    "tasks" : [],

    "taskStatus" : {
        "SUCCEEDED" : "bar height-flight",
        "FAILED" : "bar-failed height-flight",
        "RUNNING" : "bar-running height-flight",
        "KILLED" : "bar-killed height-flight"
    },

    "margin" : {
        top : 20,
        right : 40,
        bottom : 20,
        left : 80
    },

    "elementSpacing" : {
        top : 20,
        start : 20,
        end : 20
    },

    "actualSelection" : {},

    "selectedFlights" : [],

    "taskNames" : [
        "Tail#1 Flight", "Tail#2 Flight", "Tail#3 Flight", "Tail#4 Flight", "Tail#5 Flight"
    ],    

    "addMinutes" : 25,

    "format" : "%H:%M",

    "timeDomainString" : "1day",

    "FIT_TIME_DOMAIN_MODE" : "fit",

    "FIXED_TIME_DOMAIN_MODE" : "fixed",

    "timeDomainStart" : d3.time.day.offset(new Date(),-3),

    "timeDomainEnd" : d3.time.hour.offset(new Date(),+3),

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
    
constants.y = d3.scale.ordinal().domain(constants.taskTypes).rangeRoundBands([ 0, constants.height - constants.margin.top - constants.margin.bottom ], .1);

constants.xAxis = d3.svg.axis().scale(constants.x).orient("bottom").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(true).tickSize(5).tickPadding(3);

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
        var flights = d3.selectAll(".group g").filter( function(d) { return d.statusAlert !== 'none' } ),
            dates = constants.xAxis.scale().ticks(constants.xAxis.ticks()[0]);
        

        //remove circle imageStatus to re append new image
        flights.selectAll("circle").remove();

        flights.append("circle")
            .attr("cx", function(d) { return constants.x(d.endDate) })
            .attr("cy", function(d) { return constants.y(d.taskName) })
            .attr("r", 10)
            .attr("fill", "#fff")
            .attr("visibility", function(d) {                
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
        return values[0] >= dates[0] && values[1] <= dates[dates.length -1];
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
    }
};