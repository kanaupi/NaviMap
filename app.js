// set map options

var mylatlng = { lat:36.1091, lng:140.1014};
var mapOptions = {
    center:mylatlng,
    zoom:7,
    mapTypeId : google.maps.MapTypeId.ROADMAP
};

//create map

var map=new google.maps.Map(document.getElementById("googleMap"), mapOptions)

//create a Directions service object to use the route method and get a result for our request

var directionsService=new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route

var directionsDisplay=new google.maps.DirectionsRenderer();

//bind the directionsRenderer to the map

directionsDisplay.setMap(map);

// function

function calcRoute() {


    //create request
    var request={
        origin:document.getElementById("from").value,
        destination:document.getElementById("to").value,
        travelMode:google.maps.TravelMode.DRIVING,//WALKING ,BYCYCLING ,TRANSIT
        unitSystem:google.maps.UnitSystem.IMPERIAL
    }

    //Pass the request to the route method
    directionsService.route(request,(result,status)=>{
        if(status==google.maps.DirectionsStatus.OK){

            //get distance and time
            const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

            //display route 
            directionsDisplay.setDirections(result);
        }else{
            //delete route from map
            directionsDisplay.setDirections({ routes: []});

            //center map in japan
            map.setCenter(mylatlng);

            //show error message
            output.innerHTML="<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance. </div>";
        }
    });
}


// create autocomplete object for all input

var options = {
    types: ['(cities)']
}

var input1 = document.getElementById("from");
var autocomplete1=new google.maps.places.Autocomplete(input1,options)

var input2 = document.getElementById("to");
var autocomplete2=new google.maps.places.Autocomplete(input2,options)


