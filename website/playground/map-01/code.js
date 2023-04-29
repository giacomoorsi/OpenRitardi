


L.mapbox.accessToken = "pk.eyJ1IjoiZ2lhY29tb29yc2kiLCJhIjoiY2pubTM0Nml6MW02MDNwcWY0ajc3ZHE3diJ9.fz0p1ZmseERTYVzXJPqS0Q"


//https://maps.geops.io/styles/base_bright_v2/style.json?key=5cc87b12d7c5370001c1d6552688c8395e0e4e94a4faf2368b9915dd


var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
        attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        tileSize: 512,
        zoomOffset: -1
 });


var trainTiles = L.tileLayer('https://maps.geops.io/styles/base_bright_v2/style.json?key=5cc87b12d7c5370001c1d6552688c8395e0e4e94a4faf2368b9915dd', {
    //tileSize: 512,
     //   zoomOffset: -1
}
);


var map = new L.Map("map", {center: [37.8, -96.9], zoom: 4})
    .addLayer(mapboxTiles)
    .addLayer(trainTiles)
    .add
    //.addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));


