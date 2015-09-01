angular.module("searchTyping", [])
        .service('searchTyping', [function() {
        	var service = {};

        	service.getCategoryFlights = function(typed) {
                var flights,                	
                    categoryFlights = [
                    				{
                    					"category": "1",
                    					"flights": [
	                    						{ flight: "The Wolverine"},
	                    						{ flight: "The Smurfs 2"},
	                    						{ flight: "The Mortal Instruments: City of Bones"}
                    						]
                    				},
                    				{
                    					"category": "2",
                    					"flights": [
	                    						{ flight: "Red 2"},
	                    						{ flight: "Jobs"},
	                    						{ flight: "Getaway"},
	                    						{ flight: "Red Obsession"},
	                    						{ flight: "2 Guns"}
                    						]
                    				},
                    				{
                    					"category": "3",
                    					"flights": [
	                    						{ flight: "Only God Forgives"},
	                    						{ flight: "I Give It a Year"},
	                    						{ flight: "The Heat"}
                    						]
                    				},
                    				{
                    					"category": "4",
                    					"flights": [
                    							{ flight: "Europa Report"},
                    							{ flight: "Stuck in Love"},
                    							{ flight: "We Steal Secrets: The Story Of Wikileaks"},
                    							{ flight: "The Croods"},
                    							{ flight: "This Is the End"}
                							]
                    				},
                    				{
                    					"category": "5",
                    					"flights": [
                    							{ flight: "White House Down"},
                    							{ flight: "Lovelace"},
                    							{ flight: "Girl Most Likely"}
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


            service.getFlights = function(typed) {
                var flights,                	
                    allFlights = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel", "The Way Way Back", "Before Midnight", "Only God Forgives", "I Give It a Year", "The Heat", "Pacific Rim", "Pacific Rim", "Kevin Hart: Let Me Explain", "A Hijacking", "Maniac", "After Earth", "The Purge", "Much Ado About Nothing", "Europa Report", "Stuck in Love", "We Steal Secrets: The Story Of Wikileaks", "The Croods", "This Is the End", "The Frozen Ground", "Turbo", "Blackfish", "Frances Ha", "Prince Avalanche", "The Attack", "Grown Ups 2", "White House Down", "Lovelace", "Girl Most Likely", "Parkland", "Passion", "Monsters University", "R.I.P.D.", "Byzantium", "The Conjuring", "The Internship"]

                if(typed && typed.indexOf(typed)!=-1) {
                    flights = allFlights;
                } else {
                    flights = [];
                }

                return flights;
            };

            

            return service;
        }]);