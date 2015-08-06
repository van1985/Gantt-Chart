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

constants.lastDate = constants.tasks.length - 1;

constants.gantt = d3.gantt().taskTypes(constants.taskNames).taskStatus(constants.taskStatus).tickFormat(constants.format);

constants.x = d3.time.scale().domain([ constants.timeDomainStart, constants.timeDomainEnd ]).range([ 0, constants.width ]).clamp(true);
    
constants.y = d3.scale.ordinal().domain(constants.taskTypes).rangeRoundBands([ 0, constants.height - constants.margin.top - constants.margin.bottom ], .1);

constants.xAxis = d3.svg.axis().scale(constants.x).orient("bottom").tickFormat(d3.time.format(constants.tickFormat)).tickSubdivide(true).tickSize(5).tickPadding(3);

constants.yAxis = d3.svg.axis().scale(constants.y).orient("left").tickSize(0);

constants.service = {

    showButtonAssign : function(d) {
        if(!d)
            return false;

        var buttonAssign = $('.button-assign'),
            buttonProgress = $('.button-progress');

        constants.elementSpacing.top = constants.y(d.taskName) + 25;
        constants.elementSpacing.start = constants.x(d.startDate) + 70;
        constants.elementSpacing.end = constants.x(d.endDate) + 70;

        constants.actualSelection = d;

        constants.service.positionButton(buttonAssign);
        constants.service.positionButton(buttonProgress);

        if(!constants.service.flightIsAssigned(d)) {
            constants.service.hideElement(buttonProgress);
            constants.service.showElement(buttonAssign);
        } else {
            constants.service.hideElement(buttonAssign);          
            constants.service.showElement(buttonProgress);
        }

    },

    hideButtonAssign : function() {
        var buttonAssign = $('.button-assign');

        constants.service.hideElement(buttonAssign);
    },

    showButtonProgress : function() {
        var buttonAssign = $('.button-assign'),
            buttonProgress = $('.button-progress');
        
        constants.service.hideElement(buttonAssign);
        constants.service.positionButton(buttonProgress);
        constants.service.showElement(buttonProgress);
    },



    hideButtonProgress : function() {
        var buttonProgress = $('.button-progress');

        constants.service.hideElement(buttonProgress);
    },

    positionButton : function(button) {
        button.css("left", constants.elementSpacing.start)
            .css("top", constants.elementSpacing.top);
    },

    showElement : function(element) {
        element.removeClass('hide-element')
            .addClass('show-element');
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
            .attr("fill", function(d) {
                var status = d.statusAlert,
                    url = "url(#pending-background)";

                //determine wath image should be attached to circle
                switch(status) {                    
                    case 'process':
                        console.log("process");
                        url = "url(#process-background)";
                        break;
                    case 'done':
                        url = "url(#done-background)";
                        break;
                }
                return url; 
            } )
            .attr("stroke", "black")
            .attr("stroke-width", 1);
    },

    hideElement : function(element) {
        element.removeClass('show-element')
            .addClass('hide-element');
    },

    assignFlight : function() {
        constants.actualSelection.statusAlert = "pending";

        var flight = constants.actualSelection;

        constants.selectedFlights.push(flight);
        //constants.service.showLogo(flight.statusAlert, constants.selectedFlights.length-1);

        constants.service.hideButtonAssign();
        constants.service.showButtonProgress();

        constants.service.drawLogo();
    },


    processFlight : function () {
        constants.actualSelection.statusAlert = "process";
        constants.service.drawLogo();
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