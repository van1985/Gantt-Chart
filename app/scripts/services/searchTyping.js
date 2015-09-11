angular.module("searchTyping", [])
        .service('searchTyping', [function() {
        	var service = {};

        	service.getFlights = function(typed) {
                var flights,                	
                    categoryFlights = [
                    				{
                    					"category": "Pairing",
                    					"flights": [
	                    						{ flight: "The Wolverine"},
	                    						{ flight: "The Smurfs 2"},
	                    						{ flight: "The Mortal Instruments: City of Bones"}
                    						]
                    				},
                    				{
                    					"category": "Flight",
                    					"flights": [
	                    						{ flight: "Red 2"},
	                    						{ flight: "Jobs"},
	                    						{ flight: "Getaway"},
	                    						{ flight: "Red Obsession"},
	                    						{ flight: "2 Guns"}
                    						]
                    				},
                    				{
                    					"category": "Crew",
                    					"flights": [
	                    						{ flight: "Only God Forgives"},
	                    						{ flight: "I Give It a Year"},
	                    						{ flight: "The Heat"}
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