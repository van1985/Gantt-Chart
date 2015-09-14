angular.module("searchTyping", [])
        .service('searchTyping', [function() {
        	var service = {};

        	service.getFlights = function(typed) {
                var flights,                	
                    categoryFlights = [
                    				{
                    					"category": "Pairing",
                    					"flights": [
	                    						{ flight: "######    MM/DD"},
	                    						{ flight: "######    MM/DD"},
	                    						{ flight: "######    MM/DD"}
                    						]
                    				},
                    				{
                    					"category": "Flight",
                    					"flights": [
	                    						{ flight: "###### ORI - DES MM/DD"},
	                    						{ flight: "###### ORI - DES MM/DD"},
	                    						{ flight: "###### ORI - DES MM/DD"},
	                    						{ flight: "###### ORI - DES MM/DD"},
	                    						{ flight: "###### ORI - DES MM/DD"}
                    						]
                    				},
                    				{
                    					"category": "Crew",
                    					"flights": [
	                    						{ flight: "U123###### Lastname, N"},
	                    						{ flight: "U123###### Lastname, N"},
                                                { flight: "U123###### Lastname, N"},
                                                { flight: "U123###### Lastname, N"},
                                                { flight: "U123###### Lastname, N"},
                                                { flight: "U123###### Lastname, N"},
                                                { flight: "U123###### Lastname, N"},
                                                { flight: "U123###### Lastname, N"},
                                                { flight: "U123###### Lastname, N"}
                    						]
                    				}
								];

                if(typed && typed.indexOf(typed)!=-1) {
                    flights = categoryFlights;
                } else {
                    flights = [];
                }

                return flights;
            };


            function getCategories(typing) {
                var flights = service.getFlights(typing),
                    categories,
                    i,
                    len;

                for(i = 0; i < len; i++) {
                    categories.push(flights[i].category);
                }

                return categories;
            };


            service.selectedIsCategory = function(selected) {
                //return selected.indexOf(getCategories(typing)) !== -1 ? true : false;
                //return $.inArray(selected, getCategories(typing));
            };

            

            return service;
        }]);