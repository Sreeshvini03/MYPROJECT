

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat] **generally coordinates --lat then lon but here opp.
    zoom: 9 // starting zoom if decreased,like 2 very zoomed out
});
console.log(listing.geometry.coordinates)
const marker = new mapboxgl.Marker({color: "black"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h3>${listing.title}</h3><p>Excat Location will be provided after booking</p>`)) //so as we click on marker it shows this
    .addTo(map);
