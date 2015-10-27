
var firebaseRef = new Firebase('https://polygonmap.firebaseio.com/');

$(function() {

// Setup the login button; illustrates making a call to your super secret
// enterprise LDAP database mainframe supercomputer using zero-factor auth.
// This example is designed to show the use of server-side signed tokens; not
// the best practices in authenticating users. The examples makes it easy to
// switch between users by simply swapping out the username in the 'login'
// field.
$( function() {
  // XXX: If you want to use your own node server, change the URL!
  var url = 'http://misc.firebase.com:22222/?user=' ().val();
  $.getJSON(url, function(data) {
    if (data != null) {
     
     
      // Display the token payload for debug purposes.
      
    
    }
  });
});

// Setup the todo lists.
var names = ['Lat', 'Lng'];
for (var i = 0; i < names.length; i++) {
  var name = names[i];

  // Register for additions to each user's todo lists.
  firebaseRef.child(name).on('child_added', function(name){
    // Remember, we're in a loop so we need a closure to make sure name is
    // the right value.
    return function(snapshot) {
      var todo = snapshot.val();
      var item = $('<li>').text(todo.todo);
      item.attr("id", name + '-' + snapshot.name())
      $('#' + name + '-list').append(item);
    }
  }(name));

  // We need to handle remove events when Firebase security rules rollbacks
  // an addition.
  firebaseRef.child(name).on('child_removed', function(name){
    return function(snapshot) {
      $('#' + name + '-' + snapshot.name()).remove();
    }
  }(name));

  // Setup additions to the todo lists. We read from the #username field - this
  // allows us to spoof the 'from' to test the validation rules for Alice and
  // Bob and ensure that the rules we've specified are enforced.
  $('#' + name + '-add').on('click', function(name){
    return function() {
      var item = {
      
        todo: $('#' + name + '-todo').val()
      };
      firebaseRef.child(name).push(item);
      $('#' + name + '-todo').val('');
    }
  }(name));
}

});



//var myPolygon;
function initialize() {
  // Map Center
  var myLatLng = new google.maps.LatLng(33.5190755, -111.9253654);
  // General Options
  var mapOptions = {
    zoom: 12,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.RoadMap
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  // Polygon Coordinates
  var triangleCoords = [
    new google.maps.LatLng(33.5362475, -111.9267386),
    new google.maps.LatLng(33.5104882, -111.9627875),
    new google.maps.LatLng(33.5004686, -111.9027061)
  ];
  // Styling & Controls
  myPolygon = new google.maps.Polygon({
    paths: triangleCoords,
    draggable: true, // turn off if it gets annoying
    editable: true,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  });

  myPolygon.setMap(map);
  //google.maps.event.addListener(myPolygon, "dragend", getPolygonCoords);
  google.maps.event.addListener(myPolygon.getPath(), "insert_at", getPolygonCoords);
  //google.maps.event.addListener(myPolygon.getPath(), "remove_at", getPolygonCoords);
  google.maps.event.addListener(myPolygon.getPath(), "set_at", getPolygonCoords);
}

//Display Coordinates below map
function getPolygonCoords() {
  var len = myPolygon.getPath().getLength();
  var htmlStr = "";
  for (var i = 0; i < len; i++) {
    htmlStr += "(" + myPolygon.getPath().getAt(i).toUrlValue(5) + "), ";
    //Use this one instead if you want to get rid of the wrap > new google.maps.LatLng(),
    //htmlStr += "" + myPolygon.getPath().getAt(i).toUrlValue(5);
  }
  document.getElementById('info').innerHTML = htmlStr;
}

function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}