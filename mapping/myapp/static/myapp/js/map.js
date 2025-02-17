const map = L.map('map').setView([20.5937, 78.9629], 10);
const titleurl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tiles=L.tileLayer(titleurl, { attribution });
tiles.addTo(map); 


let circle; // To store the created circle

  document.getElementById("circleForm").addEventListener("submit", function (event) {
    event.preventDefault(); 

   
    const latitude = parseFloat(document.getElementById("latitude").value);
    const longitude = parseFloat(document.getElementById("longitude").value);
    const radius = parseFloat(document.getElementById("radius").value);

   
    if (isNaN(latitude) || isNaN(longitude) || isNaN(radius) || radius <= 0) {
      alert("Please enter valid latitude, longitude, and radius values.");
      return;
    }

    
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