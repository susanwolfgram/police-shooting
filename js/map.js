// Function to draw map
var drawMap = function() {
 	var map = L.map('container').setView([32.07, -94.79], 4);
  	var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
 	layer.addTo(map)
 	getData(map) 
}

// Function for getting data
var getData = function(map) {
	$.getJSON('data/response.json', function(data) {
		customBuild(data, map); 
	}); 
}

// Loop through your data and add the appropriate layers and points
var customBuild = function(data, map) {
	var layerMale = new L.LayerGroup([]);
	var layerFemale = new L.LayerGroup([]); 
	var underTwenty = new L.LayerGroup([]); 
	var twenties = new L.LayerGroup([]); 
	var thirties = new L.LayerGroup([]); 
	var forties = new L.LayerGroup([]);
	var fifties = new L.LayerGroup([]);
	var overSixty =  new L.LayerGroup([]);
	var killed = 0; 
	var male = 0; 
	var female = 0; 
	var killedMale = 0; 
	for (var i=0; i<data.length;i++) {
			var lat = data[i]["lat"];
			var lng = data[i]["lng"];
			var circ = L.circle([lat, lng], 750);
			circ.bindPopup(data[i]["Summary"]);
			var age = parseInt(data[i]["Victim's Age"]);
			if (data[i]["Hit or Killed?"] == "Killed") {
				circ.setStyle({color: 'red', fillColor: 'red'});
				killed++
				if (data[i]["Victim's Gender"] == "Male") {
					killedMale++
				}
			}
			if (age < 20) {
				circ.addTo(underTwenty);
			} else if (age >= 20 && age <= 29) {
				circ.addTo(twenties);
			} else if (age >= 30 && age <= 39) {
				circ.addTo(thirties);
			} else if (age >= 40 && age <= 49) {
				circ.addTo(forties);
			} else if (age >= 50 && age <= 59) {
				circ.addTo(fifties);
			} else if (age >= 60) {
				circ.addTo(overSixty);
			}
			if (data[i]["Victim's Gender"] == "Male") {
				circ.addTo(layerMale);
				male++
			} else {
				circ.addTo(layerFemale);
				female++
			}	
	}

	var layers = {"Male Victims" : layerMale, "Female/Unspecified Victims" : layerFemale, 
	"Victims Under 20" : underTwenty, "Victims Age 20-29" : twenties, 
	"Victims Age 30-39" : thirties, "Victims Age 40-49" : forties,
	"Victims Age 50-59" : fifties, "Victims Over 60" : overSixty};
	L.control.layers(null, layers).addTo(map);

	$('#killedMen').text(killedMale);
	$('#killedWomen').text(killed - killedMale);
	$('#injuredM').text(male - killedMale);
	$('#injuredW').text(female - (killed - killedMale));
}


