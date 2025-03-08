const location = "dharan, nepal"; // Replace with user's location
const apiKey = "googleApikey"; // Replace with your actual API key
const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;

fetch(geocodeUrl)
  .then(response => response.json())
  .then(data => {
    if (data.status === "OK") {
      const lat = data.results[0].geometry.location.lat;
      const lng = data.results[0].geometry.location.lng;
      // Display the converted value in the console
      console.log(`Converted Value: Latitude: ${lat}, Longitude: ${lng}`);
    } else {
      console.error("Geocoding failed:", data.status);
    }
  })
  .catch(error => console.error("Error fetching geocoding data:", error));
