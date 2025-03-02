

let latitudes, longitudes;
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } 
}

function showPosition(position) {
    latitudes = position.coords.latitude;
    longitudes = position.coords.longitude;
}
