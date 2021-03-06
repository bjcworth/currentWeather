			// fade in title and slide down search box
$(document).ready(function () {
   	$('.container').fadeIn(1500, function(){
   		$('#locSearch').slideDown("slow", function() {
   			//$('[data-toggle="tooltip"]').tooltip();
   			//auto focus input on page load
   			$("input").focus();
   		});
   	});
	// reset input on input click
	$( "input" ).click(function() {$('#locSearch')[0].reset();});
	// submit button function
	
	$('#locSearch').submit(function(event) {
		//unfocus from input
		$("input").blur();
		// bounce search on submit
		$('.child').effect( "bounce", {distance: 10, times: 3 }, "slow", function() {} );
		//$(".child" ).toggle( "bounce", { times: 3 }, "slow" );
		// var resDiv = document.getElementsByClassName('result'[0]);
		var div1 = document.getElementById('temp');
		var div2 = document.getElementById('units');
		var div3 = document.getElementById('location');
		// blank the old results to prep for new ones
		$(div1).empty();	
		$(div2).empty();
		$(div3).empty();
		$(div1).hide();
		$(div2).hide();
		$(div3).hide();
		// show the spinner while we search
		if($(div3).css('display')=='none') { $('#spinner').fadeIn(500);}
		var formdata = document.getElementById('locSearch');
		// variable storing entered location
		var loc="";
		var i;
		// save form data to a variable
		for (i=0; i<formdata.length; formdata++) {loc += formdata.elements[i].value;}
		var url = "";
		console.log("location entered: " + loc);
		if (parseInt(loc, 10)) {
    		console.log("location is a zip code")
    		url = "http://api.openweathermap.org/data/2.5/weather?zip="; 
    	}
		else {
    		console.log("location is not a zip code")
			url = "http://api.openweathermap.org/data/2.5/weather?q="; 
		}
		var units = "&type=accurate&APPID=f630abe0a04975102eff5d756a6e6ef8&units=imperial";
		// trim form entry of any extra whites pace
		loc = loc.trim();
		// Finish URL by apending location and units to the base URL
		url += loc + units;
		console.log("url: "+url);
		$.ajax({url: url,
				dataType: "json",
			success: function(loc_parse){
				console.log("Success!");
				if (loc_parse['message']){
					$('#spinner').hide();
					var msg = loc_parse['message'];
					alert(msg);
					$('#locSearch')[0].reset();
				}
				else {

					var iconURL = "http://openweathermap.org/img/w/";
					var icon = loc_parse['weather'][0]['icon'];
					var city = loc_parse['name'];
					var country = loc_parse['sys']['country'];
					var temp = Math.round(loc_parse['main']['temp']);
					if (country=="United States of America") {
						country="US";
					}
					iconURL += icon +".png";
					// variable for location match
					var location;
					// city search
					if(city) { location = city + ", " + country;}
					// continent search
					else if(!country) { location = loc;}
					// country search
					else if ((loc == country)||(country.indexOf("Islands")>=0)) { location = country;}
					// state/province search
					else if ((loc != country) && !city) { 
						// if string contains country, just use the string
						// bc we know the format is province, country
						if ((loc.indexOf(country)>=0) ||(loc.indexOf(country.toLowerCase())>=0)) {
							// full capitalization of country
							if(loc.indexOf(country.toLowerCase())>=0) {
								loc = loc.replace(country.toLowerCase(), country);
							}
							location = loc;
						}
						// otherwise, only a state/province was entered
						else {
							location = loc + ", " + country;
						}
					}
					var code;
					var flagIcon;
					var flagURL;
					// flag stuff
					if (country.length==2) {
						code = country.toLowerCase();
						flagIcon = "\"flag-icon flag-icon-" + code + '"';
						flagURL = '<span id=\"flag\"class='+flagIcon+'></span> ';
						$(div3).prepend(flagURL);
					}
					else {
						$.ajax({
							url: "http://data.okfn.org/data/core/country-list/r/data.json",
							dataType: "json",
							success: function(country_parse){
								//alert('old cntry: '+country);
								if(country.indexOf('And')>=0){
									country = country.replace("And","and");
								}
								for(var i=0; i<country_parse.length; i++){
									if(country_parse[i]['Name'].indexOf(country)>=0) {
										//alert(country);
										code = country_parse[i]['Code'].toLowerCase();
										flagIcon = "\"flag-icon flag-icon-" + code + '"';
										flagURL = '<span id=\"flag\"class='+flagIcon+'></span> '
										$(div3).prepend(flagURL);
										break;
										
									}
								}
							}

						});
					}
		 			// hide loading spinner and display result
		 			$('#spinner').hide("fast", function () {
		 				// add temp
						$(div1).append(temp);
						// add units
						$(div2).append("<sup>°F</sup>");
			 			// add location to result
						$(div3).append(location);
						// attatch weather image
						$(div1).prepend($('<img>',{id:'locIcon',src:iconURL,width:'50px',height:'50px'}));
						// fade in weather result after loading weather icon
						$('#locIcon').load(function() {
							$(div1).fadeIn(500);
							$(div2).fadeIn(500);
							$(div3).fadeIn(500);
						});

		 			});	
				}
			}
		});
});



});

