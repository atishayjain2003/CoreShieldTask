// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 10);
const titleurl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tiles = L.tileLayer(titleurl, { attribution });
tiles.addTo(map);

// Global variables
let currentLocation = null;  // Stores the latest live coordinates
let polyline = null;         // Stores the polyline connecting locations
let circle = null;           // Stores the created circle
let routeControl = null;     // Stores the route control (for routing)

// Display the estimated time
let estimatedTimeElem = document.getElementById("estimatedTime");

document.addEventListener("DOMContentLoaded", () => {
  const myButton = document.getElementById("myButton");
  const liveCoords = document.getElementById("liveCoords");
  
  let watchId;

  // Function to start watching the user's location continuously
  function startWatching() {
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(showPosition, showError);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  // Callback function that runs when a new position is available
  function showPosition(position) {
    const liveLatitude = position.coords.latitude;
    const liveLongitude = position.coords.longitude;
    liveCoords.textContent = `Live Latitude: ${liveLatitude}, Live Longitude: ${liveLongitude}`;
    
    // Update the current live location (as an array)
    currentLocation = [liveLatitude, liveLongitude];
  }

  // Callback function for handling errors
  function showError(error) {
    console.error("Error getting location:", error);
  }

  // Start live location updates when the button is clicked
  myButton.addEventListener("click", startWatching);
});

// Event listener for the Livelocation form (to match live and final points with a polyline)
document.getElementById("Livelocation").addEventListener("submit", function (event) {
  event.preventDefault(); 

  const final_latitude = parseFloat(document.getElementById("finalLatitude").value);
  const final_longitude = parseFloat(document.getElementById("finalLongitude").value);
  
  if (isNaN(final_latitude) || isNaN(final_longitude)) {
    alert("Please enter valid latitude and longitude values.");
    return;
  }

  // Check if we have a live location available
  if (!currentLocation) {
    alert("Live location not available yet. Please click the button to get live location.");
    return;
  }

  // If a previous polyline exists, remove it from the map
  if (polyline) {
    map.removeLayer(polyline);
  }

  // Create the route between the live location and the final location
  const waypoints = [
    L.latLng(currentLocation[0], currentLocation[1]),
    L.latLng(final_latitude, final_longitude)
  ];

  // Use Leaflet Routing Machine to calculate the route
  routeControl = L.Routing.control({
    waypoints: waypoints,
    routeWhileDragging: true,
    createMarker: function() { return null; }  // Disable markers on the route
  }).addTo(map);

  // Display the estimated time for the route
  routeControl.on('routesfound', function(e) {
    const route = e.routes[0];
    const duration = route.summary.totalTime; // Time in seconds
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    // Display the estimated time
    estimatedTimeElem.textContent = `Estimated Time: ${minutes} minutes ${seconds} seconds`;
  });

  // Adjust the map view to include both points
  map.fitBounds(routeControl.getBounds());
});

// Event listener for the circle form (to create a circle)
document.getElementById("circleForm").addEventListener("submit", function (event) {
  event.preventDefault(); 

  const latitude = parseFloat(document.getElementById("latitude").value);
  const longitude = parseFloat(document.getElementById("longitude").value);
  const radius = parseFloat(document.getElementById("radius").value);

  if (isNaN(latitude) || isNaN(longitude) || isNaN(radius) || radius <= 0) {
    alert("Please enter valid latitude, longitude, and radius values.");
    return;
  }

  // Remove any existing circle before drawing a new one
  if (circle) {
    map.removeLayer(circle);
  }

  circle = L.circle([latitude, longitude], {
    color: "blue",
    fillColor: "#30f",
    fillOpacity: 0.5,
    radius: radius,
  }).addTo(map);
});
