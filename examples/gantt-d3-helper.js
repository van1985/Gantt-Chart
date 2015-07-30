var ganttHelper = {
	
	viewActualTime : function viewActualTime () {
	    var now = new Date(),
	        actualTime = true;

	    ganttHelper.defineDomain(timeDomainString, now, actualTime);
	    gantt.redraw();
	},


	
	addMinutes : function addMinutes(actualTime, date, addMinutes) {
	    if(actualTime)
	        date.setMinutes(date.getMinutes() + addMinutes);
	},



	defineDomain : function defineDomain(timeDomainString, date, actualTime) {
	    var range;
	    switch (timeDomainString) {

	        case "1hr":
	            format = "%e %b %H:%M:%S";
	            range = 1;
	            addMinutes = 25;
	            ganttHelper.addMinutes(actualTime, date, addMinutes);
	            gantt.timeDomain([ d3.time.hour.offset(date, -range), date ], tasks);
	            break;

	        case "3hr":
	            format = "%e %b %H:%M";
	            range = 3;
	            addMinutes = 75;
	            ganttHelper.addMinutes(actualTime, date, addMinutes);
	            gantt.timeDomain([ d3.time.hour.offset(date, -range), date ], tasks);
	            break;

	        case "6hr":
	            format = "%e %b %H:%M";
	            range = 6;
	            addMinutes = 150;
	            ganttHelper.addMinutes(actualTime, date, addMinutes);
	            gantt.timeDomain([ d3.time.hour.offset(date, -range), date ], tasks);
	            break;

	        case "1day":
	            format = "%e %b %H:%M";
	            range = 1;
	            addMinutes = 600;
	            ganttHelper.addMinutes(actualTime, date, addMinutes);
	            gantt.timeDomain([ d3.time.day.offset(date, -range), date ], tasks);
	            break;

	        case "1week":
	            format = "%e %b %H:%M";
	            range = 7;
	            addMinutes = 4200;
	            ganttHelper.addMinutes(actualTime, date, addMinutes);
	            gantt.timeDomain([ d3.time.day.offset(date, -range), date ], tasks);
	            break;
	    
	        default:
	            format = "%H:%M"
	    }
	},



	zoom : function zoom(direction) {
	    if(direction === 'left' && lastDate > 0)
	        lastDate--;
	    else if(direction === 'right' && tasks.length -1 > lastDate)
	        lastDate++;	    
	},



	getLastDate : function getLastDate(i) {
	    var lastDate = Date.now();
	    if (tasks.length > 0) {
	        lastDate = tasks[i].endDate;
	    }

	    return lastDate;
	}
};